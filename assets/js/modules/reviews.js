
/* ════════════════════════════════════════
   REVIEWS MODULE
   file: assets/js/modules/reviews.js
════════════════════════════════════════ */
import { showToast } from './ui.js';

export async function submitReview(db) {
  const name   = document.getElementById('r-name').value.trim();
  const rating = document.querySelector('input[name="rating"]:checked');
  const best   = document.getElementById('r-best').value;
  const review = document.getElementById('r-review').value.trim();

  if (!name || !rating || !best || !review) {
    alert('Please fill all fields and select a star rating!');
    return;
  }

  const btn = document.getElementById('review-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    await db.collection('reviews').add({
      name,
      rating: parseInt(rating.value),
      best,
      review,
      date: new Date().toLocaleDateString('en-IN'),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    /* Reset */
    document.getElementById('r-name').value = '';
    document.getElementById('r-best').value = '';
    document.getElementById('r-review').value = '';
    document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);

    showToast('🌟 Thank you for your review! It\'s now live.');
    loadLiveReviews(db); // Reload

  } catch(err) {
    console.error(err);
    alert('Could not submit review. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = '⭐ Submit Review';
  }
}

export function loadLiveReviews(db) {
  const list = document.getElementById('live-review-list');
  if (!list) return;

  db.collection('reviews')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = '<div class="review-empty">No reviews yet. Be the first to review!</div>';
        return;
      }
      list.innerHTML = snapshot.docs.map(doc => {
        const r = doc.data();
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        return `
          <div class="live-review-item">
            <div class="live-review-stars">${stars}</div>
            <div class="live-review-text">"${r.review}"</div>
            <div style="font-size:0.75rem;color:var(--orange);margin-bottom:0.5rem;">🏆 Best part: ${r.best}</div>
            <div class="live-review-meta">
              <span class="live-review-name">— ${r.name}</span>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="live-review-badge">Verified</span>
                <span class="live-review-date">${r.date || ''}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }, err => {
      console.error(err);
      list.innerHTML = '<div class="review-empty">Could not load reviews.</div>';
    });
}
