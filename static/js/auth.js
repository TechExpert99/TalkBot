// static/js/auth.js - Modern Firebase Modular SDK (v12.6.0)
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiQdb5cdqst5yjMBa4VhXC-07e7kYa2As",
  authDomain: "talkbot-47081.firebaseapp.com",
  projectId: "talkbot-47081",
  storageBucket: "talkbot-47081.firebasestorage.app",
  messagingSenderId: "509241350052",
  appId: "1:509241350052:web:000444fda90f15ebca9331",
  measurementId: "G-GZ0HXNFVYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Global state
let currentUser = null;
let isSignUpMode = false;

console.log('✅ Firebase initialized with modular SDK v12.6.0');

// ========================================
// AUTHENTICATION STATE LISTENER
// ========================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    updateUIForLoggedInUser(user);
    console.log('✅ User signed in:', user.email);
    
    // Store user data
    storeUserData(user);
  } else {
    currentUser = null;
    updateUIForLoggedOutUser();
    console.log('User signed out');
  }
});

// ========================================
// MODAL FUNCTIONS
// ========================================
function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const submitBtnText = document.getElementById('submitBtnText');
  const toggleText = document.getElementById('toggleText');
  
  if (isSignUpMode) {
    if (modalTitle) modalTitle.textContent = 'Create Account';
    if (modalSubtitle) modalSubtitle.textContent = 'Sign up to get started with TalkBot';
    if (submitBtnText) submitBtnText.textContent = 'Sign Up';
    if (toggleText) toggleText.textContent = 'Already have an account?';
  } else {
    if (modalTitle) modalTitle.textContent = 'Welcome Back';
    if (modalSubtitle) modalSubtitle.textContent = 'Sign in to continue to TalkBot';
    if (submitBtnText) submitBtnText.textContent = 'Sign In';
    if (toggleText) toggleText.textContent = "Don't have an account?";
  }
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================
async function signInWithGoogle() {
  const btn = document.getElementById('googleSignInBtn');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span><span>Signing in...</span>';
    btn.disabled = true;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Log analytics event
      logEvent(analytics, 'login', { method: 'Google' });
      
      closeAuthModal();
      showNotification(`Welcome ${user.displayName || user.email}!`, 'success');
      
      return { success: true, user };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showNotification(getErrorMessage(error), 'error');
      return { success: false, error: error.message };
    } finally {
      if (btn) {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    }
  }
}

async function signInWithMicrosoft() {
  const btn = document.getElementById('microsoftSignInBtn');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span><span>Signing in...</span>';
    btn.disabled = true;

    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      
      // Log analytics event
      logEvent(analytics, 'login', { method: 'Microsoft' });
      
      closeAuthModal();
      showNotification(`Welcome ${user.displayName || user.email}!`, 'success');
      
      return { success: true, user };
    } catch (error) {
      console.error('Microsoft Sign-In Error:', error);
      showNotification(getErrorMessage(error), 'error');
      return { success: false, error: error.message };
    } finally {
      if (btn) {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    }
  }
}

async function handleEmailAuth() {
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }

  const btn = document.getElementById('emailAuthBtn');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;

    try {
      let result;
      if (isSignUpMode) {
        // Sign Up
        result = await createUserWithEmailAndPassword(auth, email, password);
        logEvent(analytics, 'sign_up', { method: 'Email' });
        showNotification('Account created successfully!', 'success');
      } else {
        // Sign In
        result = await signInWithEmailAndPassword(auth, email, password);
        logEvent(analytics, 'login', { method: 'Email' });
        showNotification('Signed in successfully!', 'success');
      }

      // Clear form
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      closeAuthModal();
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Email Auth Error:', error);
      showNotification(getErrorMessage(error), 'error');
      return { success: false, error: error.message };
    } finally {
      if (btn) {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    }
  }
}

async function signOut() {
  try {
    await firebaseSignOut(auth);
    
    // Log analytics event
    logEvent(analytics, 'logout');
    
    showNotification('Signed out successfully!', 'success');
    
    // Redirect to home if on protected page
    if (window.location.pathname.includes('/chat') || window.location.pathname.includes('/camera')) {
      window.location.href = '/';
    }
    
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    showNotification(`Error: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function getCurrentUser() {
  return currentUser;
}

async function getUserToken() {
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
}

function requireAuth() {
  if (!currentUser) {
    showNotification('Please sign in to access this feature', 'error');
    openAuthModal();
    return false;
  }
  return true;
}

function storeUserData(user) {
  // Store basic user info in sessionStorage for quick access
  sessionStorage.setItem('talkbot_user', JSON.stringify({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  }));
}

function getErrorMessage(error) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email. Try signing up instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password.'
  };
  
  return errorMessages[error.code] || error.message;
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================
function updateUIForLoggedInUser(user) {
  const authBtn = document.getElementById('authButton');
  if (authBtn) {
    const displayName = user.displayName || user.email.split('@')[0];
    const shortName = displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName;
    
    authBtn.innerHTML = `
      <span>👤</span>
      <span>${shortName}</span>
    `;
    authBtn.classList.add('signed-in');
    authBtn.onclick = signOut;
    authBtn.title = 'Click to sign out';
  }
  
  // Update any user-specific UI elements
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(el => {
    el.textContent = user.displayName || user.email;
  });
}

function updateUIForLoggedOutUser() {
  const authBtn = document.getElementById('authButton');
  if (authBtn) {
    authBtn.innerHTML = `
      <span>👤</span>
      <span>Sign In</span>
    `;
    authBtn.classList.remove('signed-in');
    authBtn.onclick = openAuthModal;
    authBtn.title = 'Click to sign in';
  }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#667eea'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Auth button
  const authBtn = document.getElementById('authButton');
  if (authBtn) {
    authBtn.addEventListener('click', function() {
      if (currentUser) {
        signOut();
      } else {
        openAuthModal();
      }
    });
  }

  // Google sign in
  const googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', signInWithGoogle);
  }

  // Microsoft sign in
  const microsoftBtn = document.getElementById('microsoftSignInBtn');
  if (microsoftBtn) {
    microsoftBtn.addEventListener('click', signInWithMicrosoft);
  }

  // Email auth
  const emailAuthBtn = document.getElementById('emailAuthBtn');
  if (emailAuthBtn) {
    emailAuthBtn.addEventListener('click', handleEmailAuth);
  }

  // Close modal on overlay click
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeAuthModal();
      }
    });
  }

  // Enter key handlers
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (emailInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && passwordInput) {
        passwordInput.focus();
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleEmailAuth();
      }
    });
  }

  // Close modal on Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeAuthModal();
    }
  });

  console.log('✅ TalkBot Auth initialized (Modular SDK)');
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Export functions globally for use in other scripts
window.TalkBotAuth = {
  getCurrentUser,
  getUserToken,
  requireAuth,
  signInWithGoogle,
  signInWithMicrosoft,
  handleEmailAuth,
  signOut,
  openAuthModal,
  closeAuthModal,
  showNotification,
  toggleAuthMode
};