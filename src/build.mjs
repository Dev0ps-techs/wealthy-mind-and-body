// Zero-dependency static site generator.
// Usage: node src/build.mjs   (outputs to /docs, which GitHub Pages serves)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = __dirname;
// PREVIEW=1 builds a copy for a claude.ai preview page: explicit index.html links, YouTube opens in a new tab.
const PREVIEW = !!process.env.PREVIEW;
const OUT = path.resolve(__dirname, '..', PREVIEW ? 'docs-preview' : 'docs');
// Absolute base path where the site is hosted. Used only by 404.html, which
// GitHub Pages serves from any URL depth. Set BASE=/ when using a custom domain.
const BASE = process.env.BASE ?? '/wealthy-mind-and-body/';
const { site } = C;

/* ---------------- helpers ---------------- */
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (d) =>
  new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const readMins = (post) => {
  const words = post.body.filter((b) => b[0] === 'p' || b[0] === 'h').map((b) => b[1]).join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};
const excerpt = (post) => post.excerpt || post.body.find((b) => b[0] === 'p')[1].slice(0, 150).replace(/\s\S*$/, '') + '…';

// Image dimensions (webp/png) so the browser can reserve space and avoid layout shift.
const dimCache = {};
function dims(file) {
  if (dimCache[file]) return dimCache[file];
  const b = fs.readFileSync(path.join(SRC, 'assets/img', file));
  let w, h;
  if (b.toString('ascii', 1, 4) === 'PNG') { w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
  else {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') { w = b.readUInt16LE(26) & 0x3fff; h = b.readUInt16LE(28) & 0x3fff; }
    else if (chunk === 'VP8L') { const n = b.readUInt32LE(21); w = (n & 0x3fff) + 1; h = ((n >> 14) & 0x3fff) + 1; }
    else { w = 1 + b.readUIntLE(24, 3); h = 1 + b.readUIntLE(27, 3); }
  }
  return (dimCache[file] = { w, h });
}
const hasFile = (f) => fs.existsSync(path.join(SRC, 'assets/img', f));

function img(r, name, alt = '', { cls = '', sizes = '100vw', eager = false, attrs = '' } = {}) {
  const file = hasFile(name + '.webp') ? name + '.webp' : name + '.png';
  const { w, h } = dims(file);
  const src = `${r}assets/img/${file}`;
  const small = name + '-800.webp';
  const srcset = hasFile(small) ? ` srcset="${r}assets/img/${small} 800w, ${src} ${w}w" sizes="${sizes}"` : '';
  return `<img src="${src}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${attrs ? ' ' + attrs : ''}>`;
}

const ICONS = {
  people: '<circle cx="12" cy="7" r="2.6"/><path d="M7.5 20v-3a4.5 4.5 0 0 1 9 0v3"/><circle cx="5" cy="9.5" r="1.9"/><path d="M2 19.5v-1.8A3.2 3.2 0 0 1 6.3 14.7"/><circle cx="19" cy="9.5" r="1.9"/><path d="M22 19.5v-1.8a3.2 3.2 0 0 0-4.3-3"/>',
  coachMind: '<path d="M14.5 20v-2.5h2a2 2 0 0 0 2-2V13l1.6-.6-1.6-3A7 7 0 1 0 8 15.8V20"/><path d="M11.6 12.6s-2.6-1.5-2.6-3.2a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.2-2.6 3.2z" fill="currentColor"/>',
  movePose: '<circle cx="12" cy="4" r="1.8"/><path d="M3 8.5 12 9l9-.5M12 9v4.5l-4.5 3.5L5 20M12 13.5l4.5 3.5L19 20"/>',
  lungs: '<path d="M12 3v8M12 11c-1.5 0-2.5-1-2.5-1M12 11c1.5 0 2.5-1 2.5-1"/><path d="M9 7.5C6 7 3.5 10 3.5 14.5c0 3 .8 5.5 3 5.5 2.4 0 2.5-2 2.5-4.5V7.5zM15 7.5c3-.5 5.5 2.5 5.5 7 0 3-.8 5.5-3 5.5-2.4 0-2.5-2-2.5-4.5V7.5z"/>',
  easel: '<rect x="3" y="3.5" width="18" height="11" rx="1.5"/><path d="M12 14.5V18M8 21l4-3 4 3M7 11l3-3 2.5 2L17 6.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  bag: '<path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z" fill="currentColor" stroke="none"/>',
  breath: '<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  lotus: '<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-2-3-5-3-8 1 0 2.5 1 3 2.5.5-1.5 2-2.5 3-2.5 0 3-1 6-3 8z"/><path d="M12 12.5C12 9 12 6 12 4c1.5 1.5 3 4 3 6"/>',
  leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  stretch: '<circle cx="12" cy="4.5" r="1.8"/><path d="M4 9l8 1 8-1M12 10v5l-4 6M12 15l4 6"/>',
  clarity: '<circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
  calm: '<path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  link: '<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>',
  mind: '<path d="M9 21v-3a7 7 0 1 1 8-6.9l1.5 3.4H17v3a2 2 0 0 1-2 2h-2v1.5"/><path d="M10 9.5a2 2 0 0 1 3.5-1.3"/>',
  meditate: '<circle cx="12" cy="5" r="2"/><path d="M12 8v5M7 11l5 2 5-2M4 19c2-3 5-4 8-4s6 1 8 4M8 19h8"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
  facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
};
const icon = (n, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

const btn = (href, label, cls = 'btn btn--primary', extra = '') =>
  `<a class="${cls}" href="${href}"${extra}><span>${label}</span>${icon('arrow')}</a>`;

const shopLinks = [
  { href: site.shopifyUrl || 'shop/#physical-products', ext: !!site.shopifyUrl, label: 'Physical Products', note: 'Shopify' },
  { href: site.digistoreUrl || 'shop/#digital-products', ext: !!site.digistoreUrl, label: 'Digital Products', note: 'Digistore24' },
];
const serviceLinks = C.serviceMenu.map((m) => ({ href: `services/#${m.id}`, label: m.title }));
const linkHref = (r, l) => (l.ext ? l.href : r + l.href);
const linkAttrs = (l) => (l.ext ? ' target="_blank" rel="noopener"' : '');

const NAV = [
  { href: '', label: 'Home', key: 'home' },
  { href: 'about/', label: 'About', key: 'about' },
  { href: 'services/', label: 'Services', key: 'services', children: serviceLinks },
  { href: 'shop/', label: 'Shop', key: 'shop', children: shopLinks },
  { href: 'blog/', label: 'Blog', key: 'blog' },
  { href: 'faq/', label: 'FAQ', key: 'faq' },
  { href: 'contact/', label: 'Contact', key: 'contact' },
];

/* ---------------- layout ---------------- */
function layout({ r, title, desc = site.description, key = '', body, pathOut, ogImg = 'meditation-sunset', base = '' }) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.positioning.replace(/\.$/, '')}`;
  const canonical = site.url + '/' + pathOut.replace(/index\.html$/, '');
  const navItems = NAV.map((n) => {
    const active = n.key === key ? ' aria-current="page"' : '';
    if (!n.children) return `<li><a href="${r}${n.href}"${active}>${n.label}</a></li>`;
    return `<li class="has-sub"><a href="${r}${n.href}"${active}>${n.label}</a><button class="sub-toggle" aria-expanded="false" aria-label="Show ${n.label} categories">${icon('chevron')}</button>
      <ul class="sub">${n.children.map((c) => `<li><a href="${linkHref(r, c)}"${linkAttrs(c)}>${c.label}${c.note ? `<small>${c.note}</small>` : ''}</a></li>`).join('')}</ul></li>`;
  }).join('');
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: site.name,
    alternateName: site.brand,
    url: site.url,
    telephone: site.phone,
    email: site.emails[0],
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    founder: site.owner,
    sameAs: site.social.map((s) => s.url),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${base ? `<base href="${base}">` : ''}
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#5B6E61">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site.url}/assets/img/${ogImg}.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${r}assets/img/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${r}assets/img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/css/style.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script>(function(d){d.classList.add('js','is-loading');if('scrollRestoration' in history)history.scrollRestoration='manual';try{if(sessionStorage.getItem('wmb-seen'))d.classList.add('quick-load')}catch(e){}})(document.documentElement)</script>
</head>
<body>
<div class="loader" aria-hidden="true">
  <div class="loader__in">
    <svg class="loader__mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">${ICONS.lotus}</svg>
    <span class="loader__name">${wordmark()}</span>
    <span class="loader__tag">${site.tagline}</span>
    <span class="loader__bar"><i></i></span>
  </div>
</div>
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
<div class="topbar">
  <div class="container topbar__in">
    <span class="topbar__left"><span class="w30">For ${site.audience}</span><a class="topbar__live" href="${r}#live"><span class="live-dot"></span> Live every evening · 5:00 PM Dubai time</a></span>
    <span class="topbar__links">
      <a href="tel:${site.phone}">${icon('phone')} ${site.phoneDisplay}</a>
      <a href="mailto:${site.emails[0]}">${icon('mail')} ${site.emails[0]}</a>
    </span>
  </div>
</div>
<header class="header">
  <div class="container header__in">
    <a class="logo" href="${r}" aria-label="${site.name} — home">${wordmark()}</a>
    <span class="w30 w30--header">${site.audience}</span>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list">${navItems}</ul>
      <div class="nav__mobile-extra">
        <a class="btn btn--primary" href="${r}booking/"><span>Book a session</span>${icon('arrow')}</a>
        <p><a href="tel:${site.phone}">${site.phoneDisplay}</a><br><a href="mailto:${site.emails[0]}">${site.emails[0]}</a></p>
        <div class="social">${socialLinks()}</div>
      </div>
    </nav>
    <a class="btn btn--primary btn--sm header__cta" href="${r}booking/"><span>Book a session</span>${icon('arrow')}</a>
    <button class="burger" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span><span></span></button>
  </div>
</header>
<main id="main">
${body}
</main>
${footer(r)}
<a class="wa-float" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Letchance! I’d like to know more about your sessions.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
<button class="to-top" aria-label="Back to top">${icon('up')}</button>
<dialog class="video-modal" aria-label="Video">
  <div class="video-modal__frame"></div>
  <button class="video-modal__close" aria-label="Close video">${icon('close')}</button>
</dialog>
<dialog class="lightbox" aria-label="Image preview">
  <img alt="">
  <button class="video-modal__close" aria-label="Close image">${icon('close')}</button>
</dialog>
<div class="toast" role="status" aria-live="polite"></div>
<script src="${r}assets/js/main.js" defer></script>
</body>
</html>
`;
}

