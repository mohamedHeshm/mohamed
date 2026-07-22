/* ==========================================================================
   animations.js
   All GSAP timelines: the black-screen cinematic intro, the 3D envelope
   opening choreography, and the per-letter Splitting.js text reveals used
   throughout the page.
   ========================================================================== */
window.Animations = (function(){

  function splitAll(){
    Splitting({ target:'[data-splitting]', by:'chars' });
    gsap.set('[data-splitting] .char', { opacity:0, y:24, filter:'blur(6px)' });
  }

  function revealChars(selector, opts={}){
    return gsap.to(`${selector} .char`, {
      opacity:1, y:0, filter:'blur(0px)',
      duration:0.9, stagger:opts.stagger ?? 0.025, ease:'power3.out',
      delay: opts.delay ?? 0
    });
  }

  /* ---------------- PRELOADER SEQUENCE ---------------- */
  function runPreloader(onDone){
    const tl = gsap.timeline();
    const introMat = window.ThreeScene.intro.mat;

    tl.to(introMat, { opacity:0.9, duration:2.2, ease:'power2.in' })
      .to('.crest', { opacity:1, duration:1.2, ease:'power2.out' }, '-=1.4')
      .to('.crest-svg', { scale:1.06, duration:2, ease:'sine.inOut', yoyo:true, repeat:-1 }, '<')
      .add(() => revealChars('.preloader-label', {stagger:0.04}), '-=0.6')
      .to('#preloader-fill', { width:'100%', duration:2.6, ease:'power1.inOut' }, '-=0.8')
      .to('.sound-permission', { opacity:1, pointerEvents:'auto', duration:1 }, '-=0.4');

    // Wait for explicit user gesture (autoplay policy + brief's "click to open" spirit)
    document.getElementById('sound-permission').addEventListener('click', function handler(){
      this.removeEventListener('click', handler);
      beginExit();
    }, { once:true });

    function beginExit(){
      const exitTl = gsap.timeline({ onComplete: onDone });
      exitTl
        .to('.sound-permission', { opacity:0, duration:0.4 })
        .to(introMat, { opacity:0, duration:1.2, ease:'power2.out' }, '<')
        .to('.preloader-content', { opacity:0, y:-20, duration:1, ease:'power2.in' }, '<0.2')
        .to('#preloader', {
          opacity:0, duration:1.6, ease:'power2.inOut',
          onComplete(){
            document.getElementById('preloader').style.display = 'none';
            window.ThreeScene.intro.stop();
          }
        }, '-=0.6');
    }
  }

  /* ---------------- ENVELOPE ENTRANCE (after preloader) ---------------- */
  function envelopeEntrance(){
    gsap.to('#bg-canvas, #petals-canvas', { opacity:1, duration:2 });
    window.Petals.start();

    const tl = gsap.timeline({ delay:0.2 });
    tl.to('.envelope', { opacity:1, scale:1, duration:1.6, ease:'power3.out' })
      .to('.open-btn', { opacity:1, duration:1, ease:'power2.out' }, '-=0.6')
      .to('.scroll-hint', { opacity:1, duration:1 }, '-=0.6');
  }

  /* ---------------- ENVELOPE OPEN CHOREOGRAPHY ---------------- */
  function openEnvelope(){
    const openBtn = document.getElementById('open-btn');
    openBtn.classList.add('hidden');

    const tl = gsap.timeline();

    // Wax seal cracks + fragments fly
    tl.to('.seal-crack', { opacity:1, duration:0.3, stagger:0.08 })
      .to('.seal', {
        scale:1.15, duration:0.25, ease:'power1.in'
      })
      .to('.seal', {
        scale:0, rotate:120, opacity:0, duration:0.6, ease:'power2.in'
      })
      // Flap rotates open in 3D
      .to('.env-flap', {
        rotateX:-165, duration:1.4, ease:'power3.inOut', transformPerspective:1200
      }, '-=0.2')
      // Camera-esque zoom via scene3d perspective/scale
      .to('.scene3d', { scale:1.08, duration:1.8, ease:'power2.out' }, '<')
      // Letter rises out of the envelope
      .to('.env-letter', { height:'92%', duration:1.2, ease:'power3.out' }, '-=0.9')
      .to('.envelope', { y:-40, duration:1.2, ease:'power2.out' }, '<')
      // Three folds unfurl independently, cascading
      .fromTo('.fold-1', { rotateX:-90, transformOrigin:'top center' }, { rotateX:0, duration:1, ease:'power3.out' }, '-=0.7')
      .fromTo('.fold-2', { rotateX:-70, opacity:0.6 }, { rotateX:0, opacity:1, duration:1, ease:'power3.out' }, '-=0.75')
      .fromTo('.fold-3', { rotateX:-50, opacity:0.4 }, { rotateX:0, opacity:1, duration:1, ease:'power3.out' }, '-=0.8')
      // Invitation copy shimmer-reveals letter by letter
      .add(() => {
        revealChars('.invite-copy .eyebrow', { stagger:0.02 });
        revealChars('.invite-copy .parent-name', { stagger:0.03 });
        revealChars('.invite-copy .closing-line', { stagger:0.02 });
      }, '-=0.4')
      .to('.heart-divider', { opacity:1, scale:1, duration:0.6, ease:'back.out(2)' }, '-=0.8');

    gsap.set('.heart-divider', { opacity:0, scale:0.4 });
  }

  /* ---------------- TITLE SECTION REVEAL ---------------- */
  function titleSection(){
    ScrollTrigger.create({
      trigger: '#title-reveal',
      start: 'top 70%',
      once:true,
      onEnter(){
        revealChars('.main-title', { stagger:0.05 });
        gsap.delayedCall(1.2, () => document.querySelector('.main-title').classList.add('shimmer-text'));
        revealChars('.name.bride', { stagger:0.04, delay:0.6 });
        revealChars('.name.groom', { stagger:0.04, delay:0.8 });
        gsap.to('.pulse', { opacity:1, duration:0.6, delay:0.9 });
        revealChars('.tagline', { stagger:0.015, delay:1 });
      }
    });
  }

  return { splitAll, revealChars, runPreloader, envelopeEntrance, openEnvelope, titleSection };
})();
