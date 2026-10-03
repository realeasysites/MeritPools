(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Year + today's hours
  $('#yr').textContent = new Date().getFullYear();
  const today = $(`#hours tr[data-d="${new Date().getDay()}"]`);
  if (today) today.classList.add('today');

  // Mobile menu
  const nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }));

  // Liner studio
  const { liners } = window.MERIT;
  const labels = { classic: 'Classic', geometric: 'Geometric', contemporary: 'Contemporary' };
  const grid = $('#linerGrid');
  let current = 'classic';
  const linerSelect = $('#f-liner');

  Object.entries(liners).forEach(([cat, list]) => {
    const group = document.createElement('optgroup');
    group.label = labels[cat];
    list.forEach((l) => group.appendChild(new Option(l.name, `${l.name} (${labels[cat]})`)));
    linerSelect.appendChild(group);
  });

  function render(cat) {
    current = cat;
    grid.innerHTML = '';
    liners[cat].forEach((l, i) => {
      const src = window.meritImg(l.file);
      const b = document.createElement('button');
      b.className = 'liner';
      b.type = 'button';
      b.setAttribute('aria-label', `View ${l.name} liner`);
      b.innerHTML = `<div class="img"><img src="${src.local}" data-cdn="${src.cdn}" alt="${l.name} pool liner pattern" loading="lazy"></div><div class="cap">${l.name}<small>View</small></div>`;
      b.addEventListener('click', () => openLb(i));
      grid.appendChild(b);
    });
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => {
    $$('.tab').forEach((x) => x.setAttribute('aria-selected', x === t));
    render(t.dataset.cat);
  }));
  render('classic');

  // Lightbox
  const lb = $('#lightbox');
  let idx = 0;
  function openLb(i) {
    idx = i;
    const l = liners[current][idx];
    const src = window.meritImg(l.file);
    const img = $('#lbImg');
    img.dataset.cdn = src.cdn;
    img.src = src.local;
    img.alt = `${l.name} pool liner pattern`;
    $('#lbTitle').textContent = l.name;
    $('#lbCat').textContent = `${labels[current]} collection`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#lbQuote').focus();
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  const step = (d) => openLb((idx + d + liners[current].length) % liners[current].length);
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => step(-1));
  $('#lbNext').addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  $('#lbQuote').addEventListener('click', () => {
    const l = liners[current][idx];
    linerSelect.value = `${l.name} (${labels[current]})`;
    $('#f-service').value = 'Liner replacement';
    closeLb();
  });

  // Buttons that preselect a service
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => { $('#f-service').value = a.dataset.service; }));

  // Quote form
  const form = $('#quoteForm'), msg = $('#formMsg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form-msg';
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim() || !data.phone.trim()) {
      msg.textContent = 'Please add your name and phone number.';
      msg.classList.add('err');
      return;
    }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Something went wrong.');
      form.reset();
      msg.textContent = 'Thanks! We got your request and will be in touch soon. Need us sooner? Call (207) 883-5558.';
      msg.classList.add('ok');
    } catch (err) {
      msg.textContent = `${err.message} You can also call us at (207) 883-5558.`;
      msg.classList.add('err');
    } finally {
      btn.disabled = false; btn.textContent = 'Send my request';
    }
  });

  // Scroll reveal
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
})();
