/* ==========================================================================
   main.js
   Entry point. Edit WEDDING_CONTENT below to personalize the invitation —
   every field maps directly to text already in index.html via data attrs
   where practical, and to the constants a developer would wire up next
   (SMS/WhatsApp RSVP links, real photos, real map query, etc).
   ========================================================================== */
const WEDDING_CONTENT = {
  bride: 'لمياء',
  groom: 'خالد',
  groomFather: 'وليد أحمد المنصور',
  brideFather: 'فيصل عبدالله السالم',
  date: '2026-11-12T20:00:00',
  venue: 'قاعة اللؤلؤة الذهبية، الرياض',
  mapQuery: 'Riyadh'
};

function applyContent(c){
  const set = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
  set('bride-name', c.bride);
  set('groom-name', c.groom);
  set('groom-father-name', c.groomFather);
  set('bride-father-name', c.brideFather);
  set('venue-name', c.venue);
  set('signature-line', `${c.bride} \u2661 ${c.groom}`);

  const clock = document.getElementById('flip-clock');
  if(clock) clock.dataset.target = c.date;

  const map = document.querySelector('.map-frame iframe');
  if(map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Single source of truth for personalization, applied before Splitting
  // reads the text nodes it needs to split into animated characters.
  applyContent(WEDDING_CONTENT);

  // Prep DOM-dependent libraries before anything animates
  Animations.splitAll();

  // Cinematic intro scene starts immediately on the black screen
  ThreeScene.initIntro();

  // Smooth scroll + scroll-triggered reveals are safe to wire up now;
  // they simply won't fire until the preloader hands off.
  SiteScroll.initLenis();
  SiteScroll.initReveals();

  Countdown.init();
  Gallery.init();
  Music.init();
  Animations.titleSection();

  Animations.runPreloader(() => {
    ThreeScene.initBg();
    Animations.envelopeEntrance();
    Music.play();
  });

  document.getElementById('open-btn').addEventListener('click', () => {
    Animations.openEnvelope();
  });
});
