/* ==========================================================================
   countdown.js
   Drives the glass-morphism flip clock toward the wedding date.
   ========================================================================== */
window.Countdown = (function(){
  function init(){
    const el = document.getElementById('flip-clock');
    if(!el) return;
    const target = new Date(el.dataset.target).getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-minutes');
    const secsEl = document.getElementById('cd-seconds');

    function pad(n){ return String(n).padStart(2,'0'); }

    function tick(){
      const now = Date.now();
      let diff = Math.max(0, target - now);

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      updateFlip(daysEl, pad(d));
      updateFlip(hoursEl, pad(h));
      updateFlip(minsEl, pad(m));
      updateFlip(secsEl, pad(s));
    }

    function updateFlip(node, value){
      if(node.textContent === value) return;
      node.textContent = value;
      if(window.gsap){
        gsap.fromTo(node, { rotateX:-90, opacity:0.4 }, { rotateX:0, opacity:1, duration:0.5, ease:'power2.out' });
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  return { init };
})();
