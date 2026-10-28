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
  // 6. THREE.JS AUTHENTIC HUMAN BUST SCULPTURE & GENERATIVE ENGINE
  //    - Genuine 3D Scanned Human Bust (44,000 Points, PPT1 Surface Point Cloud)
  //    - Anatomically Authentic Cranium, Eyes, Nose, Lips, Ears, Neck, and Broad Shoulders
  //    - Custom Volumetric Sculpted Hair with Organic Wave Strands & Wind Shimmer
  //    - Stage 2: Geographic 3D Point Cloud of INDIA with Pune (Current) & Hyderabad (Origin) Focal Constellations
  //    - Stage 5: Majestic, Slow-Churning Cosmic Vortex & Constellation Particle Galaxy at Website End
  //    - Fluid Virtual Scroll Damping & Symmetrical Reversibility
  // --------------------------------------------------------------------------

  const container = document.getElementById("threejs-particle-scene");
  if (container && typeof THREE !== "undefined") {
    initThreeAuthenticHumanBust();
  }

  function initThreeAuthenticHumanBust() {
    const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFormation;
  uniform float uMorph;
  uniform float uMorph2;
  uniform float uMorph3;
  uniform float uMorph4;
  uniform float uMorph5;
  uniform float uRingMix;
  uniform float uRingRadius;
  uniform vec4 uOutlineRect;
  uniform float uWaveformWidth;
  uniform float uWaveformAmp;
  uniform float uSpiralRadius;
  uniform float uWorkSlide;
  uniform float uTurbulence;
  uniform vec2 uPointer;
  uniform float uGlow;
  uniform float uGlowRadius;
  uniform float uAspect;
  // 1 on a portrait-orientation viewport (width < height), 0 otherwise —
  // updated on resize alongside uAspect. Any portrait-only tweak blends in
  // through this (mix(currentValue, portraitValue, uIsPortrait)) so
  // landscape/desktop stays byte-identical to today, never touched by
  // future portrait-specific tuning.
  uniform float uIsPortrait;
  // Shrinks the globe shape on portrait only — scaled around its own
  // vertical centre (uGlobeCentreY, cloudCentre baked once at setup) rather
  // than the world origin, since aGlobe's Y already carries that offset.
  uniform float uGlobeScale;
  uniform float uGlobeCentreY;
  // Same idea, Italy shape, scaled around its own vertical centre
  // (uItalyCentreY, italyCentre baked once at setup).
  uniform float uIndiaScale;
  uniform float uIndiaCentreY;

  attribute vec3 aOrigin;
  attribute vec3 aGlobe;
  attribute vec3 aIndia;
  attribute float aWaveX;
  attribute float aWaveCurve;
  attribute float aWaveJitter;
  attribute float aIsRung;
  attribute float aRungT;
  attribute float aDelay;
  attribute float aSize;
  attribute float aPhase;
  attribute float aLuma;
  attribute float aIsHair;

  varying float vAlpha;
  // 0 for every particle except the sparse ring dots (uRingMix *
  // ringParticipate, below) — the fragment shader uses it to fade in a
  // fake-sphere shaded look ONLY for those, leaving every other point on
  // the site (portrait, globe, DNA, everything) exactly as flat-glow as
  // before.
  varying float vRingShade;

  void main() {
    // The preloader's own ring slot — one of RING_SLOTS fixed, evenly
    // spaced positions (not a continuous angle) — computed up here because
    // the stagger just below needs it too, so particles swirl into place
    // in the same order they'll sit in around the ring.
    float ringHash = fract(sin(dot(aOrigin.xy, vec2(12.9898, 78.233))) * 43758.5453);
    // Many more slots than the old 10-dot spinner — enough points along
    // the circumference to actually read as a circle outline at a glance,
    // not a handful of scattered blobs the eye can't connect.
    const float RING_SLOTS = 20.0;
    float ringSlot = floor(ringHash * RING_SLOTS);

    // Whether this particle is one of the sparse few that actually go on
    // to build a ring dot (see the ring geometry further down, which needs
    // "shape" and so has to come later) — computed this early so the "stay
    // put and just twinkle" gate on ease/swirl below can use it. Everyone
    // else keeps doing the site's own ordinary scattered-cloud "stellar"
    // look (ambient twinkle, no directed motion) instead of invisibly also
    // drifting toward the ring underneath the visible spinner — only a
    // portion of the cloud peeling off to build it, composing the same way
    // the comet version of this did, the rest staying as background stars.
    float ringHash2 = fract(sin(dot(aOrigin.xy, vec2(4.898, 32.233))) * 12345.678);
    float ringParticipate = step(ringHash2, 0.02);

    // Everything in this block — the delay stagger, the eased curve shape
    // — only ever changes for the sparse ring-forming particles
    // (uRingMix * ringParticipate). The rest of the cloud reads
    // effectiveDelay/ease exactly as it always has (aDelay, the normal
    // ease-out curve), same as if the preloader didn't exist — genuinely
    // different particles building the ring, not the same cloud being
    // held back/frozen while it's up.
    float ringActive = uRingMix * ringParticipate;

    // Normally each particle's own swirl-in stagger is random (aDelay, set
    // once per particle at generation time) — fine for the portrait, but
    // for the preloader's ring it reads as the whole cloud converging at
    // once instead of the spinner's dots lighting up in order. Blending
    // toward a slot-based delay instead makes the ring's own particles
    // arrive in that order.
    // Lower = every dot's own stagger starts (and finishes) earlier within
    // the formation window — 0.8 meant the last dot didn't even begin
    // moving until 80% of the way through.
    float slotDelay = (ringSlot / RING_SLOTS) * 0.15;
    float effectiveDelay = mix(aDelay, slotDelay, ringActive);
    float t = clamp((uFormation - effectiveDelay) / max(1.0 - effectiveDelay, 0.001), 0.0, 1.0);
    // Ease-out everywhere else (fast start, settling in) — but for the
    // comet's own particles specifically, blended toward a plain
    // ease-in-out-cubic instead: slow start, fast middle, slow arrival.
    // Same curve as preloader.tsx's own easeInOutCubic, just inlined here
    // since it's GLSL, not JS.
    float easeOut = 1.0 - pow(1.0 - t, 3.0);
    float easeSlowStart = t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    float ease = mix(easeOut, easeSlowStart, ringActive);
    // The comet's own particles (ringParticipate) use "ease" exactly as
    // computed above, unconditionally. Everyone else instead gets held at
    // 0 — frozen at their raw scattered aOrigin, not forming toward the
    // portrait at all — for as long as the ring is fully up (uRingMix==1),
    // then eased back to their real, natural "ease" as uRingMix falls on
    // hand-off (mix itself does that ramp smoothly, no separate timer
    // needed). This is what actually keeps the background looking like
    // the initial scattered field the whole time the ring is on screen,
    // rather than slowly assembling into the portrait underneath it.
    float formEase = mix(ease * (1.0 - uRingMix), ease, ringParticipate);

    float swirl = (1.0 - formEase) * 1.4;
    float c = cos(swirl);
    float s = sin(swirl);
    vec3 origin = vec3(
      aOrigin.x * c - aOrigin.z * s,
      aOrigin.y,
      aOrigin.x * s + aOrigin.z * c
    );

    // A double helix along X: two strands circling the same axis in the
    // Y-Z plane, a half-turn apart, plus rungs — particles held back to sit
    // *between* the strands instead of on one of them, connecting the two
    // through the centre at regular intervals like DNA's base pairs. uTime
    // keeps it spinning continuously; uWorkSlide adds more turning on top
    // of that as the page scrolls through the point-by-point browsing
    // phase, so the spin visibly speeds up with scroll instead of just
    // running on a timer. The same uWorkSlide also slides the whole helix
    // sideways along its own axis, so a different stretch of it is under
    // the text at each point — the "slider" reads through motion, not just
    // a crossfade. aWaveJitter scatters each particle's radius and angle a
    // little, so every strand reads as a soft rope of particles, not a
    // hairline — and that same jitter amplitude grows with uTurbulence
    // (scroll speed), so fast scrolling visibly roughens the strands
    // instead of just spinning them faster.
    float jitterAmount = 1.0 + uTurbulence * 3.0;
    float baseAngle = aWaveX * 13.0 + uTime * 0.6 + uWorkSlide * 2.4 + aWaveJitter * 0.12 * jitterAmount;
    float radius = uWaveformAmp * (0.85 + aWaveJitter * 0.15 * jitterAmount);
    // Both strands at this particle's X — strand 1 is strand 0 rotated
    // half a turn, i.e. the antipodal point on the same circle, so the
    // line between them passes through the helix's own centre.
    vec2 strand0 = vec2(sin(baseAngle), cos(baseAngle)) * radius;
    vec2 strand1 = vec2(sin(baseAngle + 3.14159265), cos(baseAngle + 3.14159265)) * radius;
    vec2 onStrand = mix(strand0, strand1, aWaveCurve);
    vec2 onRung = mix(strand0, strand1, aRungT);
    vec2 yz = mix(onStrand, onRung, aIsRung);
    float slideX = aWaveX * uWaveformWidth - uWorkSlide * uWaveformWidth * 0.15;
    vec3 waveform = vec3(slideX, yz.x, yz.y);

    // The closing beat, once Playground's own experiments have swept
    // through (uMorph4, driven by window.__playgroundClosing — see
    // playground.tsx): the exact same double-helix geometry as the DNA
    // above (same constant tube radius, same two-strand-plus-rungs
    // construction) — just turned 90\xb0, so instead of sliding along local
    // X (spanning left-to-right on screen) it recedes along local Z
    // (spanning toward-and-away from the camera). A perspective camera
    // does the rest on its own: the same coil radius, unchanged with
    // distance, reads as a tunnel because farther rings project smaller —
    // no new shape to author, no radius/fray tuning, just a reused formula
    // with its axis swapped.
    float spiralSpin = mix(uTime * 0.6, 1.1, smoothstep(0.5, 1.0, uMorph4));
    float tunnelAngle = aWaveX * 13.0 + spiralSpin + aWaveJitter * 0.12 * jitterAmount;
    // Wider than the DNA's own tube radius — this is the tunnel's own
    // scale, not the helix's, so it's free to be bigger without touching
    // how the DNA itself reads.
    float tunnelRadius = radius * 1.5;
    vec2 tunnelStrand0 = vec2(sin(tunnelAngle), cos(tunnelAngle)) * tunnelRadius;
    vec2 tunnelStrand1 = vec2(sin(tunnelAngle + 3.14159265), cos(tunnelAngle + 3.14159265)) * tunnelRadius;
    vec2 tunnelOnStrand = mix(tunnelStrand0, tunnelStrand1, aWaveCurve);
    vec2 tunnelOnRung = mix(tunnelStrand0, tunnelStrand1, aRungT);
    vec2 tunnelXY = mix(tunnelOnStrand, tunnelOnRung, aIsRung);
    float tunnelDepth = aWaveX * uSpiralRadius * 2.4;
    vec3 spiral = vec3(tunnelXY.x, tunnelXY.y, tunnelDepth);

    // The closing beat (uMorph5, active at the end in Contact & Transmission):
    // A majestic, continuous 3D particle vortex and undulating cosmic constellation field!
    // Never static: continuously spins with uTime, undulates in 3D waves, and expands across the viewport.
    float vortexArm = aWaveCurve * 3.14159265;
    float vortexAngle = aWaveX * 12.0 + uTime * 0.16 + vortexArm + aWaveJitter * 0.2;
    float vortexRad = (0.35 + abs(aWaveX) * 1.85) * (1.0 + 0.08 * sin(uTime * 0.45 + aWaveX * 8.0));
    float vortexZ = sin(vortexRad * 3.5 - uTime * 0.5 + aWaveJitter * 2.0) * 0.25 + cos(vortexAngle * 2.0 + uTime * 0.2) * 0.12;
    vec3 vortex = vec3(
      cos(vortexAngle) * vortexRad * 1.5,
      sin(vortexAngle) * vortexRad * 1.1 - 0.15,
      vortexZ
    );

    vec3 globeScaled = vec3(aGlobe.x, aGlobe.y - uGlobeCentreY, aGlobe.z) * uGlobeScale + vec3(0.0, uGlobeCentreY, 0.0);
    vec3 indiaScaled = vec3(aIndia.x, aIndia.y - uIndiaCentreY, aIndia.z) * uIndiaScale + vec3(0.0, uIndiaCentreY, 0.0);

    vec3 shape = mix(mix(mix(mix(mix(position, globeScaled, uMorph), indiaScaled, uMorph2), waveform, uMorph3), spiral, uMorph4), vortex, uMorph5);

    // The preloader's own intro shape (see preloader.tsx, which drives
    // uRingMix from window.__preloaderRingMix): a sparse loading-spinner
    // ring — a handful of distinct dots evenly spaced around a circle
    // (ringSlot, computed above), composing the same way the comet version
    // of this did (a portion of the cloud peeling off, the rest staying
    // put as background stars — see ringParticipate/formEase above), not
    // the full particle cloud (tried the whole globe scaled down; read as
    // a dense fuzzy blob, not discrete dots).
    //
    // uTime * spin adds a continuous rotation on top of each dot's own
    // fixed slot — same wave speed as ringPulse below so the size wave and
    // the ring's own spin travel together, not against each other.
    float ringAngle = (ringSlot / RING_SLOTS) * 6.28318530718 + uTime * 1.2;
    vec3 ring = vec3(cos(ringAngle), sin(ringAngle), 0.0) * uRingRadius;
    vec3 target = mix(shape, ring, ringActive);

    // A traveling wave around the 10 slots — each dot's own size/alpha
    // pulses based on its slot position minus uTime, phase-shifted per
    // slot, so the "biggest" position visibly moves around the ring
    // continuously (a real classic spinner: dots don't rotate in place, a
    // wave of size does). Runs off uTime alone, not ease/uFormation —
    // continuous for as long as the ring is up, not a one-shot.
    float ringWavePhase = (ringSlot / RING_SLOTS) * 6.28318530718;
    float ringPulse = pow(0.5 + 0.5 * sin(uTime * 1.0 - ringWavePhase), 2.0);
    // No fake-sphere shading here anymore — with only 10 big dots it read
    // as a "ball", but with 48 smaller ones a soft sphere gradient per dot
    // just muddies them into random blurry blobs instead of a crisp,
    // readable circle. Flat glow, like every other point in the cloud.
    vRingShade = 0.0;
    vec3 formed = mix(origin, target, formEase);
    // Subtle organic wind shimmer in hair strands in humanoid bust state
    float hairSway = aIsHair * formEase * (1.0 - uMorph);
    formed.x += sin(uTime * 1.8 + formed.y * 10.0 + aPhase) * 0.007 * hairSway;
    formed.y += cos(uTime * 1.4 + formed.x * 8.0 + aPhase) * 0.005 * hairSway;
    formed.z += sin(uTime * 2.0 + aPhase) * 0.006 * hairSway;
    formed.z += sin(uTime * 0.7 + aPhase) * 0.012 * formEase;

    // Background stars sit frozen at their own raw aOrigin scatter while
    // the ring is up (see formEase above) — a full 3D sphere around the
    // origin, unrelated to the ring's own Z=0 plane, so some of them
    // naturally land BETWEEN the ring and the camera. Those close ones
    // blow up into oversized "in your face" points below (point size
    // scales with 1/distance-to-camera) instead of reading as background.
    // Clamping Z behind the ring for exactly this population keeps every
    // star safely further from the camera than the ring itself, so the
    // ring genuinely reads as being in FRONT of the star field, not lost
    // among random giant ones.
    float bgClamp = uRingMix * (1.0 - ringParticipate);
    formed.z = mix(formed.z, min(formed.z, -uRingRadius * 0.8), bgClamp);

    vec4 mvPosition = modelViewMatrix * vec4(formed, 1.0);
    vec4 clipPosition = projectionMatrix * mvPosition;
    gl_Position = clipPosition;

    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.001);
    vec2 toPointer = ndc - uPointer;
    toPointer.x *= uAspect;
    float glow = smoothstep(uGlowRadius, 0.0, length(toPointer)) * uGlow * formEase;

    float twinkle = 0.82 + 0.18 * sin(uTime * 1.4 + aPhase * 3.0);

    vAlpha = (0.16 + 0.84 * aLuma) * (1.0 + glow) * twinkle * smoothstep(0.0, 0.12, t);
    // The background (everyone NOT building the comet) gets boosted while
    // the ring is up — brighter and bigger than its own everyday look
    // elsewhere on the site, so it reads as a dense, vivid star field
    // behind the comet rather than the cloud's usual restrained brightness.
    // Same value as bgClamp above (kept as one shared name would need
    // reordering the block that needs it before "shape" exists — not
    // worth it for one extra multiply).
    float bgBoost = bgClamp;
    // Dialed back — the ring itself should read as the brightest thing on
    // screen, the background as a quieter field behind it, not competing
    // brightness.
    vAlpha *= mix(1.0, 1.4, bgBoost);
    // Fewer background stars — portrait only (uIsPortrait), landscape
    // untouched. Culls most of the background outright (not just dimmer):
    // this is the full particle cloud, thousands of points, and on a
    // narrower portrait frame that reads as an overcrowded field rather
    // than a handful of stars. ringHash2 is already a stable per-particle
    // 0..1 (used for the ring's own sparse selection above), reused here
    // from its complementary side — only ~35% of background particles
    // show when culling is active.
    float bgCull = step(ringHash2, 0.35);
    vAlpha *= mix(1.0, mix(1.0, bgCull, uIsPortrait), bgBoost);
    // Ring dots ride the wave (ringPulse) on top, boosted well past normal
    // brightness at the wave's peak so the ring reads as distinctly more
    // intense than the (now quieter) background — only dipping low at the
    // wave's own trough, not shrinking to a dim dot.
    vAlpha *= mix(1.0, mix(0.15, 2.2, ringPulse), ringActive);

    float sizeBoost = 1.0 + (1.0 - formEase) * 0.7;
    // Background size barely nudged — aSize already has real per-particle
    // variance built in (some naturally-bigger "stars" by design), and a
    // bigger flat multiplier amplifies exactly those outliers into
    // isolated blobs.
    sizeBoost *= mix(1.0, 1.05, bgBoost);
    // Ring dots noticeably bigger at the wave's peak now (1.3-3.2, not
    // 0.9-1.8) — the ring is meant to stand out clearly against the now-
    // quieter background, not blend into a similar scale.
    float ringSizeBoost = mix(1.0, mix(0.1, 4.5, ringPulse), ringActive);
    gl_PointSize = min(
      uSize * aSize * sizeBoost * ringSizeBoost * uPixelRatio / max(-mvPosition.z, 0.001),
      48.0 * uPixelRatio
    );
  }
