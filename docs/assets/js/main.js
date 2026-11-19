/* Wealthy Mind and Body — site interactions (no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CONTACT = { email: 'letchancengassa@gmail.com', whatsapp: '971552807783' };
  const FORM_ENDPOINT = ''; // optional: Formspree/Mailchimp endpoint to collect sign-ups directly

  /* ---------- toast ---------- */
  const toastEl = $('.toast');
  let toastT;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
  };

  /* ---------- year ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- header, progress, back-to-top ---------- */
  const header = $('.header');
  const progress = $('.progress');
  const toTop = $('.to-top');
  const parallax = $$('[data-parallax]');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    header?.classList.toggle('is-scrolled', y > 10);
    toTop?.classList.toggle('is-visible', y > 700);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduced) {
      for (const el of parallax) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -speed}px, 0)`;
      }
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* ---------- mobile nav ---------- */
  const burger = $('.burger');
  const nav = $('#site-nav');
  const setNav = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger?.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a') && nav.classList.contains('is-open')) setNav(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('is-open')) setNav(false); });
  $$('.sub-toggle').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open);
    b.nextElementSibling.classList.toggle('is-open', open);
  }));

  /* ---------- split headline words ---------- */
  $$('.split').forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = `<span style="--i:${i++}"></span>`;
            w.firstChild.textContent = part;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  /* ---------- reveal on scroll ---------- */
  const startReveals = () => {
    const revealEls = $$('[data-reveal], .split');
    if ('IntersectionObserver' in window && !reduced) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach((el) => io.observe(el));
    } else revealEls.forEach((el) => el.classList.add('in'));
  };

  /* ---------- page-load animation + always start at the top ---------- */
  const root = document.documentElement;
  const loader = $('.loader');
  const toTopNow = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  toTopNow();
  const quick = root.classList.contains('quick-load');
  const minTime = reduced ? 0 : quick ? 550 : 1700;
  const t0 = performance.now();
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    toTopNow();
    root.classList.remove('is-loading');
    loader?.classList.add('is-done');
    try { sessionStorage.setItem('wmb-seen', '1'); } catch {}
    setTimeout(startReveals, reduced ? 0 : 250);
    setTimeout(() => loader?.classList.add('is-gone'), 1100);
    // A link to a section (e.g. shop/#ebooks) glides there once the page is shown
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target && id !== 'main') setTimeout(() => target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), reduced ? 0 : 900);
  };
  const whenLoaded = () => setTimeout(finish, Math.max(0, minTime - (performance.now() - t0)));
  if (document.readyState === 'complete') whenLoaded(); else addEventListener('load', whenLoaded);
  setTimeout(finish, 4500); // never keep visitors waiting on a slow image
  // Coming back with the browser's Back button also starts at the top
  addEventListener('pageshow', (e) => { if (e.persisted) toTopNow(); });

  /* ---------- 3D tilt on pillar cards ---------- */
  if (!reduced && matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => (card.style.transform = ''));
    });
  }

  /* ---------- video modal ---------- */
  const vModal = $('.video-modal');
  const vFrame = $('.video-modal__frame');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-video]');
    if (!t || !vModal) return;
    vFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${t.dataset.video}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    vModal.showModal();
  });
  const closeDialog = (d) => { d.close(); };
  vModal?.addEventListener('close', () => (vFrame.innerHTML = ''));

  /* ---------- lightbox ---------- */
  const lb = $('.lightbox');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lightbox]');
    if (!t || !lb) return;
    const im = $('img', lb);
    im.src = t.dataset.lightbox;
    im.alt = $('img', t)?.alt || '';
    lb.showModal();
  });
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('.video-modal__close')) closeDialog(d); });
  });

  /* ---------- About card: TikTok plays over the thumbnail on hover ---------- */
  $$('[data-tiktok]').forEach((card) => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = null, t;
    card.addEventListener('mouseenter', () => {
      clearTimeout(t);
      if (!frame) {
        frame = document.createElement('iframe');
        frame.src = card.dataset.tiktok;
        frame.title = 'Letchance Ngassa on TikTok';
        frame.allow = 'autoplay; encrypted-media';
        frame.tabIndex = -1;
        frame.setAttribute('aria-hidden', 'true');
        frame.addEventListener('load', () => card.matches(':hover') && card.classList.add('is-playing'));
        $('.tt-card__media', card).append(frame);
      } else card.classList.add('is-playing');
    });
    card.addEventListener('mouseleave', () => { t = setTimeout(() => card.classList.remove('is-playing'), 150); });
  });

  /* ---------- homepage hero carousel ---------- */
  const hero = $('[data-hero]');
  if (hero) {
    const slides = $$('.slide', hero);
    const dots = $$('.hero__dot', hero);
    const cur = $('[data-hero-current]', hero);
    const TIME = 6000;
    hero.style.setProperty('--slide-time', TIME + 'ms');
    let i = 0, timer = null;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === i);
        s.setAttribute('aria-hidden', k !== i);
        $$('a, button', s).forEach((el) => (el.tabIndex = k === i ? 0 : -1));
      });
      dots.forEach((d, k) => {
        d.classList.remove('is-active');
        d.classList.toggle('is-done', k < i);
        if (k === i) { void d.offsetWidth; d.classList.add('is-active'); } // restart progress bar
      });
      hero.classList.toggle('hero--on-pink', slides[i].classList.contains('slide--pink'));
      if (cur) cur.textContent = String(i + 1).padStart(2, '0');
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => go(i + 1), TIME); // always keeps moving, like the original site
    };
    $('.hero__next', hero).addEventListener('click', () => go(i + 1));
    $('.hero__prev', hero).addEventListener('click', () => go(i - 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    hero.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    });
    let sx = null;
    hero.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
      sx = null;
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : schedule()));
    // start once the loading screen has lifted
    const begin = () => go(0);
    if (document.documentElement.classList.contains('is-loading')) {
      new MutationObserver((m, o) => {
        if (!document.documentElement.classList.contains('is-loading')) { o.disconnect(); begin(); }
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } else begin();
  }

  /* ---------- testimonials carousel ---------- */
  $$('[data-carousel]').forEach((car) => {
    const slides = $$('.t-slide', car);
    const dots = $$('.t-dot', car);
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k !== i); });
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    };
    const play = () => { if (!reduced) { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); } };
    $('.t-next', car).addEventListener('click', () => { go(i + 1); play(); });
    $('.t-prev', car).addEventListener('click', () => { go(i - 1); play(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', play);
    let sx = null;
    car.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    car.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); play(); }
      sx = null;
    });
    go(0); play();
  });

  /* ---------- live session countdown (Dubai time, UTC+4, no DST) ---------- */
  const live = $('[data-live]');
  if (live) {
    const HOUR = +live.dataset.hour || 17;
    const DUR = +live.dataset.duration || 30;
    const OFFSET = 4 * 3600e3;
    const nextStart = (now = Date.now()) => {
      const d = new Date(now + OFFSET); // shifted so UTC getters read Dubai time
      let start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), HOUR) - OFFSET;
      if (now >= start + DUR * 60e3) start += 864e5;
      return start;
    };
    const fmtLocal = (t, opts) => new Date(t).toLocaleString(undefined, opts);
    const cd = $('.countdown', live);
    const set = (k, v) => ($(`[data-cd="${k}"]`, live).textContent = String(v).padStart(2, '0'));
    const tick = () => {
      const now = Date.now();
      const start = nextStart(now);
      const diff = start - now;
      const isLive = diff <= 0;
      cd.classList.toggle('is-live', isLive);
      $('.countdown__label', live).innerHTML = isLive ? '<span class="live-dot"></span> We are live right now — join on YouTube' : 'Next live session starts in';
      if (!isLive) {
        set('h', Math.floor(diff / 3600e3));
        set('m', Math.floor((diff % 3600e3) / 60e3));
        set('s', Math.floor((diff % 60e3) / 1000));
      }
      $('[data-cd-local]', live).textContent = `That’s ${fmtLocal(isLive ? start : start, { weekday: 'long', hour: 'numeric', minute: '2-digit' })} in your time zone.`;
    };
    tick(); setInterval(tick, 1000);
    const list = $('[data-upcoming]', live);
    if (list) {
      let s = nextStart();
      for (let k = 0; k < 3; k++, s += 864e5) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${fmtLocal(s, { weekday: 'long', day: 'numeric', month: 'short' })}</span><span>${fmtLocal(s, { hour: 'numeric', minute: '2-digit' })}</span>`;
        list.append(li);
      }
    }
    // Downloadable daily recurring calendar event
    $('[data-ics]', live)?.addEventListener('click', () => {
      const s = new Date(nextStart());
      const e = new Date(+s + DUR * 60e3);
      const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wealthy Mind and Body//Live//EN', 'BEGIN:VEVENT',
        `UID:wmb-live-${f(s)}@wealthymindandbody.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`,
        'RRULE:FREQ=DAILY', 'SUMMARY:Mind & Body Movement — Live with Letchance Ngassa',
        'DESCRIPTION:Join live on YouTube: https://www.youtube.com/@Leechance_Ngassa', 'URL:https://www.youtube.com/@Leechance_Ngassa',
        'BEGIN:VALARM', 'TRIGGER:-PT10M', 'ACTION:DISPLAY', 'DESCRIPTION:Live session in 10 minutes', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'wealthy-mind-and-body-live.ics';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('Calendar invite downloaded — see you on the mat!');
    });
  }

  /* ---------- breathing widget ---------- */
  $$('[data-breathe]').forEach((w) => {
    const circle = $('.breathe__circle', w);
    const label = $('.breathe__label', w);
    const count = $('.breathe__count', w);
    const startBtn = $('.breathe__start', w);
    const cyclesEl = $('.breathe__cycles', w);
    const pats = $$('[data-pattern]', w);
    let pattern = [4, 4, 4, 4], running = false, timer, cycles = 0;
    pats.forEach((b) => b.addEventListener('click', () => {
      pats.forEach((x) => x.setAttribute('aria-checked', x === b));
      pattern = b.dataset.pattern.split(',').map(Number);
      if (running) { stop(); start(); }
    }));
    const phases = () => [
      ['Breathe in', pattern[0], 1.9], ['Hold', pattern[1], 1.9], ['Breathe out', pattern[2], 1], ['Hold', pattern[3], 1],
    ].filter((p) => p[1] > 0);
    const run = (idx) => {
      const ph = phases();
      if (idx >= ph.length) { cycles++; cyclesEl.textContent = `${cycles} ${cycles === 1 ? 'cycle' : 'cycles'} complete · keep going`; idx = 0; }
      const [name, secs, scale] = ph[idx];
      label.textContent = name;
      circle.style.setProperty('--dur', `${secs}s`);
      circle.style.transform = `scale(${scale})`;
      let left = secs;
      count.textContent = left;
      const step = () => {
        if (!running) return;
        left--;
        if (left > 0) { count.textContent = left; timer = setTimeout(step, 1000); } else run(idx + 1);
      };
      timer = setTimeout(step, 1000);
    };
    const start = () => { running = true; cycles = 0; startBtn.firstElementChild.textContent = 'Stop'; cyclesEl.textContent = 'Follow the circle…'; run(0); };
    const stop = () => {
      running = false; clearTimeout(timer);
      circle.style.setProperty('--dur', '1s'); circle.style.transform = '';
      label.textContent = 'Ready'; count.textContent = '';
      startBtn.firstElementChild.textContent = 'Start breathing';
    };
    startBtn.addEventListener('click', () => (running ? stop() : start()));
  });

  /* ---------- blog filter + search ---------- */
  const postsWrap = $('[data-posts]');
  if (postsWrap) {
    const cards = $$('.post-card', postsWrap);
    const input = $('[data-search-input]');
    const filters = $$('[data-filter]');
    const empty = $('.empty');
    let type = 'All';
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach((c) => {
        const ok = (type === 'All' || c.dataset.type === type) && (!q || c.dataset.search.includes(q));
        c.hidden = !ok;
        if (ok) { shown++; c.classList.add('in'); }
      });
      empty.hidden = shown > 0;
    };
    filters.forEach((b) => b.addEventListener('click', () => {
      filters.forEach((x) => x.setAttribute('aria-checked', x === b));
      type = b.dataset.filter; apply();
    }));
    input.addEventListener('input', apply);
  }

  /* ---------- copy to clipboard ---------- */
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast('Copied to clipboard'); }
    catch { toast(b.dataset.copy); }
  });

  /* ---------- forms ---------- */
  const openWhatsApp = (text) => window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  const openEmail = (subject, body) => (location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

  const validate = (form) => {
    let ok = true;
    $$('input, select, textarea', form).forEach((el) => {
      const field = el.closest('.field');
      const valid = el.checkValidity();
      field?.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    const err = $('.form__error', form);
    if (err) err.textContent = ok ? '' : 'Please complete the highlighted fields.';
    if (!ok) $(':invalid', form)?.focus();
    return ok;
  };
  const via = (e) => e.submitter?.dataset.via || 'whatsapp';

  // Booking: prefill service from ?service= and set min date to today
  const booking = $('[data-booking]');
  if (booking) {
    const date = booking.elements.date;
    const today = new Date();
    date.min = new Date(today - today.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    const svc = new URLSearchParams(location.search).get('service');
    if (svc) {
      const sel = booking.elements.service;
      if (![...sel.options].some((o) => o.value === svc)) sel.add(new Option(svc, svc));
      sel.value = svc;
    }
    booking.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(booking)) return;
      const f = Object.fromEntries(new FormData(booking));
      const msg = `Hello! I'd like to book a session.\n\nName: ${f.first} ${f.last}\nPhone: ${f.phone}\nEmail: ${f.email}\nService: ${f.service}\nDate: ${f.date}\nTime: ${f.time}${f.notes ? `\nNotes: ${f.notes}` : ''}`;
      via(e) === 'email' ? openEmail(`Booking request — ${f.service}`, msg) : openWhatsApp(msg);
      toast('Opening your message — just press send!');
    });
  }

  const contact = $('[data-contact]');
  contact?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(contact)) return;
    const f = Object.fromEntries(new FormData(contact));
    const msg = `Hello! My name is ${f.name} (${f.email}).\n\n${f.message}`;
    via(e) === 'email' ? openEmail(`Message from ${f.name}`, msg) : openWhatsApp(msg);
    toast('Opening your message — just press send!');
  });

  // Email sign-ups (newsletter, free resources, shop notify)
  $$('[data-subscribe], [data-notify]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.elements.email;
      if (!input.checkValidity()) { input.closest('.field').classList.add('is-invalid'); input.focus(); return; }
      input.closest('.field').classList.remove('is-invalid');
      const topic = form.dataset.subscribe || 'Shop launch notification';
      if (FORM_ENDPOINT) {
        try {
          await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
          form.reset(); toast('Thank you! Please check your inbox.'); return;
        } catch { /* fall through to email */ }
      }
      openEmail(topic, `Hello! Please add me: ${input.value}`);
      toast('Almost done — just press send in your email app.');
    });
  });
})();
