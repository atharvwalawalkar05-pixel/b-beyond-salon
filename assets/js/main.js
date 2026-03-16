/* ════════════════════════════════════════
   FIREBASE INIT
════════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY", // Note: This should ideally be fetched from a secure backend or injected during a build process, it's not directly accessible from a .env file in static HTML.
  authDomain: "b-beyond-salon.firebaseapp.com",
  projectId: "b-beyond-salon",
  storageBucket: "b-beyond-salon.firebasestorage.app",
  messagingSenderId: "592128739896",
  appId: "1:592128739896:web:f8b68bbb6444b3934174cd",
  measurementId: "G-CCS71DXQRX"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ════════════════════════════════════════
   EMAILJS INIT
   NOTE: Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
   after setting up EmailJS at emailjs.com
════════════════════════════════════════ */
emailjs.init("QahuE0ycftrmfWAk1");
const EMAILJS_SERVICE  = "service_wm1yuhz";
const EMAILJS_TEMPLATE = "template_4iywb0k";

/* ════════════════════════════════════════
   NAV & MENU
════════════════════════════════════════ */
const ham = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMenu() {
  ham.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').style.boxShadow = window.scrollY > 30 ? '0 4px 28px rgba(0,0,0,0.5)' : 'none';
});

/* ── ACTIVE MOBILE BOTTOM NAV ── */
const sections = document.querySelectorAll('section[id]');
const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  mobileNavLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

/* ════════════════════════════════════════
   SCROLL ANIMATIONS
════════════════════════════════════════ */
const fadeEls = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 100); obs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
fadeEls.forEach(el => obs.observe(el));

/* ════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ════════════════════════════════════════
   BOOK SERVICE — PRE-FILL FORM
════════════════════════════════════════ */
function bookService(service) {
  document.getElementById('f-service').value = service;
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

/* ════════════════════════════════════════
   BOOKING → FIREBASE + WHATSAPP + EMAIL
════════════════════════════════════════ */
async function submitBooking() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const service = document.getElementById('f-service').value;
  const date    = document.getElementById('f-date').value;
  const time    = document.getElementById('f-time').value;
  const note    = document.getElementById('f-note').value.trim();

  if (!name || !phone || !service || !date || !time) {
    alert('Please fill all required fields (Name, Phone, Service, Date, Time).');
    return;
  }

  const booking = {
    name, phone, service, date, time,
    note: note || 'None',
    bookedAt: new Date().toLocaleString('en-IN'),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    /* 1. Save to Firebase */
    await db.collection('bookings').add(booking);

    /* 2. Send Email via EmailJS */
    if (EMAILJS_SERVICE !== 'YOUR_SERVICE_ID') {
      emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        to_email:   'docsend06@gmail.com',
        from_name:  name,
        phone:      phone,
        service:    service,
        date:       date,
        time:       time,
        note:       note || 'None',
        reply_to:   'noreply@bbeyond.com'
      });
    }

    /* 3. Send to WhatsApp */
    const msg = `🌟 *New Appointment Request*\n\n` +
      `👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n💇 *Service:* ${service}\n` +
      `📅 *Date:* ${date}\n🕐 *Time:* ${time}\n📝 *Note:* ${note || 'None'}\n\n` +
      `_Sent via B Beyond Salon Website_`;
    window.open(`https://wa.me/919404274246?text=${encodeURIComponent(msg)}`, '_blank');

    /* 4. Reset form */
    ['f-name','f-phone','f-note'].forEach(id => document.getElementById(id).value = '');
    ['f-service','f-time'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-date').value = '';

    showToast('✅ Booking sent! Check WhatsApp for confirmation.');

  } catch(err) {
    console.error(err);
    alert('Something went wrong. Please try again or call us directly.');
  }
}

/* ════════════════════════════════════════
   REVIEW SUBMISSION → FIREBASE
════════════════════════════════════════ */
async function submitReview() {
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
    loadLiveReviews();

  } catch(err) {
    console.error(err);
    alert('Could not submit review. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = '⭐ Submit Review';
  }
}

/* ════════════════════════════════════════
   LOAD LIVE REVIEWS FROM FIREBASE
════════════════════════════════════════ */
function loadLiveReviews() {
  const list = document.getElementById('live-review-list');
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

/* ════════════════════════════════════════
   FIREBASE AUTH — ADMIN LOGIN
════════════════════════════════════════ */
const auth = firebase.auth();

function openAdminLogin() {
  document.getElementById('login-modal').classList.add('active');
  setTimeout(() => document.getElementById('admin-email').focus(), 100);
}

async function adminLogin() {
  const email    = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const btn      = document.getElementById('login-btn');
  const errEl    = document.getElementById('login-error');

  if (!email || !password) {
    errEl.textContent = '❌ Please enter email and password.';
    errEl.style.display = 'block';
    return;
  }

  btn.textContent = 'Logging in...';
  btn.disabled = true;
  errEl.style.display = 'none';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    document.getElementById('login-modal').classList.remove('active');
    document.getElementById('admin-email').value = '';
    document.getElementById('admin-password').value = '';
    openAdmin();
  } catch(err) {
    errEl.textContent = '❌ Wrong email or password. Try again.';
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Login →';
    btn.disabled = false;
  }
}

async function adminLogout() {
  await auth.signOut();
  closeAdmin();
  showToast('👋 Logged out successfully.');
}

function openAdmin() {
  document.getElementById('admin-panel').style.display = 'block';
  document.body.style.overflow = 'hidden';
  loadAdminData();
}

function closeAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
  document.body.style.overflow = '';
}

async function loadAdminData() {
  const tbody = document.getElementById('admin-tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">Loading bookings...</td></tr>';

  try {
    const snap = await db.collection('bookings').orderBy('timestamp','desc').get();
    document.getElementById('stat-total').textContent = snap.size;

    const todayCount = snap.docs.filter(d => d.data().date === new Date().toISOString().slice(0,10)).length;
    document.getElementById('stat-today').textContent = todayCount;

    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">No bookings yet.</td></tr>';
      return;
    }
    tbody.innerHTML = snap.docs.map((doc, i) => {
      const b = doc.data();
      return `<tr>
        <td>${snap.size - i}</td>
        <td style="color:var(--cream);font-weight:400;">${b.name}</td>
        <td><a href="tel:${b.phone}" style="color:var(--orange);text-decoration:none;">${b.phone}</a></td>
        <td><span class="admin-badge">${b.service}</span></td>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.note || '—'}</td>
        <td style="font-size:0.75rem;">${b.bookedAt || '—'}</td>
      </tr>`;
    }).join('');
  } catch(err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">⚠️ Permission denied. Please login again.</td></tr>';
  }
}

async function clearBookings() {
  if (!confirm('Clear ALL bookings from Firebase? This cannot be undone!')) return;
  try {
    const snap = await db.collection('bookings').get();
    const batch = db.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    loadAdminData();
    showToast('🗑️ All bookings cleared.');
  } catch(err) {
    alert('Error clearing bookings. Make sure you are logged in.');
  }
}

/* ════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════ */
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

/* ════════════════════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-modal').classList.contains('active')) adminLogin();
  if (e.key === 'Escape') {
    document.getElementById('login-modal').classList.remove('active');
    closeLightbox();
    closeMenu();
  }
});

/* ════════════════════════════════════════
   INIT ON PAGE LOAD
════════════════════════════════════════ */
document.getElementById('f-date').min = new Date().toISOString().slice(0,10);
loadLiveReviews();
