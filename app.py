from flask import Flask, render_template, request, jsonify, url_for
import google.generativeai as genai
import os

app = Flask(__name__)

# 🔑 Configure Gemini API Key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Home Page
@app.route("/")
def home():
    return render_template("index.html")

# About Page
@app.route("/about")
def about():
    return render_template("about.html")

# Future Page
@app.route("/future")
def future():
    return render_template("future.html")

# Contact Page
@app.route("/contact")
def contact():
    return render_template("contact.html")

# Chat Page
@app.route("/chat-page")
def chat_page():
    return render_template("chat.html")

# Camera Page
@app.route("/camera")
def camera_page():
    return render_template("camera.html")

# Chat API
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_msg = data.get("message", "")

    try:
        # Call Gemini API
        response = model.generate_content(user_msg)
        bot_reply = response.text if response and response.text else "⚠️ No reply from Gemini."
    except Exception as e:
        bot_reply = f"⚠️ Error: {str(e)}"

    return jsonify({"reply": bot_reply})


if __name__ == "__main__":
    app.run(debug=True)