function wordmark() {
  return `<span class="wordmark"><span>Wealthy</span><em>Mind</em><span>&amp;Body</span><small>.com</small></span>`;
}

function socialLinks() {
  return site.social
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${icon(s.icon)}</a>`)
    .join('');
}

function footer(r) {
  return `<footer class="footer">
  <div class="footer__cta">
    <div class="container footer__cta-in" data-reveal>
      <p class="eyebrow eyebrow--light">${site.positioning}</p>
      <h2>${site.tagline.replace('Empower Your Body.', '<br>Empower Your Body.<br>')}</h2>
      <div class="btn-row">
        ${btn(`${r}booking/`, 'Book a session', 'btn btn--rose')}
        <a class="btn btn--ghost-light" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp us</span></a>
      </div>
    </div>
  </div>
  <div class="container footer__grid">
    <div>
      <a class="logo logo--light" href="${r}">${wordmark()}</a>
      <p class="footer__tag">${site.tagline}</p>
      <p class="w30 w30--footer">${site.audienceLine}</p>
      <p class="footer__about">${site.about}</p>
      <div class="social">${socialLinks()}</div>
    </div>
    <div>
      <h3>Our Services</h3>
      <ul>${C.services.list.map((s) => `<li><a href="${r}services/">${s}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="${r}about/">About us</a></li>
        <li><a href="${r}shop/">Shop</a></li>
        <li><a href="${r}blog/">Blog</a></li>
        <li><a href="${r}booking/">Booking</a></li>
        <li><a href="${r}faq/">FAQ</a></li>
        <li><a href="${r}contact/">Contacts</a></li>
        <li><a href="${r}privacy/">Privacy Policy</a></li>
      </ul>
    </div>
    <div>
      <h3>Contact info</h3>
      <p class="footer__contact">${icon('pin')}<span>${site.location}. ${site.locationNote}</span></p>
      <p class="footer__contact">${icon('mail')}<a href="mailto:${site.emails[0]}">${site.emails[0]}</a></p>
      <p class="footer__contact">${icon('phone')}<a href="tel:${site.phone}">${site.phoneDisplay}</a></p>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>Copyright © <span data-year>2026</span> ${site.domain}. All rights reserved.</p>
    <a href="${r}privacy/">Privacy Policy</a>
  </div>
</footer>`;
}

/* ---------------- shared sections ---------------- */
const pageHero = (r, { eyebrow, title, text = '', imgName, crumbs = [] }) => `
<section class="page-hero">
  <div class="page-hero__bg" data-parallax="0.25">${img(r, imgName, '', { eager: true })}</div>
  <div class="container page-hero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${r}">Home</a>${crumbs.map((c) => `<span>/</span>${c.href ? `<a href="${r}${c.href}">${c.label}</a>` : `<span aria-current="page">${c.label}</span>`}`).join('')}</nav>
    ${eyebrow ? `<p class="eyebrow eyebrow--light" data-reveal>${eyebrow}</p>` : ''}
    <h1 class="split" data-reveal>${title}</h1>
    ${text ? `<p class="page-hero__text" data-reveal style="--d:.15s">${text}</p>` : ''}
  </div>
</section>`;

const videoCard = (r, id, cover, label = 'Play video') => PREVIEW ? `
<a class="video-card" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" aria-label="${esc(label)} (opens YouTube)">
  ${img(r, cover, '', { sizes: '(min-width: 900px) 50vw, 100vw' })}
  <span class="video-card__play">${icon('play')}</span>
  <span class="video-card__label">${label}</span>
</a>` : `
<button class="video-card" data-video="${id}" aria-label="${esc(label)}">
  ${img(r, cover, '', { sizes: '(min-width: 900px) 50vw, 100vw' })}
  <span class="video-card__play">${icon('play')}</span>
  <span class="video-card__label">${label}</span>
</button>`;

const postCard = (r, p, i = 0) => `
<article class="post-card" data-reveal style="--d:${(i % 3) * 0.08}s" data-type="${p.type}" data-search="${esc((p.title + ' ' + excerpt(p)).toLowerCase())}">
  <a href="${r}blog/${p.slug}/" class="post-card__img">${img(r, p.cover, '', { sizes: '(min-width: 900px) 33vw, 100vw' })}<span class="tag">${p.type}</span></a>
  <div class="post-card__body">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.type === 'Article' ? readMins(p) + ' min read' : p.type}</p>
    <h3><a href="${r}blog/${p.slug}/">${p.title}</a></h3>
    <p>${excerpt(p)}</p>
    <a class="link-arrow" href="${r}blog/${p.slug}/">Read More ${icon('arrow')}</a>
  </div>
</article>`;

const breathingWidget = () => `
<div class="breathe" data-breathe>
  <div class="breathe__stage">
    <div class="breathe__ring"></div>
    <div class="breathe__circle"><span class="breathe__label">Ready</span><span class="breathe__count"></span></div>
  </div>
  <div class="breathe__controls">
    <div class="seg" role="radiogroup" aria-label="Breathing pattern">
      <button role="radio" aria-checked="true" data-pattern="4,4,4,4">Box 4·4·4·4</button>
      <button role="radio" aria-checked="false" data-pattern="4,7,8,0">Calm 4·7·8</button>
      <button role="radio" aria-checked="false" data-pattern="5,0,5,0">Balance 5·5</button>
    </div>
    <button class="btn btn--rose breathe__start"><span>Start breathing</span></button>
    <p class="breathe__cycles" aria-live="polite">Find a comfortable seat. Soften your shoulders.</p>
  </div>
</div>`;

/* ---------------- pages ---------------- */
function heroCarousel(r) {
  const S = C.slides;
  return `
<section class="hero hero--carousel" data-hero aria-roledescription="carousel" aria-label="Highlights">
  ${S.map((sl, i) => {
    const tag = i === 0 ? 'h1' : 'h2';
    const buttons = `<div class="btn-row">
        ${sl.primary.href.startsWith('http')
          ? `<a class="btn ${sl.pink ? 'btn--primary' : 'btn--rose'}" href="${sl.primary.href}" target="_blank" rel="noopener"><span>${sl.primary.label}</span>${icon('arrow')}</a>`
          : btn(r + sl.primary.href, sl.primary.label, `btn ${sl.pink ? 'btn--primary' : 'btn--rose'}`)}
        ${sl.secondary ? `<a class="btn ${sl.pink ? 'btn--outline' : 'btn--ghost-light'}" href="${r}${sl.secondary.href}"><span class="live-dot"></span><span>${sl.secondary.label}</span></a>` : btn(r + 'booking/', 'Book a session', 'btn btn--ghost-light')}
      </div>`;
    if (sl.pink) return `
  <div class="slide slide--pink${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${S.length}"${i ? ' aria-hidden="true"' : ''}>
    <div class="slide__blob" aria-hidden="true"></div>
    <div class="container slide__split">
      <div class="slide__content">
        <p class="w30 w30--lg">${sl.overline}</p>
        <${tag} class="slide__title">${sl.title}</${tag}>
        <p class="slide__text">${sl.text}</p>
        ${buttons}
        <p class="slide__note">${sl.note}</p>
      </div>
      <div class="slide__photo">
        <div class="slide__arch">${img(r, sl.img, 'Letchance Ngassa in tree pose wearing Be Fit & Flex active wear', { eager: i === 0, sizes: '(min-width: 900px) 40vw, 80vw' })}</div>
        <span class="slide__badge">${site.tagline}</span>
      </div>
    </div>
  </div>`;
    if (sl.framed) return `
  <div class="slide slide--framed${dims(sl.img + '.webp').w > dims(sl.img + '.webp').h * 1.2 ? ' slide--framed-wide' : ''}${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${S.length}"${i ? ' aria-hidden="true"' : ''}>
    <div class="container slide__split">
      <div class="slide__content slide__content--light">
        <p class="w30">For ${site.audience}</p>
        <${tag} class="slide__title">${sl.title}</${tag}>
        <p class="slide__text">${sl.text}</p>
        ${buttons}
      </div>
      <div class="slide__photo">
        <div class="slide__frame" style="aspect-ratio: ${dims(sl.img + '.webp').w} / ${dims(sl.img + '.webp').h}; width: min(100%, calc(64vh * ${(dims(sl.img + '.webp').w / dims(sl.img + '.webp').h).toFixed(3)}))">${img(r, sl.img, sl.imgAlt || '', { eager: i === 0, sizes: '(min-width: 900px) 55vw, 80vw' })}</div>
      </div>
    </div>
  </div>`;
    return `
  <div class="slide${sl.align === 'right' ? ' slide--right' : ''}${sl.valign === 'bottom' ? ' slide--bottom' : ''}${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${S.length}"${i ? ' aria-hidden="true"' : ''}>
    <div class="slide__bg">${img(r, sl.img, sl.imgAlt || '', { eager: i === 0, attrs: sl.pos ? `style="object-position: ${sl.pos}"` : '' })}</div>
    <div class="slide__shade"></div>
    <div class="container slide__content slide__content--light">
      <p class="w30">For ${site.audience}</p>
      <${tag} class="slide__title">${sl.title}</${tag}>
      <p class="slide__text">${sl.text}</p>
      ${buttons}
    </div>
  </div>`;
  }).join('')}
  <div class="container hero__nav">
    <span class="hero__count"><b data-hero-current>01</b> / ${String(S.length).padStart(2, '0')}</span>
    <div class="hero__dots">${S.map((sl, i) => `<button class="hero__dot${i === 0 ? ' is-active' : ''}" aria-label="Show slide ${i + 1}: ${esc(sl.title)}"><i></i></button>`).join('')}</div>
    <div class="hero__arrows">
      <button class="hero__arrow hero__prev" aria-label="Previous slide">${icon('arrow')}</button>
      <button class="hero__arrow hero__next" aria-label="Next slide">${icon('arrow')}</button>
    </div>
  </div>
</section>`;
}

function trio(r) {
  const menu = (label, links) => `
      <details class="trio__menu">
        <summary><span>${label}</span>${icon('chevron')}</summary>
        <ul>${links.map((l) => `<li><a href="${linkHref(r, l)}"${linkAttrs(l)}><span>${l.label}</span>${l.note ? `<small>${l.note}</small>` : icon('arrow')}</a></li>`).join('')}</ul>
      </details>`;
  const cards = [
    { t: 'Blog', img: 'blog-quote-inquiry-mind', text: 'Articles, guided videos, daily mindset quotes, and healthy eating advice and guidance to support your practice between sessions.', foot: `<a class="link-arrow" href="${r}blog/">Read More ${icon('arrow')}</a>`, href: 'blog/' },
    { t: 'Services', img: 'services-stage-selfie', text: C.services.intro, foot: menu('Choose a service', serviceLinks), href: 'services/' },
    { t: 'Shop', img: 'shop-collage', text: 'Wellness essentials, active wear, ebooks and digital programs.', foot: menu('Choose a store', shopLinks), href: 'shop/' },
  ];
  return `
<section class="section intro" id="explore" aria-label="Explore">
  <div class="container trio">
    ${cards.map((c, i) => `
    <article class="trio__card" data-reveal style="--d:${i * 0.1}s">
      <a class="trio__img" href="${r}${c.href}" tabindex="-1" aria-hidden="true">${img(r, c.img, '', { sizes: '(min-width: 900px) 33vw, 100vw' })}</a>
      <div class="trio__body"><h3><a href="${r}${c.href}">${c.t}</a></h3><p>${c.text}</p>${c.foot}</div>
    </article>`).join('')}
  </div>
</section>`;
}

// TikTok video shown silently on a loop; the whole card links to the YouTube video.
// Thumbnail picture; on the live site the TikTok fades in and plays silently on hover.
// Clicking anywhere opens the YouTube video.
function tiktokCard(r) {
  const params = 'autoplay=1&loop=1&muted=1&controls=0&progress_bar=0&play_button=0&volume_control=0&fullscreen_button=0&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0';
  const tt = PREVIEW ? '' : ` data-tiktok="https://www.tiktok.com/player/v1/${site.aboutTikTok}?${params}"`;
  return `
<a class="tt-card" href="${site.aboutYouTube}" target="_blank" rel="noopener" aria-label="Watch the full video on YouTube"${tt}>
  <span class="tt-card__media">${img(r, 'move-breath-stretch-thrive', 'Move. Breath. Stretch. Thrive. Letchance Ngassa in a split pose with the Dubai skyline', { sizes: '340px' })}</span>
  <span class="tt-card__shade"></span>
  <span class="tt-card__play">${icon('play')}</span>
  <span class="tt-card__label">${icon('youtube')} Watch the full video on YouTube</span>
</a>`;
}

function aboutBand(r) {
  return `
<section class="section about-band">
  <div class="container split-2">
    <div data-reveal>${tiktokCard(r)}</div>
    <div data-reveal style="--d:.1s">
      <p class="eyebrow">Wealthy Mind &amp; Body</p>
      <h2 class="h-display">${C.aboutMBM.text}</h2>
      <p>${C.aboutMBM.belief}</p>
      <blockquote class="mission"><span>${C.aboutMBM.missionLabel}</span>${C.aboutMBM.mission}</blockquote>
      ${btn(r + 'about/', 'Read More', 'btn btn--outline')}
    </div>
  </div>
</section>`;
}

function offerSection(r) {
  return `
<section class="section offer">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${C.offer.eyebrow}</p>
      <h2 class="h-display">${C.offer.title}</h2>
      <p>${C.offer.text}</p>
    </div>
    <div class="offer__grid">
      ${C.offer.items.map((o, i) => `
      <article class="offer__card" data-reveal style="--d:${i * 0.08}s">
        <span class="offer__num">0${i + 1}</span>
        <span class="icon-badge">${icon(o.icon)}</span>
        <h3>${o.title}</h3>
        <p>${o.text}</p>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

function benefitsSection(r) {
  return `
<section class="section benefits">
  <div class="benefits__bg" data-parallax="0.2">${img(r, 'coast-yoga', '')}</div>
  <div class="container">
    <div class="section-head section-head--light" data-reveal>
      <p class="eyebrow eyebrow--light">Why Wealthy Mind and Body</p>
      <h2 class="h-display">Benefits of MBM</h2>
    </div>
    <ul class="benefits__grid">
      ${C.benefits.items.map((b, i) => `<li data-reveal style="--d:${i * 0.06}s"><span class="icon-badge icon-badge--light">${icon(b.icon)}</span>${b.title}</li>`).join('')}
    </ul>
  </div>
</section>`;
}

function home(r) {
  const H = C.home;
  const L = H.live;
  return `
${heroCarousel(r)}
${trio(r)}
<section class="section meet">
  <div class="container split-2">
    <div class="meet__media" data-reveal>
      <div class="meet__frame">${img(r, H.meet.img, 'Letchance Ngassa', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
      <div class="meet__sig" data-parallax="-0.06">Coaching for ${site.audience}</div>
    </div>
    <div data-reveal style="--d:.1s">
      <p class="eyebrow">${H.meet.eyebrow}</p>
      <h2 class="h-display meet__name">${H.meet.title}</h2>
      <p class="meet__role">${H.meet.subtitle}</p>
      ${H.meet.story.map((p) => `<p>${p}</p>`).join('')}
      ${btn(r + H.meet.cta.href, H.meet.cta.label, 'btn btn--primary')}
    </div>
  </div>
</section>
${aboutBand(r)}
${offerSection(r)}
<section class="section resources" id="resources">
  <div class="container split-2 split-2--top">
    <div data-reveal>
      <p class="eyebrow">Downloadables</p>
      <h2 class="h-display">${H.resources.title}</h2>
      <p>${H.resources.text}</p>
      <form class="inline-form" data-subscribe="Free resources request">
        <label class="field"><input type="email" name="email" required placeholder=" " autocomplete="email"><span>Your email</span></label>
        <button class="btn btn--primary" type="submit"><span>${H.resources.cta}</span>${icon('arrow')}</button>
      </form>
      <p class="form__hint">We’ll send all four guides straight to your inbox.</p>
    </div>
    <ul class="resource-list">
      ${H.resources.items.map((it, i) => `
      <li class="resource" data-reveal style="--d:${i * 0.08}s">
        <span class="resource__cover"><span class="icon-badge">${icon(it.icon)}</span><span class="resource__n">0${i + 1}</span></span>
        <span class="resource__body"><strong>${it.title}</strong><span>Free PDF</span></span>
        ${icon('arrow', 'icon resource__arrow')}
      </li>`).join('')}
    </ul>
  </div>
</section>
<section class="section section--sand programs">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div><p class="eyebrow">Featured Programs</p><h2 class="h-display">Programs for <em>${site.audience}</em></h2></div>
      ${btn(r + 'services/', 'All services', 'btn btn--outline')}
    </div>
    <div class="program-cards">
      ${H.programs.map((p, i) => `
      <a class="program-card" href="${r}booking/?service=${encodeURIComponent(p.service)}" data-reveal style="--d:${i * 0.12}s">
        ${img(r, p.img, '', { sizes: '(min-width: 900px) 33vw, 100vw' })}
        <div class="program-card__body">
          <span class="icon-badge icon-badge--light">${icon(p.icon)}</span>
          <span class="program-card__num">0${i + 1}</span>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
          <ul class="points">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
          <span class="link-arrow">Begin this program ${icon('arrow')}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>
<section class="section section--forest live" id="live" data-live data-hour="${L.startHour}" data-duration="${L.durationMin}">
  <div class="container">
    <div class="live__grid">
      <div data-reveal>
        <p class="eyebrow eyebrow--light">YouTube & Live Sessions</p>
        <h2 class="h-display">${L.title}</h2>
        <p class="live__time">${icon('clock')} ${L.time} <span>(Dubai time, GMT+4)</span></p>
        <p class="live__session">${L.session}</p>
        <div class="countdown" aria-live="polite">
          <p class="countdown__label">Next live session starts in</p>
          <div class="countdown__nums">
            <span><b data-cd="h">--</b>hours</span><span><b data-cd="m">--</b>min</span><span><b data-cd="s">--</b>sec</span>
          </div>
          <p class="countdown__local" data-cd-local></p>
        </div>
        <div class="btn-row">
          <a class="btn btn--rose" href="${site.youtube.daily}" target="_blank" rel="noopener">${icon('youtube')}<span>Subscribe on YouTube</span></a>
          <button class="btn btn--ghost-light" data-ics>${icon('calendar')}<span>Add to calendar</span></button>
        </div>
      </div>
      <div class="live__videos">
        <p class="live__label" data-reveal>Recent videos</p>
        ${L.videos.map((v, i) => `<div data-reveal style="--d:${0.1 + i * 0.1}s">${videoCard(r, v.id, v.cover, v.title)}</div>`).join('')}
        <div class="upcoming" data-reveal style="--d:.3s">
          <p class="live__label">Upcoming lives</p>
          <ul data-upcoming></ul>
        </div>
      </div>
    </div>
  </div>
</section>
${benefitsSection(r)}
<section class="section testimonials">
  <div class="container container--narrow">
    <p class="eyebrow" data-reveal>Kind words</p>
    <div class="t-carousel" data-carousel aria-roledescription="carousel" aria-label="Testimonials">
      <div class="t-carousel__track">
        ${H.testimonials.map((t, i) => `
        <figure class="t-slide${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${H.testimonials.length}">
          <blockquote class="h-display">“${t}”</blockquote>
          <figcaption><span class="stars" aria-label="5 stars">★★★★★</span> Wealthy Mind and Body community member</figcaption>
        </figure>`).join('')}
      </div>
      <div class="t-carousel__nav">
        <button class="t-prev" aria-label="Previous testimonial">${icon('arrow')}</button>
        <div class="t-dots">${H.testimonials.map((_, i) => `<button class="t-dot${i === 0 ? ' is-active' : ''}" aria-label="Show testimonial ${i + 1}"></button>`).join('')}</div>
        <button class="t-next" aria-label="Next testimonial">${icon('arrow')}</button>
      </div>
    </div>
  </div>
</section>

<section class="section community">
  <div class="container">
    <div class="community__card" data-reveal>
      <div class="community__img">${img(r, H.community.img, 'A group yoga class', { sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
      <div class="community__body">
        <p class="eyebrow eyebrow--light">Community Membership · ${site.audience}</p>
        <h2 class="h-display">${H.community.title}</h2>
        <p class="community__intro">${H.community.intro}</p>
        <ul class="ticks">${H.community.items.map((it) => `<li>${icon('check')} ${it}</li>`).join('')}</ul>
        <a class="btn btn--rose" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Letchance! I’d love to join the Wealthy Mind and Body community.')}" target="_blank" rel="noopener"><span>${H.community.cta}</span>${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>
<section class="section email-cap">
  <div class="container container--narrow email-cap__in" data-reveal>
    <span class="email-cap__mark" aria-hidden="true">${icon('lotus')}</span>
    <span class="w30">For ${site.audience}</span>
    <h2 class="h-display">${H.email.title}</h2>
    <p>${H.email.text}</p>
    <form class="inline-form inline-form--center" data-subscribe="Newsletter signup">
      <label class="field"><input type="email" name="email" required placeholder=" " autocomplete="email"><span>Your email address</span></label>
      <button class="btn btn--primary" type="submit"><span>${H.email.cta}</span>${icon('arrow')}</button>
    </form>
    <p class="form__hint">No spam. Unsubscribe anytime.</p>
  </div>
</section>`;
}

// Sections from the original homepage, now on the Services page.
function servicesExtras(r) {
  return `
${offerSection(r)}

<section class="section breathe-section" id="breathe">
  <div class="container split-2">
    <div data-reveal>
      <p class="eyebrow eyebrow--light">Try it now · Guided Breathing</p>
      <h2 class="h-display">Take one minute.<br><em>Just breathe.</em></h2>
      <p>${C.offer.items[0].text}</p>
      <p class="muted-light">Follow the circle: breathe in as it grows, hold, and breathe out as it softens. Choose a rhythm that feels right for you.</p>
    </div>
    <div data-reveal style="--d:.1s">${breathingWidget()}</div>
  </div>
</section>

${benefitsSection(r)}

<section class="section kids" id="kids">
  <div class="container split-2 split-2--rev">
    <div class="kids__media" data-reveal>
      <div class="stack">
        <div class="stack__a">${img(r, 'kids-beach-yoga', 'Children practising yoga on the beach', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
        <div class="stack__b" data-parallax="-0.1">${img(r, 'kids-yoga-park', 'Kids yoga in the park', { sizes: '(min-width: 900px) 25vw, 60vw' })}</div>
      </div>
    </div>
    <div data-reveal style="--d:.1s">
      <p class="eyebrow">Children’s Yoga</p>
      <h2 class="h-display">${C.kids.title}</h2>
      <p>${C.kids.text}</p>
      <div class="btn-row">
        ${btn(r + 'booking/?service=' + encodeURIComponent('Children Yoga'), 'Book a kids class')}
        <a class="btn btn--outline" href="${site.youtube.kids}" target="_blank" rel="noopener">${icon('youtube')}<span>Kids Yoga on YouTube</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--sand features">
  <div class="container features__grid">
    <div class="features__quote" data-reveal>
      <p class="eyebrow">${C.features.title}</p>
      <blockquote class="h-display">“${C.features.quote}”</blockquote>
      <div class="features__img">${img(r, C.features.img, 'Stretching on the mat', { sizes: '300px' })}</div>
    </div>
    <div class="features__list">
      ${C.features.items.map((f, i) => `
      <article class="feature" data-reveal style="--d:${i * 0.1}s">
        <span class="icon-badge">${icon(f.icon)}</span>
        <div><h3>${f.title}</h3><p>${f.text}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="practice">
  <div class="practice__bg" data-parallax="0.25">${img(r, 'meditation-sunset', '')}</div>
  <div class="container practice__in" data-reveal>
    <h2 class="h-display">${C.practice.title}</h2>
    <p>${C.practice.text}</p>
    ${btn(r + 'booking/', C.practice.cta, 'btn btn--rose')}
  </div>
</section>`;
}

function about(r) {
  const A = C.aboutMBM;
  const gallery = ['beach-meditation', 'services-event', 'chancy-yoga-garden', 'dubai-split', 'sunrise-run-square', 'kids-yoga-park', 'workshop-nutrition', 'sunset-tree-pose'];
  return `
${pageHero(r, { eyebrow: A.missionLabel, title: A.mission, text: A.belief, imgName: 'beach-meditation', crumbs: [{ label: 'About us' }] })}
<section class="section">
  <div class="container split-2">
    <div data-reveal>${videoCard(r, site.introVideo, 'video-mind-body-10min', 'Watch: Mind & Body Movement')}</div>
    <div data-reveal style="--d:.1s">
      <p class="eyebrow">${A.title}</p>
      <h2 class="h-display">${A.text}</h2>
      <p>${A.wellness}</p>
      <div class="founder">
        ${img(r, 'letchance-ngassa', site.owner, { cls: 'founder__img', sizes: '72px' })}
        <div><strong>${site.owner}</strong><span>Founder · Wealthy Mind &amp; Body</span></div>
      </div>
    </div>
  </div>
</section>
<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">How we work</p>
      <h2 class="h-display">${A.approachTitle}</h2>
      <p>${A.approach}</p>
    </div>
    <div class="pillars">
      ${A.pillars.map((p, i) => `
      <article class="pillar" data-reveal style="--d:${i * 0.1}s">
        <div class="pillar__img">${img(r, p.img, p.title, { sizes: '(min-width: 900px) 33vw, 100vw' })}</div>
        <h3>${p.title}</h3><p>${p.text}</p>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Moments</p><h2 class="h-display">Life at MBM</h2></div>
    <div class="gallery">
      ${gallery.map((g, i) => `<button class="gallery__item" data-lightbox="${r}assets/img/${g}.webp" data-reveal style="--d:${(i % 4) * 0.06}s" aria-label="Enlarge photo">${img(r, g, '', { sizes: '(min-width: 900px) 25vw, 50vw' })}</button>`).join('')}
    </div>
  </div>
</section>
<section class="section section--forest">
  <div class="container split-2">
    <div data-reveal>
      <p class="eyebrow eyebrow--light">${site.tagline}</p>
      <h2 class="h-display">${A.closing}</h2>
      <p>${site.about}</p>
      <div class="btn-row">${btn(r + 'booking/', 'Book a session', 'btn btn--rose')}${btn(r + 'services/', 'Explore services', 'btn btn--ghost-light')}</div>
    </div>
    <div class="rounded-img" data-reveal style="--d:.1s">${img(r, A.closingImg, 'A healthy workshop buffet', { sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
  </div>
</section>`;
}

function servicesPage(r) {
  const S = C.services;
  return `
${pageHero(r, { eyebrow: 'Services', title: 'Holistic wellness for every body', text: S.intro, imgName: 'family-yoga-park', crumbs: [{ label: 'Services' }] })}
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Our services · ${site.audience}</p><h2 class="h-display">How we work together</h2></div>
    <div class="svc-menu">
      ${C.serviceMenu.map((m, i) => `
      <article class="svc" id="${m.id}" data-reveal style="--d:${(i % 3) * 0.08}s">
        <div class="svc__img">${img(r, m.img, m.title, { sizes: '(min-width: 900px) 33vw, 100vw' })}</div>
        <div class="svc__body">
          <span class="icon-badge">${icon(m.icon)}</span>
          <h3>${m.title}</h3>
          <p>${m.text}</p>
          <a class="link-arrow" href="${r}booking/?service=${encodeURIComponent(m.title)}">Book ${m.title} ${icon('arrow')}</a>
        </div>
      </article>`).join('')}
    </div>
    <div class="service-pills" data-reveal>${S.list.map((l) => `<span class="chip chip--lg">${icon('lotus')} ${l}</span>`).join('')}</div>
    ${S.items.map((it, i) => `
    <article class="service-row${i % 2 ? ' service-row--rev' : ''}">
      <div class="service-row__img" data-reveal>${img(r, it.img, it.title, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
      <div class="service-row__body" data-reveal style="--d:.1s">
        <span class="service-row__num">0${i + 1}</span>
        <h2 class="h-display">${it.title}</h2>
        <p>${it.text}</p>
        ${btn(r + 'booking/?service=' + encodeURIComponent(it.title), 'Book now', 'btn btn--outline')}
      </div>
    </article>`).join('')}
  </div>
</section>
<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">${C.offer.eyebrow}</p><h2 class="h-display">${S.solutionsTitle}</h2></div>
    <div class="solutions">
      ${S.solutions.map((s, i) => `
      <a class="solution" href="${r}${s.href}" data-reveal style="--d:${i * 0.1}s">
        ${img(r, s.img, '', { sizes: '(min-width: 900px) 33vw, 100vw' })}
        <div class="solution__body"><h3>${s.title}</h3><span class="link-arrow">${s.cta} ${icon('arrow')}</span></div>
      </a>`).join('')}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Classes & schedule</p><h2 class="h-display">${C.classes.title}</h2><p>${C.classes.text}</p></div>
    <div class="classes__grid">
      ${C.classes.items.map((c, i) => `
      <article class="class-card" data-reveal style="--d:${i * 0.1}s">
        <div class="class-card__img">${img(r, c.img, c.title, { sizes: '(min-width: 900px) 33vw, 100vw' })}</div>
        <div class="class-card__body">
          <div class="chips">${c.days ? `<span class="chip">${icon('calendar')} ${c.days}</span>` : ''}<span class="chip">${icon('clock')} ${c.hours}</span></div>
          <h3>${c.title}</h3><p>${c.text}</p>
          <a class="link-arrow" href="${r}booking/?service=${encodeURIComponent(c.title)}">Book this class ${icon('arrow')}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>
${servicesExtras(r)}
<section class="section section--forest">
  <div class="container split-2">
    <div class="rounded-img rounded-img--tall" data-reveal>${img(r, S.youtubeImg, 'Mindset coaching class', { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    <div data-reveal style="--d:.1s">
      <p class="eyebrow eyebrow--light">Daily practice</p>
      <h2 class="h-display">${S.youtube}</h2>
      <div class="yt-links">
        <a class="yt-link" href="${site.youtube.daily}" target="_blank" rel="noopener">${icon('youtube')}<span><strong>Leechance Ngassa</strong>Daily MBM practice</span></a>
        <a class="yt-link" href="${site.youtube.mindset}" target="_blank" rel="noopener">${icon('youtube')}<span><strong>Mindset with Leechance</strong>Mindset coaching</span></a>
        <a class="yt-link" href="${site.youtube.kids}" target="_blank" rel="noopener">${icon('youtube')}<span><strong>Leechance Kids Yoga</strong>Children’s yoga</span></a>
        <a class="yt-link" href="${site.youtube.main}" target="_blank" rel="noopener">${icon('youtube')}<span><strong>Lee Chance Yoga</strong>Yoga classes</span></a>
      </div>
    </div>
  </div>
</section>`;
}

function bookingPage(r) {
  const B = C.booking;
  const options = [...C.serviceMenu.map((m) => m.title), ...C.home.programs.map((p) => p.title), 'Live Evening Classes', 'Community Membership', ...C.services.list, ...C.classes.items.map((c) => c.title), 'Private and Group Sessions', 'Mind and Body Fit', 'Workshop / Retreat', 'Other']
    .filter((v, i, a) => a.indexOf(v) === i);
  return `
${pageHero(r, { eyebrow: 'Booking', title: B.title, text: B.paragraphs[0], imgName: 'meditation-sunset', crumbs: [{ label: 'Booking' }] })}
<section class="section">
  <div class="container booking">
    <aside class="booking__aside" data-reveal>
      ${B.paragraphs.slice(1).map((p) => `<p>${p}</p>`).join('')}
      <ul class="info-list">
        <li>${icon('clock')}<span><strong>Hours</strong>Tuesdays – Saturdays, 8:30 – 17:00</span></li>
        <li>${icon('pin')}<span><strong>Where</strong>${site.location} — ${site.locationNote.toLowerCase()}. Online worldwide.</span></li>
        <li>${icon('phone')}<span><strong>Call</strong><a href="tel:${site.phone}">${site.phoneDisplay}</a></span></li>
      </ul>
    </aside>
    <form class="form card" data-booking novalidate>
      <h2 class="h-display">Request your session</h2>
      <p class="form__hint">Fill in the details and send your request instantly by WhatsApp or email. We’ll confirm your time personally.</p>
      <fieldset class="form__row">
        <legend>Name <span aria-hidden="true">*</span></legend>
        <label class="field"><input name="first" autocomplete="given-name" required placeholder=" "><span>First</span></label>
        <label class="field"><input name="last" autocomplete="family-name" required placeholder=" "><span>Last</span></label>
      </fieldset>
      <div class="form__row">
        <label class="field"><input name="phone" type="tel" autocomplete="tel" required placeholder=" " pattern="[+0-9 ()-]{7,}"><span>Phone *</span></label>
        <label class="field"><input name="email" type="email" autocomplete="email" required placeholder=" "><span>Email *</span></label>
      </div>
      <label class="field field--select"><select name="service" required>
        <option value="" disabled selected hidden></option>
        ${options.map((o) => `<option>${esc(o)}</option>`).join('')}
      </select><span>Service *</span></label>
      <div class="form__row">
        <label class="field"><input name="date" type="date" required><span class="field__static">Date *</span></label>
        <fieldset class="times">
          <legend>Select *</legend>
          ${B.times.map((t, i) => `<label class="time"><input type="radio" name="time" value="${t}" ${i === 0 ? 'required' : ''}><span>${t}</span></label>`).join('')}
        </fieldset>
      </div>
      <label class="field"><textarea name="notes" rows="4" placeholder=" "></textarea><span>Special notes</span></label>
      <p class="form__error" role="alert"></p>
      <div class="btn-row">
        <button class="btn btn--primary" type="submit" data-via="whatsapp">${icon('whatsapp')}<span>Send via WhatsApp</span></button>
        <button class="btn btn--outline" type="submit" data-via="email">${icon('mail')}<span>Send via email</span></button>
      </div>
    </form>
  </div>
</section>`;
}

function shopPage(r) {
  const S = C.shop;
  const digitalPosts = C.posts.filter((p) => p.type !== 'Article');
  return `
${pageHero(r, { eyebrow: 'Shop · Coming soon', title: S.title, text: S.text, imgName: 'shop-collage', crumbs: [{ label: 'Shop' }] })}
<section class="section">
  <div class="container">
    <div class="notify card" data-reveal>
      <div>
        <h2 class="h-display">Be first through the door</h2>
        <p>Leave your email and we’ll let you know the moment the store opens.</p>
      </div>
      <form class="notify__form" data-notify>
        <label class="field"><input type="email" name="email" required placeholder=" " autocomplete="email"><span>Your email</span></label>
        <button class="btn btn--primary" type="submit"><span>Notify me</span>${icon('arrow')}</button>
      </form>
    </div>
    <div class="stores">
      ${shopLinks.map((l, i) => `
      <a class="store" id="${i === 0 ? 'physical-products' : 'digital-products'}" href="${linkHref(r, l)}"${l.ext ? linkAttrs(l) : ''} data-reveal style="--d:${i * 0.1}s">
        ${img(r, i === 0 ? 'fresh-juices' : 'yoga-childs-pose', '', { sizes: '(min-width: 900px) 50vw, 100vw' })}
        <span class="store__body">
          <span class="tag">${l.note}</span>
          <strong>${l.label}</strong>
          <span>${i === 0 ? 'Wellness products and Be Fit &amp; Flex active wear' : 'Ebooks, guided programs and online classes'}</span>
          <span class="link-arrow">${l.ext ? `Shop on ${l.note}` : `${l.note} store opening soon`} ${icon('arrow')}</span>
        </span>
      </a>`).join('')}
    </div>
    <div class="cats">
      ${S.categories.map((c, i) => `
      <a class="cat" id="${c.id}" href="#${c.id}" data-reveal style="--d:${i * 0.08}s">
        ${img(r, c.img, '', { sizes: '(min-width: 900px) 25vw, 50vw' })}
        <span class="cat__body"><span class="tag">Coming soon</span><strong>${c.title}</strong></span>
      </a>`).join('')}
    </div>
  </div>
</section>
<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Sneak peek</p><h2 class="h-display">A preview of what’s coming</h2></div>
    <div class="products">
      ${S.products.map((p, i) => `
      <article class="product" data-reveal style="--d:${i * 0.1}s">
        <div class="product__img">${img(r, p.img, p.name, { sizes: '300px' })}</div>
        <div class="product__body">
          <p class="meta">${S.categories.find((c) => c.id === p.category).title}</p>
          <h3>${p.name}</h3>
          <p>${p.text}</p>
          ${p.more ? `<p class="muted">${p.more}</p>` : ''}
          <div class="product__foot">
            <span class="price">${p.price ? `${p.price.toFixed(2)} AED` : 'Price soon'}</span>
            <a class="btn btn--outline btn--sm" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi! I’m interested in the ${p.name}.`)}" target="_blank" rel="noopener"><span>Enquire</span></a>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Free while you wait</p><h2 class="h-display">${S.digitalTitle}</h2></div>
    <div class="posts-grid posts-grid--2">${digitalPosts.map((p, i) => postCard(r, p, i)).join('')}</div>
  </div>
</section>`;
}

function blogPage(r) {
  const types = ['All', ...new Set(C.posts.map((p) => p.type))];
  return `
${pageHero(r, { eyebrow: 'Blog', title: 'Stories, practices & daily inspiration', text: 'Articles, guided movement and mindset quotes from Mind and Body Movement.', imgName: 'blog-cover', crumbs: [{ label: 'Blog' }] })}
<section class="section">
  <div class="container">
    <div class="blog-tools" data-reveal>
      <div class="seg" role="radiogroup" aria-label="Filter posts">
        ${types.map((t, i) => `<button role="radio" aria-checked="${i === 0}" data-filter="${t}">${t}</button>`).join('')}
      </div>
      <label class="search">${icon('search')}<input type="search" placeholder="Search posts…" aria-label="Search posts" data-search-input></label>
    </div>
    <div class="posts-grid" data-posts>${C.posts.map((p, i) => postCard(r, p, i)).join('')}</div>
    <p class="empty" hidden>No posts match your search. Try another word.</p>
  </div>
</section>`;
}

function postPage(r, p) {
  const idx = C.posts.indexOf(p);
  const related = C.posts.filter((x) => x !== p).slice(0, 3);
  const prev = C.posts[idx + 1];
  const next = C.posts[idx - 1];
  const url = `${site.url}/blog/${p.slug}/`;
  const body = p.body.map((b) => {
    if (b[0] === 'p') return `<p>${b[1]}</p>`;
    if (b[0] === 'h') return `<h2>${b[1]}</h2>`;
    if (b[0] === 'video') return `<div class="post__video">${videoCard(r, b[1], p.cover, 'Play video')}</div>`;
    if (b[0] === 'img') return `<figure><button class="post__img" data-lightbox="${r}assets/img/${b[1]}.webp" aria-label="Enlarge image">${img(r, b[1], b[2] || '', { sizes: '(min-width: 800px) 760px, 100vw' })}</button></figure>`;
    return '';
  }).join('\n');
  return `
<article class="post">
  <header class="post__head">
    <div class="container container--narrow">
      <nav class="crumbs crumbs--dark" aria-label="Breadcrumb"><a href="${r}">Home</a><span>/</span><a href="${r}blog/">Blog</a><span>/</span><span aria-current="page">${p.title}</span></nav>
      <p class="meta" data-reveal><span class="tag tag--solid">${p.type}</span> <time datetime="${p.date}">${fmtDate(p.date)}</time>${p.type === 'Article' ? ` · ${readMins(p)} min read` : ''}</p>
      <h1 class="h-display split" data-reveal>${p.title}</h1>
      <p class="post__by" data-reveal>${img(r, 'letchance-ngassa', '', { sizes: '40px' })} By ${site.owner}</p>
    </div>
  </header>
  <div class="container container--narrow post__body">
    ${body}
    <div class="share">
      <span>Share</span>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Share on Facebook">${icon('facebook')}</a>
      <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}" target="_blank" rel="noopener" aria-label="Share on X">${icon('x')}</a>
      <a href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + url)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">${icon('whatsapp')}</a>
      <button data-copy="${url}" aria-label="Copy link">${icon('copy')}</button>
    </div>
    <nav class="post-nav" aria-label="More posts">
      ${prev ? `<a href="${r}blog/${prev.slug}/"><span>← Previous</span>${prev.title}</a>` : '<span></span>'}
      ${next ? `<a class="post-nav__next" href="${r}blog/${next.slug}/"><span>Next →</span>${next.title}</a>` : ''}
    </nav>
  </div>
</article>
<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal><p class="eyebrow">Keep reading</p><h2 class="h-display">You may also like</h2></div>
    <div class="posts-grid">${related.map((x, i) => postCard(r, x, i)).join('')}</div>
  </div>
</section>`;
}

function faqPage(r) {
  return `
${pageHero(r, { eyebrow: 'FAQ', title: C.faq.title, text: 'Everything you need to know about booking, digital products and our shop.', imgName: 'seedling-hands', crumbs: [{ label: 'FAQ' }] })}
<section class="section">
  <div class="container container--narrow">
    <div class="faq">
      ${C.faq.items.map((f, i) => `
      <details class="faq__item" data-reveal style="--d:${i * 0.08}s"${i === 0 ? ' open' : ''}>
        <summary><span>${f.q}</span><span class="faq__icon">${icon('plus')}</span></summary>
        <div class="faq__a"><p>${f.a}</p></div>
      </details>`).join('')}
    </div>
    <div class="faq__more card" data-reveal>
      <div><h2 class="h-display">${C.faq.cta}</h2><p>Still have a question? We’re a message away.</p></div>
      <div class="btn-row">${btn(r + 'booking/', 'Book Now')}${btn(r + 'contact/', 'Contact us', 'btn btn--outline')}</div>
    </div>
  </div>
</section>`;
}

function contactPage(r) {
  return `
${pageHero(r, { eyebrow: 'Contacts', title: 'Let’s talk wellness', text: C.contactPage.text.replace(/ at$/, '.'), imgName: 'sunset-tree-pose', crumbs: [{ label: 'Contacts' }] })}
<section class="section">
  <div class="container contact">
    <div class="contact__cards">
      <a class="contact-card" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-reveal>${icon('whatsapp')}<strong>WhatsApp</strong><span>${site.phoneDisplay}</span></a>
      <a class="contact-card" href="tel:${site.phone}" data-reveal style="--d:.06s">${icon('phone')}<strong>Call</strong><span>${site.phoneDisplay}</span></a>
      ${site.emails.map((e, i) => `<div class="contact-card" data-reveal style="--d:${0.12 + i * 0.06}s">${icon('mail')}<strong>Email</strong><a href="mailto:${e}">${e}</a><button class="copy-btn" data-copy="${e}" aria-label="Copy ${e}">${icon('copy')} Copy</button></div>`).join('')}
      <div class="contact-card contact-card--wide" data-reveal style="--d:.3s">${icon('pin')}<strong>${site.location}</strong><span>${site.locationNote}. Online around the world.</span></div>
    </div>
    <form class="form card" data-contact novalidate>
      <h2 class="h-display">Send a message</h2>
      <div class="form__row">
        <label class="field"><input name="name" required autocomplete="name" placeholder=" "><span>Your name *</span></label>
        <label class="field"><input name="email" type="email" required autocomplete="email" placeholder=" "><span>Email *</span></label>
      </div>
      <label class="field"><textarea name="message" rows="5" required placeholder=" "></textarea><span>How can we help? *</span></label>
      <p class="form__error" role="alert"></p>
      <div class="btn-row">
        <button class="btn btn--primary" type="submit" data-via="whatsapp">${icon('whatsapp')}<span>Send via WhatsApp</span></button>
        <button class="btn btn--outline" type="submit" data-via="email">${icon('mail')}<span>Send via email</span></button>
      </div>
      <div class="social social--dark"><span>Follow along</span>${socialLinks()}</div>
    </form>
  </div>
</section>`;
}

function privacyPage(r) {
  return `
${pageHero(r, { eyebrow: 'Legal', title: 'Privacy Policy', imgName: 'seedling-hands', crumbs: [{ label: 'Privacy Policy' }] })}
<section class="section">
  <div class="container container--narrow prose">
    ${C.privacy.map(([h, p, list]) => `${h ? `<h2>${h}</h2>` : ''}<p>${p}${h.startsWith('8') ? ` Email <a href="mailto:${site.emails[0]}">${site.emails[0]}</a> or call <a href="tel:${site.phone}">${site.phoneDisplay}</a>.` : ''}</p>${list ? `<ul>${list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}`).join('\n')}
  </div>
</section>`;
}

function notFound(r) {
  return `
<section class="nf">
  <div class="container nf__in">
    <p class="eyebrow">404</p>
    <h1 class="h-display">This page took a deep breath and drifted away.</h1>
    <p>Let’s get you back to balance.</p>
    <div class="btn-row">${btn(r, 'Back home')}${btn(r + 'blog/', 'Read the blog', 'btn btn--outline')}</div>
  </div>
</section>`;
}

/* ---------------- write ---------------- */
function write(rel, html) {
  if (PREVIEW && rel.endsWith('.html')) {
    html = html.replace(/href="(\.{1,2}\/[^"]*|[a-z0-9-]+\/[^"]*|)"/g, (m, u) => {
      if (/^(https?:|mailto:|tel:|#)/.test(u) || u.includes('assets/')) return m;
      const cut = u.search(/[?#]/);
      const [p, rest] = cut < 0 ? [u, ''] : [u.slice(0, cut), u.slice(cut)];
      return p === '' || p.endsWith('/') ? `href="${p}index.html${rest}"` : m;
    });
  }
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
const depthOf = (rel) => rel.split('/').length - 1;
const rootFor = (rel) => '../'.repeat(depthOf(rel)) || './';

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(SRC, 'assets'), path.join(OUT, 'assets'), { recursive: true });

const pages = [
  ['index.html', '', 'home', home],
  ['about/index.html', 'About us', 'about', about],
  ['services/index.html', 'Services', 'services', servicesPage],
  ['booking/index.html', 'Book a Session', '', bookingPage],
  ['shop/index.html', 'Shop', 'shop', shopPage],
  ['blog/index.html', 'Blog', 'blog', blogPage],
  ['faq/index.html', 'FAQ', 'faq', faqPage],
  ['contact/index.html', 'Contacts', 'contact', contactPage],
  ['privacy/index.html', 'Privacy Policy', '', privacyPage],
];
for (const [rel, title, key, fn] of pages) {
  const r = rootFor(rel);
  write(rel, layout({ r, title, key, body: fn(r), pathOut: rel }));
}
for (const p of C.posts) {
  const rel = `blog/${p.slug}/index.html`;
  const r = rootFor(rel);
  write(rel, layout({ r, title: p.title, key: 'blog', desc: excerpt(p), body: postPage(r, p), pathOut: rel, ogImg: p.cover }));
}
write('404.html', layout({ r: '', base: BASE, title: 'Page not found', body: notFound(''), pathOut: '404.html' }));

// Redirects from the old WordPress URLs, so existing links keep working.
const redirects = {
  'about-us': 'about/', reservations: 'booking/', 'contacts-2': 'contact/', contacts: 'contact/',
  'shop-2': 'shop/', ebooks: 'shop/#ebooks', 'be-fit-flex-active-wear': 'shop/#active-wear',
  'be-fit-flex-fitness-wear': 'shop/#active-wear', 'wellness-products': 'shop/#wellness',
  'digital-products': 'shop/#digital', 'digital-products-2': 'shop/#digital', 'mind-body-movements': 'contact/',
  'mindful-movement-coaching': '', privacy: null, '360-2': 'blog/mind-and-body-movements-10-minutes/',
  ...Object.fromEntries(C.posts.filter((p) => p.slug !== 'mind-and-body-movements-10-minutes').map((p) => [p.slug, `blog/${p.slug}/`])),
};
for (const [from, to] of Object.entries(redirects)) {
  if (to === null || PREVIEW) continue;
  const target = '../' + to;
  write(`${from}/index.html`, `<!doctype html><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex"><link rel="canonical" href="${site.url}/${to}"><meta http-equiv="refresh" content="0; url=${target}"><a href="${target}">Continue</a>`);
}

// SEO files
const urls = [...pages.map((p) => p[0]), ...C.posts.map((p) => `blog/${p.slug}/index.html`)].map((u) => site.url + '/' + u.replace(/index\.html$/, ''));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write('.nojekyll', '');

console.log(`Built ${pages.length + C.posts.length + 1} pages + ${Object.keys(redirects).length - 1} redirects → ${path.relative(process.cwd(), OUT) || OUT}`);
