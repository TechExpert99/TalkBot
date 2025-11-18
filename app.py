from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import base64
from PIL import Image
import io

# Import Firebase auth utilities
from utils.firebase_auth import initialize_firebase, require_auth, optional_auth

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
CORS(app)

# ============================================
# FIREBASE SETUP
# ============================================
print("\n" + "="*60)
print("🔥 INITIALIZING FIREBASE")
print("="*60)
firebase_initialized = initialize_firebase()
if firebase_initialized:
    print("✅ Firebase Admin SDK initialized successfully")
else:
    print("⚠️  Firebase initialization failed - authentication may not work")
print("="*60)

# ============================================
# GEMINI SETUP
# ============================================
print("\n" + "="*60)
print("🤖 INITIALIZING GEMINI AI")
print("="*60)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️  WARNING: GEMINI_API_KEY not found!")
    print("   Please create a .env file with: GEMINI_API_KEY=your_key_here")
else:
    print(f"✅ Gemini API Key loaded: {api_key[:10]}...")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash-exp")
print("✅ Gemini model initialized: gemini-2.0-flash-exp")
print("="*60)

# ============================================
# SESSION STORAGE
# ============================================
chat_sessions = {}

# ============================================
# ROUTES - PAGES
# ============================================
@app.route("/")
def home():
    """Home page"""
    return render_template("index.html")

@app.route("/about")
def about():
    """About page"""
    return render_template("about.html")

@app.route("/future")
def future():
    """Future/Roadmap page"""
    return render_template("future.html")

@app.route("/contact")
def contact():
    """Contact page"""
    return render_template("contact.html")

@app.route("/chat")
def chat_page():
    """Chat page - protected (frontend checks auth)"""
    return render_template("chat.html")

@app.route("/camera")
def camera_page():
    """Camera page - protected (frontend checks auth)"""
    return render_template("camera.html")

