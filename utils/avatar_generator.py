"""
Avatar Generator Utility
Handles AI avatar rendering and animation
"""

class AvatarGenerator:
    def __init__(self):
        self.avatar_styles = ['default', 'friendly', 'professional', 'playful']
        self.current_style = 'default'
    
    def generate_avatar_data(self, emotion='neutral', speaking=False):
        """
        Generate avatar rendering data
        Args:
            emotion: Current emotion
            speaking: Whether avatar is speaking
        Returns:
            dict: Avatar state data
        """
        return {
            'emotion': emotion,
            'speaking': speaking,
            'style': self.current_style,
            'animation': 'talking' if speaking else 'idle'
        }
    
    def set_style(self, style):
        """Set avatar style"""
        if style in self.avatar_styles:
            self.current_style = style
            return True
        return False
    
    def get_lip_sync_data(self, text):
        """
        Generate lip sync timing data
        Args:
            text: Text being spoken
        Returns:
            list: Timing data for lip movements
        """
        words = text.split()
        return [
            {'word': word, 'duration': len(word) * 100}
            for word in words
        ]