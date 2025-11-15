function qs(name) {
const url = new URL(window.location.href);
return url.searchParams.get(name);
}


function formatDate(d=new Date()) {
const yyyy = d.getFullYear();
const mm = String(d.getMonth()+1).padStart(2,'0');
const dd = String(d.getDate()).padStart(2,'0');
return `${yyyy}-${mm}-${dd}`;
}


(function init(){
const fromSession = sessionStorage.getItem('numbers:last');
const fromQuery = qs('num');
const num = fromQuery || fromSession || '—';
const name = sessionStorage.getItem('numbers:name') || 'Anonymous';
document.getElementById('certSub').textContent = `Owned by ${name} · ${formatDate()}`;
document.getElementById('date').textContent = formatDate();


const btn = document.getElementById('downloadBtn');
btn.addEventListener('click', async () => {
const node = document.getElementById('cert');
const canvas = await html2canvas(node, { backgroundColor: '#fff', scale: 2 });
const link = document.createElement('a');
link.download = `numbers-${num}.png`;
link.href = canvas.toDataURL('image/png');
link.click();
});
})();

