/**
 * AGRIWEB — Authentication & Persona Manager
 */

const auth = {
  currentUser: null,
  token: null,

  init() {
    this.token = localStorage.getItem("aw_token") || localStorage.getItem("ks_token");
    const storedUser = localStorage.getItem("aw_user") || localStorage.getItem("ks_user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.updateUI();
  },

  setSession(token, user) {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem("aw_token", token);
    localStorage.setItem("aw_user", JSON.stringify(user));
    this.updateUI();
    
    // Trigger callback in main app to dynamically show/hide tabs & views
    if (window.app && typeof app.onAuthChanged === "function") {
      app.onAuthChanged();
    }
  },

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("aw_token");
    localStorage.removeItem("aw_user");
    localStorage.removeItem("ks_token");
    localStorage.removeItem("ks_user");
    this.updateUI();

    if (window.app && typeof app.onAuthChanged === "function") {
      app.onAuthChanged();
    }
    if (window.showToast) {
      showToast("Logged out successfully", "info");
    }
  },

  isLoggedIn() {
    return !!this.token && !!this.currentUser;
  },

  getRole() {
    return this.currentUser ? this.currentUser.role : "guest";
  },

  async login(phone, password) {
    const res = await api.login({ phone, password });
    this.setSession(res.token, res.user);
    return res.user;
  },

  async register(data) {
    const res = await api.register(data);
    this.setSession(res.token, res.user);
    return res.user;
  },

  updateUI() {
    const userChip = document.getElementById("userChip");
    const loginBtn = document.getElementById("loginBtn");
    const userNameSpan = document.getElementById("userName");
    const userRoleSpan = document.getElementById("userRole");
    const roleIndicator = document.getElementById("navRoleIndicator");

    if (this.isLoggedIn()) {
      if (userChip) userChip.style.display = "flex";
      if (loginBtn) loginBtn.style.display = "none";
      if (userNameSpan) userNameSpan.textContent = this.currentUser.name;
      if (userRoleSpan) {
        userRoleSpan.textContent = this.currentUser.role.toUpperCase();
      }

      // Update Top-Left Indicator stating who is accessing
      if (roleIndicator) {
        let roleName = "User";
        if (this.currentUser.role === "farmer") roleName = "Farmer";
        if (this.currentUser.role === "buyer") roleName = "Direct Buyer / Consumer";
        if (this.currentUser.role === "admin") roleName = "Admin / Ministry";
        roleIndicator.textContent = `👤 ${roleName}: ${this.currentUser.name}`;
      }
    } else {
      if (userChip) userChip.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (roleIndicator) {
        roleIndicator.textContent = "👤 Visitor / Guest Mode";
      }
    }
  }
};

window.auth = auth;
