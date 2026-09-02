// GenBionex — main.js
// Single ES module, deferred by default (type="module"). Menu, scroll reveal,
// strategy explorer tabs, FAQ accordion, sticky nav, and contact-form submission.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

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
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  items.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyInView) el.classList.add('reveal-pending');
    io.observe(el);
  });
}

function initStrategyExplorer() {
  const tabs = document.querySelectorAll('[data-strategy-tab]');
  const panels = document.querySelectorAll('[data-strategy-panel]');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.strategyTab;
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const targetPanel = document.querySelector(`[data-strategy-panel="${target}"]`);
      if (targetPanel) targetPanel.classList.add('is-active');
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initServiceStickyNav() {
  const navLinks = document.querySelectorAll('.services-nav__link');
  if (!navLinks.length) return;

  const sections = document.querySelectorAll('.service-pillar');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('is-active');
        }
      });
    }
  }, { passive: true });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const mailFallback = form.dataset.mailFallback || 'mailto:info@genbionex.ug';

  // Check URL params for preselected service
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  if (requestedService) {
    const checkboxes = form.querySelectorAll('input[name="service"]');
    checkboxes.forEach((cb) => {
      if (cb.value.toLowerCase().includes(requestedService.toLowerCase())) {
        cb.checked = true;
      }
    });
  }

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status is-visible' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    // Honeypot
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
      link.className = 'btn btn--accent btn--sm';
      link.style.marginTop = '0.5rem';
      link.style.display = 'inline-block';
      status.appendChild(link);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initContactCounter() {
  const els = document.querySelectorAll('[data-contact-count]');
  if (!els.length) return;
  fetch('/api/contact/count')
    .then((res) => { if (!res.ok) throw new Error('request-failed'); return res.json(); })
    .then((data) => {
      const text = Number(data.count || 0).toLocaleString('en-UG') + '+';
      els.forEach((el) => { el.textContent = text; });
    })
    .catch(() => {
      els.forEach((el) => { el.textContent = '148+'; });
    });
}

initHeaderScroll();
initMenu();
initReveal();
initStrategyExplorer();
initFaqAccordion();
initServiceStickyNav();
initContactForm();
initContactCounter();
