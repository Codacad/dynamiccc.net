(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() { toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation'); nav.classList.remove('is-open'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('is-open', open); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
  nav.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
  matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', updateHeader, {passive:true}); updateHeader();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:0.06});
    document.querySelectorAll('[data-reveal]').forEach(el => { if(el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal-ready'); observer.observe(el); } });
  }
  const galleryData = document.querySelector('#gallery-data');
  if(galleryData) {
    const photos = JSON.parse(galleryData.textContent);
    const cards = [...document.querySelectorAll('.gallery-grid .work-card')];
    let active = photos.map((_,i) => i), current = 0;
    const dialog = document.querySelector('#lightbox');
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      active = [];
      cards.forEach((card,i) => { const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter; card.hidden = !show; card.classList.add('is-visible'); if(show) active.push(i); });
      document.querySelector('#gallery-count').textContent = `${active.length} photograph${active.length === 1 ? '' : 's'}`;
    }));
    function showPhoto(index) {
      current = index; const p = photos[index]; const image = document.querySelector('#lightbox-image');
      image.src = `/assets/images/optimized/${p.image}-1920.webp`; image.alt = p.text;
      document.querySelector('#lightbox-title').textContent = p.title;
      document.querySelector('#lightbox-tag').textContent = p.tag;
      document.querySelector('#lightbox-text').textContent = p.text;
      document.querySelector('#lightbox-count').textContent = `${active.indexOf(index)+1} / ${active.length}`;
    }
    document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.lightbox)); dialog.showModal(); document.body.classList.add('modal-open'); }));
    function move(direction) { showPhoto(active[(active.indexOf(current) + direction + active.length) % active.length]); }
    dialog.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.direction))));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if(e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('keydown', e => { if(e.key==='ArrowRight') {e.preventDefault();move(1);} if(e.key==='ArrowLeft') {e.preventDefault();move(-1);} });
  }
  const form = document.querySelector('#enquiry-form');
  if(form) {
    const service = new URLSearchParams(location.search).get('service');
    if([...form.elements.service.options].some(option => option.value === service)) form.elements.service.value = service;
    form.addEventListener('submit', e => {
      e.preventDefault();
      for(const field of [form.elements.name,form.elements.message]) { field.value = field.value.trim(); }
      if(!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      const selected = form.elements.service.selectedOptions[0].textContent;
      const body = `Hello Dynamic Contracting Company,\n\nI would like to discuss a project.\n\nName: ${data.name}\nCompany: ${data.company || 'Not specified'}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not specified'}\nService: ${selected}\nLocation: ${data.location || 'Not specified'}\n\nProject brief:\n${data.message}\n\nKind regards,\n${data.name}`;
      document.querySelector('#draft-text').value = body;
      document.querySelector('#send-email').href = `mailto:info@dynamiccc.net?subject=${encodeURIComponent(`Project enquiry — ${selected}`)}&body=${encodeURIComponent(body)}`;
      document.querySelector('#email-preview').hidden = false;
      document.querySelector('#form-status').textContent = 'Your draft is ready. Review it below, then open your email app to send it. Nothing has been sent yet.';
      document.querySelector('#draft-text').focus();
    });
    document.querySelector('#copy-enquiry').addEventListener('click', async () => {
      const draft = document.querySelector('#draft-text');
      try { await navigator.clipboard.writeText(draft.value); document.querySelector('#form-status').textContent = 'Enquiry copied. Paste it into an email to info@dynamiccc.net.'; }
      catch { draft.focus(); draft.select(); document.querySelector('#form-status').textContent = 'Select and copy the draft, then paste it into your email service.'; }
    });
    form.addEventListener('input', e => { if(e.target.id !== 'draft-text') { document.querySelector('#email-preview').hidden = true; document.querySelector('#form-status').textContent = ''; } });
  }
})();
