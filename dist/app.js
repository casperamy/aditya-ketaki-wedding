(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const themes = {
    courtyard: { image: 'assets/palace-island.webp', number: '01', color: '#f8f4eb', alt: 'A painted Indian palace and garden on a small island beneath an open sky' },
    midnight: { image: 'assets/palace-island.webp', number: '02', color: '#101f2d', alt: 'A painted Indian palace and garden on a small island beneath an open sky' },
    garden: { image: 'assets/palace-island.webp', number: '03', color: '#fbf4ee', alt: 'A painted Indian palace and garden on a small island beneath an open sky' }
  };
  function setTheme(theme, updateUrl = true) {
    if (!themes[theme]) theme = 'courtyard';
    root.dataset.theme = theme;
    document.querySelector('#hero-source').srcset = themes[theme].image;
    document.querySelector('#hero-image').src = themes[theme].image;
    document.querySelector('#hero-image').alt = themes[theme].alt;
    document.querySelector('meta[name="theme-color"]').content = themes[theme].color;
    document.querySelector('#design-count').textContent = `${themes[theme].number} / 03`;
    document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('theme', theme);
      history.pushState({ theme }, '', url);
    }
    updateScroll();
    const picker = document.querySelector('.design-options');
    if (picker) { picker.hidden = true; document.querySelector('.switcher-toggle').setAttribute('aria-expanded', 'false'); }
  }
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
  document.querySelector('.switcher-toggle').addEventListener('click', () => {
    const options = document.querySelector('.design-options');
    options.hidden = !options.hidden;
    document.querySelector('.switcher-toggle').setAttribute('aria-expanded', String(!options.hidden));
  });
  addEventListener('popstate', () => setTheme(new URLSearchParams(location.search).get('theme') || 'courtyard', false));

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header nav');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const weddingTime = new Date('2026-12-27T10:00:00-08:00').getTime();
  function countdown() {
    const remaining = Math.max(0, weddingTime - Date.now());
    document.querySelector('#days').textContent = String(Math.floor(remaining / 86400000)).padStart(2, '0');
    document.querySelector('#hours').textContent = String(Math.floor(remaining / 3600000) % 24).padStart(2, '0');
    document.querySelector('#minutes').textContent = String(Math.floor(remaining / 60000) % 60).padStart(2, '0');
    if (!remaining) document.querySelector('.countdown-section .eyebrow').textContent = 'OUR FOREVER HAS BEGUN';
  }
  countdown(); setInterval(countdown, 30000);

  // Native scrolling remains untouched. Only visual properties follow the scroll position.
  let scrollQueued = false;
  const hero = document.querySelector('.hero');
  const venue = document.querySelector('.venue-section');
  const track = document.querySelector('.hero-scroll-track');
  const heroArt = document.querySelector('.hero-art');
  const manUpper = document.querySelector('#proposal-man-upper');
  const posePaths = [...document.querySelectorAll('[data-pose]')].map(path => ({
    path,
    standing: path.dataset.stand.match(/[A-Za-z]|-?\d*\.?\d+/g),
    kneeling: path.dataset.kneel.match(/[A-Za-z]|-?\d*\.?\d+/g)
  }));
  function proposalPose(progress) {
    const t = Math.min(1, Math.max(0, (progress - .05) / .8));
    const eased = t * t * (3 - 2 * t);
    manUpper.setAttribute('transform', `translate(${12 * eased} ${100 * eased})`);
    posePaths.forEach(({ path, standing, kneeling }) => {
      path.setAttribute('d', standing.map((token, index) => {
        if (/^[A-Za-z]$/.test(token)) return token;
        return (Number(token) + (Number(kneeling[index]) - Number(token)) * eased).toFixed(2);
      }).join(' '));
    });
  }
  function updateScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    root.classList.toggle('past-intro', scrollY >= track.offsetHeight - 80);
    root.style.setProperty('--progress', `${max > 0 ? (scrollY / max) * 100 : 0}%`);
    if (!reducedMotion.matches) {
      const travel = track.offsetHeight - hero.offsetHeight;
      const progress = Math.min(1, Math.max(0, (scrollY - track.offsetTop) / Math.max(1, travel)));
      const smooth = progress * progress * (3 - 2 * progress);
      const targetScale = 1.035;
      const shiftX = hero.clientWidth / 2 - (heroArt.offsetLeft + heroArt.offsetWidth / 2);
      // End at the proposal on the near bank, not at the center of the tall palace painting.
      const shiftY = -hero.clientHeight * .008;
      const coupleScale = 1.035;
      hero.style.setProperty('--scene-progress', progress.toFixed(4));
      hero.style.setProperty('--scene-scale', (1 + (targetScale - 1) * smooth).toFixed(4));
      hero.style.setProperty('--scene-x', `${shiftX * smooth}px`);
      hero.style.setProperty('--scene-y', `${shiftY * smooth}px`);
      proposalPose(progress);
      hero.style.setProperty('--frame-opacity', String(1 - Math.min(1, Math.max(0, (progress - .35) / .45))));
      hero.style.setProperty('--intro-opacity', String(1 - Math.min(1, progress / .48)));
      hero.style.setProperty('--scene-caption-opacity', String(Math.min(1, Math.max(0, (progress - .7) / .2))));
      hero.style.setProperty('--couple-scale', String(1 + smooth * (coupleScale - 1)));
      hero.style.setProperty('--painting-opacity', '1');
      hero.classList.toggle('scene-open', progress > .48);
      hero.style.setProperty('--parallax', `${smooth * -10}px`);
      const rect = venue.getBoundingClientRect();
      venue.style.setProperty('--venue-shift', `${Math.max(-65, Math.min(65, (innerHeight / 2 - rect.top - rect.height / 2) * .1))}px`);
    } else { proposalPose(1); hero.style.setProperty('--parallax', '0px'); venue.style.setProperty('--venue-shift', '0px'); hero.classList.remove('scene-open'); }
    scrollQueued = false;
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll);
  reducedMotion.addEventListener('change', updateScroll);
  if ('IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  const rsvpForm = document.querySelector('#rsvp-form');
  const reminderForm = document.querySelector('#reminder-form');
  const rsvpSuccess = document.querySelector('#rsvp-success');
  const reminderSuccess = document.querySelector('#reminder-success');
  function attendanceFields() {
    const attending = rsvpForm.elements.attendance.value === 'yes';
    document.querySelector('#attending-fields').hidden = !attending;
    document.querySelectorAll('#attending-fields input, #attending-fields select, #attending-fields textarea').forEach(input => input.disabled = !attending);
  }
  rsvpForm.querySelectorAll('[name=attendance]').forEach(input => input.addEventListener('change', attendanceFields));
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    closeMenu();
    const type = button.dataset.open;
    if (type === 'rsvp') {
      rsvpForm.hidden = false; rsvpSuccess.hidden = true;
      rsvpForm.elements.attendance.value = button.dataset.decline ? 'no' : 'yes';
      attendanceFields();
    } else { reminderForm.hidden = false; reminderSuccess.hidden = true; }
    document.querySelector(`#${type}-dialog`).showModal();
  }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  rsvpForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(rsvpForm);
    const name = data.get('name').trim();
    if (!name) { rsvpForm.elements.name.setCustomValidity('Please enter your name.'); rsvpForm.elements.name.reportValidity(); return; }
    const attending = data.get('attendance') === 'yes';
    const guests = Number(data.get('guests'));
    document.querySelector('#rsvp-summary').textContent = attending
      ? `${name}, your preview is for ${guests} ${guests === 1 ? 'guest' : 'guests'}, joyfully attending. Meal preference: ${data.get('meal').toLowerCase()}.`
      : `${name}, your preview sends your love and regrets.`;
    rsvpForm.hidden = true; rsvpSuccess.hidden = false;
    rsvpSuccess.querySelector('.dialog-done').focus();
  });
  rsvpForm.elements.name.addEventListener('input', () => rsvpForm.elements.name.setCustomValidity(''));
  document.querySelector('#edit-rsvp').addEventListener('click', () => { rsvpForm.hidden = false; rsvpSuccess.hidden = true; rsvpForm.elements.name.focus(); });
  reminderForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(reminderForm);
    document.querySelector('#reminder-summary').textContent = `Preview: an email to ${data.get('email')} ${data.get('timing')} before the wedding.`;
    reminderForm.hidden = true; reminderSuccess.hidden = false;
    reminderSuccess.querySelector('.dialog-done').focus();
  });

  let toastTimeout;
  function toast(message) {
    const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 4500);
  }
  document.querySelectorAll('.calendar-download').forEach(link => link.addEventListener('click', () => toast('Open the calendar file to add the celebration.')));
  setTheme(root.dataset.theme, false);
})();
