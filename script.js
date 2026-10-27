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
  //    - Stage 0: 24,000 Particle Anatomical Humanoid Bust (Daniel Ingrassia Reference)
  //    - Interactive Celestial Glowing Light Orb with 3D Head Tilt & Dynamic Repulsion
  //    - Multi-Stage Scroll Morphing: Bust -> Spiral -> Wave -> Gyroscope -> Lattice -> Torus -> Grid -> Vortex
  //    - Smooth reverse scrolling back into humanoid bust
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

    // 24,000 fine stippled monochromatic particles for dense silhouette & fast morphing
    const particleCount = 24000;
    const positions = new Float32Array(particleCount * 3);
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

    // Allocate 8 distinct geometric stage target buffers
    const stageTargets = [
      new Float32Array(particleCount * 3), // 0: Anatomical Bust Silhouette
      new Float32Array(particleCount * 3), // 1: Logarithmic Spiral Formation
      new Float32Array(particleCount * 3), // 2: Undulating Wave Manifold
      new Float32Array(particleCount * 3), // 3: Concentric Orbital Gyroscope
      new Float32Array(particleCount * 3), // 4: Crystalline 3D Lattice
      new Float32Array(particleCount * 3), // 5: Flowing Torus
      new Float32Array(particleCount * 3), // 6: Planar Harmonic Grid
      new Float32Array(particleCount * 3)  // 7: Convergent Focal Vortex
    ];

    const stageLabels = [
      '00 // ANATOMICAL BUST',
      '01 // FORMATION SPIRAL',
      '02 // MANIFESTO WAVE',
      '03 // ORBITAL GYROSCOPE',
      '04 // 3D CUBIC LATTICE',
      '05 // FLOWING TORUS',
      '06 // HARMONIC GRID',
      '07 // CONVERGENT VORTEX'
    ];

    // ========================================================================
    // BUILD STAGE 0: Anatomical Humanoid Bust Silhouette (Daniel Ingrassia Reference)
    // ========================================================================
    const bustBuf = stageTargets[0];
    for (let i = 0; i < particleCount; i++) {
      let x = 0, y = 0, z = 0;
      let pSize = rand(1.1, 2.3);
      let pOpacity = rand(0.35, 0.95);

      const region = Math.random();

      if (region < 0.35) {
        // 1. Head & Facial Contour (Cranium, temples, jaw, chin, cheeks, nose, eye sockets)
        const vY = rand(0, 1);
        const curY = 0 + vY * 38;
        
        let radX, radZ;
        if (curY > 16) {
          const t = (curY - 16) / 22;
          radX = 21.5 * Math.sqrt(Math.max(0.01, 1.0 - Math.pow(t - 0.4, 2) * 1.5));
          radZ = 23.5 * Math.sqrt(Math.max(0.01, 1.0 - Math.pow(t - 0.3, 2) * 1.4));
        } else {
          const t = (curY - 0) / 16;
          radX = 8.5 + t * 13.0;
          radZ = 12.0 + t * 11.5;
        }

        const angle = rand(0, Math.PI * 2);
        const shell = Math.pow(Math.random(), 0.18);
        let px = Math.cos(angle) * radX * shell;
        let py = curY;
        let pz = Math.sin(angle) * radZ * shell;

        // Sculpt facial features in front quadrant (pz > 0)
        if (pz > 0) {
          if (curY > 18 && curY < 24 && Math.abs(px) < 14) {
            if (Math.abs(px) > 3 && Math.abs(px) < 11) pz -= 1.8;
            if (curY > 21) pz += 1.5 * Math.exp(-Math.pow(px / 6.0, 2));
          }
          if (curY >= 9 && curY <= 19 && Math.abs(px) < 4.5) {
            const noseProfile = Math.sin(((curY - 9) / 10) * Math.PI);
            pz += noseProfile * 4.8 * Math.exp(-Math.pow(px / 2.0, 2));
          }
          if (curY >= 5 && curY <= 8 && Math.abs(px) < 6) {
            pz += 1.4 * Math.exp(-Math.pow(px / 3.0, 2));
          }
          if (curY <= 4 && Math.abs(px) < 4.5) {
            pz += 2.6 * Math.exp(-Math.pow(px / 3.0, 2));
          }
        }

        if (curY > 12 && curY < 21 && Math.abs(px) > radX * 0.78 && Math.abs(pz) < 8) {
          px += (px > 0 ? 3.0 : -3.0) * rand(0.6, 1.2);
        }

        x = px + randGauss() * 0.7;
        y = py;
        z = pz + randGauss() * 0.7;

      } else if (region < 0.60) {
        // 2. Signature Textured Curly Hair Silhouette
        const h = rand(15, 48);
        const normH = (h - 15) / 33;
        const angle = rand(0, Math.PI * 2);

        const baseR = 21.0 + Math.sin(normH * Math.PI) * 5.2 + (normH > 0.7 ? (1.0 - normH) * 6.0 : 0);
        const curl = Math.sin(angle * 11.0 + h * 0.35) * 3.2 + Math.cos(angle * 18.0) * 2.2 + randGauss() * 1.5;
        const finalR = baseR + curl + rand(0, 3.8);

        let hx = Math.cos(angle) * finalR;
        let hy = h + randGauss() * 1.2;
        let hz = Math.sin(angle) * (finalR * 0.95);

        if (hz > 8 && hy < 24) hz *= 0.55;

        x = hx;
        y = hy;
        z = hz;
        pSize = rand(1.2, 2.5);

      } else if (region < 0.92) {
        // 3. Anatomical Neck, Trapezius Slope & Wide Shoulders
        const t = Math.random();
        y = 0 - t * 85;

        let spanX, depthZ;
        if (y > -16) {
          const neckProgress = -y / 16.0;
          spanX = 11.0 + neckProgress * 3.5;
          depthZ = 13.0 + neckProgress * 2.0;
        } else {
          const shoulderT = (-16 - y) / 69.0;
          const shoulderSpread = Math.pow(shoulderT, 0.75) * 105.0;
          spanX = 14.5 + shoulderSpread;
          depthZ = 19.0 * (1.0 - shoulderT * 0.25);
        }

        const side = Math.random() < 0.5 ? -1 : 1;
        const perimeterBias = Math.pow(Math.random(), 0.5);
        let sx = side * perimeterBias * spanX + randGauss() * 1.6;
        let sz = (Math.random() - 0.5) * depthZ * 2.0;

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

      bustBuf[i * 3] = x;
      bustBuf[i * 3 + 1] = y;
      bustBuf[i * 3 + 2] = z;

      // Initial positions start at bust
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = pSize;
      opacities[i] = pOpacity;
    }

    // ========================================================================
    // BUILD STAGE 1: Logarithmic Spiral Formation
    // ========================================================================
    const formBuf = stageTargets[1];
    for (let i = 0; i < particleCount; i++) {
      const u = i / particleCount;
      const angle = u * Math.PI * 18;
      const radius = 20 + Math.pow(u, 0.8) * 140;
      const y = (u - 0.5) * 130 + Math.sin(i * 0.2) * 18;
      formBuf[i * 3] = Math.cos(angle) * radius;
      formBuf[i * 3 + 1] = y;
      formBuf[i * 3 + 2] = Math.sin(angle) * radius * 0.75;
    }

    // ========================================================================
    // BUILD STAGE 2: Undulating Riemannian Wave Manifold (Manifesto)
    // ========================================================================
    const waveBuf = stageTargets[2];
    const gridCols = Math.floor(Math.sqrt(particleCount * 1.6));
    for (let i = 0; i < particleCount; i++) {
      const c = i % gridCols;
      const r = Math.floor(i / gridCols);
      const u = (c / gridCols - 0.5) * 270;
      const v = (r / gridCols - 0.5) * 180;
      const dist = Math.sqrt(u * u + v * v);
      const z = Math.sin(dist * 0.05) * 32 + Math.cos(u * 0.08) * 16;
      waveBuf[i * 3] = u;
      waveBuf[i * 3 + 1] = v;
      waveBuf[i * 3 + 2] = z;
    }

    // ========================================================================
    // BUILD STAGE 3: Concentric Orbital Gyroscope (Projects)
    // ========================================================================
    const gyroBuf = stageTargets[3];
    for (let i = 0; i < particleCount; i++) {
      const ring = i % 3;
      const angle = (i / particleCount) * Math.PI * 8;
      if (ring === 0) {
        gyroBuf[i * 3] = Math.cos(angle) * 105;
        gyroBuf[i * 3 + 1] = Math.sin(angle) * 20;
        gyroBuf[i * 3 + 2] = Math.sin(angle) * 105;
      } else if (ring === 1) {
        gyroBuf[i * 3] = Math.cos(angle) * 120;
        gyroBuf[i * 3 + 1] = Math.sin(angle) * 120;
        gyroBuf[i * 3 + 2] = Math.cos(angle * 2) * 30;
      } else {
        const phi = (i / particleCount) * Math.PI;
        const theta = (i * 2.39996) % (Math.PI * 2);
        const r = 85;
        gyroBuf[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        gyroBuf[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        gyroBuf[i * 3 + 2] = r * Math.cos(phi);
      }
    }

    // ========================================================================
    // BUILD STAGE 4: Crystalline 3D Cubic Lattice (Skills)
    // ========================================================================
    const latticeBuf = stageTargets[4];
    const side = Math.floor(Math.cbrt(particleCount));
    const spacing = 10.5;
    for (let i = 0; i < particleCount; i++) {
      const ix = i % side;
      const iy = Math.floor(i / side) % side;
      const iz = Math.floor(i / (side * side));
      latticeBuf[i * 3] = (ix - side / 2) * spacing;
      latticeBuf[i * 3 + 1] = (iy - side / 2) * spacing;
      latticeBuf[i * 3 + 2] = (iz - side / 2) * spacing;
    }

    // ========================================================================
    // BUILD STAGE 5: Flowing Torus (Education)
    // ========================================================================
    const torusBuf = stageTargets[5];
    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 2;
      const v = (i * 13.0) % (Math.PI * 2);
      const R = 95;
      const r = 32;
      torusBuf[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      torusBuf[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u) * 0.75;
      torusBuf[i * 3 + 2] = r * Math.sin(v) * 1.8;
    }

    // ========================================================================
    // BUILD STAGE 6: Planar Harmonic Grid (GitHub Matrix)
    // ========================================================================
    const gridBuf = stageTargets[6];
    const hCols = Math.floor(Math.sqrt(particleCount * 2.2));
    const hSpacing = 8.5;
    for (let i = 0; i < particleCount; i++) {
      const col = i % hCols;
      const row = Math.floor(i / hCols);
      gridBuf[i * 3] = (col - hCols / 2) * hSpacing;
      gridBuf[i * 3 + 1] = (row - 15) * hSpacing * 0.8;
      gridBuf[i * 3 + 2] = Math.sin(col * 0.35) * Math.cos(row * 0.35) * 28;
    }

    // ========================================================================
    // BUILD STAGE 7: Convergent Focal Vortex (Contact)
    // ========================================================================
    const vortexBuf = stageTargets[7];
    for (let i = 0; i < particleCount; i++) {
      const u = i / particleCount;
      const angle = u * Math.PI * 24;
      const rad = 8 + Math.pow(u, 1.4) * 145;
      const y = (u - 0.5) * 160;
      vortexBuf[i * 3] = Math.cos(angle) * rad;
      vortexBuf[i * 3 + 1] = y;
      vortexBuf[i * 3 + 2] = Math.sin(angle) * rad;
    }

    // Build Three.js Geometry & Shader Material
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
    let currentScrollFraction = 0;

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

      // Scroll Progress Calculation (Supports reverse scrolling smoothly)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScrollFraction = Math.min(1.0, Math.max(0.0, window.scrollY / maxScroll));
      currentScrollFraction += (targetScrollFraction - currentScrollFraction) * 0.08;

      // Determine Multi-Stage Interpolation
      const stageSpan = 7;
      const scaledProgress = currentScrollFraction * stageSpan;
      const stageA = Math.min(stageSpan - 1, Math.floor(scaledProgress));
      const stageB = Math.min(stageSpan, stageA + 1);
      const stageT = scaledProgress - stageA;
      const easeT = stageT * stageT * (3.0 - 2.0 * stageT);

      if (hudStageElem) {
        hudStageElem.textContent = stageLabels[stageA];
      }

      const targetA = stageTargets[stageA];
      const targetB = stageTargets[stageB];

      // Smooth lerp mouse tracking
      currentMouseX += (targetMouseX - currentMouseX) * 0.07;
      currentMouseY += (targetMouseY - currentMouseY) * 0.07;

      // Camera position adapts slightly per stage for dramatic framing
      camera.position.z = 205 + currentScrollFraction * 70;
      camera.position.y = 5 - currentScrollFraction * 15;

      // Portrait Head Tilt in Stage 0, transitioning into orbital rotation in later stages
      if (!prefersReducedMotion) {
        const landingInfluence = Math.max(0.0, 1.0 - currentScrollFraction * 3.0);
        particleSystem.rotation.y = (currentMouseX * 0.25 * landingInfluence) + (time * 0.06 + currentScrollFraction * Math.PI * 2.0) * (1.0 - landingInfluence * 0.85);
        particleSystem.rotation.x = -currentMouseY * 0.12 * landingInfluence;
      }

      // Animate Celestial Light Orb in Stage 0
      const orbFade = Math.max(0.0, 1.0 - currentScrollFraction * 3.0);
      orbCore.material.opacity = 0.98 * orbFade;
      orbHalo.material.opacity = 0.24 * orbFade;
      orbOuter.material.opacity = 0.07 * orbFade;

      if (orbFade > 0.01) {
        const targetOrbX = currentMouseX * 100;
        const targetOrbY = currentMouseY * 75;
        orbGroup.position.x += (targetOrbX - orbGroup.position.x) * 0.08;
        orbGroup.position.y += (targetOrbY - orbGroup.position.y) * 0.08;
        orbGroup.position.z = 20 + Math.sin(time * 2.2) * 5.5;
        orbHalo.scale.setScalar(1.0 + Math.sin(time * 3.6) * 0.16);
        orbOuter.scale.setScalar(1.0 + Math.cos(time * 2.6) * 0.12);
      }

      // Dynamic particle interpolation across stages with orb repulsion in Stage 0
      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array;
      const invMatrix = new THREE.Matrix4().copy(particleSystem.matrixWorld).invert();
      const localOrb = orbGroup.position.clone().applyMatrix4(invMatrix);

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const ax = targetA[idx];
        const ay = targetA[idx + 1];
        const az = targetA[idx + 2];
        const bx = targetB[idx];
        const by = targetB[idx + 1];
        const bz = targetB[idx + 2];

        let destX = ax + (bx - ax) * easeT;
        let destY = ay + (by - ay) * easeT;
        let destZ = az + (bz - az) * easeT;

        // In Stage 0, apply dynamic physical repulsion around celestial light orb
        if (orbFade > 0.08 && i % 2 === 0) {
          const dx = destX - localOrb.x;
          const dy = destY - localOrb.y;
          const dz = destZ - localOrb.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 1296 && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (36.0 - dist) / 36.0;
            destX += (dx / dist) * force * 16.0 * orbFade;
            destY += (dy / dist) * force * 16.0 * orbFade;
            destZ += (dz / dist) * force * 16.0 * orbFade;
          }
        }

        // Smooth momentum approach to target configuration
        posArr[idx] += (destX - posArr[idx]) * 0.12;
        posArr[idx + 1] += (destY - posArr[idx + 1]) * 0.12;
        posArr[idx + 2] += (destZ - posArr[idx + 2]) * 0.12;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  }

})();
