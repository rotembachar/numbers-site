// === CONFIG ===


// === INIT ===
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const lastEl = document.getElementById('lastNumber');
const nextEl = document.getElementById('nextNumber');
const yearEl = document.getElementById('year');
const buyBtn = document.getElementById('buyBtn');
yearEl && (yearEl.textContent = new Date().getFullYear());


async function refreshCounter() {
try {
const { data, error } = await sb.from('settings').select('next_number').eq('id', 1).single();
if (error) throw error;
const next = data.next_number;
const last = Math.max(0, next - 1);
if (lastEl) lastEl.textContent = `#${last}`;
if (nextEl) nextEl.textContent = `#${next}`;
} catch (e) {
if (lastEl) lastEl.textContent = '—';
if (nextEl) nextEl.textContent = '—';
console.error(e);
}
}


async function reserveNextNumber() {
// Calls a Postgres function that atomically reserves and returns the next number
const { data, error } = await sb.rpc('reserve_next_number');
if (error) throw error;
return data; // the reserved integer
}


buyBtn && buyBtn.addEventListener('click', async () => {
// If you have Stripe, go there first. After success, redirect back and call reserve.
if (STRIPE_CHECKOUT_URL) {
window.location.href = STRIPE_CHECKOUT_URL;
return;
}


// MVP: simulate payment -> reserve immediately
buyBtn.disabled = true; buyBtn.textContent = 'Reserving…';
try {
const num = await reserveNextNumber();
// Pass number to thank-you page
sessionStorage.setItem('numbers:last', String(num));
window.location.href = `./thankyou.html?num=${encodeURIComponent(num)}`;
} catch (e) {
console.error(e);
alert('Something went wrong. Please try again.');
} finally {
buyBtn.disabled = false; buyBtn.textContent = 'Buy the Next Number';
}
});


refreshCounter();
