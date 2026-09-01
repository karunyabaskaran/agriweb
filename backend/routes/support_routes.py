from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time

support_bp = Blueprint("support", __name__, url_prefix="/api/support")

@support_bp.route("/tickets", methods=["POST"])
@auth_required
def create_support_ticket():
    """Buyer or Farmer submits a formal support ticket/grievance to the Ministry of Agriculture."""
    try:
        data = request.get_json() or {}
        subject = data.get("subject")
        category = data.get("category", "General Query")
        description = data.get("description")
        order_id = data.get("orderId")

        if not subject or not description:
            return jsonify({"error": "subject and description are required"}), 400

        user_id = g.user.get("id")
        user_name = g.user.get("name", "User")
        user_role = g.user.get("role", "buyer")

        ticket_id = f"tck-{new_id()[:8]}"

        ticket = {
            "id": ticket_id,
            "userId": user_id,
            "userName": user_name,
            "userRole": user_role,
            "orderId": order_id,
            "category": category,
            "subject": str(subject).strip(),
            "description": str(description).strip(),
            "status": "open", # open -> in_progress -> resolved
            "adminResponse": None,
            "createdAt": current_iso_time()
        }

        db.insert("support_tickets", ticket)
        return jsonify({"message": "Grievance submitted successfully to the Ministry of Agriculture", "ticket": ticket}), 201
    except Exception as e:
        print(f"Error creating support ticket: {e}")
        return jsonify({"error": f"Failed to submit support ticket: {str(e)}"}), 500

@support_bp.route("/tickets", methods=["GET"])
@auth_required
def get_support_tickets():
    """Retrieve support tickets: User sees their raised tickets; Admin/Ministry sees all platform tickets."""
    try:
        all_tickets = db.get_all("support_tickets") or []
        user_id = g.user.get("id")
        role = g.user.get("role")

        if role == "admin":
            mine = all_tickets
        else:
            mine = [t for t in all_tickets if isinstance(t, dict) and t.get("userId") == user_id]

        return jsonify(mine), 200
    except Exception as e:
        print(f"Error fetching support tickets: {e}")
        return jsonify({"error": f"Failed to fetch support tickets: {str(e)}"}), 500

@support_bp.route("/tickets/<ticket_id>", methods=["PATCH"])
@auth_required
@require_role("admin")
def update_support_ticket(ticket_id):
    """Ministry Officer/Admin resolves or updates a support ticket status."""
    try:
        data = request.get_json() or {}
        new_status = data.get("status")
        response_text = data.get("adminResponse")

        ticket = db.get_by_id("support_tickets", ticket_id)
        if not ticket:
            return jsonify({"error": "Support ticket not found"}), 404

        updates = {}
        if new_status in ["open", "in_progress", "resolved"]:
            updates["status"] = new_status
        if response_text:
            updates["adminResponse"] = response_text

        updated = db.update("support_tickets", ticket_id, updates)
        return jsonify({"message": "Ticket updated successfully", "ticket": updated}), 200
    except Exception as e:
        print(f"Error updating support ticket: {e}")
        return jsonify({"error": f"Failed to update support ticket: {str(e)}"}), 500
