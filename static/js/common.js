// Common Utilities for TalkBot

// API Helper Functions
const API = {
    // Base URL (can be configured)
    baseURL: window.location.origin,
    
    // Make API call
    async call(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Chat endpoint
    chat(message, sessionId = 'default') {
        return this.call('/chat', 'POST', { message, session_id: sessionId });
    },
    
    // Camera endpoint
    camera(frameData, emotion, message) {
        return this.call('/camera', 'POST', {
            frame: frameData,
            emotion: emotion,
            message: message
        });
    },
    
    // Health check
    health() {
        return this.call('/health', 'GET');
    }
};

// Storage Helper (using localStorage)
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// UI Helper Functions
const UI = {
    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    // Format timestamp
    formatTime(date = new Date()) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },
    
    // Format date
    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    },
    
    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!', 'success', 2000);
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy', 'error', 2000);
            return false;
        }
    }
};

// Voice Helper Functions
const Voice = {
    // Check if speech synthesis is supported
    isSupported() {
        return 'speechSynthesis' in window;
    },
    
    // Speak text
    speak(text, options = {}) {
        if (!this.isSupported()) {
            console.error('Speech synthesis not supported');
            return false;
        }
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        utterance.lang = options.lang || 'en-US';
        
        if (options.onStart) utterance.onstart = options.onStart;
        if (options.onEnd) utterance.onend = options.onEnd;
        if (options.onError) utterance.onerror = options.onError;
        
        window.speechSynthesis.speak(utterance);
        return true;
    },
    
    // Stop speaking
    stop() {
        if (this.isSupported()) {
            window.speechSynthesis.cancel();
        }
    },
    
    // Check if speech recognition is supported
    isRecognitionSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },
    
    // Create speech recognition instance
    createRecognition(options = {}) {
        if (!this.isRecognitionSupported()) {
            console.error('Speech recognition not supported');
            return null;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = options.lang || 'en-US';
        recognition.continuous = options.continuous || false;
        recognition.interimResults = options.interimResults || false;
        
        return recognition;
    }
};

// Camera Helper Functions
const Camera = {
    // Check if getUserMedia is supported
    isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },
    
    // Get camera stream
    async getStream(constraints = { video: true, audio: false }) {
        if (!this.isSupported()) {
            throw new Error('Camera not supported');
        }
        
        try {
            return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
            console.error('Camera access error:', error);
            throw error;
        }
    },
    
    // Stop stream
    stopStream(stream) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    },
    
    // Capture frame from video
    captureFrame(videoElement, quality = 0.8) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0);
        
        return canvas.toDataURL('image/jpeg', quality);
    },
    
    // Get available devices
    async getDevices() {
        if (!this.isSupported()) {
            return [];
        }
        
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === 'videoinput');
        } catch (error) {
            console.error('Error getting devices:', error);
            return [];
        }
    }
};

// Utility Functions
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Generate unique ID
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Check if mobile device
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Animation Helper
const Animate = {
    // Fade in element
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    // Fade out element
    fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = 1 - Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        requestAnimationFrame(animate);
    },
    
    // Slide in element
    slideIn(element, direction = 'right', duration = 300) {
        const keyframes = direction === 'right' 
            ? [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }]
            : [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }];
        
        element.animate(keyframes, {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export to global scope
window.TalkBot = {
    API,
    Storage,
    UI,
    Voice,
    Camera,
    Utils,
    Animate
};

console.log('✅ TalkBot Common Utilities Loaded');