# ============================================
# API - CHAT (PROTECTED)
# ============================================
@app.route("/api/chat", methods=["POST"])
@require_auth
def chat_api(current_user):
    """
    Chat API endpoint - protected with Firebase auth
    
    Args:
        current_user (dict): User info from Firebase token (injected by @require_auth)
    """
    try:
        print("\n" + "="*60)
        print("📨 CHAT REQUEST RECEIVED")
        print("="*60)
        print(f"👤 User: {current_user['email']}")
        print(f"🔑 UID: {current_user['uid']}")
        
        data = request.json
        if not data:
            print("❌ No data provided")
            return jsonify({"error": "No data provided"}), 400
        
        user_msg = data.get("message", "").strip()
        # Use user's UID as session ID for personalized conversations
        session_id = current_user['uid']
        
        print(f"💬 Message: {user_msg[:100]}{'...' if len(user_msg) > 100 else ''}")
        print(f"📦 Session ID: {session_id}")
        
        if not user_msg:
            print("❌ Empty message")
            return jsonify({"error": "Message cannot be empty"}), 400

        # Get or create chat session for this user
        if session_id not in chat_sessions:
            print(f"✨ Creating new chat session for: {current_user['email']}")
            chat_sessions[session_id] = model.start_chat(history=[])
        
        chat = chat_sessions[session_id]
        
        # Send message to Gemini
        print("🤖 Sending to Gemini AI...")
        response = chat.send_message(user_msg)
        bot_reply = response.text if response and response.text else "No reply"
        
        print(f"✅ Bot reply length: {len(bot_reply)} characters")
        print(f"💬 Preview: {bot_reply[:100]}{'...' if len(bot_reply) > 100 else ''}")
        print("="*60 + "\n")
        
        return jsonify({
            "reply": bot_reply,
            "session_id": session_id,
            "user": current_user['email']
        })
    
    except Exception as e:
        print(f"❌ CHAT ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        print("="*60 + "\n")
        return jsonify({"error": f"Error: {str(e)}"}), 500

# ============================================
# API - CAMERA (PROTECTED)
# ============================================
@app.route("/api/camera", methods=["POST"])
@require_auth
def camera_api(current_user):
    """
    Camera API endpoint - protected with Firebase auth
    Handles image/video analysis with emotion detection
    
    Args:
        current_user (dict): User info from Firebase token
    """
    try:
        print("\n" + "="*60)
        print("📷 CAMERA REQUEST RECEIVED")
        print("="*60)
        print(f"👤 User: {current_user['email']}")
        print(f"🔑 UID: {current_user['uid']}")
        
        data = request.json
        frame_data = data.get("frame", "")
        emotion = data.get("emotion", "neutral")
        user_message = data.get("message", "")
        
        print(f"😊 Detected Emotion: {emotion}")
        print(f"💬 User Message: {user_message[:50]}{'...' if len(user_message) > 50 else ''}")
        
        if not frame_data:
            print("❌ No frame data provided")
            return jsonify({"error": "No frame data"}), 400
        
        # Decode image
        try:
            if "," in frame_data:
                header, encoded = frame_data.split(",", 1)
            else:
                encoded = frame_data
            
            image_bytes = base64.b64decode(encoded)
            image = Image.open(io.BytesIO(image_bytes))
            print(f"✅ Image decoded successfully: {image.size} pixels")
            
        except Exception as img_error:
            print(f"❌ Image decode error: {str(img_error)}")
            return jsonify({"error": "Invalid image format"}), 400
        
        # Create personalized prompt
        user_name = current_user.get('name', current_user['email'].split('@')[0])
        prompt = f"""You are a friendly AI assistant talking to {user_name}.

The user's current emotion appears to be: {emotion}
User says: {user_message if user_message else "Just showing the camera"}

Respond warmly and empathetically in 1-2 sentences. Be supportive and engaging."""

        print("🤖 Sending to Gemini Vision AI...")
        
        # Send to Gemini with image
        response = model.generate_content([prompt, image])
        bot_reply = response.text if response and response.text else "I can see you! How can I help?"
        
        print(f"✅ AI Reply: {bot_reply[:100]}{'...' if len(bot_reply) > 100 else ''}")
        print("="*60 + "\n")
        
        return jsonify({
            "reply": bot_reply,
            "emotion": emotion,
            "user": current_user['email']
        })
    
    except Exception as e:
        print(f"❌ CAMERA ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        print("="*60 + "\n")
        return jsonify({
            "error": str(e),
            "reply": "Sorry, I had trouble processing that. Try again!"
        }), 500

# ============================================
# API - USER PROFILE (PROTECTED)
# ============================================
@app.route("/api/user/profile", methods=["GET"])
@require_auth
def get_profile(current_user):
    """Get current user profile with session info"""
    return jsonify({
        'uid': current_user['uid'],
        'email': current_user['email'],
        'name': current_user.get('name'),
        'picture': current_user.get('picture'),
        'email_verified': current_user.get('email_verified', False),
        'has_active_session': current_user['uid'] in chat_sessions
    })

# ============================================
# API - CLEAR CHAT HISTORY (PROTECTED)
# ============================================
@app.route("/api/chat/clear", methods=["POST"])
@require_auth
def clear_chat(current_user):
    """Clear user's chat history"""
    try:
        session_id = current_user['uid']
        if session_id in chat_sessions:
            del chat_sessions[session_id]
            print(f"🗑️  Cleared chat history for: {current_user['email']}")
            return jsonify({"message": "Chat history cleared successfully"})
        return jsonify({"message": "No chat history to clear"})
    except Exception as e:
        print(f"❌ Error clearing chat: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ============================================
# API - PUBLIC INFO (OPTIONAL AUTH)
# ============================================
@app.route("/api/info", methods=["GET"])
@optional_auth
def public_info(current_user):
    """
    Public endpoint that works with or without authentication
    Shows different info based on auth status
    """
    if current_user:
        return jsonify({
            'message': f'Hello {current_user["email"]}! You are authenticated.',
            'authenticated': True,
            'has_chat_history': current_user['uid'] in chat_sessions,
            'total_active_sessions': len(chat_sessions)
        })
    else:
        return jsonify({
            'message': 'Welcome to TalkBot! Sign in to start chatting.',
            'authenticated': False,
            'features': ['Chat with AI', 'Camera Interaction', 'Emotion Detection']
        })

# ============================================
# HEALTH CHECK
# ============================================
@app.route("/health")
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "services": {
            "flask": "running",
            "gemini": "configured" if api_key else "not configured",
            "firebase_auth": "initialized" if firebase_initialized else "not initialized"
        },
        "model": "gemini-2.0-flash-exp",
        "active_sessions": len(chat_sessions)
    })

# ============================================
# ERROR HANDLERS
# ============================================
@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    print(f"❌ Server error: {str(e)}")
    import traceback
    traceback.print_exc()
    return jsonify({"error": "Internal server error"}), 500

# ============================================
# RUN
# ============================================
if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 TALKBOT SERVER STARTING")
    print("="*60)
    print("\n📋 SERVICE STATUS:")
    print("   ✅ Flask: Running")
    print(f"   {'✅' if api_key else '❌'} Gemini AI: {'Configured' if api_key else 'NOT CONFIGURED'}")
    print(f"   {'✅' if firebase_initialized else '❌'} Firebase Auth: {'Initialized' if firebase_initialized else 'NOT INITIALIZED'}")
    print(f"   ✅ Model: gemini-2.0-flash-exp")
    print("\n" + "="*60)
    print("🌐 AVAILABLE ENDPOINTS")
    print("="*60)
    print("\n   📖 PUBLIC PAGES:")
    print("   • http://localhost:5000/")
    print("   • http://localhost:5000/about")
    print("   • http://localhost:5000/future")
    print("   • http://localhost:5000/contact")
    print("\n   🔒 PROTECTED PAGES (require sign-in):")
    print("   • http://localhost:5000/chat")
    print("   • http://localhost:5000/camera")
    print("\n   🔐 PROTECTED API ENDPOINTS:")
    print("   • POST   /api/chat          - Send chat message")
    print("   • POST   /api/camera        - Analyze camera image")
    print("   • GET    /api/user/profile  - Get user profile")
    print("   • POST   /api/chat/clear    - Clear chat history")
    print("\n   🌍 PUBLIC API ENDPOINTS:")
    print("   • GET    /api/info          - Get service info")
    print("   • GET    /health            - Health check")
    print("\n" + "="*60)
    print("💾 DATA STORAGE")
    print("="*60)
    print("   • User accounts: Firebase Authentication")
    print("   • Chat sessions: In-memory (cleared on restart)")
    print("   • Active sessions: " + str(len(chat_sessions)))
    print("="*60)
    
    if not api_key:
        print("\n⚠️  WARNING: GEMINI_API_KEY not found!")
        print("   Please add to .env file:")
        print("   GEMINI_API_KEY=your-api-key-here")
        print("="*60)
    
    if not firebase_initialized:
        print("\n⚠️  WARNING: Firebase not initialized!")
        print("   Please ensure serviceAccountKey.json exists")
        print("   Download from: Firebase Console > Project Settings > Service Accounts")
        print("="*60)
    
    print("\n✨ Server ready! Waiting for requests...\n")
    
    # Create uploads directory if it doesn't exist
    os.makedirs('uploads', exist_ok=True)
    
    # Run Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    
    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug
    )