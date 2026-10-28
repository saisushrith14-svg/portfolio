
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
