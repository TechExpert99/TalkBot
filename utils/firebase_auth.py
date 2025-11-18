# utils/firebase_auth.py
"""
Firebase Authentication Helper for TalkBot Backend
Verifies Firebase ID tokens sent from the frontend
"""

import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from flask import request, jsonify
import os

# ========================================
# INITIALIZE FIREBASE ADMIN SDK
# ========================================
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
        print("✅ Firebase Admin SDK already initialized")
        return True
    except ValueError:
        # Not initialized yet, so initialize it
        try:
            # Path to service account key
            cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'serviceAccountKey.json')
            
            if not os.path.exists(cred_path):
                print("⚠️  WARNING: serviceAccountKey.json not found!")
                print(f"   Expected location: {cred_path}")
                print("   Download it from Firebase Console > Project Settings > Service Accounts")
                return False
            
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialized successfully")
            return True
        except Exception as e:
            print(f"❌ Error initializing Firebase: {str(e)}")
            return False

# ========================================
# VERIFY FIREBASE ID TOKEN
# ========================================
def verify_firebase_token(id_token):
    """
    Verify a Firebase ID token
    
    Args:
        id_token (str): The ID token to verify
        
    Returns:
        dict: Decoded token with user info, or None if invalid
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return {
            'uid': decoded_token['uid'],
            'email': decoded_token.get('email'),
            'name': decoded_token.get('name'),
            'picture': decoded_token.get('picture'),
            'email_verified': decoded_token.get('email_verified', False)
        }
    except auth.InvalidIdTokenError:
        print("❌ Invalid Firebase ID token")
        return None
    except auth.ExpiredIdTokenError:
        print("❌ Expired Firebase ID token")
        return None
    except Exception as e:
        print(f"❌ Error verifying token: {str(e)}")
        return None

# ========================================
# DECORATOR TO REQUIRE AUTHENTICATION
# ========================================
def require_auth(f):
    """
    Decorator to protect routes with Firebase authentication
    
    Usage:
        @app.route('/api/protected')
        @require_auth
        def protected_route(current_user):
            return jsonify({'message': f'Hello {current_user["email"]}!'})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        id_token = auth_header.replace('Bearer ', '')
        
        # Verify token
        user = verify_firebase_token(id_token)
        
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Pass user info to the route function
        return f(current_user=user, *args, **kwargs)
    
    return decorated_function

# ========================================
# OPTIONAL AUTH DECORATOR
# ========================================
def optional_auth(f):
    """
    Decorator that passes user info if authenticated, None if not
    
    Usage:
        @app.route('/api/public')
        @optional_auth
        def public_route(current_user):
            if current_user:
                return jsonify({'message': f'Hello {current_user["email"]}!'})
            return jsonify({'message': 'Hello anonymous user!'})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer '):
            id_token = auth_header.replace('Bearer ', '')
            user = verify_firebase_token(id_token)
            return f(current_user=user, *args, **kwargs)
        
        return f(current_user=None, *args, **kwargs)
    
    return decorated_function

# ========================================
# GET USER BY UID
# ========================================
def get_user_by_uid(uid):
    """
    Get user information by Firebase UID
    
    Args:
        uid (str): Firebase user UID
        
    Returns:
        dict: User information or None
    """
    try:
        user = auth.get_user(uid)
        return {
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name,
            'photo_url': user.photo_url,
            'email_verified': user.email_verified,
            'disabled': user.disabled
        }
    except Exception as e:
        print(f"❌ Error getting user: {str(e)}")
        return None

# ========================================
# GET USER BY EMAIL
# ========================================
def get_user_by_email(email):
    """
    Get user information by email
    
    Args:
        email (str): User email
        
    Returns:
        dict: User information or None
    """
    try:
        user = auth.get_user_by_email(email)
        return {
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name,
            'photo_url': user.photo_url,
            'email_verified': user.email_verified
        }
    except Exception as e:
        print(f"❌ Error getting user: {str(e)}")
        return None

# ========================================
# CREATE CUSTOM TOKEN
# ========================================
def create_custom_token(uid, additional_claims=None):
    """
    Create a custom Firebase token
    
    Args:
        uid (str): User UID
        additional_claims (dict): Optional additional claims
        
    Returns:
        str: Custom token
    """
    try:
        custom_token = auth.create_custom_token(uid, additional_claims)
        return custom_token.decode('utf-8')
    except Exception as e:
        print(f"❌ Error creating custom token: {str(e)}")
        return None