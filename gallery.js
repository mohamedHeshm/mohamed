/* ==========================================================================
   gallery.js
   Populates the masonry layout (replace the placeholder URLs below with
   assets/images/*.jpg for the real engagement/wedding photos) and drives
   the lightbox open/close with a soft scale + fade transition.
   ========================================================================== */
window.Gallery = (function(){
  // Placeholder curated photos — swap for real photography in assets/images/
  const PHOTOS = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
    'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80'
  ];

  function init(){
    const grid = document.getElementById('masonry');
    if(!grid) return;

    PHOTOS.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.alt = 'لحظة من قصتنا';
      img.style.opacity = 0;
      grid.appendChild(img);
      img.addEventListener('load', () => {
        gsap.to(img, { opacity:1, duration:0.8, delay:i*0.05 });
      });
      img.addEventListener('click', () => openLightbox(src));
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', e => {
      if(e.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
  }

  function openLightbox(src){
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    box.classList.add('active');
    gsap.fromTo(img, { scale:0.9, opacity:0 }, { scale:1, opacity:1, duration:0.5, ease:'power3.out' });
  }
  function closeLightbox(){
    document.getElementById('lightbox').classList.remove('active');
  }

  return { init };
})();
