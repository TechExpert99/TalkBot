# 🤖 TalkBot - AI Vision Voice And Video Assistant

A cutting-edge AI-powered chat assistant with real-time camera vision, emotion detection, and interactive avatar responses powered by Google Gemini 2.0.

![TalkBot Banner](https://img.shields.io/badge/TalkBot-AI%20Assistant-6366f1?style=for-the-badge&logo=robot&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.0-4285F4?style=flat&logo=google&logoColor=white)

## ✨ Features

### 💬 VoiceBot
- Conversational AI powered by Google Gemini 2.0 Flash
- Context-aware responses with session management
- Voice input (Speech-to-Text)
- Voice output (Text-to-Speech)
- Beautiful modern UI with code highlighting
- Real-time message streaming

### 📷 VideoBot (YouTube Live Style)
- **Real-time video streaming** with camera input
- **AI-powered emotion detection** (7+ emotions)
- **Interactive avatar** with lip-sync animation
- **Draggable & resizable** picture-in-picture camera
- **Live chat interface** like YouTube Live
- **Facial expression analysis** using Gemini Vision
- **Bottom control bar** with intuitive buttons

### 🎭 Advanced Features
- Multi-face detection support
- Emotion-aware AI responses
- Real-time video processing
- WebRTC integration
- Responsive design for all devices
- Dark theme with purple accents
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Webcam (for CameraBot features)
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/talkbot.git
cd talkbot
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

5. **Run the application**
```bash
python app.py
```

6. **Open in browser**
```
http://localhost:5000
```

## 📁 Project Structure
```
talkbot/
│
├── app.py                  # Flask backend server
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
├── README.md              # Documentation
│
├── static/
│   ├── js/
│   │   ├── script.js      # Chat page logic
│   │   ├── camera.js      # Camera page logic
│   │   └── common.js      # Shared utilities
│   ├── css/
│   │   └── style.css      # Global styles
│   └── images/
│       └── logo.png       # Application logo
│
├── templates/
│   ├── index.html         # Home page
│   ├── chat.html          # Chat interface
│   ├── camera.html        # Camera interface (YouTube style)
│   ├── about.html         # About page
│   ├── future.html        # Roadmap page
│   └── contact.html       # Contact page
│
├── uploads/               # User uploaded files
│   └── .gitkeep
│
└── utils/                 # Utility modules
    ├── __init__.py
    ├── emotion_detector.py
    ├── avatar_generator.py
    └── speech_handler.py
```

## 🎯 Usage Guide

### ChatBot
1. Navigate to `/chat`
2. Type your message or use voice input (🎤)
3. Press Enter or click Send
4. Click speaker icon (🔊) to hear responses

### CameraBot
1. Navigate to `/camera`
2. Click **Camera** button to start webcam
3. Your camera appears in draggable PiP window
4. Click **Capture** to analyze your expression
5. AI responds based on your emotion
6. Use bottom controls:
   - 📹 Start/Stop Camera
   - 📸 Capture & Analyze
   - 🎙️ Voice Input
   - 🔊 Speak Response

## 🛠️ Technology Stack

### Backend
- **Flask** - Web framework
- **Google Gemini 2.0** - AI model
- **Python 3.8+** - Programming language
- **Pillow** - Image processing

### Frontend
- **HTML5 & CSS3** - Structure and styling
- **JavaScript ES6+** - Client-side logic
- **WebRTC** - Camera access
- **Canvas API** - Avatar rendering
- **Web Speech API** - Voice features

### APIs & Services
- Google Gemini API - Text and Vision AI
- Web Speech API - Voice recognition
- MediaDevices API - Camera access

## 📖 API Endpoints

### Chat Endpoints
```
POST /chat
Body: { "message": "Hello", "session_id": "user123" }
Response: { "reply": "Hi! How can I help?", "session_id": "user123" }

POST /clear-chat
Body: { "session_id": "user123" }
Response: { "message": "Chat cleared" }
```

### Camera Endpoints
```
POST /camera
Body: {
  "frame": "base64_image_data",
  "emotion": "happy",
  "message": "Analyze this"
}
Response: {
  "reply": "I can see you're happy!",
  "emotion": "happy"
}
```

### Status Endpoints
```
GET /health
Response: {
  "status": "healthy",
  "model": "gemini-2.0-flash-exp"
}
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `static/css/style.css`:
```css
:root {
  --accent-primary: #6366f1;  /* Your primary color */
  --bg-primary: #0a0e27;      /* Background color */
}
```

### Modify Avatar
Edit `drawAvatar()` function in camera page or create custom avatars in `utils/avatar_generator.py`

### Add New Features
1. Create route in `app.py`
2. Add HTML template in `templates/`
3. Add JavaScript logic in `static/js/`

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Use HTTPS or localhost
- Try Chrome/Edge (best support)

### API Errors
- Verify `GEMINI_API_KEY` in `.env`
- Check API quota limits
- Review console logs

### Voice Not Working
- Chrome/Edge recommended
- Check microphone permissions
- Not supported in private/incognito mode

## 🔐 Security

- Never commit `.env` file
- Keep API keys secret
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting

## 📝 License

This project is for educational purposes. Feel free to modify and use for learning.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/talkbot/issues)
- **Email**: support@talkbot.ai
- **Documentation**: [Wiki](https://github.com/yourusername/talkbot/wiki)

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model
- Flask community for excellent web framework
- WebRTC for real-time communication
- All open-source contributors

---

**Made with ❤️ by TalkBot Team** • **Powered by Gemini AI** • **© 2025**
```

## 📄 .gitignore
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
*.egg-info/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/*
!uploads/.gitkeep

# Logs
*.log
logs/

# Testing
.pytest_cache/
.coverage
htmlcov/

# Misc
*.bak
*.tmp
