# Utils package initialization
from .emotion_detector import EmotionDetector
from .avatar_generator import AvatarGenerator
from .speech_handler import SpeechHandler

__all__ = ['EmotionDetector', 'AvatarGenerator', 'SpeechHandler']
# utils/__init__.py
# This file makes the utils directory a Python package

"""
TalkBot Utilities Package

This package contains utility modules for Firebase authentication,
Firestore database operations, and other helper functions.
"""

__version__ = '1.0.0'
__all__ = ['firebase_auth']