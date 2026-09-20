/* ==========================================================================
   ANIRUDH R - PORTFOLIO CORE INTERACTIVITY & APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sound Synthesis Engine (Web Audio API) ---
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playSound(type = 'click') {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'terminal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.setAttribute('title', soundEnabled ? 'Sound Enabled' : 'Sound Muted');
      showToast(soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted');
      if (soundEnabled) playSound('pop');
    });
  }

  // Generic click sound for interactive elements
  document.querySelectorAll('button, a, .filter-btn, .cmd-k-trigger, .palette-item').forEach((el) => {
    el.addEventListener('click', () => {
      if (soundEnabled) playSound('click');
    });
  });

  // --- 2. Ambient Atmospheric Spotlight ---
  // Ambient glow operates purely via CSS keyframe breathing animation without tracking cursor

  // --- 3. Kinetic 3D Glowing Pill Rotator ---
  const pillTrack = document.getElementById('kinetic-pill-track');
  const pillItems = document.querySelectorAll('.kinetic-pill-item');
  let currentPillIdx = 0;
  const totalPills = pillItems.length;

  if (pillTrack && totalPills > 0) {
    setInterval(() => {
      pillItems[currentPillIdx].classList.remove('active');
      currentPillIdx = (currentPillIdx + 1) % totalPills;
      pillItems[currentPillIdx].classList.add('active');
      pillTrack.style.transform = `translateY(-${currentPillIdx * 54}px)`;
    }, 2800);
  }

  // --- 4. Hero Cyber Showcase Tile ---
  // The tile floats autonomously with rotating cyber border beam & HUD corners

  // --- 5. Navbar Sticky State & Active Section Tracking ---
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 6. Toast Notification System ---
  const toastContainer = document.getElementById('toast-container');
  window.showToast = function (message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // --- 7. Copy Email to Clipboard ---
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'anirudh.eng@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Email copied: anirudh.eng@outlook.com');
        playSound('pop');
      });
    });
  });

  // --- 8. Project Filter Tabs ---
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'toast-in 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 9. Skills Filter Tabs ---
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 10. Architecture Deep-Dive Modal Data & Logic ---
  const projectData = {
    cognitix: {
      title: 'Cognitix: Autonomous Multi-Agent AI Orchestrator',
      category: 'AI & Machine Learning',
      overview: 'A production-grade distributed orchestration platform coordinating stateful autonomous LLM agents across complex multi-step reasoning workflows. Features dynamic branching, self-correcting agent loops, and real-time execution graphs.',
      architecture: [
        'LangGraph + FastAPI event-driven async state machines.',
        'Hybrid Redis vector memory store with semantic caching yielding a 65% reduction in model token costs.',
        'Streaming SSE telemetry engine for sub-second agent thought visualization.',
        'Self-healing sandbox executor isolated via gVisor microVM containers.'
      ],
      metrics: [
        '98.6% Workflow task completion accuracy on multi-turn benchmarks.',
        '154 concurrent agent nodes handling up to 1.2M API requests/day.',
        'Sub-15ms coordination dispatch latency.'
      ]
    },
    hyperion: {
      title: 'Synapse Cloud: Global Distributed Telemetry & Edge Mesh',
      category: 'Cloud & Distributed Systems',
      overview: 'Ultra-high-throughput observability mesh engineered in Go and Rust. Ingests raw telemetry, metrics, and distributed traces from edge points-of-presence globally, aggregating them into a high-density ClickHouse cluster with live WebSockets.',
      architecture: [
        'Zero-copy eBPF kernel network probes capturing low-overhead edge telemetry.',
        'Raft consensus layer providing partition-tolerant configuration propagation.',
        'Lock-free ring buffers in Rust delivering wire-speed metric ingestion.',
        'Tail-based distributed tracing with adaptive dynamic sampling algorithms.'
      ],
      metrics: [
        '1.4 Million Requests per second peak ingestion rate.',
        'Average query latency of 24.1ms across 1.2 Petabytes of telemetry.',
        '99.8% proven high-availability across multi-region failovers.'
      ]
    },
    lumina: {
      title: 'Genesis 3D / Lumina: Real-Time WebGL Generative Engine',
      category: 'Creative Tech & WebGL',
      overview: 'Interactive web-based 3D node-graph shader and mesh synthesis environment. Empowers technical artists and designers to assemble custom procedural GLSL shaders and complex 3D scenes running directly in the browser.',
      architecture: [
        'Custom WebGL2 & WebGPU render pipeline with post-processing bloom, SSAO, and volumetric lighting.',
        'Node-graph AST compiler compiling visual node trees directly into optimized GLSL fragment/vertex shaders.',
        'WebAssembly SIMD physics math module calculating 240,000+ wireframe mesh vertices in real time.',
        'Local-first persistent workspace using IndexedDB and CRDTs for collaborative editing.'
      ],
      metrics: [
        'Solid 60 FPS viewport rendering at 4K resolution on modern hardware.',
        'Instant compilation of 100+ procedural node shader permutations.',
        'Under 2.1MB total initial bundle footprint with zero runtime bloat.'
      ]
    },
    chronodb: {
      title: 'ChronoDB: High-Throughput In-Memory Time Series Engine',
      category: 'Systems & Performance',
      overview: 'Custom storage engine built in Rust to handle high-frequency financial and sensor time-series data. Utilizes columnar compression algorithms (Gorilla XOR + Run Length Encoding) for maximum density.',
      architecture: [
        'LSM-tree inspired memory-mapped write-ahead logging (WAL).',
        'Gorilla XOR floating-point delta compression saving 82% RAM.',
        'Async gRPC streaming interfaces backed by Tokio multi-threaded runtime.',
        'Zero garbage collection pauses guaranteeing predictable tail latency.'
      ],
      metrics: [
        '10x higher write throughput compared to standard relational time series setups.',
        '<4ms P99 query response time under heavy concurrent read loads.',
        '82% memory compression ratio on raw metric feeds.'
      ]
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalOverview = document.getElementById('modal-overview');
  const modalArchList = document.getElementById('modal-arch-list');
  const modalMetricsList = document.getElementById('modal-metrics-list');

  document.querySelectorAll('.deep-dive-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalBadge.textContent = data.category;
      modalTitle.textContent = data.title;
      modalOverview.textContent = data.overview;

      modalArchList.innerHTML = data.architecture.map((item) => `<li>${item}</li>`).join('');
      modalMetricsList.innerHTML = data.metrics.map((item) => `<li><strong>Metric:</strong> ${item}</li>`).join('');

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSound('pop');
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      playSound('click');
    }
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- 11. Command Palette (Ctrl+K / Cmd+K) ---
  const paletteOverlay = document.getElementById('palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteItems = document.querySelectorAll('.palette-item');
  const cmdKTriggers = document.querySelectorAll('.cmd-k-trigger');

  function openPalette() {
    paletteOverlay?.classList.add('active');
    paletteInput?.focus();
    if (paletteInput) paletteInput.value = '';
    filterPalette('');
    document.body.style.overflow = 'hidden';
    playSound('pop');
  }

  function closePalette() {
    paletteOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cmdKTriggers.forEach((btn) => btn.addEventListener('click', openPalette));

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteOverlay?.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape') {
      closePalette();
      closeModal();
    }
  });

  paletteOverlay?.addEventListener('click', (e) => {
    if (e.target === paletteOverlay) closePalette();
  });

  function filterPalette(query) {
    const q = query.toLowerCase().trim();
    paletteItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  paletteInput?.addEventListener('input', (e) => {
    filterPalette(e.target.value);
  });

  paletteItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      handlePaletteAction(action);
      closePalette();
    });
  });

  function handlePaletteAction(action) {
    switch (action) {
      case 'goto-projects':
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto-skills':
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto-experience':
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto-terminal':
        document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('terminal-input')?.focus();
        break;
      case 'goto-contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'copy-email':
        navigator.clipboard.writeText('anirudh.eng@outlook.com');
        showToast('📋 Email copied: anirudh.eng@outlook.com');
        break;
      case 'toggle-sound':
        soundToggleBtn?.click();
        break;
      case 'theme-emerald':
        document.body.className = 'theme-emerald';
        showToast('🟢 Emerald Theme Activated');
        break;
      case 'theme-purple':
        document.body.className = 'theme-purple';
        showToast('🟣 Cyber Purple Theme Activated');
        break;
      case 'theme-default':
        document.body.className = '';
        showToast('⚡ Obsidian Cyan Theme Activated');
        break;
    }
  }

  // --- 12. Interactive Developer Terminal / Playground ---
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const termQuickBtns = document.querySelectorAll('.term-quick-btn');

  const termCommands = {
    help: `Available commands:
  • about       - Overview of Anirudh R & engineering philosophy
  • skills      - Core tech stack & proficiencies
  • projects    - Featured production systems & architectures
  • stats       - Architecture telemetry & lifetime metrics
  • experience  - Career timeline & organizational impact
  • contact     - Direct contact channels & social coordinates
  • matrix      - Trigger dynamic matrix digital rain stream
  • theme [col] - Switch theme: theme cyan | theme emerald | theme purple
  • sound       - Toggle synthesized Web Audio sound FX
  • clear       - Clear terminal session
  • sudo        - Execute root superuser privileges`,

    about: `Anirudh R — Full-Stack Architect & AI Systems Engineer.
Based in India, building high-concurrency distributed systems, stateful AI agent loops, and fluid WebGL user interfaces.
Obsessed with zero-latency UX, elegant systems architecture, and robust engineering craftsmanship.`,

    skills: `Tech Matrix Overview:
  [Frontend]    TypeScript, React 19, Next.js, Three.js, WebGL, TailwindCSS, CSS Architecture
  [Backend]     Go, Python, Rust, Node.js, FastAPI, gRPC, Redis, PostgreSQL, ClickHouse
  [AI / ML]     LangGraph, PyTorch, VectorDBs (Chroma/Qdrant), RAG Pipelines, Fine-tuning
  [Cloud/DevOps] Docker, Kubernetes, Terraform, AWS, Cloudflare Workers, GitHub Actions`,

    projects: `Featured Systems:
  1. Cognitix      - Autonomous Multi-Agent AI Orchestrator (98.6% Workflow Success)
  2. Synapse Cloud - Global Distributed Telemetry & Edge Mesh (1.4M RPS)
  3. Genesis 3D    - Real-Time WebGL Procedural Shader Suite (60 FPS 4K)
  4. ChronoDB      - Ultra-Low Latency In-Memory Time Series Storage (Rust / <4ms P99)`,

    stats: `Live Telemetry:
  • Architecture Uptime: 99.99%
  • Peak Ingestion:      1.4M RPS
  • Code Shipped:        15+ Production Engines & Applications
  • Total Requests Served: >45 Million lifetime calls`,

    experience: `Milestones:
  • Senior Systems & AI Architect @ Cognitive Labs (2024 - Present)
  • Full-Stack Cloud Engineer @ HyperScale Systems (2022 - 2024)
  • Software Engineer @ Apex Software (2020 - 2022)`,

    contact: `Connect with Anirudh R:
  • Email:    anirudh.eng@outlook.com
  • GitHub:   https://github.com/anirudh-r
  • LinkedIn: https://linkedin.com/in/anirudh-r
  • Discord:  anirudh#0001
  • Status:   🟢 Open for high-impact roles & technical consulting`,

    sudo: `Permission denied: user is already an authenticated superuser in this matrix.`
  };

  let commandHistory = [];
  let historyIndex = -1;

  function runTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-prompt-line';
    userLine.innerHTML = `<span class="term-prompt-label">visitor@anirudh:~$</span> <span>${escapeHtml(cmd)}</span>`;
    terminalBody.insertBefore(userLine, terminalInput.parentElement);

    playSound('terminal');

    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-output';

    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear') {
      // Clear all before input prompt
      const lines = terminalBody.querySelectorAll('.term-prompt-line, .term-output');
      lines.forEach((l) => l.remove());
      terminalInput.value = '';
      return;
    } else if (lowerCmd.startsWith('theme')) {
      const parts = lowerCmd.split(' ');
      const themeName = parts[1];
      if (themeName === 'emerald') {
        document.body.className = 'theme-emerald';
        outputDiv.className = 'term-output success';
        outputDiv.textContent = 'Theme set to Emerald.';
      } else if (themeName === 'purple') {
        document.body.className = 'theme-purple';
        outputDiv.className = 'term-output accent';
        outputDiv.textContent = 'Theme set to Cyber Purple.';
      } else {
        document.body.className = '';
        outputDiv.className = 'term-output info';
        outputDiv.textContent = 'Theme reset to default Obsidian Cyan.';
      }
    } else if (lowerCmd === 'sound') {
      soundToggleBtn?.click();
      outputDiv.className = 'term-output info';
      outputDiv.textContent = `Sound toggled: ${soundEnabled ? 'ON' : 'OFF'}`;
    } else if (lowerCmd === 'matrix') {
      outputDiv.className = 'term-output success';
      outputDiv.textContent = 'Initializing Neural Matrix link...\n01000001 01101110 01101001 01110010 01110101 01100100 01101000 [SYSTEM OPTIMAL]';
      showToast('⚡ Matrix Stream Synchronized');
    } else if (termCommands[lowerCmd]) {
      outputDiv.textContent = termCommands[lowerCmd];
    } else {
      outputDiv.className = 'term-output error';
      outputDiv.textContent = `command not found: "${cmd}". Type "help" to inspect valid instructions.`;
    }

    terminalBody.insertBefore(outputDiv, terminalInput.parentElement);
    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runTerminalCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  termQuickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        runTerminalCommand(cmd);
        terminalInput?.focus();
      }
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- 13. Interactive Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    if (formSubmitBtn) {
      const origText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = '<span>⚡ Transmitting message...</span>';
      formSubmitBtn.disabled = true;

      setTimeout(() => {
        formSubmitBtn.innerHTML = '<span>✅ Message Delivered!</span>';
        showToast('🚀 Thank you! Your transmission has been received.');
        playSound('pop');
        contactForm.reset();

        setTimeout(() => {
          formSubmitBtn.innerHTML = origText;
          formSubmitBtn.disabled = false;
        }, 3000);
      }, 1000);
    }
  });

  // --- 14. Real-Time UTC / Local Time Clock in Footer ---
  const timeClock = document.getElementById('live-time-clock');
  function updateTime() {
    if (!timeClock) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    timeClock.textContent = timeStr;
  }
  updateTime();
  setInterval(updateTime, 1000);
});
