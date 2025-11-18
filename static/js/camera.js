// ==================== REALISTIC HUMAN AVATAR LIBRARY ====================

const HumanAvatars = {
  avatars: {
    male_professional: {
      name: "Professional Male",
      gender: "male",
      icon: "👨‍💼",
      skinTone: "#f4c2a0",
      hairColor: "#2c1810",
      hairStyle: "short",
      eyeColor: "#4a3428",
      features: {
        faceShape: "square",
        jawline: "strong",
        nose: "medium",
        lips: "thin"
      },
      accessories: {
        glasses: false,
        beard: "stubble",
        mustache: false
      }
    },

    female_friendly: {
      name: "Friendly Female",
      gender: "female",
      icon: "👩",
      skinTone: "#f9d4b3",
      hairColor: "#8b5a2b",
      hairStyle: "long",
      eyeColor: "#6b8e23",
      features: {
        faceShape: "oval",
        jawline: "soft",
        nose: "small",
        lips: "full"
      },
      accessories: {
        glasses: false,
        earrings: true,
        makeup: "natural"
      }
    },

    male_casual: {
      name: "Casual Guy",
      gender: "male",
      icon: "👦",
      skinTone: "#e8b89a",
      hairColor: "#3d2314",
      hairStyle: "messy",
      eyeColor: "#4682b4",
      features: {
        faceShape: "round",
        jawline: "soft",
        nose: "small",
        lips: "medium"
      },
      accessories: {
        glasses: true,
        beard: false,
        mustache: false
      }
    },

    female_professional: {
      name: "Professional Woman",
      gender: "female",
      icon: "👩‍💼",
      skinTone: "#c68642",
      hairColor: "#1a1a1a",
      hairStyle: "bob",
      eyeColor: "#2f4f4f",
      features: {
        faceShape: "heart",
        jawline: "defined",
        nose: "medium",
        lips: "full"
      },
      accessories: {
        glasses: true,
        earrings: true,
        makeup: "professional"
      }
    },

    male_elder: {
      name: "Wise Elder",
      gender: "male",
      icon: "👴",
      skinTone: "#d4a88c",
      hairColor: "#c0c0c0",
      hairStyle: "receding",
      eyeColor: "#556b2f",
      features: {
        faceShape: "square",
        jawline: "strong",
        nose: "large",
        lips: "thin"
      },
      accessories: {
        glasses: true,
        beard: "full",
        mustache: true,
        wrinkles: true
      }
    },

    female_young: {
      name: "Young Woman",
      gender: "female",
      icon: "👧",
      skinTone: "#ffdbac",
      hairColor: "#ffd700",
      hairStyle: "ponytail",
      eyeColor: "#87ceeb",
      features: {
        faceShape: "oval",
        jawline: "soft",
        nose: "small",
        lips: "full"
      },
      accessories: {
        glasses: false,
        earrings: false,
        makeup: "light"
      }
    },

    male_athlete: {
      name: "Athletic Male",
      gender: "male",
      icon: "🏃‍♂️",
      skinTone: "#c4997e",
      hairColor: "#000000",
      hairStyle: "buzz",
      eyeColor: "#8b4513",
      features: {
        faceShape: "square",
        jawline: "strong",
        nose: "large",
        lips: "medium"
      },
      accessories: {
        glasses: false,
        beard: false,
        mustache: false,
        athletic: true
      }
    },

    female_creative: {
      name: "Creative Artist",
      gender: "female",
      icon: "👩‍🎨",
      skinTone: "#f5d7c3",
      hairColor: "#ff1493",
      hairStyle: "curly",
      eyeColor: "#9370db",
      features: {
        faceShape: "round",
        jawline: "soft",
        nose: "button",
        lips: "full"
      },
      accessories: {
        glasses: true,
        earrings: true,
        makeup: "colorful",
        piercings: true
      }
    }
  },

  current: "male_professional",

  getCurrentAvatar() {
    return this.avatars[this.current];
  },

  setAvatar(avatarId) {
    if (this.avatars[avatarId]) {
      this.current = avatarId;
      return true;
    }
    return false;
  },

  getAllAvatars() {
    return Object.keys(this.avatars).map(id => ({
      id: id,
      ...this.avatars[id]
    }));
  }
};

