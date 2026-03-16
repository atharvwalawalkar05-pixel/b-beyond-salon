
/* ════════════════════════════════════════
   MAIN ORCHESTRATOR
   file: assets/js/main.js
════════════════════════════════════════ */
import { firebaseConfig, EMAILJS_PUBLIC_KEY } from './modules/config.js';
import { initUI } from './modules/ui.js';
import { submitBooking } from './modules/booking.js';
import { submitReview, loadLiveReviews } from './modules/reviews.js';
import { initAdmin } from './modules/admin.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Initialize UI Interactions
initUI();

// Initialize Admin Logic
initAdmin(auth, db);

// Global access for HTML event handlers
window.submitBooking = () => submitBooking(db);
window.submitReview = () => submitReview(db);

// Page Load Initializations
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('f-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }
  loadLiveReviews(db);
});
