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
  // 6. GENERATIVE PARTICLE ARTWORK ENGINE (Canvas 2D)
  //    - Stage 0: Anatomical Silhouette Bust + Interactive Celestial Orb
  //    - Stages 1-7: Scroll-driven deterministic mathematical morphing
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('generative-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Responsive Particle Density
  const isMobile = window.innerWidth <= 768;
  const PARTICLE_COUNT = isMobile ? 480 : 1200;

  if (hudParticlesElem) {
    hudParticlesElem.textContent = `PARTICLES: ${PARTICLE_COUNT.toLocaleString()} VTX`;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // --------------------------------------------------------------------------
  // Mathematical Geometry Generators for Multi-Stage Morphing
  // --------------------------------------------------------------------------

  // Helper random functions
  function pseudoRand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // STAGE 0: Anatomical Bust Silhouette
  // Based on the approved starting screen specification:
  // Cranium, jawline, nose bridge, eyes, mouth, neck, trapezius slope & deltoids
  function generateBustPoint(i, count) {
    const u = i / count;
    let x = 0, y = 0, z = 0;

    if (u < 0.40) {
      // 1. Head & Facial Features (y from 0 to 42, centered ~22)
      const curY = (u / 0.40) * 44;
      let radX, radZ;
      if (curY > 16) {
        // Cranium / Temples
        const t = (curY - 16) / 28;
        radX = 22 * Math.sqrt(Math.max(0.02, 1.0 - Math.pow(t - 0.45, 2) * 1.5));
        radZ = 24 * Math.sqrt(Math.max(0.02, 1.0 - Math.pow(t - 0.35, 2) * 1.4));
      } else {
        // Jawline & Chin
        const t = curY / 16;
        radX = 8.5 + t * 13.5;
        radZ = 12.0 + t * 12.0;
      }

      const angle = (i * 2.39996) % (Math.PI * 2);
      const shell = 0.75 + 0.25 * pseudoRand(i * 3.1);
      x = Math.cos(angle) * radX * shell;
      y = curY;
      z = Math.sin(angle) * radZ * shell;

      // Facial contour sculpting in front quadrant
      if (z > 0) {
        // Eye socket recession
        if (curY > 18 && curY < 24 && Math.abs(x) < 14) {
          if (Math.abs(x) > 3 && Math.abs(x) < 11) z -= 2.0;
        }
        // Nose bridge & tip
        if (curY >= 9 && curY <= 19 && Math.abs(x) < 4.5) {
          const noseProf = Math.sin(((curY - 9) / 10) * Math.PI);
          z += noseProf * 4.8 * Math.exp(-Math.pow(x / 2.2, 2));
        }
        // Mouth
        if (curY >= 5 && curY <= 8 && Math.abs(x) < 6) {
          z += 1.4 * Math.exp(-Math.pow(x / 3.0, 2));
        }
        // Chin
        if (curY <= 4 && Math.abs(x) < 4.5) {
          z += 2.6 * Math.exp(-Math.pow(x / 3.0, 2));
        }
      }
    } else if (u < 0.65) {
      // 2. Crown & Silhouette Hair
      const h = 15 + ((u - 0.40) / 0.25) * 36;
      const normH = (h - 15) / 36;
      const angle = (i * 1.618) % (Math.PI * 2);
      const baseR = 21.0 + Math.sin(normH * Math.PI) * 5.5;
      const curl = Math.sin(angle * 12.0 + h * 0.4) * 3.0 + Math.cos(angle * 16.0) * 2.0;
      const finalR = baseR + curl;

      x = Math.cos(angle) * finalR;
      y = h;
      z = Math.sin(angle) * (finalR * 0.95);
      if (z > 8 && y < 24) z *= 0.5; // keep face open
    } else {
      // 3. Neck, Trapezius Slope & Deltoid Shoulders (y: 0 down to -85)
      const t = (u - 0.65) / 0.35;
      y = -t * 85;

      let spanX, depthZ;
      if (y > -16) {
        // Neck column
        const neckProg = -y / 16.0;
        spanX = 11.5 + neckProg * 3.5;
        depthZ = 13.5 + neckProg * 2.5;
      } else {
        // Shoulders flare
        const shoulderT = (-16 - y) / 69.0;
        const shoulderSpread = Math.pow(shoulderT, 0.72) * 115.0;
        spanX = 15.0 + shoulderSpread;
        depthZ = 20.0 * (1.0 - shoulderT * 0.25);
      }

      const side = (i % 2 === 0) ? -1 : 1;
      const angle = (i * 3.7) % (Math.PI * 2);
      x = side * Math.abs(Math.cos(angle)) * spanX;
      z = Math.sin(angle) * depthZ;
    }

    // Scale and center for our 3D space
    return {
      x: x * 3.2,
      y: (y - 5) * 3.2,
      z: z * 3.2
    };
  }

  // STAGE 1: Formation / Dispersal Grid
  function generateStage1(i, count) {
    const angle = (i / count) * Math.PI * 14;
    const radius = 40 + (i / count) * 280;
    const wave = Math.sin(i * 0.2) * 45;
    return {
      x: Math.cos(angle) * radius,
      y: wave + Math.sin(angle) * 80,
      z: Math.sin(angle) * radius * 0.5
    };
  }

  // STAGE 2: Manifesto / Undulating Riemannian Manifold (Wave Lattice)
  function generateStage2(i, count) {
    const cols = Math.floor(Math.sqrt(count * 1.8));
    const r = Math.floor(i / cols);
    const c = i % cols;
    const u = (c / cols - 0.5) * 700;
    const v = (r / cols - 0.5) * 450;
    const dist = Math.sqrt(u * u + v * v);
    const z = Math.sin(dist * 0.035) * 75 + Math.cos(u * 0.04) * 35;
    return { x: u, y: v, z: z };
  }

  // STAGE 3: Projects / Concentric Orbital Gyroscope
  function generateStage3(i, count) {
    const ring = i % 3;
    const angle = (i / count) * Math.PI * 6;
    let radius = 220;
    let x = 0, y = 0, z = 0;

    if (ring === 0) {
      // Equatorial Ring
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * 40;
      z = Math.sin(angle) * radius;
    } else if (ring === 1) {
      // Inclined Polar Ring
      x = Math.cos(angle) * (radius * 1.15);
      y = Math.sin(angle) * (radius * 1.15);
      z = Math.cos(angle * 2) * 60;
    } else {
      // Core Shell
      const phi = (i / count) * Math.PI;
      const theta = (i * 2.39996) % (Math.PI * 2);
      radius = 120;
      x = radius * Math.sin(phi) * Math.cos(theta);
      y = radius * Math.sin(phi) * Math.sin(theta);
      z = radius * Math.cos(phi);
    }
    return { x, y, z };
  }

  // STAGE 4: Skills / Crystalline 3D Lattice Matrix
  function generateStage4(i, count) {
    const side = Math.floor(Math.cbrt(count));
    const ix = i % side;
    const iy = Math.floor(i / side) % side;
    const iz = Math.floor(i / (side * side));
    const spacing = 46;
    return {
      x: (ix - side / 2) * spacing,
      y: (iy - side / 2) * spacing,
      z: (iz - side / 2) * spacing
    };
  }

  // STAGE 5: Education / Flowing Torus (Donut Ring)
  function generateStage5(i, count) {
    const u = (i / count) * Math.PI * 2;
    const v = (i * 13.0) % (Math.PI * 2);
    const R = 230; // major radius
    const r = 65;  // minor tube radius
    return {
      x: (R + r * Math.cos(v)) * Math.cos(u),
      y: (R + r * Math.cos(v)) * Math.sin(u) * 0.7,
      z: r * Math.sin(v) * 2.0
    };
  }

  // STAGE 6: GitHub / Planar Harmonic Grid
  function generateStage6(i, count) {
    const cols = Math.floor(Math.sqrt(count * 2.5));
    const col = i % cols;
    const row = Math.floor(i / cols);
    const spacing = 28;
    const x = (col - cols / 2) * spacing;
    const y = (row - 10) * spacing * 0.7;
    const z = Math.sin(col * 0.3) * Math.cos(row * 0.3) * 60;
    return { x, y, z };
  }

  // STAGE 7: Contact / Convergent Focal Vortex
  function generateStage7(i, count) {
    const angle = (i / count) * Math.PI * 18;
    const progress = i / count;
    const radius = 20 + Math.pow(progress, 1.6) * 320;
    const y = (progress - 0.5) * 400;
    return {
      x: Math.cos(angle) * radius,
      y: y,
      z: Math.sin(angle) * radius
    };
  }

  // Pre-generate target configurations for each particle
  const stageGenerators = [
    generateBustPoint, // 0: Landing Bust Silhouette
    generateStage1,   // 1: Hero Formation
    generateStage2,   // 2: Manifesto Wave
    generateStage3,   // 3: Projects Gyroscope
    generateStage4,   // 4: Skills Lattice
    generateStage5,   // 5: Education Torus
    generateStage6,   // 6: GitHub Grid
    generateStage7    // 7: Contact Vortex
  ];

  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const targets = stageGenerators.map(gen => gen(i, PARTICLE_COUNT));
    particles.push({
      // Current 3D position
      x: targets[0].x,
      y: targets[0].y,
      z: targets[0].z,
      targets: targets,
      baseSize: 0.9 + pseudoRand(i * 5.1) * 1.5,
      alpha: 0.35 + pseudoRand(i * 7.3) * 0.65,
      flickerOffset: pseudoRand(i * 11.2) * Math.PI * 2
    });
  }

  // --------------------------------------------------------------------------
  // The Celestial Glowing Orb (Interactive Light Source)
  // --------------------------------------------------------------------------
  const celestialOrb = {
    x: 180,
    y: 80,
    z: 40,
    targetX: 180,
    targetY: 80,
    baseRadius: 3.5,
    haloRadius: 18
  };

  // Mouse / Pointer Interaction
  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false
  };

  window.addEventListener('pointermove', (e) => {
    pointer.active = true;
    pointer.targetX = (e.clientX - width / 2);
    pointer.targetY = -(e.clientY - height / 2);

    // Orb tracks pointer smoothly in landing viewport
    if (window.scrollY < window.innerHeight * 0.8) {
      celestialOrb.targetX = pointer.targetX * 0.55;
      celestialOrb.targetY = pointer.targetY * 0.55;
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointer.active = false;
    celestialOrb.targetX = 160;
    celestialOrb.targetY = 70;
  });

  // --------------------------------------------------------------------------
  // Render Loop & Physics
  // --------------------------------------------------------------------------
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsTimer = performance.now();

  // Smooth scroll tracking
  let currentScrollFraction = 0;
  let targetScrollFraction = 0;

  function render(time) {
    // Visibility pause optimization
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }

    // FPS Meter
    frameCount++;
    if (time - fpsTimer >= 1000) {
      const fps = Math.round((frameCount * 1000) / (time - fpsTimer));
      if (canvasFpsElem) canvasFpsElem.textContent = `${fps} FPS`;
      if (headerFpsElem) headerFpsElem.textContent = `${fps} FPS`;
      frameCount = 0;
      fpsTimer = time;
    }

    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    // Calculate Scroll Progress
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScrollFraction = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    // Smooth lerp scroll fraction to avoid abrupt jumping on fast scroll
    currentScrollFraction += (targetScrollFraction - currentScrollFraction) * 0.1;

    // Determine current interpolation stages (0 to 7)
    const stageSpan = 7;
    const scaledProgress = currentScrollFraction * stageSpan;
    const stageA = Math.min(stageSpan - 1, Math.floor(scaledProgress));
    const stageB = Math.min(stageSpan, stageA + 1);
    const stageT = scaledProgress - stageA;

    // Ease stage transition (smooth step)
    const easeT = stageT * stageT * (3 - 2 * stageT);

    // Smooth pointer tracking
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    celestialOrb.x += (celestialOrb.targetX - celestialOrb.x) * 0.06;
    celestialOrb.y += (celestialOrb.targetY - celestialOrb.y) * 0.06;

    // 3D Camera Angles
    const timeScale = prefersReducedMotion ? 0 : time * 0.0004;
    let rotY = (pointer.x / width) * 0.45;
    let rotX = -(pointer.y / height) * 0.25;

    // Add continuous subtle rotation based on scroll stage
    if (!prefersReducedMotion) {
      rotY += timeScale + (currentScrollFraction * Math.PI * 2.5);
    }

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Clear Screen
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    // In landing stage, center bust slightly higher for balanced composition
    const landingShift = Math.max(0, 1 - currentScrollFraction * 5) * 20;
    const centerY = (height / 2) - landingShift;
    const fov = 650;

    // Draw Celestial Orb in Landing Stage
    const isLanding = currentScrollFraction < 0.25;
    if (isLanding) {
      const orbPulse = Math.sin(time * 0.003) * 0.15;
      const orbScreenX = centerX + celestialOrb.x;
      const orbScreenY = centerY - celestialOrb.y;

      const orbFade = Math.max(0, 1 - currentScrollFraction * 4);

      // Outer Halo Glow
      const haloGrad = ctx.createRadialGradient(
        orbScreenX, orbScreenY, 0,
        orbScreenX, orbScreenY, celestialOrb.haloRadius * (1 + orbPulse) * 2.5
      );
      haloGrad.addColorStop(0, `rgba(43, 64, 253, ${0.45 * orbFade})`);
      haloGrad.addColorStop(0.4, `rgba(10, 38, 238, ${0.18 * orbFade})`);
      haloGrad.addColorStop(1, 'rgba(10, 38, 238, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(orbScreenX, orbScreenY, celestialOrb.haloRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core Solid Orb
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * orbFade})`;
      ctx.beginPath();
      ctx.arc(orbScreenX, orbScreenY, celestialOrb.baseRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Process & Render Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Interpolate target positions between Stage A and Stage B
      const targetA = p.targets[stageA];
      const targetB = p.targets[stageB] || targetA;

      const destX = targetA.x + (targetB.x - targetA.x) * easeT;
      const destY = targetA.y + (targetB.y - targetA.y) * easeT;
      const destZ = targetA.z + (targetB.z - targetA.z) * easeT;

      // Smooth approach to current interpolated target
      p.x += (destX - p.x) * 0.08;
      p.y += (destY - p.y) * 0.08;
      p.z += (destZ - p.z) * 0.08;

      let px = p.x;
      let py = p.y;
      let pz = p.z;

      // Interactive Orb Repulsion in Landing Phase
      if (isLanding) {
        const dx = px - celestialOrb.x;
        const dy = py - celestialOrb.y;
        const dz = pz - celestialOrb.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const repelRadiusSq = 55 * 55;

        if (distSq < repelRadiusSq && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = (55 - dist) / 55;
          px += (dx / dist) * force * 16;
          py += (dy / dist) * force * 16;
          pz += (dz / dist) * force * 16;
        }
      }

      // 3D Rotation (Y axis then X axis)
      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      const y2 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;

      // Perspective Projection
      const depth = fov + z2 + 350;
      if (depth > 20) {
        const scale = fov / depth;
        const screenX = centerX + x1 * scale;
        const screenY = centerY - y2 * scale;

        if (screenX >= -10 && screenX <= width + 10 && screenY >= -10 && screenY <= height + 10) {
          // Dynamic alpha with depth and subtle shimmer
          const shimmer = Math.sin(time * 0.002 + p.flickerOffset) * 0.1;
          const depthAlpha = Math.max(0.1, Math.min(0.95, (p.alpha + shimmer) * (scale * 0.9)));

          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = depthAlpha;

          const radius = Math.max(0.65, p.baseSize * scale);
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles in crystalline lattice stage
          if (stageA === 4 && i % 3 === 0 && !isMobile) {
            const nextP = particles[(i + 1) % PARTICLE_COUNT];
            const ndepth = fov + nextP.z + 350;
            if (ndepth > 20) {
              const nscale = fov / ndepth;
              const nsx = centerX + nextP.x * nscale;
              const nsy = centerY - nextP.y * nscale;
              const lineDist = Math.hypot(screenX - nsx, screenY - nsy);
              if (lineDist < 35) {
                ctx.strokeStyle = 'rgba(43, 64, 253, 0.25)';
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(nsx, nsy);
                ctx.stroke();
              }
            }
          }
        }
      }
    }

    ctx.globalAlpha = 1.0;
    requestAnimationFrame(render);
  }

  // Start Animation Loop
  requestAnimationFrame(render);

})();