// ==================== REALISTIC HUMAN AVATAR RENDERER ====================
class HumanAvatarRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.blinkTimer = 0;
    this.blinking = false;
  }

  draw(speaking = false, emotion = 'neutral') {
    const avatar = HumanAvatars.getCurrentAvatar();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const scale = Math.min(this.canvas.width, this.canvas.height) / 600;

    // Draw avatar layers
    this.drawNeck(cx, cy, scale, avatar);
    this.drawHead(cx, cy, scale, avatar);
    this.drawHair(cx, cy, scale, avatar);
    this.drawEars(cx, cy, scale, avatar);
    this.drawEyes(cx, cy, scale, avatar, speaking, emotion);
    this.drawNose(cx, cy, scale, avatar);
    this.drawMouth(cx, cy, scale, avatar, speaking, emotion);
    this.drawEyebrows(cx, cy, scale, avatar, emotion);
    
    // Accessories
    if (avatar.accessories.glasses) {
      this.drawGlasses(cx, cy, scale);
    }
    if (avatar.accessories.beard) {
      this.drawBeard(cx, cy, scale, avatar);
    }
    if (avatar.accessories.earrings && avatar.gender === 'female') {
      this.drawEarrings(cx, cy, scale);
    }
    
    // Blinking animation
    this.handleBlinking();
  }

  drawBackground() {
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
    );
    gradient.addColorStop(0, '#2d3748');
    gradient.addColorStop(1, '#1a202c');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawNeck(cx, cy, scale, avatar) {
    this.ctx.fillStyle = this.darkenColor(avatar.skinTone, 0.9);
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 60 * scale, cy + 130 * scale);
    this.ctx.lineTo(cx - 40 * scale, cy + 180 * scale);
    this.ctx.lineTo(cx + 40 * scale, cy + 180 * scale);
    this.ctx.lineTo(cx + 60 * scale, cy + 130 * scale);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawHead(cx, cy, scale, avatar) {
    this.ctx.fillStyle = avatar.skinTone;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 20 * scale;
    this.ctx.shadowOffsetX = 5 * scale;
    this.ctx.shadowOffsetY = 5 * scale;

    this.ctx.beginPath();
    
    switch(avatar.features.faceShape) {
      case 'oval':
        this.ctx.ellipse(cx, cy, 100 * scale, 130 * scale, 0, 0, Math.PI * 2);
        break;
      case 'round':
        this.ctx.arc(cx, cy, 110 * scale, 0, Math.PI * 2);
        break;
      case 'square':
        this.ctx.roundRect(cx - 100 * scale, cy - 120 * scale, 200 * scale, 240 * scale, 30 * scale);
        break;
      case 'heart':
        this.drawHeartFace(cx, cy, scale);
        break;
      default:
        this.ctx.ellipse(cx, cy, 100 * scale, 130 * scale, 0, 0, Math.PI * 2);
    }
    
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Face contours (shading)
    this.ctx.fillStyle = this.darkenColor(avatar.skinTone, 0.95);
    this.ctx.globalAlpha = 0.3;
    
    // Left cheek shading
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 70 * scale, cy + 20 * scale, 30 * scale, 40 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Right cheek shading
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 70 * scale, cy + 20 * scale, 30 * scale, 40 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.globalAlpha = 1;
  }

  drawHeartFace(cx, cy, scale) {
    this.ctx.moveTo(cx, cy + 100 * scale);
    this.ctx.bezierCurveTo(
      cx - 100 * scale, cy + 80 * scale,
      cx - 100 * scale, cy - 40 * scale,
      cx, cy - 120 * scale
    );
    this.ctx.bezierCurveTo(
      cx + 100 * scale, cy - 40 * scale,
      cx + 100 * scale, cy + 80 * scale,
      cx, cy + 100 * scale
    );
  }

  drawHair(cx, cy, scale, avatar) {
    this.ctx.fillStyle = avatar.hairColor;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    this.ctx.shadowBlur = 10 * scale;

    switch(avatar.hairStyle) {
      case 'short':
        this.drawShortHair(cx, cy, scale);
        break;
      case 'long':
        this.drawLongHair(cx, cy, scale);
        break;
      case 'bob':
        this.drawBobHair(cx, cy, scale);
        break;
      case 'ponytail':
        this.drawPonytail(cx, cy, scale);
        break;
      case 'curly':
        this.drawCurlyHair(cx, cy, scale);
        break;
      case 'buzz':
        this.drawBuzzCut(cx, cy, scale);
        break;
      case 'messy':
        this.drawMessyHair(cx, cy, scale);
        break;
      case 'receding':
        this.drawRecedingHair(cx, cy, scale);
        break;
    }
    
    this.ctx.shadowBlur = 0;
  }

  drawShortHair(cx, cy, scale) {
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 110 * scale, 60 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
  }

  drawLongHair(cx, cy, scale) {
    // Top
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 110 * scale, 60 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
    
    // Sides
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 95 * scale, cy, 30 * scale, 120 * scale, -0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 95 * scale, cy, 30 * scale, 120 * scale, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBobHair(cx, cy, scale) {
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 110 * scale, 60 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 90 * scale, cy + 30 * scale, 25 * scale, 80 * scale, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 90 * scale, cy + 30 * scale, 25 * scale, 80 * scale, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPonytail(cx, cy, scale) {
    // Front hair
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 110 * scale, 60 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
    
    // Ponytail
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 60 * scale, 40 * scale, 25 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 5 * scale, cy + 20 * scale, 25 * scale, 100 * scale, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawCurlyHair(cx, cy, scale) {
    // Main volume
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 60 * scale, 130 * scale, 80 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Curls
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 120 * scale;
      const x = cx + Math.cos(angle) * radius;
      const y = cy - 60 * scale + Math.sin(angle) * radius * 0.6;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawBuzzCut(cx, cy, scale) {
    this.ctx.globalAlpha = 0.8;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 105 * scale, 50 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  drawMessyHair(cx, cy, scale) {
    // Base
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy - 80 * scale, 115 * scale, 65 * scale, 0, Math.PI, 2 * Math.PI);
    this.ctx.fill();
    
    // Messy spikes
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI + (i / 8) * Math.PI;
      const x = cx + Math.cos(angle) * 100 * scale;
      const y = cy - 80 * scale + Math.sin(angle) * 60 * scale;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + Math.random() * 20 * scale - 10 * scale, y - 30 * scale);
      this.ctx.lineTo(x + 15 * scale, y);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  drawRecedingHair(cx, cy, scale) {
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 60 * scale, cy - 100 * scale);
    this.ctx.quadraticCurveTo(cx - 40 * scale, cy - 120 * scale, cx, cy - 130 * scale);
    this.ctx.quadraticCurveTo(cx + 40 * scale, cy - 120 * scale, cx + 60 * scale, cy - 100 * scale);
    this.ctx.lineTo(cx + 100 * scale, cy - 80 * scale);
    this.ctx.quadraticCurveTo(cx + 80 * scale, cy - 60 * scale, cx + 60 * scale, cy - 50 * scale);
    this.ctx.lineTo(cx - 60 * scale, cy - 50 * scale);
    this.ctx.quadraticCurveTo(cx - 80 * scale, cy - 60 * scale, cx - 100 * scale, cy - 80 * scale);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawEars(cx, cy, scale, avatar) {
    const earColor = this.darkenColor(avatar.skinTone, 0.95);
    
    // Left ear
    this.ctx.fillStyle = earColor;
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 100 * scale, cy, 15 * scale, 30 * scale, -0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Inner ear
    this.ctx.fillStyle = this.darkenColor(earColor, 0.9);
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 100 * scale, cy, 8 * scale, 15 * scale, -0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Right ear
    this.ctx.fillStyle = earColor;
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 100 * scale, cy, 15 * scale, 30 * scale, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Inner ear
    this.ctx.fillStyle = this.darkenColor(earColor, 0.9);
    this.ctx.beginPath();
    this.ctx.ellipse(cx + 100 * scale, cy, 8 * scale, 15 * scale, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawEyes(cx, cy, scale, avatar, speaking, emotion) {
    const eyeY = cy - 20 * scale;
    const eyeSpacing = 45 * scale;

    // Eye whites
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - eyeSpacing, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + eyeSpacing, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Iris
    this.ctx.fillStyle = avatar.eyeColor;
    const pupilOffset = speaking ? Math.sin(Date.now() / 300) * 2 * scale : 0;
    
    if (!this.blinking) {
      this.ctx.beginPath();
      this.ctx.arc(cx - eyeSpacing + pupilOffset, eyeY, 8 * scale, 0, Math.PI * 2);
      this.ctx.arc(cx + eyeSpacing + pupilOffset, eyeY, 8 * scale, 0, Math.PI * 2);
      this.ctx.fill();

      // Pupils
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(cx - eyeSpacing + pupilOffset, eyeY, 5 * scale, 0, Math.PI * 2);
      this.ctx.arc(cx + eyeSpacing + pupilOffset, eyeY, 5 * scale, 0, Math.PI * 2);
      this.ctx.fill();

      // Eye shine
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(cx - eyeSpacing + 3 * scale, eyeY - 2 * scale, 2 * scale, 0, Math.PI * 2);
      this.ctx.arc(cx + eyeSpacing + 3 * scale, eyeY - 2 * scale, 2 * scale, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Eyelids (for blinking)
    if (this.blinking) {
      this.ctx.fillStyle = avatar.skinTone;
      this.ctx.beginPath();
      this.ctx.ellipse(cx - eyeSpacing, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
      this.ctx.ellipse(cx + eyeSpacing, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Upper eyelid line
    this.ctx.strokeStyle = this.darkenColor(avatar.skinTone, 0.7);
    this.ctx.lineWidth = 2 * scale;
    this.ctx.beginPath();
    this.ctx.arc(cx - eyeSpacing, eyeY, 18 * scale, Math.PI, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(cx + eyeSpacing, eyeY, 18 * scale, Math.PI, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawEyebrows(cx, cy, scale, avatar, emotion) {
    this.ctx.strokeStyle = this.darkenColor(avatar.hairColor, 0.8);
    this.ctx.lineWidth = 4 * scale;
    this.ctx.lineCap = 'round';

    const browY = cy - 45 * scale;
    const browSpacing = 45 * scale;

    this.ctx.beginPath();
    
    switch(emotion) {
      case 'happy':
        this.ctx.arc(cx - browSpacing, browY, 25 * scale, 1.2 * Math.PI, 1.8 * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(cx + browSpacing, browY, 25 * scale, 1.2 * Math.PI, 1.8 * Math.PI);
        break;
      case 'sad':
        this.ctx.arc(cx - browSpacing, browY - 5 * scale, 25 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(cx + browSpacing, browY - 5 * scale, 25 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
        break;
      case 'angry':
        this.ctx.moveTo(cx - browSpacing - 20 * scale, browY);
        this.ctx.lineTo(cx - browSpacing + 20 * scale, browY - 10 * scale);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(cx + browSpacing + 20 * scale, browY);
        this.ctx.lineTo(cx + browSpacing - 20 * scale, browY - 10 * scale);
        break;
      default:
        this.ctx.moveTo(cx - browSpacing - 20 * scale, browY);
        this.ctx.lineTo(cx - browSpacing + 20 * scale, browY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(cx + browSpacing - 20 * scale, browY);
        this.ctx.lineTo(cx + browSpacing + 20 * scale, browY);
    }
    
    this.ctx.stroke();
  }

  drawNose(cx, cy, scale, avatar) {
    const noseColor = this.darkenColor(avatar.skinTone, 0.9);
    
    this.ctx.fillStyle = noseColor;
    this.ctx.strokeStyle = this.darkenColor(avatar.skinTone, 0.85);
    this.ctx.lineWidth = 2 * scale;
    
    switch(avatar.features.nose) {
      case 'small':
        // Button nose
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx - 8 * scale, cy + 20 * scale);
        this.ctx.lineTo(cx + 8 * scale, cy + 20 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        break;
      case 'medium':
        // Average nose
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 10 * scale);
        this.ctx.lineTo(cx - 10 * scale, cy + 25 * scale);
        this.ctx.lineTo(cx + 10 * scale, cy + 25 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        break;
      case 'large':
        // Prominent nose
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 15 * scale);
        this.ctx.lineTo(cx - 12 * scale, cy + 30 * scale);
        this.ctx.lineTo(cx + 12 * scale, cy + 30 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        break;
      case 'button':
        // Round button nose
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + 15 * scale, 10 * scale, 8 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        break;
    }

    // Nostrils
    this.ctx.fillStyle = this.darkenColor(avatar.skinTone, 0.7);
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 8 * scale, cy + 22 * scale, 3 * scale, 4 * scale, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 8 * scale, cy + 22 * scale, 3 * scale, 4 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawMouth(cx, cy, scale, avatar, speaking, emotion) {
    const mouthY = cy + 60 * scale;
    
    this.ctx.strokeStyle = this.darkenColor(avatar.skinTone, 0.7);
    this.ctx.lineWidth = 3 * scale;
    this.ctx.lineCap = 'round';

    if (speaking) {
      // Animated speaking mouth
      const openAmount = Math.abs(Math.sin(Date.now() / 120)) * 20 * scale;
      
      // Lips
      this.ctx.fillStyle = '#d1868b';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, mouthY, 35 * scale, 15 * scale + openAmount, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Teeth
      if (openAmount > 10 * scale) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.rect(cx - 25 * scale, mouthY - 5 * scale, 50 * scale, 8 * scale);
        this.ctx.fill();
      }
      
      // Tongue
      this.ctx.fillStyle = '#ff6b9d';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, mouthY + 8 * scale, 20 * scale, 10 * scale, 0, 0, Math.PI);
      this.ctx.fill();
    } else {
      // Static mouth based on emotion
      switch(emotion) {
        case 'happy':
          // Big smile
          this.ctx.fillStyle = '#d1868b';
          this.ctx.beginPath();
          this.ctx.arc(cx, mouthY - 10 * scale, 40 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
          this.ctx.lineTo(cx + 30 * scale, mouthY + 5 * scale);
          this.ctx.arc(cx, mouthY + 10 * scale, 30 * scale, 0.8 * Math.PI, 0.2 * Math.PI, true);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        case 'sad':
          // Frown
          this.ctx.beginPath();
          this.ctx.arc(cx, mouthY + 30 * scale, 30 * scale, 1.2 * Math.PI, 1.8 * Math.PI);
          this.ctx.stroke();
          break;
        case 'surprised':
          // Open mouth
          this.ctx.fillStyle = '#8b4545';
          this.ctx.beginPath();
          this.ctx.ellipse(cx, mouthY, 20 * scale, 25 * scale, 0, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Teeth
          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.rect(cx - 15 * scale, mouthY - 10 * scale, 30 * scale, 8 * scale);
          this.ctx.fill();
          break;
        case 'angry':
          // Straight line
          this.ctx.beginPath();
          this.ctx.moveTo(cx - 30 * scale, mouthY);
          this.ctx.lineTo(cx + 30 * scale, mouthY);
          this.ctx.stroke();
          break;
        default:
          // Neutral smile
          this.ctx.fillStyle = '#d1868b';
          this.ctx.beginPath();
          this.ctx.arc(cx, mouthY - 5 * scale, 35 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
          this.ctx.lineTo(cx + 25 * scale, mouthY + 2 * scale);
          this.ctx.arc(cx, mouthY + 5 * scale, 25 * scale, 0.8 * Math.PI, 0.2 * Math.PI, true);
          this.ctx.closePath();
          this.ctx.fill();
      }
      
      // Lip line
      this.ctx.strokeStyle = this.darkenColor('#d1868b', 0.8);
      this.ctx.lineWidth = 2 * scale;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 30 * scale, mouthY);
      this.ctx.quadraticCurveTo(cx, mouthY + 3 * scale, cx + 30 * scale, mouthY);
      this.ctx.stroke();
    }
  }

  drawGlasses(cx, cy, scale) {
    const glassesY = cy - 20 * scale;
    const frameColor = '#2c3e50';
    
    this.ctx.strokeStyle = frameColor;
    this.ctx.lineWidth = 3 * scale;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

    // Left lens
    this.ctx.beginPath();
    this.ctx.arc(cx - 45 * scale, glassesY, 25 * scale, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Right lens
    this.ctx.beginPath();
    this.ctx.arc(cx + 45 * scale, glassesY, 25 * scale, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Bridge
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 20 * scale, glassesY);
    this.ctx.lineTo(cx + 20 * scale, glassesY);
    this.ctx.stroke();

    // Temple arms
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 70 * scale, glassesY);
    this.ctx.lineTo(cx - 100 * scale, glassesY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx + 70 * scale, glassesY);
    this.ctx.lineTo(cx + 100 * scale, glassesY);
    this.ctx.stroke();

    // Lens reflection
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(cx - 50 * scale, glassesY - 10 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.arc(cx + 40 * scale, glassesY - 10 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBeard(cx, cy, scale, avatar) {
    const beardColor = this.darkenColor(avatar.hairColor, 0.9);
    this.ctx.fillStyle = beardColor;

    switch(avatar.accessories.beard) {
      case 'stubble':
        // Light stubble
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + 80 * scale, 80 * scale, 60 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        break;
      
      case 'short':
        // Short beard
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 70 * scale, cy + 30 * scale);
        this.ctx.lineTo(cx - 60 * scale, cy + 100 * scale);
        this.ctx.quadraticCurveTo(cx, cy + 120 * scale, cx + 60 * scale, cy + 100 * scale);
        this.ctx.lineTo(cx + 70 * scale, cy + 30 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        break;
      
      case 'full':
        // Full beard
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 85 * scale, cy);
        this.ctx.lineTo(cx - 75 * scale, cy + 110 * scale);
        this.ctx.quadraticCurveTo(cx, cy + 130 * scale, cx + 75 * scale, cy + 110 * scale);
        this.ctx.lineTo(cx + 85 * scale, cy);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Beard texture
        this.ctx.strokeStyle = this.lightenColor(beardColor, 1.1);
        this.ctx.lineWidth = 2 * scale;
        for (let i = 0; i < 10; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(cx - 60 * scale + i * 12 * scale, cy + 50 * scale);
          this.ctx.lineTo(cx - 55 * scale + i * 12 * scale, cy + 90 * scale + Math.random() * 20 * scale);
          this.ctx.stroke();
        }
        break;
    }

    // Mustache if applicable
    if (avatar.accessories.mustache) {
      this.ctx.fillStyle = beardColor;
      this.ctx.beginPath();
      this.ctx.ellipse(cx - 25 * scale, cy + 50 * scale, 25 * scale, 12 * scale, -0.2, 0, Math.PI * 2);
      this.ctx.ellipse(cx + 25 * scale, cy + 50 * scale, 25 * scale, 12 * scale, 0.2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawEarrings(cx, cy, scale) {
    const earringColor = '#ffd700';
    
    // Left earring
    this.ctx.fillStyle = earringColor;
    this.ctx.beginPath();
    this.ctx.arc(cx - 100 * scale, cy + 15 * scale, 5 * scale, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = earringColor;
    this.ctx.lineWidth = 2 * scale;
    this.ctx.beginPath();
    this.ctx.arc(cx - 100 * scale, cy + 25 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.stroke();

    // Right earring
    this.ctx.fillStyle = earringColor;
    this.ctx.beginPath();
    this.ctx.arc(cx + 100 * scale, cy + 15 * scale, 5 * scale, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = earringColor;
    this.ctx.beginPath();
    this.ctx.arc(cx + 100 * scale, cy + 25 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  handleBlinking() {
    this.blinkTimer++;
    
    if (this.blinkTimer > 180) { // Blink every 3 seconds
      this.blinking = true;
      if (this.blinkTimer > 185) { // Blink duration
        this.blinking = false;
        this.blinkTimer = 0;
      }
    }
  }

  darkenColor(color, factor) {
    const rgb = this.hexToRgb(color);
    return `rgb(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)})`;
  }

  lightenColor(color, factor) {
    const rgb = this.hexToRgb(color);
    return `rgb(${Math.min(255, Math.floor(rgb.r * factor))}, ${Math.min(255, Math.floor(rgb.g * factor))}, ${Math.min(255, Math.floor(rgb.b * factor))})`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 100, g: 100, b: 100 };
  }
}

// ==================== ADD CUSTOM HUMAN AVATAR ====================
HumanAvatars.addCustomAvatar = function(id, config) {
  this.avatars[id] = {
    name: config.name || "Custom Avatar",
    gender: config.gender || "male",
    icon: config.icon || "👤",
    skinTone: config.skinTone || "#f4c2a0",
    hairColor: config.hairColor || "#2c1810",
    hairStyle: config.hairStyle || "short",
    eyeColor: config.eyeColor || "#4a3428",
    features: {
      faceShape: config.faceShape || "oval",
      jawline: config.jawline || "soft",
      nose: config.nose || "medium",
      lips: config.lips || "medium"
    },
    accessories: config.accessories || {
      glasses: false,
      beard: false,
      mustache: false
    }
  };
  return true;
};

// Export
window.HumanAvatars = HumanAvatars;
window.HumanAvatarRenderer = HumanAvatarRenderer;

console.log('✅ Human Avatar Library Loaded');