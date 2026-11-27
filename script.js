(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Preloader: short, deterministic, and never blocks the page indefinitely.
  const preloader = $('#preloader');
  const loaderBar = $('#loaderBar');
  const loaderPercent = $('#loaderPercent');
  const loaderStatus = $('#loaderStatus');
  document.body.classList.add('is-loading');
  const loaderStates = ['Gathering the pieces', 'Setting the scene', 'Almost ready'];
  let loaderValue = 0;
  const loaderTimer = window.setInterval(() => {
    loaderValue = Math.min(100, loaderValue + (loaderValue < 70 ? 3 : 5));
    if (loaderBar) loaderBar.style.width = `${loaderValue}%`;
    if (loaderPercent) loaderPercent.textContent = `${String(loaderValue).padStart(2, '0')}%`;
    if (loaderStatus) loaderStatus.textContent = loaderStates[Math.min(2, Math.floor(loaderValue / 36))];
    if (loaderValue >= 100) window.clearInterval(loaderTimer);
  }, 28);
  let loaderFinished = false;
  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;
    window.clearInterval(loaderTimer);
    if (loaderBar) loaderBar.style.width = '100%';
    if (loaderPercent) loaderPercent.textContent = '100%';
    window.setTimeout(() => {
      if (preloader) preloader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      window.setTimeout(() => preloader?.remove(), 950);
      updateOpening();
    }, 180);
  }
  window.addEventListener('load', finishLoader, { once: true });
  window.setTimeout(finishLoader, 2400);

  // In-view content reveal.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });
  $$('.reveal').forEach(node => revealObserver.observe(node));

  // Custom cursor on desktop only.
  if (finePointer && !reducedMotion) {
    const glow = $('.cursor-glow');
    const dot = $('.cursor-dot');
    let px = 0, py = 0, gx = 0, gy = 0;
    document.body.classList.add('cursor-ready');
    window.addEventListener('pointermove', event => { px = event.clientX; py = event.clientY; }, { passive: true });
    const cursorFrame = () => {
      gx += (px - gx) * 0.16;
      gy += (py - gy) * 0.16;
      if (glow) glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
      if (dot) dot.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%)`;
      requestAnimationFrame(cursorFrame);
    };
    requestAnimationFrame(cursorFrame);
  }

  // Cinematic scroll entrance. The photo zooms toward the viewer as the visitor scrolls.
  const opening = $('#opening');
  const openingBackdrop = $('#openingBackdrop');
  const openingPortrait = $('#openingPortrait');
  const openingCopy = $('#openingCopy');
  const openingBottom = $('#openingBottom');
  const openingEnter = $('#openingEnter');
  const openingPercent = $('#openingPercent');
  const openingSticky = $('#openingSticky');
  const siteHeader = $('#siteHeader');
  let openingQueued = false;
  function updateOpening() {
    if (!opening) return;
    const rect = opening.getBoundingClientRect();
    const travel = Math.max(1, opening.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / travel);
    // Ease quickly through the photo so the opening feels cinematic, not like a long loading level.
    const easeIn = 1 - Math.pow(1 - p, 2.15);
    if (openingBackdrop) {
      openingBackdrop.style.transform = `scale(${1.12 + easeIn * 1.62}) translate3d(0, ${-easeIn * 5.5}%, 0)`;
      openingBackdrop.style.filter = `blur(${20 + easeIn * 7}px) brightness(${0.32 - easeIn * 0.08}) saturate(${0.68 + easeIn * 0.12})`;
    }
    if (openingPortrait && !reducedMotion) {
      openingPortrait.style.transform = `scale(${1.02 + easeIn * 2.05}) translate3d(${easeIn * -1.6}%, ${easeIn * -3.5}%, 0)`;
      openingPortrait.style.opacity = String(0.96 - clamp((p - 0.57) / 0.43) * 0.96);
    }
    if (openingCopy) {
      openingCopy.style.opacity = String(1 - clamp(p / 0.52));
      openingCopy.style.transform = `translate3d(0, calc(-50% - ${p * 125}px), 0) scale(${1 - p * 0.13})`;
    }
    if (openingBottom) openingBottom.style.opacity = String(1 - clamp(p / 0.45));
    if (openingEnter) {
      const enter = clamp((p - 0.68) / 0.28);
      openingEnter.style.opacity = String(enter);
      openingEnter.style.transform = `translate(-50%,-50%) scale(${0.82 + enter * 0.18})`;
      if (openingSticky) openingSticky.style.backgroundColor = `rgb(${Math.round(9 + enter * 7)},${Math.round(11 + enter * 9)},${Math.round(18 + enter * 25)})`;
    }
    if (openingPercent) openingPercent.textContent = String(Math.round(p * 100)).padStart(2, '0');
    if (siteHeader) siteHeader.classList.toggle('ready', p > 0.91 || window.scrollY > opening.offsetHeight - window.innerHeight + 15);
    const pageProgress = $('#pageProgress');
    if (pageProgress) {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      pageProgress.style.width = `${clamp(window.scrollY / total) * 100}%`;
    }
  }
  function queueOpening() {
    if (openingQueued) return;
    openingQueued = true;
    requestAnimationFrame(() => { updateOpening(); openingQueued = false; });
  }
  window.addEventListener('scroll', queueOpening, { passive: true });
  window.addEventListener('resize', queueOpening);
  updateOpening();

  // Mobile navigation.
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      mainNav.classList.toggle('open', open);
    });
    $$('.nav-link', mainNav).forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
    }));
  }

  // Active nav item follows scroll position.
  const navLinks = $$('.nav-link');
  const navSections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -52% 0px' });
  navSections.forEach(section => activeObserver.observe(section));

  // Reliable lanyard interaction.
  // The original card stays in its lanyard rig at all times. A temporary clone is
  // lifted to the viewport for dragging, then removed after a spring-back animation.
  // This avoids reparenting/pointer-capture edge cases that could hide or strand the card.
  const card = $('#identityCard');
  const clip = $('.lanyard-clip');
  const dragHint = $('#dragHint');
  if (card && clip) {
    const drag = {
      active: false,
      pointerId: null,
      clone: null,
      overlay: null,
      path: null,
      left: 0,
      top: 0,
      homeLeft: 0,
      homeTop: 0,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
      angle: 0,
      vx: 0,
      vy: 0,
      va: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      frame: 0,
      anchorX: 0,
      anchorY: 0
    };

    const removeOverlay = () => {
      if (drag.overlay) drag.overlay.remove();
      drag.overlay = null;
      drag.path = null;
    };

    const createOverlay = () => {
      removeOverlay();
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('class', 'lanyard-drag-overlay');
      svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const defs = document.createElementNS(ns, 'defs');
      const gradient = document.createElementNS(ns, 'linearGradient');
      gradient.setAttribute('id', 'lanyardDragGradientV6');
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('x2', '1');
      [['0', '#2c4fc8'], ['.5', '#8ba6ff'], ['1', '#385bd1']].forEach(([offset, color]) => {
        const stop = document.createElementNS(ns, 'stop');
        stop.setAttribute('offset', offset);
        stop.setAttribute('stop-color', color);
        gradient.appendChild(stop);
      });
      defs.appendChild(gradient);
      svg.appendChild(defs);
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#lanyardDragGradientV6)');
      path.setAttribute('stroke-width', '10');
      path.setAttribute('stroke-linecap', 'round');
      path.style.filter = 'drop-shadow(0 7px 9px rgba(38,61,145,.23))';
      svg.appendChild(path);
      document.body.appendChild(svg);
      drag.overlay = svg;
      drag.path = path;
    };

    const drawCord = () => {
      if (!drag.path) return;
      const endX = drag.left + drag.width * .5;
      const endY = drag.top + 10;
      const dx = endX - drag.anchorX;
      const dy = endY - drag.anchorY;
      const bend = Math.max(42, Math.min(210, Math.abs(dy) * .34 + Math.abs(dx) * .13));
      const c1x = drag.anchorX + dx * .18;
      const c1y = drag.anchorY + bend;
      const c2x = endX - dx * .18;
      const c2y = endY - bend * .52;
      drag.path.setAttribute('d', `M ${drag.anchorX} ${drag.anchorY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`);
    };

    const paintClone = () => {
      if (!drag.clone) return;
      drag.clone.style.left = `${drag.left}px`;
      drag.clone.style.top = `${drag.top}px`;
      drag.clone.style.transform = `rotate(${drag.angle}deg)`;
      drawCord();
    };

    const stopSpring = () => {
      if (drag.frame) cancelAnimationFrame(drag.frame);
      drag.frame = 0;
    };

    const finishImmediately = () => {
      stopSpring();
      drag.active = false;
      drag.pointerId = null;
      drag.clone?.remove();
      drag.clone = null;
      removeOverlay();
      card.classList.remove('is-drag-source');
      if (dragHint) dragHint.classList.remove('is-used');
    };

    const springHome = () => {
      stopSpring();
      if (!drag.clone) {
        finishImmediately();
        return;
      }
      let last = performance.now();
      const tick = now => {
        const dt = Math.min(2.2, Math.max(.5, (now - last) / 16.67 || 1));
        last = now;
        const stiffness = .105 * dt;
        const damping = Math.pow(.77, dt);
        drag.vx = (drag.vx - (drag.left - drag.homeLeft) * stiffness) * damping;
        drag.vy = (drag.vy - (drag.top - drag.homeTop) * stiffness) * damping;
        drag.va = (drag.va - drag.angle * stiffness * 1.5) * damping;
        drag.left += drag.vx * dt;
        drag.top += drag.vy * dt;
        drag.angle += drag.va * dt;
        paintClone();
        const close = Math.abs(drag.left - drag.homeLeft) < .7 && Math.abs(drag.top - drag.homeTop) < .7;
        const slow = Math.abs(drag.vx) < .38 && Math.abs(drag.vy) < .38 && Math.abs(drag.angle) < .22;
        if (close && slow) {
          finishImmediately();
          return;
        }
        drag.frame = requestAnimationFrame(tick);
      };
      drag.frame = requestAnimationFrame(tick);
    };

    card.addEventListener('dragstart', event => event.preventDefault());
    card.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      if (drag.active || drag.clone) return;
      event.preventDefault();
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      drag.width = rect.width;
      drag.height = rect.height;
      drag.left = rect.left;
      drag.top = rect.top;
      drag.homeLeft = rect.left;
      drag.homeTop = rect.top;
      drag.offsetX = event.clientX - rect.left;
      drag.offsetY = event.clientY - rect.top;
      const clipRect = clip.getBoundingClientRect();
      drag.anchorX = clipRect.left + clipRect.width * .5;
      drag.anchorY = clipRect.bottom;
      drag.angle = 0;
      drag.vx = drag.vy = drag.va = 0;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = performance.now();
      drag.pointerId = event.pointerId;
      drag.active = true;

      const clone = card.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('dragging', 'drag-clone');
      clone.style.position = 'fixed';
      clone.style.left = `${drag.left}px`;
      clone.style.top = `${drag.top}px`;
      clone.style.width = `${drag.width}px`;
      clone.style.height = `${drag.height}px`;
      clone.style.margin = '0';
      clone.style.zIndex = '1101';
      clone.style.transform = 'rotate(0deg)';
      clone.style.transformOrigin = '50% 14px';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'none';
      clone.style.cursor = 'grabbing';
      document.body.appendChild(clone);
      drag.clone = clone;
      card.classList.add('is-drag-source');
      createOverlay();
      paintClone();
      if (dragHint) dragHint.classList.add('is-used');
    });

    window.addEventListener('pointermove', event => {
      if (!drag.active || event.pointerId !== drag.pointerId || !drag.clone) return;
      const now = performance.now();
      const elapsed = Math.max(8, now - drag.lastT);
      const maxLeft = Math.max(8, window.innerWidth - drag.width - 8);
      const maxTop = Math.max(8, window.innerHeight - drag.height - 8);
      drag.left = clamp(event.clientX - drag.offsetX, 8, maxLeft);
      drag.top = clamp(event.clientY - drag.offsetY, 8, maxTop);
      const dx = (event.clientX - drag.lastX) / elapsed * 16.67;
      const dy = (event.clientY - drag.lastY) / elapsed * 16.67;
      drag.vx = clamp(dx, -34, 34);
      drag.vy = clamp(dy, -34, 34);
      drag.va = clamp(drag.vx * .2 + drag.vy * .055, -7, 7);
      drag.angle = clamp(drag.vx * .16 + drag.vy * .035, -17, 17);
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = now;
      paintClone();
      event.preventDefault();
    }, { passive: false });

    const endDrag = event => {
      if (!drag.active) return;
      if (event && event.pointerId !== undefined && event.pointerId !== drag.pointerId) return;
      drag.active = false;
      drag.pointerId = null;
      springHome();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('blur', finishImmediately);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && (drag.active || drag.clone)) finishImmediately();
    });
    window.addEventListener('resize', () => {
      if (!drag.clone) return;
      drag.left = clamp(drag.left, 8, Math.max(8, window.innerWidth - drag.width - 8));
      drag.top = clamp(drag.top, 8, Math.max(8, window.innerHeight - drag.height - 8));
      drag.homeLeft = clamp(drag.homeLeft, 8, Math.max(8, window.innerWidth - drag.width - 8));
      drag.homeTop = clamp(drag.homeTop, 8, Math.max(8, window.innerHeight - drag.height - 8));
      if (drag.overlay) drag.overlay.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
      paintClone();
    });
  }

  // Process scrollytelling: the workspace assembles as the section progresses.
  const processTrack = $('#process');
  const assemblyStage = $('#assemblyStage');
  const processTitle = $('#processTitle');
  const processDescription = $('#processDescription');
  const processStep = $('#processStep');
  const processStepFill = $('#processStepFill');
  const assemblyMode = $('#assemblyMode');
  const assemblyPercent = $('#assemblyPercent');
  const wires = $$('.assembly-wires path');
  const phases = [
    { title: 'Everything<br>starts with<br><em>a question.</em>', description: 'Rasa penasaran menjadi pemantik. Ada hal yang ingin dicoba, kebutuhan yang ingin dipahami, atau ide yang ingin diwujudkan.', mode: 'IDEA' },
    { title: 'Give the idea<br><em>a direction.</em>', description: 'Mulai menyusun tujuan, kebutuhan, dan alur. Ide yang masih abstrak perlahan menemukan bentuk dan prioritas.', mode: 'STRUCTURE' },
    { title: 'Turn plans<br>into <em>practice.</em>', description: 'Masuk ke proses membangun: menulis kode, menghubungkan komponen, menguji interaksi, dan memperbaiki hal yang belum sesuai.', mode: 'BUILD' },
    { title: 'Make it work.<br><em>Make it matter.</em>', description: 'Hasilnya bukan akhir dari perjalanan. Karya yang sudah bisa digunakan menjadi awal untuk evaluasi dan pengembangan berikutnya.', mode: 'LIVE' }
  ];
  let processQueued = false;
  function updateProcess() {
    if (!processTrack || !assemblyStage) return;
    const rect = processTrack.getBoundingClientRect();
    const travel = Math.max(1, processTrack.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / travel);
    const eased = p * p * (3 - 2 * p);
    const step = Math.min(3, Math.floor(p * 4));
    const phase = phases[step];
    assemblyStage.style.setProperty('--progress', eased.toFixed(4));
    assemblyStage.dataset.step = String(step);
    if (processTitle && processTitle.dataset.phase !== String(step)) {
      processTitle.innerHTML = phase.title;
      processTitle.dataset.phase = String(step);
    }
    if (processDescription && processDescription.dataset.phase !== String(step)) {
      processDescription.textContent = phase.description;
      processDescription.dataset.phase = String(step);
    }
    if (processStep) processStep.textContent = `0${step + 1}`;
    if (processStepFill) processStepFill.style.width = `${((step + (p * 4 % 1)) / 4) * 100}%`;
    if (assemblyMode) assemblyMode.textContent = `MODE: ${phase.mode}`;
    if (assemblyPercent) assemblyPercent.textContent = `${String(Math.round(p * 100)).padStart(2, '0')}%`;
    wires.forEach((path, i) => {
      const length = path.getTotalLength ? path.getTotalLength() : 700;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length * (1 - clamp(eased * (1.25 + i * .12)))}`;
    });
  }
  function queueProcess() {
    if (processQueued) return;
    processQueued = true;
    requestAnimationFrame(() => { updateProcess(); processQueued = false; });
  }
  window.addEventListener('scroll', queueProcess, { passive: true });
  window.addEventListener('resize', queueProcess);
  updateProcess();

  // Gentle magnetic buttons on desktop.
  if (finePointer && !reducedMotion) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) * .075;
        const dy = (event.clientY - rect.top - rect.height / 2) * .095;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    const projectPreview = $('.project-visual');
    const browserFrame = $('.browser-frame');
    if (projectPreview && browserFrame) {
      projectPreview.addEventListener('pointermove', event => {
        const rect = projectPreview.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        browserFrame.style.transform = `perspective(1200px) rotateX(${3 - y * 5}deg) rotateY(${-7 + x * 8}deg) translateY(-2px)`;
      });
      projectPreview.addEventListener('pointerleave', () => { browserFrame.style.transform = ''; });
    }
  }

  // Clickable toolkit bubbles: switch the detail panel and spring the selected orb.
  const toolCards = $$('.tool-card');
  const toolkitFocus = $('#toolkitFocus');
  const toolFocusNo = $('#toolFocusNo');
  const toolFocusKicker = $('#toolFocusKicker');
  const toolFocusTitle = $('#toolFocusTitle');
  const toolFocusDetail = $('#toolFocusDetail');
  const toolFocusApplication = $('#toolFocusApplication');
  const toolFocusSymbol = $('#toolFocusSymbol');
  const toolSymbols = { html: '5', css: '✳', javascript: 'JS', 'apps-script': '{ }', sheets: '▦', three: '◇' };
  toolCards.forEach((tool, index) => {
    tool.addEventListener('click', () => {
      toolCards.forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-pressed', 'false'); });
      tool.classList.add('is-active'); tool.setAttribute('aria-pressed', 'true');
      if (toolFocusNo) toolFocusNo.textContent = String(index + 1).padStart(2, '0');
      if (toolFocusKicker) toolFocusKicker.textContent = tool.dataset.kicker || '';
      if (toolFocusTitle) toolFocusTitle.textContent = tool.dataset.title || '';
      if (toolFocusDetail) toolFocusDetail.textContent = tool.dataset.detail || '';
      if (toolFocusApplication) toolFocusApplication.textContent = tool.dataset.application || '';
      if (toolFocusSymbol) toolFocusSymbol.textContent = toolSymbols[tool.dataset.tool] || '✳';
      if (toolkitFocus) {
        toolkitFocus.classList.remove('bubble-change'); void toolkitFocus.offsetWidth; toolkitFocus.classList.add('bubble-change');
        window.setTimeout(() => toolkitFocus.classList.remove('bubble-change'), 700);
      }
    });
  });

  // Global liquid micro-interaction inspired by a soft, expanding bubble.
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('a, button, summary, .explore-card, .principle, .profile-fact');
    if (!target || target.id === 'identityCard' || target.closest('#identityCard') || reducedMotion) return;
    const bubble = document.createElement('span');
    bubble.className = 'click-bubble';
    bubble.style.left = `${event.clientX}px`; bubble.style.top = `${event.clientY}px`;
    document.body.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 720);
  }, { passive: true });

  // Mini idea generator.
  const ideaType = $('#ideaType');
  const ideaGoal = $('#ideaGoal');
  const ideaMood = $('#ideaMood');
  const ideaTitle = $('#ideaTitle');
  const ideaDescription = $('#ideaDescription');
  const ideaNumber = $('#ideaNumber');
  const ideaTagType = $('#ideaTagType');
  const ideaTagMood = $('#ideaTagMood');
  const generateIdea = $('#generateIdea');
  const copyIdea = $('#copyIdea');
  let ideaCount = 1;
  let currentIdea = '';
  const typeLabels = { website: 'WEBSITE', dashboard: 'DASHBOARD', game: 'BROWSER GAME', tool: 'PRODUCTIVITY TOOL' };
  const moodLabels = ['EDITORIAL', 'CINEMATIC', 'PASTEL', 'INTERACTIVE'];
  function buildIdea() {
    if (!ideaType || !ideaGoal || !ideaMood || !ideaTitle || !ideaDescription) return;
    const type = ideaType.value;
    const goal = ideaGoal.value;
    const mood = ideaMood.value;
    const moodLabel = mood.includes('editorial') ? moodLabels[0] : mood.includes('cinematic') ? moodLabels[1] : mood.includes('pastel') ? moodLabels[2] : moodLabels[3];
    const titleMap = { website: 'Satu ruang<br><em>yang terhubung.</em>', dashboard: 'Pusat kendali<br><em>yang sederhana.</em>', game: 'Petualangan<br><em>kecil di browser.</em>', tool: 'Teman kerja<br><em>digital.</em>' };
    ideaTitle.innerHTML = titleMap[type];
    ideaDescription.textContent = `Rancang ${type === 'website' ? 'sebuah website interaktif' : type === 'dashboard' ? 'sebuah dashboard ringkas' : type === 'game' ? 'sebuah game berbasis browser' : 'sebuah tools digital'} untuk ${goal}, dengan pendekatan visual ${mood} dan interaksi yang mudah dipahami.`;
    ideaTagType.textContent = typeLabels[type];
    ideaTagMood.textContent = moodLabel;
    ideaCount += 1;
    ideaNumber.textContent = String(ideaCount).padStart(3, '0');
    currentIdea = `${ideaTitle.innerText.replace(/\n/g, ' ')}\n${ideaDescription.textContent}\nType: ${typeLabels[type]} · Mood: ${moodLabel}`;
    const output = $('.lab-output');
    if (output) { output.classList.remove('idea-pop'); void output.offsetWidth; output.classList.add('idea-pop'); }
    if (copyIdea) copyIdea.innerHTML = '<span>Salin gagasan</span><b>⌘</b>';
  }
  generateIdea?.addEventListener('click', buildIdea);
  copyIdea?.addEventListener('click', async () => {
    const text = currentIdea || `${ideaTitle?.innerText || ''}\n${ideaDescription?.textContent || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      copyIdea.innerHTML = '<span>Berhasil disalin</span><b>✓</b>';
    } catch (_) {
      const temp = document.createElement('textarea');
      temp.value = text; document.body.appendChild(temp); temp.select();
      const ok = document.execCommand('copy'); temp.remove();
      copyIdea.innerHTML = ok ? '<span>Berhasil disalin</span><b>✓</b>' : '<span>Salin manual</span><b>⌘</b>';
    }
    window.setTimeout(() => { if (copyIdea) copyIdea.innerHTML = '<span>Salin gagasan</span><b>⌘</b>'; }, 1800);
  });
  buildIdea();

  // FAQ accordion: keep one answer open at a time for a calmer reading experience.
  const faqItems = $$('.faq-list details');
  faqItems.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => { if (other !== item) other.open = false; });
  }));

  // Add a graceful image fallback class if any local image is missing.
  $$('img').forEach(img => img.addEventListener('error', () => img.classList.add('image-missing'), { once: true }));
})();
