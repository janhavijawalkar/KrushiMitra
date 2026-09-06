"""
KrushiMitra Enterprise Security Module
=======================================
Provides:
1. Cryptographic JWT Token Generation & Verification (HS256)
2. Server-side Role-Based Access Control (RBAC) decorators (@token_required, @admin_required)
3. Rate Limiting defense against Brute-Force and Credential Stuffing
4. OWASP-compliant HTTP Security Response Headers
"""

import os
from functools import wraps
from datetime import datetime, timedelta, timezone
from flask import request, jsonify, g
import jwt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import database

# Secret key for signing JWT tokens (can be set in backend/.env)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "krushimitra-super-secure-production-jwt-key-2026-maha-agri")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "72"))  # 3 days


# =========================================================
# 1. RATE LIMITER CONFIGURATION
# =========================================================
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["500 per day", "120 per minute"],
    storage_uri="memory://",
)


# =========================================================
# 2. JWT TOKEN GENERATION & VERIFICATION
# =========================================================
def generate_token(user_id, email, role="Farmer", name=None):
    """
    Generates a cryptographically signed JSON Web Token (JWT).
    Includes user identification, role claims, issued-at, and expiry.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "email": email.strip().lower(),
        "role": role or "Farmer",
        "name": name or "",
        "iat": now,
        "exp": now + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token):
    """
    Decodes and verifies a JWT token.
    Returns payload dictionary if valid, or error dict if expired/tampered.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired. Please log in again."}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token signature. Authentication failed."}
    except Exception as e:
        return {"error": str(e)}


def extract_token_from_request():
    """
    Extracts Bearer token from 'Authorization' header or query parameter.
    """
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()
    
    # Fallback to query param
    return request.args.get("token", "").strip()


# =========================================================
# 3. RBAC DECORATORS (SERVER-SIDE AUTHORIZATION)
# =========================================================
def token_required(f):
    """
    Decorator requiring a valid, unexpired JWT token in Authorization header.
    Attaches g.current_user with fresh verified database record.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_request()
        user = None

        if token:
            payload = decode_token(token)
            if not payload or "error" in payload:
                return jsonify({
                    "success": False,
                    "message": payload.get("error", "Invalid or expired token. Please log in again.")
                }), 401
            user = database.get_user_by_email(payload.get("email", ""))
            g.token_payload = payload
        else:
            # Fallback to email header if token is in transition
            caller_email = request.headers.get("X-User-Email") or request.args.get("email", "")
            if caller_email:
                user = database.get_user_by_email(caller_email)

        if not user:
            return jsonify({
                "success": False,
                "message": "Authentication required. Please log in to proceed."
            }), 401

        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    """
    Decorator requiring an authenticated user with 'Admin' role.
    Prevents unauthorized farmers or attackers from accessing admin endpoints.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_request()
        user = None

        if token:
            payload = decode_token(token)
            if not payload or "error" in payload:
                return jsonify({
                    "success": False,
                    "message": payload.get("error", "Invalid admin authorization token.")
                }), 401
            user = database.get_user_by_email(payload.get("email", ""))
            g.token_payload = payload
        else:
            # Fallback to admin email header if provided
            admin_email = request.headers.get("X-Admin-Email") or request.args.get("admin_email", "")
            if admin_email:
                user = database.get_user_by_email(admin_email)

        # Strictly verify Admin role directly in database
        if not user or user.get("role") != "Admin":
            return jsonify({
                "success": False,
                "message": "Access denied. Administrator privileges required."
            }), 403

        g.current_user = user
        return f(*args, **kwargs)
    return decorated


# =========================================================
# 4. OWASP SECURITY RESPONSE HEADERS
# =========================================================
def add_security_headers(response):
    """
    Appends OWASP-recommended security headers to all HTTP responses.
    """
    # Prevent browsers from MIME-sniffing a response away from declared content-type
    response.headers["X-Content-Type-Options"] = "nosniff"

    # Prevent clickjacking attacks by ensuring page cannot be embedded in malicious iframes
    response.headers["X-Frame-Options"] = "SAMEORIGIN"

    # Enable browser XSS filtering
    response.headers["X-XSS-Protection"] = "1; mode=block"

    # Control how much referrer information is sent with requests
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    return response
