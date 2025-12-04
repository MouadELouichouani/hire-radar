from flask import request, jsonify, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from core import database as db
from core.models import User

# Google OAuth imports
from google_auth_oauthlib.flow import Flow
import os

# Load from environment
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "secret123")


def google_login():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": ["http://localhost:5000/auth/google/callback"],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["openid", "email", "profile"],
    )

    flow.redirect_uri = "http://localhost:5000/auth/google/callback"

    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true"
    )

    session["state"] = state
    return redirect(authorization_url)


def google_callback():
    state = session.get("state")

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": ["http://localhost:5000/auth/google/callback"],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["openid", "email", "profile"],
        state=state
    )

    flow.redirect_uri = "http://localhost:5000/auth/google/callback"

    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials

    from google.oauth2 import id_token
    from google.auth.transport import requests

    token_info = id_token.verify_oauth2_token(
        credentials.id_token,
        requests.Request(),
        GOOGLE_CLIENT_ID
    )

    email = token_info["email"]
    name = token_info.get("name", "Unknown")

    # Check if user exists
    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(full_name=name, email=email, role="candidate")
        db.session.add(user)
        db.session.commit()

    # Create JWT
    token = jwt.encode(
        {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token, "user": {"name": user.full_name, "email": user.email}})


def get_current_user():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = User.query.get(decoded["id"])
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    })


def logout():
    session.clear()
    return jsonify({"message": "Logged out"})


def signup():
    data = request.json

    name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "candidate")

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    password_hash = generate_password_hash(password)

    new_user = User(
        full_name=name,
        email=email,
        password_hash=password_hash,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode(
        {"id": new_user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token, "user": {
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role
    }})


def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 400

    token = jwt.encode(
        {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token, "user": {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }})
