from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time

support_bp = Blueprint("support", __name__, url_prefix="/api/support")

@support_bp.route("/chat", methods=["POST"])
def support_chatbot():
    """
    AI Support Chatbot Assistant.
    Provides intelligent automated answers for common farmer and buyer queries,
    or offers to create an official Ministry Support ticket.
    """
    try:
        data = request.get_json() or {}
        user_msg = str(data.get("message", "")).strip()
        if not user_msg:
            return jsonify({"error": "Message is required"}), 400

        msg_lower = user_msg.lower()

        # Automated AI response matrix
        if any(w in msg_lower for w in ["escrow", "payment", "money", "refund", "paid"]):
            reply = "🛡️ **AGRIWEB Escrow Protection**: When a buyer places an order, funds are held securely in Escrow. Once the farmer dispatches and the buyer confirms delivery (or if farmer rejects the order), funds are instantly released or refunded."
        elif any(w in msg_lower for w in ["order", "status", "confirm", "track", "delivery"]):
            reply = "📦 **Order & Tracking**: You can view active direct orders under 'Direct Orders'. Click '📍 Track Location' on any order to see real-time vehicle GPS coordinates and transit progress."
        elif any(w in msg_lower for w in ["price", "mandi", "radar", "rate", "cost"]):
            reply = "📊 **Price Transparency**: Our AI Price Predictor compares wholesale APMC Mandi benchmarks with direct farmer asking rates and urban retail prices to ensure fair trade."
        elif any(w in msg_lower for w in ["quality", "grade", "freshness", "spoilage"]):
            reply = "⭐ **Quality Grading**: AGRIWEB AI Quality Classifier rates produce as Grade A (Premium), Grade B (Standard), or Grade C (Processing) based on harvest freshness and storage days."
        elif any(w in msg_lower for w in ["contact", "admin", "help", "agent", "dispute", "complain", "issue"]):
            reply = "🏛️ **Ministry Support Desk**: You can submit a support ticket below! An official Ministry administrator will review your issue and respond directly."
        else:
            reply = f"🌱 **AGRIWEB AI Support**: Thank you for asking about '{user_msg}'. Our platform provides direct farmer-to-buyer trade, escrow payment safety, and live GPS route tracking. Would you like to create a Ministry support ticket?"

        return jsonify({
            "reply": reply,
            "timestamp": current_iso_time()
        }), 200
    except Exception as e:
        print(f"Error in support chatbot: {e}")
        return jsonify({"error": str(e)}), 500


@support_bp.route("/tickets", methods=["POST"])
@auth_required
def create_ticket():
    """Submit a support ticket to the Ministry Admin Desk."""
    try:
        data = request.get_json() or {}
        subject = data.get("subject")
        message = data.get("message")
        category = data.get("category", "General")

        if not subject or not message:
            return jsonify({"error": "Subject and message are required"}), 400

        ticket_id = f"tkt-{new_id()[:8]}"
        user = g.user or {}

        ticket = {
            "id": ticket_id,
            "userId": user.get("id"),
            "userName": user.get("name", "User"),
            "userPhone": user.get("phone", ""),
            "userRole": user.get("role", "buyer"),
            "category": category,
            "subject": subject,
            "message": message,
            "adminReply": None,
            "status": "open", # open -> resolved
            "createdAt": current_iso_time(),
            "resolvedAt": None
        }

        db.insert("tickets", ticket)
        return jsonify({"message": "Support ticket created successfully", "ticket": ticket}), 201
    except Exception as e:
        print(f"Error creating support ticket: {e}")
        return jsonify({"error": str(e)}), 500


@support_bp.route("/tickets", methods=["GET"])
@auth_required
def get_tickets():
    """Fetch tickets (Users see their own tickets; Admin sees all)."""
    try:
        all_tickets = db.get_all("tickets") or []
        role = str(g.user.get("role", "")).lower()
        user_id = str(g.user.get("id", ""))

        if role == "admin":
            mine = all_tickets
        else:
            mine = [t for t in all_tickets if isinstance(t, dict) and str(t.get("userId", "")) == user_id]

        return jsonify(mine), 200
    except Exception as e:
        print(f"Error fetching tickets: {e}")
        return jsonify({"error": str(e)}), 500


@support_bp.route("/tickets/<ticket_id>", methods=["PATCH"])
@auth_required
@require_role("admin")
def resolve_ticket(ticket_id):
    """Admin responds to a support ticket and marks it as resolved."""
    try:
        data = request.get_json() or {}
        reply = data.get("reply")
        status = data.get("status", "resolved")

        clean_id = str(ticket_id).replace("#", "").strip()
        ticket = db.get_by_id("tickets", clean_id)
        if not ticket:
            all_t = db.get_all("tickets") or []
            ticket = next((t for t in all_t if isinstance(t, dict) and (t.get("id") == clean_id or str(t.get("id")) == str(ticket_id))), None)

        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404

        updates = {
            "adminReply": reply or "Issue resolved by Ministry Support.",
            "status": status,
            "resolvedAt": current_iso_time()
        }

        target_id = ticket.get("id", clean_id)
        updated = db.update("tickets", target_id, updates)
        if not updated:
            updated = {**ticket, **updates}

        return jsonify({"message": "Ticket status updated", "ticket": updated}), 200
    except Exception as e:
        print(f"Error resolving ticket: {e}")
        return jsonify({"error": str(e)}), 500
