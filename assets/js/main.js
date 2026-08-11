/* Brugzicht — motion */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    /[?&]static=1/.test(window.location.search);
  if (/[?&]flat=1/.test(window.location.search)) {
    document.documentElement.classList.add('flat');
    reduce = true;
  }

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var onScroll = function () { nav.classList.toggle('vast', window.scrollY > 16); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  if (reduce || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* hero: books rise onto the shelf, then copy settles */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-boven', { y: 16, opacity: 0, duration: 0.8 }, 0.15)
    .from('.hero-titel .regel > span', { yPercent: 112, duration: 1, stagger: 0.13 }, 0.3)
    .from('.hero-sub, .hero-acties', { y: 20, opacity: 0, duration: 0.85, stagger: 0.13 }, 0.85)
    .from('.plank-hout', { scaleX: 0, transformOrigin: 'left center', duration: 0.7 }, 0.4)
    .from('.boek', { yPercent: 108, opacity: 0, duration: 0.75, stagger: 0.07, ease: 'back.out(1.4)' }, 0.7)
    .from('.plank-label', { opacity: 0, duration: 0.8 }, 1.6)
    .from('.service-strip span', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 1.3);
  /* vangnet: in verborgen tabs/previews tikt rAF niet — spring dan direct naar de eindstand,
     en forceer sowieso de eindstand als de intro na 4s nog niet klaar is */
  if (document.hidden) heroTl.progress(1);
  setTimeout(function () { if (heroTl.progress() < 1) heroTl.progress(1); }, 4000);

  /* idle: one book peeks now and then */
  var boeken = gsap.utils.toArray('.boek');
  gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 3 })
    .to(boeken[2], { y: -8, duration: 0.4, ease: 'power2.out' })
    .to(boeken[2], { y: 0, duration: 0.5, ease: 'bounce.out' }, '+=0.6');

  /* section reveals */
  gsap.utils.toArray('.kop.reveal, .intro.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 26, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });
  [['.kast-lijst li', '.kast-lijst'], ['.titel', '.titels'], ['.lezer', '.lezers'], ['.kerken-punten li', '.kerken-punten']].forEach(function (pair) {
    gsap.utils.toArray(pair[0]).forEach(function (el, i) {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 0.75, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: pair[1], start: 'top 85%', once: true }
      });
    });
  });
  gsap.from('.lezen-quote', {
    opacity: 0, y: 24, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.lezen-quote', start: 'top 88%', once: true }
  });
})();
