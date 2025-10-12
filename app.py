from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import base64
from PIL import Image
import io
import cv2
import numpy as np

# Load environment variables
load_dotenv()

app = Flask(__name__)

# ---------------- Gemini Setup ---------------- #
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("⚠️ GEMINI_API_KEY not found in environment variables!")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash-exp")

# ---------------- ChatBot History ---------------- #
chat_sessions = {}

# ---------------- CameraBot History ---------------- #
camera_history = []

# ---------------- Pages ---------------- #
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/future")
def future():
    return render_template("future.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/chat")
@app.route("/chat-page")
def chat_page():
    return render_template("chat.html")

@app.route("/camera")
def camera_page():
    return render_template("camera.html")

# ---------------- Chat API ---------------- #
@app.route("/chat", methods=["POST"])
def chat_api():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_msg = data.get("message", "").strip()
        session_id = data.get("session_id", "default")
        
        if not user_msg:
            return jsonify({"error": "Message cannot be empty"}), 400

        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat(history=[])
        
        chat = chat_sessions[session_id]
        response = chat.send_message(user_msg)
        bot_reply = response.text if response and response.text else "⚠️ No reply from Gemini."
        
        return jsonify({"reply": bot_reply, "session_id": session_id})
    
    except Exception as e:
        return jsonify({"error": f"⚠️ Error: {str(e)}"}), 500

@app.route("/clear-chat", methods=["POST"])
def clear_chat():
    try:
        data = request.json
        session_id = data.get("session_id", "default")
        if session_id in chat_sessions:
            del chat_sessions[session_id]
        return jsonify({"message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- CameraBot API ---------------- #
# Optional: Simple emotion detection using Haar cascade + pretrained model
# For demo, we use faces only; you can replace with deep learning model for real emotions
@app.route("/camera", methods=["POST"])
def camera_api():
    try:
        data = request.json
        frame_data = data.get("frame", "")
        bot_reply = "⚠️ No frame received"

        if frame_data:
            # Decode Base64 frame
            header, encoded = frame_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            image = Image.open(io.BytesIO(image_bytes))
            img_np = np.array(image)
            img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

            # Face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(img_cv, scaleFactor=1.1, minNeighbors=5)

            if len(faces) > 0:
                bot_reply = f"Detected {len(faces)} face(s)"
                # Placeholder: Emotion detection can be added here using pretrained model
                # Example: emotion = predict_emotion(face_crop)
                # bot_reply += f", Emotion: {emotion}"
            else:
                bot_reply = "No face detected"

        # Save to history
        camera_history.append({"user": "frame", "bot": bot_reply})
        return jsonify({"reply": bot_reply})

    except Exception as e:
        return jsonify({"reply": f"⚠️ Error: {str(e)}"}), 500

# ---------------- Camera History API ---------------- #
@app.route("/history/camera", methods=["GET"])
def get_camera_history():
    return jsonify(camera_history)

@app.route("/history/camera/clear", methods=["POST"])
def clear_camera_history():
    camera_history.clear()
    return jsonify({"status": "success", "message": "CameraBot history cleared"})

# ---------------- Health Check ---------------- #
@app.route("/health")
def health():
    return jsonify({"status": "healthy", "model": "gemini-2.0-flash-exp"})

# ---------------- Error Handlers ---------------- #
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

# ---------------- Run ---------------- #
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
