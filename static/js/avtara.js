// ==================== AVATAR LIBRARY ====================
// Collection of different avatar styles and configurations

const AvatarLibrary = {
  // Avatar configurations
  avatars: {
    robot: {
      name: "Robot",
      icon: "🤖",
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#a78bfa"
      },
      features: {
        head: "circular",
        eyes: "digital",
        mouth: "robotic"
      }
    },
    
    friendly: {
      name: "Friendly",
      icon: "😊",
      colors: {
        primary: "#10b981",
        secondary: "#059669",
        accent: "#34d399"
      },
      features: {
        head: "circular",
        eyes: "happy",
        mouth: "smile"
      }
    },
    
    professional: {
      name: "Professional",
      icon: "👔",
      colors: {
        primary: "#3b82f6",
        secondary: "#2563eb",
        accent: "#60a5fa"
      },
      features: {
        head: "circular",
        eyes: "focused",
        mouth: "neutral"
      }
    },
    
    playful: {
      name: "Playful",
      icon: "🎉",
      colors: {
        primary: "#f59e0b",
        secondary: "#d97706",
        accent: "#fbbf24"
      },
      features: {
        head: "circular",
        eyes: "sparkle",
        mouth: "grin"
      }
    },
    
    mysterious: {
      name: "Mysterious",
      icon: "🎭",
      colors: {
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        accent: "#a78bfa"
      },
      features: {
        head: "circular",
        eyes: "mysterious",
        mouth: "subtle"
      }
    },
    
    energetic: {
      name: "Energetic",
      icon: "⚡",
      colors: {
        primary: "#ef4444",
        secondary: "#dc2626",
        accent: "#f87171"
      },
      features: {
        head: "circular",
        eyes: "excited",
        mouth: "wide"
      }
    },
    
    calm: {
      name: "Calm",
      icon: "🧘",
      colors: {
        primary: "#06b6d4",
        secondary: "#0891b2",
        accent: "#22d3ee"
      },
      features: {
        head: "circular",
        eyes: "serene",
        mouth: "gentle"
      }
    },
    
    cute: {
      name: "Cute",
      icon: "🐱",
      colors: {
        primary: "#ec4899",
        secondary: "#db2777",
        accent: "#f472b6"
      },
      features: {
        head: "rounded",
        eyes: "kawaii",
        mouth: "cute"
      }
    }
  },

  // Current active avatar
  current: "robot",

  // Get current avatar config
  getCurrentAvatar() {
    return this.avatars[this.current];
  },

  // Change avatar
  setAvatar(avatarId) {
    if (this.avatars[avatarId]) {
      this.current = avatarId;
      return true;
    }
    return false;
  },

  // Get all avatars
  getAllAvatars() {
    return Object.keys(this.avatars).map(id => ({
      id: id,
      ...this.avatars[id]
    }));
  }
};

