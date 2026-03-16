
/* ════════════════════════════════════════
   BOOKING MODULE
   file: assets/js/modules/booking.js
════════════════════════════════════════ */
import { EMAILJS_SERVICE, EMAILJS_TEMPLATE } from './config.js';
import { showToast } from './ui.js';

export async function submitBooking(db) {
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
    if (EMAILJS_SERVICE && EMAILJS_SERVICE !== 'YOUR_SERVICE_ID') {
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
