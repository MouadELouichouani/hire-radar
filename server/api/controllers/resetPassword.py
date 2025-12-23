from flask import request, jsonify
from sqlalchemy.orm import Session
from core.models import User, PasswordResetToken, engine
from datetime import datetime, timedelta
import secrets
from werkzeug.security import generate_password_hash
from services.email import send_reset_email
import os


def request_password_reset():
    """
    Request a password reset link.
    Sends an email with a reset token to the user.
    """
    session = Session(engine)
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Find user by email
        user = session.query(User).filter(User.email == email).first()

        # Always return success to prevent email enumeration
        if not user:
            return jsonify({
                "message": "If an account exists with this email, a reset link has been sent."
            }), 200

        # Generate secure random token
        token = secrets.token_urlsafe(32)
        
        # Set expiration (1 hour from now)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        # Invalidate any existing unused tokens for this user
        existing_tokens = session.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == 0
        ).all()
        
        for token_obj in existing_tokens:
            token_obj.used = 1

        # Create new reset token
        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=expires_at
        )
        session.add(reset_token)
        session.commit()

        # Send email with reset link
        # reset_url = f"{request.host_url}reset-password?token={token}"
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_url = f"{frontend_url}/reset-password?token={token}"
        send_reset_email(user.email, user.full_name, reset_url)

        return jsonify({
            "message": "If an account exists with this email, a reset link has been sent."
        }), 200

    except Exception as e:
        session.rollback()
        print(f"Error in request_password_reset: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500
    
    finally:
        session.close()


def verify_reset_token():
    """
    Verify if a reset token is valid.
    Used to check token before showing reset form.
    """
    session = Session(engine)
    try:
        token = request.args.get("token")

        if not token:
            return jsonify({"error": "Token is required"}), 400

        reset_token = session.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == 0,
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()

        if not reset_token:
            return jsonify({"error": "Invalid or expired token"}), 400

        return jsonify({
            "valid": True,
            "message": "Token is valid"
        }), 200

    except Exception as e:
        print(f"Error in verify_reset_token: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500
    
    finally:
        session.close()


def reset_password():
    """
    Reset password using the token.
    """
    session = Session(engine)
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("password")

        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        # Find valid token
        reset_token = session.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == 0,
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()

        if not reset_token:
            return jsonify({"error": "Invalid or expired token"}), 400

        # Get user
        user = session.query(User).filter(User.id == reset_token.user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Hash new password (using werkzeug - same as Flask's default)
        hashed_password = generate_password_hash(new_password)

        # Update password
        user.password = hashed_password

        # Mark token as used
        reset_token.used = 1

        session.commit()

        return jsonify({
            "message": "Password has been reset successfully"
        }), 200

    except Exception as e:
        session.rollback()
        print(f"Error in reset_password: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500
    
    finally:
        session.close()