`;

    const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uExposure;

  varying float vAlpha;
  varying float vRingShade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float flatShade = smoothstep(0.5, 0.05, d);

    // Fake-sphere impostor, faded in only for the preloader's ring dots
    // (vRingShade) — a flat glowing disc doesn't read as a "ball" like the
    // reference spinner; a cheap normal reconstructed from the point's own
    // UV (as if it really were a hemisphere bulging toward the camera)
    // plus one fixed light direction gets there without a texture or any
    // real per-particle geometry.
    float r2 = dot(uv, uv);
    float sphereZ = sqrt(max(0.25 - r2, 0.0)) / 0.5;
    vec3 normal = normalize(vec3(uv * 2.0, sphereZ));
    vec3 lightDir = normalize(vec3(-0.4, 0.55, 0.75));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float sphereShade = flatShade * mix(0.35, 1.6, diffuse);

    float shade = mix(flatShade, sphereShade, vRingShade);

    gl_FragColor =
      vec4(uColor, min(shade * vAlpha * uExposure, 1.0));

    #include <encodings_fragment>
  }
`;

    function parsePPT1(arrayBuffer) {
      const view = new DataView(arrayBuffer);
      const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      if (magic !== "PPT1") {
        throw new Error("Invalid point cloud magic: " + magic);
      }
      const count = view.getUint32(4, true);
      const scale = view.getFloat32(8, true);
      const positions = new Float32Array(count * 3);
      const luma = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const offset = 12 + 8 * i;
        positions[3 * i] = view.getInt16(offset, true) * scale;
        positions[3 * i + 1] = view.getInt16(offset + 2, true) * scale;
        positions[3 * i + 2] = view.getInt16(offset + 4, true) * scale;
        luma[i] = view.getUint8(offset + 6) / 255.0;
      }
      return { count, positions, luma };
    }

    // Load assets asynchronously
    Promise.all([
      fetch("assets/portrait.bin").then(r => r.arrayBuffer()),
      fetch("assets/india.bin").then(r => r.arrayBuffer()).catch(() => null)
    ]).then(([portraitBuf, indiaBuf]) => {
      const portraitData = parsePPT1(portraitBuf);
      const indiaData = indiaBuf ? parsePPT1(indiaBuf) : null;
      startParticleEngine(portraitData, indiaData ? indiaData.positions : null);
    }).catch(err => {
      console.warn("Failed to load binary point cloud assets:", err);
    });

    function startParticleEngine(portraitData, indiaPositions) {
      let count = portraitData.count;
      let positions = portraitData.positions;
      let luma = portraitData.luma;

      // Sculpt hair with natural volume, textured waves, and layered loft
      const hairAttribute = new Float32Array(count);
      for (let t = 0; t < count; t++) {
        let px = positions[3 * t];
        let py = positions[3 * t + 1];
        let pz = positions[3 * t + 2];

        if (py > 0.38 && (pz < 0.12 || py > 0.52)) {
          const hairHeight = (py - 0.38) / (0.87 - 0.38); // 0 to 1
          hairAttribute[t] = hairHeight;

          // Natural volumetric crown loft
          const loft = Math.sin(hairHeight * Math.PI) * 0.045;
          // Harmonic wave texture for organic hair strands and curls
          const waveX = Math.sin(py * 24.0 + pz * 18.0) * 0.018 * hairHeight;
          const waveY = Math.cos(px * 20.0 + pz * 15.0) * 0.015 * hairHeight;
          const waveZ = Math.sin(px * 16.0 + py * 18.0) * 0.022 * hairHeight;

          positions[3 * t] = px + waveX;
          positions[3 * t + 1] = py + loft + waveY;
          positions[3 * t + 2] = pz + waveZ;
        } else {
          hairAttribute[t] = 0.0;
        }
      }

      let width = container.clientWidth || window.innerWidth;
      let height = container.clientHeight || window.innerHeight;

      // Renderer setup
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch (e) {
        console.error("WebGL initialization failed:", e);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";

      // Clear existing canvas if any
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const cameraDistance = 3.0;
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = cameraDistance;

      // Bounding box calculation for humanoid bust
      let maxY = -Infinity, minY = Infinity, minX = Infinity, maxX = -Infinity;
      for (let t = 0; t < count; t++) {
        let px = positions[3 * t];
        let py = positions[3 * t + 1];
        if (py > maxY) maxY = py;
        if (py < minY) minY = py;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
      }
      let G = Math.max(maxY - minY, 0.001);
      let X = Math.max(maxX - minX, 0.001);
      let V = (maxY + minY) / 2;

      // Initial dispersed origin cloud
      const aOrigin = new Float32Array(3 * count);
      const aDelay = new Float32Array(count);
      const aSize = new Float32Array(count);
      const aPhase = new Float32Array(count);
      const tmpVec = new THREE.Vector3();

      for (let t = 0; t < count; t++) {
        tmpVec.set(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1);
        if (tmpVec.lengthSq() === 0) tmpVec.set(0, 1, 0);
        tmpVec.normalize().multiplyScalar(2.0 + 4.5 * Math.random());
        aOrigin[3 * t] = tmpVec.x;
        aOrigin[3 * t + 1] = tmpVec.y;
        aOrigin[3 * t + 2] = tmpVec.z;
        aDelay[t] = 0.55 * Math.random();
        aSize[t] = 0.5 + 0.35 * luma[t] + 1.4 * Math.pow(Math.random(), 3);
        aPhase[t] = Math.random() * Math.PI * 2;
      }

      // India Geographic Point Cloud
      let aIndia = indiaPositions;
      if (!aIndia || aIndia.length !== count * 3) {
        aIndia = new Float32Array(3 * count);
        for (let i = 0; i < count; i++) {
          const u = (i % 200) / 200 * 2 - 1;
          const v = Math.floor(i / 200) / (count / 200) * 2 - 1;
          aIndia[3 * i] = u * 0.9;
          aIndia[3 * i + 1] = v * 0.8;
          aIndia[3 * i + 2] = Math.sin(u * 6.0) * Math.cos(v * 6.0) * 0.12;
        }
      }

      let indiaMaxY = -Infinity, indiaMinY = Infinity;
      for (let t = 0; t < count; t++) {
        let py = aIndia[3 * t + 1];
        if (py > indiaMaxY) indiaMaxY = py;
        if (py < indiaMinY) indiaMinY = py;
      }
      let indiaCenterY = (indiaMaxY + indiaMinY) / 2;

      // Fibonacci Globe
      const aGlobe = new Float32Array(3 * count);
      const phi = Math.PI * (3 - Math.sqrt(5));
      const globeRadius = G * 0.42;
      for (let o = 0; o < count; o++) {
        const yNorm = 1 - (o / Math.max(count - 1, 1)) * 2;
        const rad = Math.sqrt(Math.max(1 - yNorm * yNorm, 0));
        const theta = phi * o;
        aGlobe[3 * o] = Math.cos(theta) * rad * globeRadius;
        aGlobe[3 * o + 1] = yNorm * globeRadius + V;
        aGlobe[3 * o + 2] = Math.sin(theta) * rad * globeRadius;
      }

      // Waveform / DNA Double Helix
      const rungFreq = 1 / 6;
      const aWaveX = new Float32Array(count);
      const aWaveCurve = new Float32Array(count);
      const aWaveJitter = new Float32Array(count);
      const aIsRung = new Float32Array(count);
      const aRungT = new Float32Array(count);

      const shuffleIdx = new Uint32Array(count);
      for (let i = 0; i < count; i++) shuffleIdx[i] = i;
      for (let i = count - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const temp = shuffleIdx[i];
        shuffleIdx[i] = shuffleIdx[r];
        shuffleIdx[r] = temp;
      }

      const step = 1 / Math.max(count - 1, 1);
      for (let o = 0; o < count; o++) {
        const idx = shuffleIdx[o];
        aWaveJitter[idx] = 2 * Math.random() - 1;
        if (o % Math.round(1 / rungFreq) === 0) {
          const rungSlot = Math.floor(24 * Math.random());
          aWaveX[idx] = (rungSlot + 0.5) * 0.041666666666666664 - 0.5 + (Math.random() - 0.5) * 0.041666666666666664 * 0.5;
          aIsRung[idx] = 1;
          aRungT[idx] = Math.random();
        } else {
          aWaveX[idx] = o * step - 0.5 + (Math.random() - 0.5) * step;
          aWaveCurve[idx] = o % 2;
        }
      }

      // Geometry definition
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aOrigin", new THREE.BufferAttribute(aOrigin, 3));
      geometry.setAttribute("aGlobe", new THREE.BufferAttribute(aGlobe, 3));
      geometry.setAttribute("aIndia", new THREE.BufferAttribute(aIndia, 3));
      geometry.setAttribute("aWaveX", new THREE.BufferAttribute(aWaveX, 1));
      geometry.setAttribute("aWaveCurve", new THREE.BufferAttribute(aWaveCurve, 1));
      geometry.setAttribute("aWaveJitter", new THREE.BufferAttribute(aWaveJitter, 1));
      geometry.setAttribute("aIsRung", new THREE.BufferAttribute(aIsRung, 1));
      geometry.setAttribute("aRungT", new THREE.BufferAttribute(aRungT, 1));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(aDelay, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
      geometry.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
      geometry.setAttribute("aLuma", new THREE.BufferAttribute(luma, 1));
      geometry.setAttribute("aIsHair", new THREE.BufferAttribute(hairAttribute, 1));

      // Shader Material
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uFormation: { value: prefersReducedMotion ? 1.0 : 0.0 },
          uMorph: { value: 0 },
          uMorph2: { value: 0 },
          uMorph3: { value: 0 },
          uMorph4: { value: 0 },
          uMorph5: { value: 0 },
          uRingMix: { value: 0 },
          uRingRadius: { value: 0.1 * X },
          uOutlineRect: { value: new THREE.Vector4(0, 0, 0, 0) },
          uWaveformWidth: { value: 0 },
          uWaveformAmp: { value: 0.12 * G },
          uSpiralRadius: { value: 0 },
          uWorkSlide: { value: 0 },
          uTurbulence: { value: 0 },
          uColor: { value: new THREE.Color("#FFFFFF") },
          uExposure: { value: 0.5 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uGlow: { value: 0 },
          uGlowRadius: { value: 1.0 },
          uAspect: { value: width / height },
          uIsPortrait: { value: +(width < height) },
          uGlobeScale: { value: width < height ? 0.6 : 1.0 },
          uGlobeCentreY: { value: V },
          uIndiaScale: { value: width < height ? 0.7 : 1.0 },
          uIndiaCentreY: { value: indiaCenterY }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particlePoints = new THREE.Points(geometry, material);
      const headGroup = new THREE.Group();
      headGroup.add(particlePoints);
      scene.add(headGroup);

      // Tracking variables
      let lastTime = performance.now();
      let scaleS = 1;
      let frustumH = 0;
      let frustumW = 0;
      let turbulence = 0;
      let pointerNDC = new THREE.Vector2(0, 0);
      let currentPointer = new THREE.Vector2(0, 0);
      let pointerActive = 0;
      let pointerTargetActive = 0;

      const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
          pointerTargetActive = 0;
          return;
        }
        pointerNDC.set(2 * nx - 1, -(2 * ny - 1));
        pointerTargetActive = 1;
      };

      const onPointerLeave = () => {
        pointerTargetActive = 0;
      };

      if (!prefersReducedMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", onPointerLeave);
      }

      // Resize & projection setup
      const onResize = () => {
        const rect = container.getBoundingClientRect();
        width = rect.width || window.innerWidth;
        height = rect.height || window.innerHeight;

        frustumH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * cameraDistance;
        frustumW = frustumH * (width / height);

        const fillH = 0.92 * frustumH / G;
        const fillW = 0.94 * frustumW / X;
        const isPortrait = width < height;
        scaleS = isPortrait ? fillH : Math.min(fillH, fillW);

        material.uniforms.uWaveformWidth.value = (frustumH / 0.3428978) / scaleS * 1.15;
        material.uniforms.uSpiralRadius.value = (0.2 * frustumH) / scaleS;
        material.uniforms.uSize.value = THREE.MathUtils.clamp((height / 900) * 5.5, 2.4, 7.0);
        material.uniforms.uAspect.value = width / height;
        material.uniforms.uIsPortrait.value = +isPortrait;
        material.uniforms.uRingRadius.value = 0.07 * X;
        material.uniforms.uGlobeScale.value = isPortrait ? 0.6 : 1.0;
        material.uniforms.uIndiaScale.value = isPortrait ? 0.7 : 1.0;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      onResize();
      window.addEventListener("resize", onResize, { passive: true });

      // Telemetry HUD updates
      if (hudParticlesElem) {
        hudParticlesElem.textContent = count.toLocaleString();
      }

      let targetScrollY = window.scrollY;
      let smoothScrollY = window.scrollY;
      let lastSmoothScrollY = window.scrollY;

      window.addEventListener("scroll", () => {
        targetScrollY = window.scrollY;
      }, { passive: true });

      let frameCounter = 0;
      let lastFpsCheck = performance.now();

      // Main Animation Loop
      const animate = (now) => {
        const dt = Math.min((now - lastTime) / 1000, 0.03);
        lastTime = now;

        // FPS calculation
        frameCounter++;
        if (now - lastFpsCheck >= 1000) {
          const fps = Math.round((frameCounter * 1000) / (now - lastFpsCheck));
          if (canvasFpsElem) canvasFpsElem.textContent = `${fps} FPS`;
          if (headerFpsElem) headerFpsElem.textContent = `${fps} FPS`;
          frameCounter = 0;
          lastFpsCheck = now;
        }

        // Fluid exponential damping for scroll position (eliminates jittery notches)
        const scrollDamping = 1 - Math.exp(-dt * 7.5);
        smoothScrollY += (targetScrollY - smoothScrollY) * scrollDamping;

        const scrollDelta = Math.abs(smoothScrollY - lastSmoothScrollY) / Math.max(dt, 0.001);
        lastSmoothScrollY = smoothScrollY;

        const turbTarget = THREE.MathUtils.clamp(scrollDelta / 2000, 0, 1);
        turbulence += (turbTarget - turbulence) * (1 - Math.exp(-dt / 0.15));
        material.uniforms.uTurbulence.value = turbulence;

        const time = (material.uniforms.uTime.value += dt);

        // Smooth pointer interpolation
        const followSpeed = 1 - Math.exp(-dt / 0.35);
        const settleSpeed = 1 - Math.exp(-dt / 1.1);
        currentPointer.lerp(pointerNDC, followSpeed);
        currentPointer.x = THREE.MathUtils.clamp(currentPointer.x, -1, 1);
        currentPointer.y = THREE.MathUtils.clamp(currentPointer.y, -1, 1);
        pointerActive += (pointerTargetActive - pointerActive) * (pointerTargetActive > pointerActive ? followSpeed : settleSpeed);

        // State B -> C: Formation progress
        if (material.uniforms.uFormation.value < 1.0) {
          material.uniforms.uFormation.value = Math.min(material.uniforms.uFormation.value + dt / 2.0, 1.0);
        }
        const formation = material.uniforms.uFormation.value;

        // Fluid scroll morph progression based on smoothScrollY
        const vh = window.innerHeight;
        const smoothScrollRatio = smoothScrollY / vh;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

        // Stage 0 -> 1: Bust to Globe (Section 1 Selected Works)
        const m1 = THREE.MathUtils.clamp((smoothScrollRatio - 0.6) / 0.9, 0, 1);
        const morph1 = m1 * m1 * (3 - 2 * m1);
        material.uniforms.uMorph.value = morph1;

        // Stage 1 -> 2: Globe to 3D Map of INDIA (Section 2 Lab / Location)
        const m2 = THREE.MathUtils.clamp((smoothScrollRatio - 1.7) / 0.9, 0, 1);
        const morph2 = m2 * m2 * (3 - 2 * m2);
        material.uniforms.uMorph2.value = morph2;

        // Stage 2 -> 3: India Map to Double Helix DNA Wave (Section 3 Career)
        const m3 = THREE.MathUtils.clamp((smoothScrollRatio - 2.8) / 0.9, 0, 1);
        const morph3 = m3 * m3 * (3 - 2 * m3);
        material.uniforms.uMorph3.value = morph3;

        // Continuous wave slide along X
        const slideProgress = Math.max(0, smoothScrollRatio - 3.7);
        const workSlide = THREE.MathUtils.clamp(slideProgress / 2.5, 0, 1);
        material.uniforms.uWorkSlide.value = workSlide;

        // Stage 4: 3D Tunnel Vortex (Section 4 Core & Section 5 Philosophy)
        const m4 = THREE.MathUtils.clamp((smoothScrollRatio - 4.8) / 0.9, 0, 1);
        const morph4 = m4 * m4 * (3 - 2 * m4);
        material.uniforms.uMorph4.value = morph4;

        // Stage 5: Calm, Majestic Swirling Cosmic Vortex Animation at the end (Contact Section)
        const endTriggerDist = window.innerHeight * 2.2;
        const distFromBottom = maxScroll - smoothScrollY;
        const endProgress = THREE.MathUtils.clamp(1.0 - distFromBottom / endTriggerDist, 0, 1);
        const morph5 = endProgress * endProgress * (3 - 2 * endProgress);
        material.uniforms.uMorph5.value = morph5;

        // Idle subtle organic head breathing sway
        const idleX = Math.sin(0.16 * time) * 0.12;
        const idleY = -(Math.sin(0.11 * time + 1.4) * 0.12 * 0.4);

        const ep = (val, maxLim) => maxLim * Math.tanh(val / maxLim);
        const headTurn = 0.16;
        const maxTurn = 0.22;

        // morphFade ensures complete pure return to head pose when at the top (smoothScrollRatio -> 0)
        const morphFade = Math.max(0, 1.0 - morph1 * 1.25);

        // Calm, gentle rotation rates at the end (slowed down from rapid spinning)
        const targetRotY = (ep(THREE.MathUtils.lerp(idleX, currentPointer.x * headTurn, pointerActive) * formation, maxTurn) - 0.45 * smoothScrollRatio * morphFade) * morphFade + (time * 0.05) * morph5;
        const targetRotX = ep(THREE.MathUtils.lerp(idleY, -currentPointer.y * headTurn * 0.6, pointerActive) * formation, 0.6 * maxTurn) * morphFade + (Math.sin(time * 0.3) * 0.04) * morph5;
        const targetRotZ = 0.35 * morph3 * (1.0 - morph4) + (time * 0.08) * morph5;

        // Smoothly lerp headGroup rotation so reversals are buttery smooth with zero residual offset
        const rotEase = 1 - Math.exp(-dt * 8.0);
        headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * rotEase;
        headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * rotEase;
        headGroup.rotation.z += (targetRotZ - headGroup.rotation.z) * rotEase;

        material.uniforms.uPointer.value.copy(currentPointer);
        material.uniforms.uGlow.value = 2.0 * pointerActive;

        // Scale & Position bust on landing with smooth lerp
        const scaleVal = scaleS * (1 + smoothScrollRatio * 0.16 * morphFade) * (1 + 0.45 * workSlide);
        headGroup.scale.set(scaleVal, scaleVal, scaleVal);

        const landingY = -frustumH / 2 - minY * scaleVal + 0.02 * frustumH;
        const morphY = -THREE.MathUtils.lerp(THREE.MathUtils.lerp(V, indiaCenterY, morph2), 0, morph3) * scaleVal;
        const endY = -0.1 * frustumH;
        const targetY = THREE.MathUtils.lerp(THREE.MathUtils.lerp(landingY, morphY, morph1), endY, morph5);
        headGroup.position.y += (targetY - headGroup.position.y) * rotEase;

        const targetX = -0.22 * morph3 * frustumW * (1.0 - morph5);
        headGroup.position.x += (targetX - headGroup.position.x) * rotEase;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }

})();
