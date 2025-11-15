function qs(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function formatDate(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

(function init() {
  // Get number and name
  const fromSession = sessionStorage.getItem('numbers:last');
  const fromQuery = qs('num');
  const num = fromQuery || fromSession || '—';
  const name = sessionStorage.getItem('numbers:name') || 'Anonymous';

  // Insert data into certificate
  const certNumEl = document.getElementById('certNumber');
  const certSubEl = document.getElementById('certSub');
  const dateEl = document.getElementById('date');

  if (certNumEl) certNumEl.textContent = `#${num}`;
  if (certSubEl) certSubEl.textContent = `Owned by ${name} · ${formatDate()}`;
  if (dateEl) dateEl.textContent = formatDate();

  // Download button logic
  const btn = document.getElementById('downloadBtn');
  const node = document.getElementById('cert');

  if (btn && node) {
    btn.addEventListener('click', async () => {
      try {
        const canvas = await html2canvas(node, { backgroundColor: '#fff', scale: 2 });
        const link = document.createElement('a');
        link.download = `numbers-${num}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Certificate download failed:', err);
        alert('Could not generate certificate. Please try again.');
      }
    });
  }
})();
