// GenBionex — main.js
// Single ES module, deferred by default (type="module"). Menu, scroll reveal,
// and contact-form submission. No framework.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const sheet = document.querySelector('[data-menu-sheet]');
  if (!toggle || !sheet) return;
  const firstLink = sheet.querySelector('a');

  function open() {
    sheet.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (firstLink) firstLink.focus();
  }
  function close() {
    sheet.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  toggle.addEventListener('click', () => {
    sheet.classList.contains('is-open') ? close() : open();
  });
  sheet.querySelectorAll('[data-menu-close], a').forEach((el) => el.addEventListener('click', close));
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Every .reveal element is visible by default (see style.css) so content
// never depends on JS to appear. This only ever ADDS hiding, and only for
// elements that are off-screen at load time, so there is no flash for
// anything already in view.
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyInView) el.classList.add('reveal-pending');
    io.observe(el);
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const mailFallback = form.dataset.mailFallback || 'mailto:info@genbionex.ug';

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status is-visible' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    // Honeypot: real visitors never fill this field.
    if (data.get('company_site')) {
      setStatus('Thank you — we will be in touch shortly.', 'success');
      form.reset();
      return;
    }

    const payload = Object.fromEntries(data.entries());
    payload.service = data.getAll('service');
    if (submitBtn) submitBtn.disabled = true;
    setStatus('Sending…');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('request-failed');
      setStatus('Thank you — your message has been sent. We reply within two working days.', 'success');
      form.reset();
    } catch (err) {
      const body = encodeURIComponent(
        'From: ' + (payload.name || '') + ' <' + (payload.email || '') + '>' +
        '\nOrganisation: ' + (payload.organisation || '') +
        '\nDistrict: ' + (payload.district || '') +
        '\nEnterprise: ' + (payload.enterprise || '') +
        '\nService interest: ' + (payload.service.join(', ') || '') +
        '\n\n' + (payload.message || '')
      );
      const subject = encodeURIComponent('Enquiry from ' + (payload.name || 'website'));
      setStatus('We could not send this automatically. Email us directly at info@genbionex.ug, or use this pre-filled draft: ', 'error');
      const link = document.createElement('a');
      link.href = mailFallback + '?subject=' + subject + '&body=' + body;
      link.textContent = 'Open email draft';
      link.className = 'card__link';
      status.appendChild(link);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initContactCounter() {
  const el = document.querySelector('[data-contact-count]');
  if (!el) return;
  fetch('/api/contact/count')
    .then((res) => { if (!res.ok) throw new Error('request-failed'); return res.json(); })
    .then((data) => { el.textContent = Number(data.count || 0).toLocaleString('en-UG'); })
    .catch(() => { el.closest('section').hidden = true; });
}

initMenu();
initReveal();
initContactForm();
initContactCounter();
