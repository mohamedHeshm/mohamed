/* ==========================================================================
   scroll.js
   Lenis smooth scroll driving GSAP's ticker, plus ScrollTrigger reveals
   for every .reveal-section and its inner elements.
   ========================================================================== */
window.SiteScroll = (function(){
  let lenis;

  function initLenis(){
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  function initReveals(){
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.reveal-section').forEach(section => {
      const els = section.querySelectorAll('.section-title, .detail-card, .flip-clock, .timeline-item, .masonry, .map-frame, .main-title, .couple-names, .tagline, .signature, .small-crest');
      gsap.set(els, { opacity:0, y:50 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => {
          gsap.to(els, {
            opacity:1, y:0, duration:1.1, stagger:0.12, ease:'power3.out'
          });
        },
        once:true
      });
    });

    // Tilt cards
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - 0.5;
        const py = (e.clientY - r.top)/r.height - 0.5;
        gsap.to(card, { rotateY: px*14, rotateX: -py*14, duration:0.4, ease:'power2.out', transformPerspective:600 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY:0, rotateX:0, duration:0.6, ease:'power3.out' });
      });
    });
  }

  return { initLenis, initReveals, get instance(){ return lenis; } };
})();
