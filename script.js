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
  //    - 68,000 Particle Anatomical Human Bust Sculpture (Stitch Screen 1518cefe38b2431793d4e4540f9d8aab)
  //    - Loading Sequence: Dispersed Emergence -> Smooth Coalescence -> Landing Reveal -> Organic Idle Shimmer
  //    - Interactive Celestial Glowing Light Orb with 3D Head Tilt & Dynamic Physical Repulsion
  //    - Multi-Stage Scroll Morphing: Bust -> Spiral -> Wave -> Gyroscope -> Lattice -> Torus -> Grid -> Vortex
  //    - Seamless Reverse Scrolling reassembling the humanoid bust at top
  // --------------------------------------------------------------------------
  const container = document.getElementById('threejs-particle-scene');
  if (container && typeof THREE !== 'undefined') {
    initThreeHumanoidBust();
  }

  function initThreeHumanoidBust() {
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    // Camera positioned at z = 150 (field of view 46) so head occupies central upper viewport
    // and broad shoulders sweep across the lower viewport exactly like ingrassiadaniel.it
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 4, 150);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 68,000 fine stippled monochromatic particles for dense, unmistakable human anatomy
    const PARTICLE_COUNT = 68000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const initialPositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    if (hudParticlesElem) {
      hudParticlesElem.textContent = `PARTICLES: ${PARTICLE_COUNT.toLocaleString()} VTX`;
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
      targetPositions,                      // 0: Anatomical Bust Silhouette
      new Float32Array(PARTICLE_COUNT * 3), // 1: Logarithmic Spiral Formation
      new Float32Array(PARTICLE_COUNT * 3), // 2: Undulating Wave Manifold
      new Float32Array(PARTICLE_COUNT * 3), // 3: Concentric Orbital Gyroscope
      new Float32Array(PARTICLE_COUNT * 3), // 4: Crystalline 3D Lattice
      new Float32Array(PARTICLE_COUNT * 3), // 5: Flowing Torus
      new Float32Array(PARTICLE_COUNT * 3), // 6: Planar Harmonic Grid
      new Float32Array(PARTICLE_COUNT * 3)  // 7: Convergent Focal Vortex
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
    // BUILD STAGE 0: Anatomical Human Head & Shoulders Bust (Stitch Revised Specification)
    // ========================================================================
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let tx = 0, ty = 0, tz = 0;
      let pSize = rand(1.2, 2.4);
      let pOpacity = rand(0.45, 0.95);

      const region = Math.random();

      if (region < 0.28) {
        // 1. Head Cranium & Face Surface (y: 0 to 30)
        // Tapered anatomical skull: chin narrow at bottom, wide cranium/temples at top
        const curY = rand(0, 30);

        let radX, radZ;
        if (curY > 12) {
          // Upper cranium / brow / temples
          const t = (curY - 12) / 18.0;
          radX = 18.5 * Math.sqrt(Math.max(0.04, 1.0 - Math.pow(t - 0.45, 2) * 1.5));
          radZ = 20.0 * Math.sqrt(Math.max(0.04, 1.0 - Math.pow(t - 0.35, 2) * 1.4));
        } else {
          // Mandible jawline & chin tapering down
          const t = curY / 12.0;
          radX = 7.5 + t * 11.0;
          radZ = 10.5 + t * 9.5;
        }

        const angle = rand(0, Math.PI * 2);
        // Dense surface shell bias concentrates points on visible outer surface shell
        const shell = Math.pow(Math.random(), 0.16);
        let px = Math.cos(angle) * radX * shell;
        let py = curY;
        let pz = Math.sin(angle) * radZ * shell;

        // Sculpt facial plane features in front quadrant (pz > 0)
        if (pz > 0) {
          // Nose ridge peak around y = 8 to 18
          if (curY >= 8 && curY <= 18 && Math.abs(px) < 3.8) {
            const noseContour = Math.sin(((curY - 8) / 10.0) * Math.PI);
            pz += noseContour * 4.2 * Math.exp(-Math.pow(px / 1.8, 2));
          }
          // Chin prominence
          if (curY <= 4 && Math.abs(px) < 4.0) {
            pz += 2.2 * Math.exp(-Math.pow(px / 2.5, 2));
          }
          // Brow ridge
          if (curY >= 18 && curY <= 22 && Math.abs(px) < 12.0) {
            pz += 1.4 * Math.exp(-Math.pow(px / 6.0, 2));
          }
        }

        // Bilateral ears
        if (curY > 10 && curY < 19 && Math.abs(px) > radX * 0.78 && Math.abs(pz) < 7) {
          px += (px > 0 ? 3.0 : -3.0) * rand(0.5, 1.2);
        }

        tx = px + randGauss() * 0.65;
        ty = py;
        tz = pz + randGauss() * 0.65;

      } else if (region < 0.58) {
        // 2. Sculpted Natural Curly Hair Silhouette (Signature texture in Daniel Ingrassia's portrait)
        // Sits atop cranium and along back/sides: y = 14 up to 42
        const h = rand(14, 42);
        const normH = (h - 14) / 28.0;
        const angle = rand(0, Math.PI * 2);

        const baseR = 18.5 + Math.sin(normH * Math.PI) * 4.5 + (normH > 0.65 ? (1.0 - normH) * 5.0 : 0);
        // Fractal curl displacement
        const curl = Math.sin(angle * 12.0 + h * 0.4) * 3.5 + Math.cos(angle * 19.0) * 2.2 + randGauss() * 1.4;
        const finalR = baseR + curl + rand(0, 3.8);

        let hx = Math.cos(angle) * finalR;
        let hy = h + randGauss() * 1.2;
        let hz = Math.sin(angle) * (finalR * 0.95);

        // Keep face clear in front
        if (hz > 7 && hy < 22) {
          hz *= 0.5;
        }

        tx = hx;
        ty = hy;
        tz = hz;
        pSize = rand(1.3, 2.6);
        pOpacity = rand(0.5, 0.98);

      } else if (region < 0.95) {
        // 3. Anatomical Neck, Trapezius & Broad Deltoids (Shoulders & Upper Torso)
        // Neck: y = 0 down to -14
        // Shoulders: y = -14 down to -75 (stretches wide across lower screen)
        const t = Math.random();
        ty = 0 - t * 75;

        let spanX, depthZ;
        if (ty > -14) {
          // Neck column
          const neckP = -ty / 14.0;
          spanX = 9.5 + neckP * 3.0;
          depthZ = 11.5 + neckP * 2.0;
        } else {
          // Natural human shoulder slope flare into deltoids
          const shoulderT = (-14 - ty) / 61.0;
          // Ergonomic S-curve of shoulders spanning wide
          const shoulderSpread = Math.pow(shoulderT, 0.72) * 88.0;
          spanX = 12.5 + shoulderSpread;
          depthZ = 18.0 * (1.0 - shoulderT * 0.22);
        }

        const side = Math.random() < 0.5 ? -1 : 1;
        // Denser near silhouette perimeter
        const perimeterBias = Math.pow(Math.random(), 0.45);
        let sx = side * perimeterBias * spanX + randGauss() * 1.5;
        let sz = (Math.random() - 0.5) * depthZ * 2.0;

        // Clavicle / Collarbone contour
        if (ty < -12 && ty > -24 && sz > 2) {
          sz += 2.5 * Math.sin(Math.min(1.0, Math.abs(sx) / 40.0) * Math.PI);
        }

        tx = sx;
        tz = sz;

      } else {
        // 4. Subtle ambient celestial particulate atmosphere
        tx = rand(-110, 110);
        ty = rand(-70, 95);
        tz = rand(-50, 50);
        pSize = rand(0.8, 1.4);
        pOpacity = rand(0.12, 0.4);
      }

      // Target sculpture positions
      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;

      // Initial loading emergence positions (State A: Dispersed emergence)
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadDist = rand(15, 140);
      initialPositions[i * 3] = Math.cos(spreadAngle) * spreadDist + randGauss() * 20;
      initialPositions[i * 3 + 1] = Math.sin(spreadAngle) * spreadDist * 0.7 + randGauss() * 20;
      initialPositions[i * 3 + 2] = rand(-60, 60);

      // Start live position at initial dispersed state
      positions[i * 3] = initialPositions[i * 3];
      positions[i * 3 + 1] = initialPositions[i * 3 + 1];
      positions[i * 3 + 2] = initialPositions[i * 3 + 2];

      sizes[i] = pSize;
      opacities[i] = pOpacity;
      phases[i] = Math.random() * Math.PI * 2;
    }

    // ========================================================================
    // BUILD STAGE 1: Logarithmic Spiral Formation
    // ========================================================================
    const formBuf = stageTargets[1];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = i / PARTICLE_COUNT;
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
    const gridCols = Math.floor(Math.sqrt(PARTICLE_COUNT * 1.6));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ring = i % 3;
      const angle = (i / PARTICLE_COUNT) * Math.PI * 8;
      if (ring === 0) {
        gyroBuf[i * 3] = Math.cos(angle) * 105;
        gyroBuf[i * 3 + 1] = Math.sin(angle) * 20;
        gyroBuf[i * 3 + 2] = Math.sin(angle) * 105;
      } else if (ring === 1) {
        gyroBuf[i * 3] = Math.cos(angle) * 120;
        gyroBuf[i * 3 + 1] = Math.sin(angle) * 120;
        gyroBuf[i * 3 + 2] = Math.cos(angle * 2) * 30;
      } else {
        const phi = (i / PARTICLE_COUNT) * Math.PI;
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
    const side = Math.floor(Math.cbrt(PARTICLE_COUNT));
    const spacing = 7.5;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = (i / PARTICLE_COUNT) * Math.PI * 2;
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
    const hCols = Math.floor(Math.sqrt(PARTICLE_COUNT * 2.2));
    const hSpacing = 5.5;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = i / PARTICLE_COUNT;
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
        gl_PointSize = size * (230.0 / -mvPosition.z);
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
        
        // Crisp optical stipple point matching Daniel Ingrassia's fine stipple
        float alpha = smoothstep(0.5, 0.06, dist) * vOpacity;
        gl_FragColor = vec4(0.96, 0.97, 1.0, alpha);
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

    // Interactive Celestial Cursor Light Orb (positioned to right of head in reference)
    const orbGroup = new THREE.Group();
    const orbCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 })
    );
    const orbHalo = new THREE.Mesh(
      new THREE.SphereGeometry(5.8, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending })
    );
    const orbOuter = new THREE.Mesh(
      new THREE.SphereGeometry(12.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending })
    );
    orbGroup.add(orbCore);
    orbGroup.add(orbHalo);
    orbGroup.add(orbOuter);
    scene.add(orbGroup);
    orbGroup.position.set(48, 26, 15);

    // Loading sequence state machine (State A -> B -> C -> D)
    let loadProgress = 0.0;
    const formationStartTime = performance.now();

    // Mouse Tracking
    let targetMouseX = 0.25;
    let targetMouseY = 0.12;
    let currentMouseX = 0.25;
    let currentMouseY = 0.12;

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
      const elapsed = (now - formationStartTime) / 1000.0;

      // State B: Formation S-curve ease over 1.8 seconds
      if (loadProgress < 1.0) {
        const t = Math.min(1.0, elapsed / 1.8);
        loadProgress = t * t * (3.0 - 2.0 * t); // smoothstep

        if (loadProgress >= 0.85) {
          const leftLabel = document.getElementById('hero-label-left');
          const rightLabel = document.getElementById('hero-label-right');
          if (leftLabel) leftLabel.style.opacity = '1';
          if (rightLabel) rightLabel.style.opacity = '1';
        }
      }

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
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Camera position adapts slightly per stage for dramatic framing
      camera.position.z = 150 + currentScrollFraction * 70;
      camera.position.y = 4 - currentScrollFraction * 15;

      // Portrait Head Tilt in Stage 0, transitioning into orbital rotation in later stages
      if (!prefersReducedMotion) {
        const landingInfluence = Math.max(0.0, 1.0 - currentScrollFraction * 3.0);
        particleSystem.rotation.y = (currentMouseX * 0.22 * landingInfluence) + (time * 0.06 + currentScrollFraction * Math.PI * 2.0) * (1.0 - landingInfluence * 0.85);
        particleSystem.rotation.x = -currentMouseY * 0.12 * landingInfluence;
      }

      // Animate Celestial Light Orb in Stage 0
      const orbFade = Math.max(0.0, 1.0 - currentScrollFraction * 3.0);
      orbCore.material.opacity = 0.98 * orbFade;
      orbHalo.material.opacity = 0.22 * orbFade;
      orbOuter.material.opacity = 0.06 * orbFade;

      if (orbFade > 0.01) {
        const targetOrbX = currentMouseX * 75;
        const targetOrbY = currentMouseY * 55;
        orbGroup.position.x += (targetOrbX - orbGroup.position.x) * 0.07;
        orbGroup.position.y += (targetOrbY - orbGroup.position.y) * 0.07;
        orbGroup.position.z = 16 + Math.sin(time * 2.2) * 4.5;
        orbHalo.scale.setScalar(1.0 + Math.sin(time * 3.4) * 0.14);
        orbOuter.scale.setScalar(1.0 + Math.cos(time * 2.5) * 0.10);
      }

      // Dynamic particle interpolation across stages with orb repulsion in Stage 0
      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array;
      const invMatrix = new THREE.Matrix4().copy(particleSystem.matrixWorld).invert();
      const localOrb = orbGroup.position.clone().applyMatrix4(invMatrix);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;

        // In State A -> B formation phase: interpolate from initial dispersed positions into bust
        if (loadProgress < 1.0) {
          const ix = initialPositions[idx];
          const iy = initialPositions[idx + 1];
          const iz = initialPositions[idx + 2];
          const tx = targetPositions[idx];
          const ty = targetPositions[idx + 1];
          const tz = targetPositions[idx + 2];

          posArr[idx] = ix + (tx - ix) * loadProgress;
          posArr[idx + 1] = iy + (ty - iy) * loadProgress;
          posArr[idx + 2] = iz + (tz - iz) * loadProgress;
        } else {
          // State C & D: Multi-stage scroll morphing
          const ax = targetA[idx];
          const ay = targetA[idx + 1];
          const az = targetA[idx + 2];
          const bx = targetB[idx];
          const by = targetB[idx + 1];
          const bz = targetB[idx + 2];

          let destX = ax + (bx - ax) * easeT;
          let destY = ay + (by - ay) * easeT;
          let destZ = az + (bz - az) * easeT;

          // In Stage 0, apply dynamic physical repulsion around celestial light orb + subtle organic breathing
          if (stageA === 0 && easeT < 0.25) {
            if (orbFade > 0.08 && i % 2 === 0) {
              const dx = destX - localOrb.x;
              const dy = destY - localOrb.y;
              const dz = destZ - localOrb.z;
              const distSq = dx * dx + dy * dy + dz * dz;

              if (distSq < 784 && distSq > 0.01) {
                const dist = Math.sqrt(distSq);
                const force = (28.0 - dist) / 28.0;
                destX += (dx / dist) * force * 15.0 * orbFade;
                destY += (dy / dist) * force * 15.0 * orbFade;
                destZ += (dz / dist) * force * 15.0 * orbFade;
              }
            }
            // State D: Subtle organic micro-shimmer
            const breathe = Math.sin(time * 1.8 + phases[i]) * 0.25;
            destY += breathe;
          }

          // Smooth momentum approach to target configuration
          posArr[idx] += (destX - posArr[idx]) * 0.12;
          posArr[idx + 1] += (destY - posArr[idx + 1]) * 0.12;
          posArr[idx + 2] += (destZ - posArr[idx + 2]) * 0.12;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  }

})();
