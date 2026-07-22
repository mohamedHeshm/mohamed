/* ==========================================================================
   music.js
   Ambient piano/strings loop control. Drop an mp3 at assets/music/ambient.mp3
   — the player degrades gracefully (silently) if no file is present.
   ========================================================================== */
window.Music = (function(){
  let audio, toggleBtn, volumeSlider, playing = false;

  function fadeTo(vol, duration=1200){
    const start = audio.volume;
    const startTime = performance.now();
    function step(now){
      const p = Math.min(1, (now - startTime) / duration);
      audio.volume = start + (vol - start) * p;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function play(){
    audio.play().then(() => {
      playing = true;
      fadeTo(parseFloat(volumeSlider.value));
      toggleBtn.classList.add('playing');
      toggleBtn.querySelector('i').className = 'fa-solid fa-pause';
    }).catch(() => { /* no audio source present — fail silently */ });
  }

  function pause(){
    fadeTo(0, 800);
    setTimeout(() => { if(!playing) return; audio.pause(); }, 850);
    playing = false;
    toggleBtn.classList.remove('playing');
    toggleBtn.querySelector('i').className = 'fa-solid fa-music';
  }

  function init(){
    audio = document.getElementById('bg-audio');
    toggleBtn = document.getElementById('music-toggle');
    volumeSlider = document.getElementById('music-volume');
    audio.volume = 0;

    toggleBtn.addEventListener('click', () => { playing ? pause() : play(); });
    volumeSlider.addEventListener('input', () => {
      if(playing) audio.volume = parseFloat(volumeSlider.value);
    });
  }

  return { init, play, pause, get isPlaying(){ return playing; } };
})();
