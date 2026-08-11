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

  /* hero-entrance is pure CSS (zie style.css, html.anim). De schakelaar gaat pas om
     nadat twee echte animatieframes zijn getikt in een zichtbare tab — in verborgen
     tabs, previews en screenshots blijft de pagina dus gewoon in eindstand staan. */
  var armed = false;
  var arm = function () {
    if (armed || document.visibilityState !== 'visible') return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (armed || document.visibilityState !== 'visible') return;
        armed = true;
        document.documentElement.classList.add('anim');
        /* waakhond: sommige renderers (previews, screenshots) bevriezen de
           animatieklok terwijl timers doorlopen — is er na 3,5s nog geen enkele
           animatie afgerond, strip dan de klasse zodat alles in eindstand staat */
        var klaar = false;
        document.addEventListener('animationend', function () { klaar = true; }, { once: true });
        setTimeout(function () {
          if (!klaar) document.documentElement.classList.remove('anim');
        }, 3500);
      });
    });
  };
  arm();
  document.addEventListener('visibilitychange', arm);

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
