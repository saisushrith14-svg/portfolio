/**
 * ============================================================================
 * SWISS STYLE GENERATIVE ENGINE & INTERACTIONS — SAI SUSHRITH PORTFOLIO
 * Vanilla JavaScript (No Frameworks, No Three.js, Pure Native Canvas 2D)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Accessibility & Environment Diagnostics
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --------------------------------------------------------------------------
  // 2. Custom Desktop Cursor
  // --------------------------------------------------------------------------
  const cursor = document.getElementById('custom-cursor');
  if (cursor && !isTouchDevice) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Interactive element hover detection
    const interactiveElements = 'a, button, input, .project-card, .language-card, .objective-card, .activity-cell, .social-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        cursor.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        cursor.classList.remove('hovering');
      }
    });

    function updateCursor() {
      // Smooth lerp for outer ring
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
  }

  // --------------------------------------------------------------------------
  // 3. Navigation & Header Telemetry
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navItems = document.querySelectorAll('.desktop-nav .nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const sections = document.querySelectorAll('.portfolio-section, #landing');
  const hudStageElem = document.getElementById('hud-stage-name');
  const hudParticlesElem = document.getElementById('hud-particles-count');
  const canvasFpsElem = document.getElementById('canvas-fps');
  const headerFpsElem = document.getElementById('header-fps');

  // Mobile nav toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        mobileNav.setAttribute('hidden', '');
      } else {
        mobileNav.removeAttribute('hidden');
      }
    });

    // Close on navigation click
    mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileNav.setAttribute('hidden', '');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Section Observer for Active Nav State & HUD Stage Name
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const stageName = entry.target.getAttribute('data-stage') || (id === 'landing' ? '00 // ANATOMICAL BUST' : id.toUpperCase());

        if (hudStageElem) {
          hudStageElem.textContent = stageName;
        }

        // Update active class on nav links
        navItems.forEach(link => {
          const targetSection = link.getAttribute('data-section');
          if (targetSection === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavItems.forEach(link => {
          const targetSection = link.getAttribute('data-section');
          if (targetSection === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // --------------------------------------------------------------------------
  // 4. Deterministic Monochromatic GitHub Activity Grid
  // --------------------------------------------------------------------------
  const activityGrid = document.getElementById('activity-grid');
  if (activityGrid) {
    const totalWeeks = 38;
    const daysPerWeek = 7;
    const totalCells = totalWeeks * daysPerWeek;
    const shades = ['shade-0', 'shade-1', 'shade-2', 'shade-3', 'shade-4'];

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'activity-cell';

      // Deterministic pseudo-random generation
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const rand = seed - Math.floor(seed);

      let shadeIndex = 0;
      if (rand > 0.40) shadeIndex = 1;
      if (rand > 0.65) shadeIndex = 2;
      if (rand > 0.84) shadeIndex = 3;
      if (rand > 0.94) shadeIndex = 4;

      cell.classList.add(shades[shadeIndex]);
      cell.setAttribute('title', `Cadence Sample [Day ${i + 1}] — Activity Level ${shadeIndex}`);
      fragment.appendChild(cell);
    }
    activityGrid.appendChild(fragment);
  }

  // --------------------------------------------------------------------------
  // 5. Copy Email Clipboard Interaction
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-btn-text');
  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      const email = 'saisushrith14@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyText.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#10B981';
        copyBtn.style.borderColor = '#10B981';
        setTimeout(() => {
          copyText.textContent = 'Copy Email';
          copyBtn.style.backgroundColor = '';
          copyBtn.style.borderColor = '';
        }, 2200);
      }).catch(() => {
        copyText.textContent = 'saisushrith14@gmail.com';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. THREE.JS GENERATIVE PARTICLE ARTWORK ENGINE
  //    - 52,000 Particle Anatomical Humanoid Bust Silhouette (Daniel Ingrassia Reference)
  //    - Interactive Celestial Glowing Light Orb with 3D Head Tilt & Dynamic Repulsion
  //    - Scroll-linked progressive dispersion into architectural background
  // --------------------------------------------------------------------------
  const container = document.getElementById('threejs-particle-scene');
  if (container && typeof THREE !== 'undefined') {
    initThreeHumanoidBust();
  }

  function initThreeHumanoidBust() {
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 205);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 52,000 fine stippled monochromatic particles sculpting the human silhouette
    const particleCount = 52000;
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    if (hudParticlesElem) {
      hudParticlesElem.textContent = `PARTICLES: ${particleCount.toLocaleString()} VTX`;
    }

    function rand(min, max) { return min + Math.random() * (max - min); }
    function randGauss() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    // Sculpt accurate anatomical silhouette: cranium, face, curly hair crown, neck, trapezius, shoulders
    for (let i = 0; i < particleCount; i++) {
      let x = 0, y = 0, z = 0;
      let pSize = rand(1.0, 2.2);
      let pOpacity = rand(0.35, 0.95);

      const region = Math.random();

      if (region < 0.35) {
        // 1. ANATOMICAL HEAD & FACE (Cranium, temples, jaw, chin, cheeks, nose, eye sockets)
        const vY = rand(0, 1);
        const curY = 0 + vY * 38; // 0 to 38
        
        let radX, radZ;
        if (curY > 16) {
          // Cranium / upper face
          const t = (curY - 16) / 22;
          radX = 21.5 * Math.sqrt(Math.max(0.01, 1.0 - Math.pow(t - 0.4, 2) * 1.5));
          radZ = 23.5 * Math.sqrt(Math.max(0.01, 1.0 - Math.pow(t - 0.3, 2) * 1.4));
        } else {
          // Lower face, jawline & chin tapering down
          const t = (curY - 0) / 16;
          radX = 8.5 + t * 13.0;
          radZ = 12.0 + t * 11.5;
        }

        const angle = rand(0, Math.PI * 2);
        // Bias particles towards the visible silhouette surface shell
        const shell = Math.pow(Math.random(), 0.18);
        let px = Math.cos(angle) * radX * shell;
        let py = curY;
        let pz = Math.sin(angle) * radZ * shell;

        // Sculpt facial features in front quadrant (pz > 0)
        if (pz > 0) {
          // Eye sockets / Brow ridge
          if (curY > 18 && curY < 24 && Math.abs(px) < 14) {
            if (Math.abs(px) > 3 && Math.abs(px) < 11) {
              pz -= 1.8;
            }
            if (curY > 21) {
              pz += 1.5 * Math.exp(-Math.pow(px / 6.0, 2));
            }
          }

          // Nose bridge and tip
          if (curY >= 9 && curY <= 19 && Math.abs(px) < 4.5) {
            const noseProfile = Math.sin(((curY - 9) / 10) * Math.PI);
            pz += noseProfile * 4.8 * Math.exp(-Math.pow(px / 2.0, 2));
          }

          // Lips / Mouth
          if (curY >= 5 && curY <= 8 && Math.abs(px) < 6) {
            pz += 1.4 * Math.exp(-Math.pow(px / 3.0, 2));
          }

          // Chin projection
          if (curY <= 4 && Math.abs(px) < 4.5) {
            pz += 2.6 * Math.exp(-Math.pow(px / 3.0, 2));
          }
        }

        // Bilateral ears
        if (curY > 12 && curY < 21 && Math.abs(px) > radX * 0.78 && Math.abs(pz) < 8) {
          px += (px > 0 ? 3.0 : -3.0) * rand(0.6, 1.2);
        }

        x = px + randGauss() * 0.7;
        y = py;
        z = pz + randGauss() * 0.7;

      } else if (region < 0.60) {
        // 2. SIGNATURE TEXTURED CURLY HAIR SILHOUETTE
        const h = rand(15, 48);
        const normH = (h - 15) / 33;
        const angle = rand(0, Math.PI * 2);

        // Rounded crown envelope
        const baseR = 21.0 + Math.sin(normH * Math.PI) * 5.2 + (normH > 0.7 ? (1.0 - normH) * 6.0 : 0);
        // Distinct fractal curly stipple clusters
        const curl = Math.sin(angle * 11.0 + h * 0.35) * 3.2 + Math.cos(angle * 18.0) * 2.2 + randGauss() * 1.5;
        const finalR = baseR + curl + rand(0, 3.8);

        let hx = Math.cos(angle) * finalR;
        let hy = h + randGauss() * 1.2;
        let hz = Math.sin(angle) * (finalR * 0.95);

        // Keep face clear in front
        if (hz > 8 && hy < 24) {
          hz *= 0.55;
        }

        x = hx;
        y = hy;
        z = hz;
        pSize = rand(1.2, 2.5);

      } else if (region < 0.92) {
        // 3. ANATOMICAL NECK, TRAPEZIUS, CLAVICLES, SHOULDERS & CHEST
        const t = Math.random();
        y = 0 - t * 85;

        let spanX, depthZ;
        if (y > -16) {
          // Muscular cylindrical neck column
          const neckProgress = -y / 16.0;
          spanX = 11.0 + neckProgress * 3.5;
          depthZ = 13.0 + neckProgress * 2.0;
        } else {
          // Natural human shoulder slope
          const shoulderT = (-16 - y) / 69.0;
          const shoulderSpread = Math.pow(shoulderT, 0.75) * 105.0;
          spanX = 14.5 + shoulderSpread;
          depthZ = 19.0 * (1.0 - shoulderT * 0.25);
        }

        const side = Math.random() < 0.5 ? -1 : 1;
        const perimeterBias = Math.pow(Math.random(), 0.5);
        let sx = side * perimeterBias * spanX + randGauss() * 1.6;
        let sz = (Math.random() - 0.5) * depthZ * 2.0;

        // Clavicle ridge
        if (y < -14 && y > -26 && sz > 2) {
          sz += 2.8 * Math.sin(Math.min(1.0, Math.abs(sx) / 45.0) * Math.PI);
        }

        x = sx;
        z = sz;

      } else {
        // 4. Subtle ambient celestial particulate atmosphere
        x = rand(-135, 135);
        y = rand(-90, 115);
        z = rand(-70, 70);
        pSize = rand(0.8, 1.5);
        pOpacity = rand(0.15, 0.5);
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      sizes[i] = pSize;
      opacities[i] = pOpacity;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('customOpacity', new THREE.BufferAttribute(opacities, 1));

    const vertexShader = `
      attribute float size;
      attribute float customOpacity;
      varying float vOpacity;
      varying vec3 vPos;
      
      void main() {
        vOpacity = customOpacity;
        vPos = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (235.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vOpacity;
      varying vec3 vPos;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        // Crisp optical point with feathered stippled edge
        float alpha = smoothstep(0.5, 0.08, dist) * vOpacity;
        gl_FragColor = vec4(0.97, 0.98, 1.0, alpha);
      }
    `;

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // The Iconic Glowing Celestial Orb
    const orbGroup = new THREE.Group();
    const orbCore = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 })
    );
    const orbHalo = new THREE.Mesh(
      new THREE.SphereGeometry(7.5, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending })
    );
    const orbOuter = new THREE.Mesh(
      new THREE.SphereGeometry(15.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending })
    );
    orbGroup.add(orbCore);
    orbGroup.add(orbHalo);
    orbGroup.add(orbOuter);
    scene.add(orbGroup);

    // Initial position to right of head matching Daniel Ingrassia screenshot
    orbGroup.position.set(62, 36, 18);

    // Mouse Tracking
    let targetMouseX = 0.32;
    let targetMouseY = 0.18;
    let currentMouseX = 0.32;
    let currentMouseY = 0.18;

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetMouseX = (px - 0.5) * 2;
      targetMouseY = -(py - 0.5) * 2;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let lastFpsTime = performance.now();
    let frames = 0;

    function animate() {
      requestAnimationFrame(animate);

      if (document.hidden) return;

      const now = performance.now();
      frames++;
      if (now - lastFpsTime >= 1000) {
        const fps = Math.round((frames * 1000) / (now - lastFpsTime));
        if (canvasFpsElem) canvasFpsElem.textContent = `${fps} FPS`;
        if (headerFpsElem) headerFpsElem.textContent = `${fps} FPS`;
        frames = 0;
        lastFpsTime = now;
      }

      const time = clock.getElapsedTime();

      // Scroll Progress Calculation
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1.0, Math.max(0.0, window.scrollY / maxScroll));

      // Smooth lerp mouse tracking
      currentMouseX += (targetMouseX - currentMouseX) * 0.07;
      currentMouseY += (targetMouseY - currentMouseY) * 0.07;

      // 3D portrait head tilt & orientation (respecting reduced motion)
      if (!prefersReducedMotion) {
        particleSystem.rotation.y = currentMouseX * 0.25;
        particleSystem.rotation.x = -currentMouseY * 0.12;

        // Camera gentle travel on scroll
        camera.position.z = 205 + scrollFraction * 120;
        camera.position.y = 5 - scrollFraction * 25;
      }

      // Animate Celestial Light Orb
      const targetOrbX = currentMouseX * 100;
      const targetOrbY = currentMouseY * 75;
      orbGroup.position.x += (targetOrbX - orbGroup.position.x) * 0.08;
      orbGroup.position.y += (targetOrbY - orbGroup.position.y) * 0.08;
      orbGroup.position.z = 20 + Math.sin(time * 2.2) * 5.5;

      orbHalo.scale.setScalar(1.0 + Math.sin(time * 3.6) * 0.16);
      orbOuter.scale.setScalar(1.0 + Math.cos(time * 2.6) * 0.12);

      // Fade celestial orb slightly as user enters deep reading sections
      const orbFade = Math.max(0.1, 1.0 - scrollFraction * 2.5);
      orbCore.material.opacity = 0.98 * orbFade;
      orbHalo.material.opacity = 0.24 * orbFade;
      orbOuter.material.opacity = 0.07 * orbFade;

      // Dynamic particle interaction with light orb + scroll dispersion
      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array;
      const invMatrix = new THREE.Matrix4().copy(particleSystem.matrixWorld).invert();
      const localOrb = orbGroup.position.clone().applyMatrix4(invMatrix);

      const step = 3;
      const dispFactor = scrollFraction * 1.6;

      for (let i = 0; i < particleCount; i += step) {
        const idx = i * 3;
        const ix = initialPositions[idx];
        const iy = initialPositions[idx + 1];
        const iz = initialPositions[idx + 2];

        // Target position based on scroll dispersion
        let tx = ix;
        let ty = iy;
        let tz = iz;

        if (dispFactor > 0.001) {
          const disperser = Math.sin(i * 0.05 + time * 0.5) * 12.0;
          tx = ix + (ix * 0.8 + disperser) * dispFactor;
          ty = iy + (iy * 0.8 + disperser) * dispFactor;
          tz = iz + (iz * 0.8) * dispFactor;
        }

        const dx = posArr[idx] - localOrb.x;
        const dy = posArr[idx + 1] - localOrb.y;
        const dz = posArr[idx + 2] - localOrb.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        // Repulsion radius = 36 (active in landing/top phase)
        if (distSq < 1296 && distSq > 0.01 && scrollFraction < 0.3) {
          const dist = Math.sqrt(distSq);
          const force = (36.0 - dist) / 36.0;
          posArr[idx] += (dx / dist) * force * 1.8;
          posArr[idx + 1] += (dy / dist) * force * 1.8;
          posArr[idx + 2] += (dz / dist) * force * 1.8;
        } else {
          posArr[idx] += (tx - posArr[idx]) * 0.06;
          posArr[idx + 1] += (ty - posArr[idx + 1]) * 0.06;
          posArr[idx + 2] += (tz - posArr[idx + 2]) * 0.06;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  }

})();
