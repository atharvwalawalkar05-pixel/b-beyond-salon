
/* ════════════════════════════════════════
   ADMIN MODULE
   file: assets/js/modules/admin.js
════════════════════════════════════════ */
import { showToast } from './ui.js';

export function initAdmin(auth, db) {
  window.openAdminLogin = () => {
    document.getElementById('login-modal').classList.add('active');
    setTimeout(() => document.getElementById('admin-email').focus(), 100);
  };

  window.adminLogin = async () => {
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
      openAdmin(db);
    } catch(err) {
      errEl.textContent = '❌ Wrong email or password. Try again.';
      errEl.style.display = 'block';
    } finally {
      btn.textContent = 'Login →';
      btn.disabled = false;
    }
  };

  window.adminLogout = async () => {
    await auth.signOut();
    closeAdmin();
    showToast('👋 Logged out successfully.');
  };

  window.clearBookings = () => clearBookings(db);
}

function openAdmin(db) {
  document.getElementById('admin-panel').style.display = 'block';
  document.body.style.overflow = 'hidden';
  loadAdminData(db);
}

function closeAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
  document.body.style.overflow = '';
}

async function loadAdminData(db) {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;
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

async function clearBookings(db) {
  if (!confirm('Clear ALL bookings from Firebase? This cannot be undone!')) return;
  try {
    const snap = await db.collection('bookings').get();
    const batch = db.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    loadAdminData(db);
    showToast('🗑️ All bookings cleared.');
  } catch(err) {
    alert('Error clearing bookings. Make sure you are logged in.');
  }
}
