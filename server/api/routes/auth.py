from flask import Blueprint
from controllers.auth import (
    google_login,
    google_callback,
    get_current_user,
    logout,
    signup,
    login,
    update_password,
    delete_account_request,
)

from controllers.resetPassword import (
    request_password_reset,
    verify_reset_token,
    reset_password,
)

auth = Blueprint("auth", __name__)

# Auth routes - using proper Flask blueprint syntax
auth.add_url_rule("/google", "google_login", google_login, methods=["GET"])
auth.add_url_rule(
    "/google/callback", "google_callback", google_callback, methods=["GET"]
)
auth.add_url_rule("/me", "get_current_user", get_current_user, methods=["GET"])
auth.add_url_rule("/logout", "logout", logout, methods=["POST"])
auth.add_url_rule(
    "/update-password", "update-password", update_password, methods=["PUT"]
)
auth.add_url_rule(
    "/delete-account", "delete-account", delete_account_request, methods=["POST"]
)
auth.add_url_rule("/signup", "signup", signup, methods=["POST"])
auth.add_url_rule("/login", "login", login, methods=["POST"])


auth.add_url_rule(
    "/forgot-password", 
    "forgot-password", 
    request_password_reset, 
    methods=["POST"]
)
auth.add_url_rule(
    "/verify-reset-token", 
    "verify-reset-token", 
    verify_reset_token, 
    methods=["GET"]
)
auth.add_url_rule(
    "/reset-password", 
    "reset-password", 
    reset_password, 
    methods=["POST"]
)