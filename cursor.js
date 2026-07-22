/* ==========================================================================
   cursor.js
   Glowing dot + lagging ring cursor, magnetic buttons, hover distortion.
   ========================================================================== */
(function(){
  if(window.matchMedia('(hover: none)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx=0,my=0, rx=0,ry=0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop(){
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mouseover', e => {
    if(e.target.closest('a, button, .tilt, .masonry img, input[type=range]')){
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if(e.target.closest('a, button, .tilt, .masonry img, input[type=range]')){
      ring.classList.remove('hovering');
    }
  });

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width/2;
      const relY = e.clientY - rect.top - rect.height/2;
      gsap.to(btn, { x: relX*0.3, y: relY*0.4, duration:0.4, ease:'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)' });
    });
  });
})();
