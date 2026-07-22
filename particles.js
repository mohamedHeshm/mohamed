/* ==========================================================================
   particles.js
   2D canvas rose-petal simulation: continuous fall, wind, mouse avoidance.
   Kept on a separate canvas (petals-canvas) layered above the Three.js
   background so it can use simple, cheap 2D draw calls at 60fps.
   ========================================================================== */
(function(){
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  let petals = [];
  let mouse = { x:-9999, y:-9999 };
  let windPhase = 0;
  let running = false;

  const COUNT = window.innerWidth < 700 ? 26 : 55;

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function makePetal(initial){
    const size = 8 + Math.random() * 14;
    return {
      x: Math.random() * window.innerWidth,
      y: initial ? Math.random() * window.innerHeight : -20 - Math.random()*200,
      size,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      vy: 0.4 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.3,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random()*0.01,
      hue: Math.random() > 0.5 ? 'rose' : 'gold',
      opacity: 0.55 + Math.random()*0.4
    };
  }

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x*DPR, p.y*DPR);
    ctx.rotate(p.rot);
    ctx.scale(DPR,DPR);
    const grad = ctx.createRadialGradient(0,0,0,0,0,p.size);
    if(p.hue === 'rose'){
      grad.addColorStop(0, `rgba(227,183,166,${p.opacity})`);
      grad.addColorStop(1, `rgba(150,90,80,0)`);
    } else {
      grad.addColorStop(0, `rgba(228,193,141,${p.opacity})`);
      grad.addColorStop(1, `rgba(180,140,80,0)`);
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0,-p.size);
    ctx.bezierCurveTo(p.size*0.8,-p.size*0.4, p.size*0.6,p.size*0.7, 0,p.size);
    ctx.bezierCurveTo(-p.size*0.6,p.size*0.7, -p.size*0.8,-p.size*0.4, 0,-p.size);
    ctx.fill();
    ctx.restore();
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,W,H);
    windPhase += 0.004;
    const windForce = Math.sin(windPhase) * 0.4;

    for(const p of petals){
      p.sway += p.swaySpeed;
      let vx = p.vx + windForce + Math.sin(p.sway)*0.3;
      let vy = p.vy;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const avoidRadius = 140;
      if(dist < avoidRadius){
        const force = (1 - dist/avoidRadius) * 2.2;
        vx += (dx/(dist||1)) * force;
        vy -= (dy/(dist||1)) * force * 0.4;
        p.rotSpeed = p.rotSpeed >= 0 ? p.rotSpeed + 0.01 : p.rotSpeed - 0.01;
      }

      p.x += vx;
      p.y += vy;
      p.rot += p.rotSpeed;

      if(p.y > window.innerHeight + 30){
        Object.assign(p, makePetal(false));
      }
      if(p.x < -30) p.x = window.innerWidth + 30;
      if(p.x > window.innerWidth + 30) p.x = -30;

      drawPetal(p);
    }
    requestAnimationFrame(step);
  }

  function init(){
    resize();
    petals = Array.from({length: COUNT}, () => makePetal(true));
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', e => {
      if(e.touches[0]){ mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    }, {passive:true});
  }

  window.Petals = {
    start(){
      if(running) return;
      running = true;
      canvas.style.transition = 'opacity 1.5s ease';
      canvas.style.opacity = 1;
      requestAnimationFrame(step);
    },
    stop(){ running = false; }
  };

  init();
})();
