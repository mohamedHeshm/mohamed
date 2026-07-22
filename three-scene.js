/* ==========================================================================
   three-scene.js
   Two lightweight Three.js scenes:
   1) Intro flythrough on #intro-canvas — camera drifts through gold dust
      while the site is fully black, before the crest/logo appears.
   2) Ambient background on #bg-canvas — a persistent field of soft gold
      particles + drifting "rose" glow sprites with fog and mouse parallax.
   Both use additive-blended sprite textures (generated on a canvas) rather
   than a full post-processing bloom pipeline, so the effect stays cheap
   and dependency-free while still reading as soft volumetric glow.
   ========================================================================== */
window.ThreeScene = (function(){

  function makeGlowTexture(colorInner, colorOuter){
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
    grad.addColorStop(0, colorInner);
    grad.addColorStop(0.4, colorOuter);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,size,size);
    return new THREE.CanvasTexture(c);
  }

  function makePetalTexture(){
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.translate(size/2, size/2);
    const grad = ctx.createRadialGradient(0,0,0,0,0,size/2);
    grad.addColorStop(0, 'rgba(227,183,166,0.9)');
    grad.addColorStop(1, 'rgba(227,183,166,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0,-size/2.2);
    ctx.bezierCurveTo(size/2.5,-size/6,size/3,size/2.5,0,size/2.2);
    ctx.bezierCurveTo(-size/3,size/2.5,-size/2.5,-size/6,0,-size/2.2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  /* ---------------- INTRO SCENE ---------------- */
  let intro = {};
  function initIntro(){
    const canvas = document.getElementById('intro-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0,0,18);

    const glowTex = makeGlowTexture('rgba(255,240,210,1)', 'rgba(212,175,122,0.6)');

    const count = window.innerWidth < 700 ? 500 : 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      positions[i*3] = (Math.random()-0.5) * 40;
      positions[i*3+1] = (Math.random()-0.5) * 40;
      positions[i*3+2] = (Math.random()-0.5) * 60;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));

    const mat = new THREE.PointsMaterial({
      size: 0.18,
      map: glowTex,
      transparent:true,
      depthWrite:false,
      blending: THREE.AdditiveBlending,
      color: 0xd4af7a,
      opacity: 0
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let raf;
    function animate(){
      raf = requestAnimationFrame(animate);
      points.rotation.y += 0.0006;
      camera.position.z -= 0.006;
      renderer.render(scene, camera);
    }
    animate();

    function resize(){
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);

    intro = { renderer, scene, camera, points, mat, stop(){ cancelAnimationFrame(raf); } };
  }

  /* ---------------- AMBIENT BACKGROUND SCENE ---------------- */
  let bg = {};
  function initBg(){
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x14100c, 0.018);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 200);
    camera.position.set(0,0,30);

    const glowTex = makeGlowTexture('rgba(255,240,210,1)', 'rgba(212,175,122,0.5)');
    const petalTex = makePetalTexture();

    // Layer 1: fine gold dust (parallax layer, far)
    const dustCount = window.innerWidth < 700 ? 260 : 500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount*3);
    for(let i=0;i<dustCount;i++){
      dustPos[i*3] = (Math.random()-0.5) * 80;
      dustPos[i*3+1] = (Math.random()-0.5) * 60;
      dustPos[i*3+2] = (Math.random()-0.5) * 60 - 20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos,3));
    const dustMat = new THREE.PointsMaterial({
      size:0.12, map:glowTex, transparent:true, depthWrite:false,
      blending:THREE.AdditiveBlending, color:0xd4af7a, opacity:0.5
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Layer 2: bokeh / lens-flare style larger soft lights (near, parallax stronger)
    const bokehCount = 26;
    const bokehGeo = new THREE.BufferGeometry();
    const bokehPos = new Float32Array(bokehCount*3);
    for(let i=0;i<bokehCount;i++){
      bokehPos[i*3] = (Math.random()-0.5) * 50;
      bokehPos[i*3+1] = (Math.random()-0.5) * 34;
      bokehPos[i*3+2] = (Math.random()-0.5) * 20 + 5;
    }
    bokehGeo.setAttribute('position', new THREE.BufferAttribute(bokehPos,3));
    const bokehMat = new THREE.PointsMaterial({
      size:1.6, map:glowTex, transparent:true, depthWrite:false,
      blending:THREE.AdditiveBlending, color:0xffe9c4, opacity:0.35
    });
    const bokeh = new THREE.Points(bokehGeo, bokehMat);
    scene.add(bokeh);

    // Layer 3: drifting rose-petal sprites in 3D space (the "floating roses")
    const roseCount = window.innerWidth < 700 ? 18 : 34;
    const roseGeo = new THREE.BufferGeometry();
    const rosePos = new Float32Array(roseCount*3);
    for(let i=0;i<roseCount;i++){
      rosePos[i*3] = (Math.random()-0.5) * 46;
      rosePos[i*3+1] = (Math.random()-0.5) * 30;
      rosePos[i*3+2] = (Math.random()-0.5) * 30;
    }
    roseGeo.setAttribute('position', new THREE.BufferAttribute(rosePos,3));
    const roseMat = new THREE.PointsMaterial({
      size:1.1, map:petalTex, transparent:true, depthWrite:false,
      blending:THREE.NormalBlending, opacity:0.8
    });
    const roses = new THREE.Points(roseGeo, roseMat);
    scene.add(roses);

    let target = { x:0, y:0 };
    let current = { x:0, y:0 };
    window.addEventListener('mousemove', e => {
      target.x = (e.clientX / window.innerWidth - 0.5);
      target.y = (e.clientY / window.innerHeight - 0.5);
    });

    let raf;
    const clock = new THREE.Clock();
    function animate(){
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.03;
      current.y += (target.y - current.y) * 0.03;

      camera.position.x = current.x * 4;
      camera.position.y = -current.y * 3;
      camera.lookAt(0,0,0);

      dust.rotation.y = t * 0.01;
      bokeh.position.x = current.x * 2.5;
      bokeh.position.y = -current.y * 2;
      roses.rotation.y = t * 0.02;
      roses.position.y = Math.sin(t*0.15) * 0.6;

      renderer.render(scene, camera);
    }
    animate();

    function resize(){
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);

    bg = { renderer, scene, camera, stop(){ cancelAnimationFrame(raf); } };
  }

  return {
    initIntro, initBg,
    get intro(){ return intro; },
    get bg(){ return bg; }
  };
})();