// ==================== AVATAR RENDERER ====================
class AvatarRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationFrame = null;
  }

  // Main draw function
  draw(speaking = false, emotion = 'neutral') {
    const avatar = AvatarLibrary.getCurrentAvatar();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background
    this.drawBackground(avatar);

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const scale = Math.min(this.canvas.width, this.canvas.height) / 500;

    // Draw based on features
    this.drawHead(cx, cy, scale, avatar);
    this.drawEyes(cx, cy, scale, avatar, speaking);
    this.drawMouth(cx, cy, scale, avatar, speaking, emotion);
    this.drawAccessories(cx, cy, scale, avatar);
  }

  drawBackground(avatar) {
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
    );
    gradient.addColorStop(0, '#1a1f3a');
    gradient.addColorStop(1, '#0d1117');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawHead(cx, cy, scale, avatar) {
    // Glow effect
    this.ctx.shadowColor = avatar.colors.primary;
    this.ctx.shadowBlur = 60;

    // Head shape
    this.ctx.fillStyle = avatar.colors.primary;
    this.ctx.beginPath();
    
    if (avatar.features.head === 'rounded') {
      // More rounded for cute avatars
      this.ctx.arc(cx, cy, 140 * scale, 0, Math.PI * 2);
    } else {
      // Standard circular
      this.ctx.arc(cx, cy, 140 * scale, 0, Math.PI * 2);
    }
    
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  drawEyes(cx, cy, scale, avatar, speaking) {
    const eyeOffset = speaking ? Math.sin(Date.now() / 200) * 3 : 0;

    switch (avatar.features.eyes) {
      case 'digital':
        this.drawDigitalEyes(cx, cy, scale, eyeOffset);
        break;
      case 'happy':
        this.drawHappyEyes(cx, cy, scale);
        break;
      case 'focused':
        this.drawFocusedEyes(cx, cy, scale, eyeOffset);
        break;
      case 'sparkle':
        this.drawSparkleEyes(cx, cy, scale);
        break;
      case 'mysterious':
        this.drawMysteriousEyes(cx, cy, scale);
        break;
      case 'excited':
        this.drawExcitedEyes(cx, cy, scale);
        break;
      case 'serene':
        this.drawSereneEyes(cx, cy, scale);
        break;
      case 'kawaii':
        this.drawKawaiiEyes(cx, cy, scale);
        break;
      default:
        this.drawDigitalEyes(cx, cy, scale, eyeOffset);
    }
  }

  drawDigitalEyes(cx, cy, scale, offset) {
    // Standard robot eyes
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 22 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 22 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale + offset, cy - 25 * scale, 12 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 45 * scale + offset, cy - 25 * scale, 12 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Highlights
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(cx - 40 * scale, cy - 30 * scale, 6 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 50 * scale, cy - 30 * scale, 6 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawHappyEyes(cx, cy, scale) {
    // Crescent happy eyes
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 15 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 15 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawFocusedEyes(cx, cy, scale, offset) {
    // Sharp, focused eyes
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 45 * scale, cy - 25 * scale, 20 * scale, 18 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 45 * scale, cy - 25 * scale, 20 * scale, 18 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 45 * scale + offset, cy - 25 * scale, 10 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 45 * scale + offset, cy - 25 * scale, 10 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawSparkleEyes(cx, cy, scale) {
    // Star-like sparkle eyes
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 2; i++) {
      const x = i === 0 ? cx - 45 * scale : cx + 45 * scale;
      this.drawStar(x, cy - 25 * scale, 8, 20 * scale, 10 * scale);
    }
  }

  drawMysteriousEyes(cx, cy, scale) {
    // Half-closed mysterious eyes
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 45 * scale, cy - 25 * scale, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 45 * scale, cy - 25 * scale, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#4c1d95';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 45 * scale, cy - 25 * scale, 10 * scale, 8 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 45 * scale, cy - 25 * scale, 10 * scale, 8 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawExcitedEyes(cx, cy, scale) {
    // Wide excited eyes
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 25 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 25 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 15 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 15 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawSereneEyes(cx, cy, scale) {
    // Calm, serene eyes
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 3 * scale;
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 12 * scale, 0, Math.PI);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 12 * scale, 0, Math.PI);
    this.ctx.stroke();
  }

  drawKawaiiEyes(cx, cy, scale) {
    // Cute anime-style eyes
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, cy - 25 * scale, 18 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 45 * scale, cy - 25 * scale, 18 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Sparkles
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(cx - 40 * scale, cy - 30 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 50 * scale, cy - 30 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx - 48 * scale, cy - 20 * scale, 4 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 42 * scale, cy - 20 * scale, 4 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawMouth(cx, cy, scale, avatar, speaking, emotion) {
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 6 * scale;
    this.ctx.lineCap = 'round';

    if (speaking) {
      const mouthOpen = Math.abs(Math.sin(Date.now() / 150)) * 20 * scale;
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy + 50 * scale, 30 * scale, 15 * scale + mouthOpen, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      // Tongue
      this.ctx.fillStyle = '#ff6b9d';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy + 55 * scale, 18 * scale, 10 * scale, 0, 0, Math.PI);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      
      switch (avatar.features.mouth) {
        case 'robotic':
          this.ctx.arc(cx, cy + 35 * scale, 50 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
          break;
        case 'smile':
          this.ctx.arc(cx, cy + 30 * scale, 55 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
          break;
        case 'neutral':
          this.ctx.moveTo(cx - 40 * scale, cy + 40 * scale);
          this.ctx.lineTo(cx + 40 * scale, cy + 40 * scale);
          break;
        case 'grin':
          this.ctx.arc(cx, cy + 25 * scale, 60 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
          break;
        case 'subtle':
          this.ctx.arc(cx, cy + 40 * scale, 40 * scale, 0.3 * Math.PI, 0.7 * Math.PI);
          break;
        case 'wide':
          this.ctx.arc(cx, cy + 20 * scale, 70 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
          break;
        case 'gentle':
          this.ctx.arc(cx, cy + 35 * scale, 45 * scale, 0.25 * Math.PI, 0.75 * Math.PI);
          break;
        case 'cute':
          this.ctx.arc(cx, cy + 30 * scale, 35 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
          break;
        default:
          this.ctx.arc(cx, cy + 35 * scale, 50 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
      }
      
      this.ctx.stroke();
    }
  }

  drawAccessories(cx, cy, scale, avatar) {
    // Eyebrows
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 5 * scale;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 70 * scale, cy - 55 * scale);
    this.ctx.lineTo(cx - 25 * scale, cy - 55 * scale);
    this.ctx.moveTo(cx + 25 * scale, cy - 55 * scale);
    this.ctx.lineTo(cx + 70 * scale, cy - 55 * scale);
    this.ctx.stroke();
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

// Export for use
window.AvatarLibrary = AvatarLibrary;
window.AvatarRenderer = AvatarRenderer;