/**
 * KARTHIK MADALA PORTFOLIO - SHARED SCRIPT v2.0
 * Multi-page · Dual Theme · Three.js · Chart.js · Spark Trail · PWA
 */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);

/* ????????????????????????????????????????????????????
   THEME MANAGER
???????????????????????????????????????????????????? */
const Theme = {
  key: 'km-theme',
  layoutReady: false,
  get() {
    const saved = localStorage.getItem(this.key);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  set(theme) {
    localStorage.setItem(this.key, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this._updateToggle(theme);
    this._updateThreeColors(theme);
    this._updateChartColors(theme);
  },
  _updateToggle(theme) {
    const btn = $('#themeToggle');
    if (!btn) return;
    const thumb = btn.querySelector('.theme-toggle-thumb');
    if (thumb) thumb.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 450);
  },
  _updateThreeColors(theme) {
    if (window._threeScene) {
      const color = theme === 'dark' ? 0xFF8C42 : 0xE8590C;
      window._threeScene.meshes?.forEach(m => {
        if (m.material) m.material.color.setHex(color);
      });
    }
  },
  _updateChartColors(theme) {
    if (window._radarChart) {
      const fill = theme === 'dark' ? 'rgba(255,140,66,0.2)' : 'rgba(232,89,12,0.15)';
      const border = theme === 'dark' ? '#FF8C42' : '#E8590C';
      window._radarChart.data.datasets[0].backgroundColor = fill;
      window._radarChart.data.datasets[0].borderColor = border;
      window._radarChart.data.datasets[0].pointBackgroundColor = border;
      window._radarChart.update();
    }
  },
  toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-transitioning');
    this.set(next);
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 450);
  },
  async nav() {
    const placeholder = $('#nav-placeholder');
    if (!placeholder) return false;
    try {
      const response = await fetch('shared/_nav.html');
      if (!response.ok) throw new Error('Could not load nav');
      placeholder.innerHTML = await response.text();
      return true;
    } catch (err) {
      console.error('Nav load error:', err);
      return false;
    }
  },
  async footer() {
    const placeholder = $('#footer-placeholder');
    if (!placeholder) return false;
    try {
      const response = await fetch('shared/_footer.html');
      if (!response.ok) throw new Error('Could not load footer');
      placeholder.innerHTML = await response.text();
      return true;
    } catch (err) {
      console.error('Footer load error:', err);
      return false;
    }
  },
  bindLayout() {
    on($('#themeToggle'), 'click', () => this.toggle());
    initNav();
    initShare();
    this._updateToggle(this.get());
    this.layoutReady = true;
  },
  async init() {
    this.set(this.get());
    await Promise.all([this.nav(), this.footer()]);
    this.bindLayout();
  }
};

/* ????????????????????????????????????????????????????
   PAGE LOADER
???????????????????????????????????????????????????? */
function initLoader() {
  const loader = $('#pageLoader');
  if (!loader) return;
  document.body.style.overflow = 'hidden';
  const bar = $('#loaderBar');
  if (bar) setTimeout(() => { bar.style.width = '100%'; }, 50);
  const hide = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    document.body.classList.add('page-enter');
  };
  if (document.readyState === 'complete') {
    setTimeout(hide, 1800);
  } else {
    on(window, 'load', () => setTimeout(hide, 1600));
  }
}

/* ????????????????????????????????????????????????????
   NAVIGATION - ACTIVE PAGE + SCROLL EFFECTS
???????????????????????????????????????????????????? */
function initNav() {
  const page = document.body.dataset.page || '';
  const activePage = page === 'article' ? 'blog' : page;
  $$('[data-nav-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.navPage === activePage);
  });
  const navbar = $('#navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

/* ????????????????????????????????????????????????????
   SCROLL PROGRESS BAR
???????????????????????????????????????????????????? */
function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  on(window, 'scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${Math.min(pct, 1)})`;
  }, { passive: true });
}

/* ????????????????????????????????????????????????????
   BACK TO TOP
???????????????????????????????????????????????????? */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  on(window, 'scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ????????????????????????????????????????????????????
   MOUSE FOLLOWER
???????????????????????????????????????????????????? */
function initMouseFollower() {
  if (window.matchMedia('(hover: none)').matches) return;
  const follower = $('#mouseFollower');
  if (!follower) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  on(document, 'mousemove', e => {
    mx = e.clientX; my = e.clientY;
    follower.style.opacity = '1';
  });
  const loop = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    follower.style.left = cx + 'px';
    follower.style.top = cy + 'px';
    requestAnimationFrame(loop);
  };
  loop();
  on(document, 'mouseleave', () => { follower.style.opacity = '0'; });
  $$('.magnetic, .btn-premium').forEach(el => {
    on(el, 'mouseenter', () => { follower.style.width = '60px'; follower.style.height = '60px'; follower.style.opacity = '0.5'; });
    on(el, 'mouseleave', () => { follower.style.width = '40px'; follower.style.height = '40px'; follower.style.opacity = '1'; });
  });
}

/* ????????????????????????????????????????????????????
   CURSOR SPARK TRAIL
???????????????????????????????????????????????????? */
function initSparkTrail() {
  if (window.matchMedia('(hover: none)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  on(window, 'resize', resize, { passive: true });

  const particles = [];
  const COLORS = ['#FF8C42', '#FFB347', '#FF6B1A', '#FFD700', '#FF4500'];

  class Spark {
    constructor(x, y, burst = false) {
      this.x = x; this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? (Math.random() * 4 + 2) : (Math.random() * 2 + 0.5);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (burst ? 0 : 1);
      this.alpha = 1;
      this.size = burst ? (Math.random() * 3 + 2) : (Math.random() * 2 + 1);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.decay = burst ? 0.025 : 0.04;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.08;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let lastSpawn = 0;
  on(window, 'mousemove', e => {
    const now = Date.now();
    if (now - lastSpawn < 30) return;
    lastSpawn = now;
    for (let i = 0; i < 3; i++) particles.push(new Spark(e.clientX, e.clientY));
  });
  on(window, 'click', e => {
    for (let i = 0; i < 8; i++) particles.push(new Spark(e.clientX, e.clientY, true));
  });

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(loop);
  };
  loop();
}

/* ????????????????????????????????????????????????????
   CANVAS BACKGROUND MESH
???????????????????????????????????????????????????? */
function initCanvasMesh() {
  const canvas = $('#bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const CONFIG = { count: window.innerWidth < 768 ? 30 : 55, speed: 0.25, connectDist: 110 };

  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }

  const setup = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: CONFIG.count }, () => new Node());
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const c = isDark ? '255,140,66' : '232,89,12';
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},0.5)`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDist) {
          const alpha = (1 - dist / CONFIG.connectDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${c},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  };

  setup();
  draw();
  let resizeTimer;
  on(window, 'resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { cancelAnimationFrame(animId); setup(); draw(); }, 300);
  }, { passive: true });
}

/* ????????????????????????????????????????????????????
   THREE.JS HERO BACKGROUND (index.html only)
???????????????????????????????????????????????????? */
function initThreeHero() {
  if (document.body.dataset.page !== 'home') return;
  const loadThree = () => {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('threeCanvas') || (() => {
      const c = document.createElement('canvas');
      c.id = 'threeCanvas'; document.body.insertBefore(c, document.body.firstChild); return c;
    })();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const color = isDark ? 0xFF8C42 : 0xE8590C;
    const mat = () => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 });

    const geos = [
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.IcosahedronGeometry(0.8, 1),
      new THREE.OctahedronGeometry(1, 1),
      new THREE.OctahedronGeometry(0.6, 1),
    ];
    const positions = [[-3, 2, -2], [3, -1.5, -3], [2.5, 2.5, -4], [-2.5, -2, -2]];
    const meshes = geos.map((g, i) => {
      const m = new THREE.Mesh(g, mat());
      m.position.set(...positions[i]);
      scene.add(m);
      return m;
    });

    window._threeScene = { meshes };

    let mx = 0, my = 0;
    on(window, 'mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      meshes.forEach((m, i) => {
        m.rotation.x += 0.003 + i * 0.001;
        m.rotation.y += 0.004 + i * 0.001;
        m.position.x += (-mx * 0.3 - m.position.x) * 0.02;
        m.position.y += (my * 0.3 - m.position.y) * 0.02;
      });
      renderer.render(scene, camera);
    };
    animate();

    on(window, 'resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  };

  if (typeof THREE !== 'undefined') {
    loadThree();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = loadThree;
    document.head.appendChild(s);
  }
}

/* ????????????????????????????????????????????????????
   TYPED.JS (index.html only)
???????????????????????????????????????????????????? */
function initTyped() {
  if (document.body.dataset.page !== 'home') return;
  const el = $('#typedText');
  if (!el) return;
  const run = () => {
    if (typeof Typed === 'undefined') return;
    new Typed('#typedText', {
      strings: ['Laravel Applications', 'Blockchain DApps', 'Web3 Solutions', 'ICO Platforms', 'RESTful APIs', 'Secure Backends'],
      typeSpeed: 60, backSpeed: 35, backDelay: 2200, startDelay: 800, loop: true, cursorChar: '|', smartBackspace: true,
    });
  };
  if (typeof Typed !== 'undefined') run();
  else on(window, 'load', run);
}

/* ????????????????????????????????????????????????????
   STAT COUNTERS
???????????????????????????????????????????????????? */
function initCounters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const counter = (el) => {
    const target = +el.dataset.count;
    const duration = 1800;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (el.dataset.suffix || '');
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { counter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
}

/* ????????????????????????????????????????????????????
   RIPPLE EFFECT
???????????????????????????????????????????????????? */
function initRipple() {
  on(document, 'click', e => {
    const btn = e.target.closest('.ripple-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const r = Math.max(rect.width, rect.height);
    const el = document.createElement('span');
    el.className = 'ripple-effect';
    el.style.cssText = `width:${r}px;height:${r}px;left:${e.clientX - rect.left - r / 2}px;top:${e.clientY - rect.top - r / 2}px;`;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 650);
  });
}

/* ????????????????????????????????????????????????????
   MAGNETIC BUTTONS
???????????????????????????????????????????????????? */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  $$('.magnetic').forEach(el => {
    on(el, 'mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    on(el, 'mouseleave', () => { el.style.transform = ''; });
  });
}

/* ????????????????????????????????????????????????????
   TILT EFFECT
???????????????????????????????????????????????????? */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  $$('.tilt-effect').forEach(el => {
    on(el, 'mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientY - r.top - r.height / 2) / (r.height / 2) * 6;
      const y = -(e.clientX - r.left - r.width / 2) / (r.width / 2) * 6;
      el.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.01,1.01,1.01)`;
    });
    on(el, 'mouseleave', () => { el.style.transform = ''; });
  });
}

/* ????????????????????????????????????????????????????
   SKILL TAG TOOLTIPS (Popper.js)
???????????????????????????????????????????????????? */
function initSkillTooltips() {
  const tooltip = $('#tooltip');
  const content = $('#tooltip-content');
  if (!tooltip || !content || typeof Popper === 'undefined') return;
  let popperInstance = null;
  $$('[data-proficiency]').forEach(tag => {
    on(tag, 'mouseenter', () => {
      content.textContent = tag.dataset.proficiency;
      tooltip.setAttribute('aria-hidden', 'false');
      tooltip.classList.add('show');
      popperInstance = Popper.createPopper(tag, tooltip, { placement: 'top', modifiers: [{ name: 'offset', options: { offset: [0, 8] } }] });
    });
    on(tag, 'mouseleave', () => {
      tooltip.classList.remove('show');
      tooltip.setAttribute('aria-hidden', 'true');
      popperInstance?.destroy(); popperInstance = null;
    });
  });
}

/* ????????????????????????????????????????????????????
   AOS INIT
???????????????????????????????????????????????????? */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 60 });
}

/* ????????????????????????????????????????????????????
   SECTION DIVIDERS - SCROLL ANIMATE
???????????????????????????????????????????????????? */
function initDividers() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: 0.2 });
  $$('.divider-animate').forEach(el => obs.observe(el));
}

/* ????????????????????????????????????????????????????
   PROJECT FILTERS (projects.html)
???????????????????????????????????????????????????? */
function initProjectFilters() {
  if (document.body.dataset.page !== 'projects') return;
  const btns = $$('.filter-btn');
  const cards = $$('.project-card[data-category]');
  btns.forEach(btn => {
    on(btn, 'click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category.includes(filter);
        card.classList.toggle('hide', !match);
        if (match) card.style.animation = 'fadeInUp 0.4s ease both';
      });
    });
  });
}

/* ????????????????????????????????????????????????????
   GITHUB LIVE FEED (projects.html)
???????????????????????????????????????????????????? */
async function initGitHubFeed() {
  if (document.body.dataset.page !== 'projects') return;
  const container = $('#githubGrid');
  if (!container) return;

  const LANG_COLORS = {
    JavaScript: '#F7DF1E', PHP: '#777BB4', Python: '#3776AB',
    TypeScript: '#3178C6', HTML: '#E34F26', CSS: '#1572B6',
    'Ruby': '#CC342D', 'Shell': '#89E051', default: '#6B7280'
  };

  const renderSkeleton = () => {
    container.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-line"></div><div class="skeleton-line"></div>
        <div class="skeleton-line"></div><div class="skeleton-line"></div>
      </div>`).join('');
  };

  const renderRepo = repo => {
    const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;
    const updated = new Date(repo.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    return `<div class="github-card">
      <div class="github-card-header">
        <i class="fas fa-code-branch" style="color:var(--accent-1)"></i>
        <a class="github-card-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
      </div>
      <p class="github-card-desc">${repo.description || 'No description provided.'}</p>
      <div class="github-card-meta">
        ${repo.language ? `<span class="github-lang-dot" style="background:${langColor}" aria-hidden="true"></span><span class="github-meta-item">${repo.language}</span>` : ''}
        <span class="github-meta-item"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
        <span class="github-meta-item"><i class="fas fa-clock"></i> ${updated}</span>
        <a class="github-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>`;
  };

  const renderError = () => {
    container.innerHTML = `<div class="glass-card" style="grid-column:1/-1;text-align:center;padding:40px">
      <i class="fas fa-code-branch" style="font-size:2rem;color:var(--accent-1);margin-bottom:12px;display:block"></i>
      <p style="color:var(--text-2);margin-bottom:16px">GitHub API rate limited - visit my profile directly.</p>
      <a href="https://github.com/karthikmadala" target="_blank" rel="noopener noreferrer" class="btn-premium btn-primary-premium">
        <i class="fab fa-github"></i> View GitHub
      </a>
    </div>`;
  };

  renderSkeleton();
  try {
    const res = await fetch('https://api.github.com/users/karthikmadala/repos?sort=updated&per_page=6', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error('API error');
    const repos = await res.json();
    if (!repos.length) throw new Error('No repos');
    container.innerHTML = repos.map(renderRepo).join('');
  } catch {
    renderError();
  }
}

/* ????????????????????????????????????????????????????
   SKILLS RADAR CHART (skills.html)
???????????????????????????????????????????????????? */
function initRadarChart() {
  if (document.body.dataset.page !== 'skills') return;
  const canvas = $('#radarChart');
  if (!canvas) return;

  const loadChart = () => {
    if (typeof Chart === 'undefined') return;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const fill = isDark ? 'rgba(255,140,66,0.2)' : 'rgba(232,89,12,0.15)';
    const border = isDark ? '#FF8C42' : '#E8590C';
    const gridColor = isDark ? 'rgba(255,140,66,0.1)' : 'rgba(232,89,12,0.15)';
    const labelColor = isDark ? '#B8BCC8' : '#2D2D44';

    window._radarChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Languages', 'APIs', 'Blockchain', 'Databases', 'Cloud', 'CMS'],
        datasets: [{
          label: 'Proficiency',
          data: [90, 85, 92, 88, 78, 85],
          backgroundColor: fill,
          borderColor: border,
          borderWidth: 2,
          pointBackgroundColor: border,
          pointBorderColor: border,
          pointHoverBackgroundColor: '#fff',
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true, min: 0, max: 100,
            ticks: { display: false, stepSize: 20 },
            grid: { color: gridColor },
            pointLabels: { color: labelColor, font: { size: 13, family: "'Syne', sans-serif", weight: '600' } },
            angleLines: { color: gridColor },
          }
        },
        animation: { duration: 1200, easing: 'easeInOutQuart' }
      }
    });
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (typeof Chart !== 'undefined') loadChart();
        else {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          s.onload = loadChart;
          document.head.appendChild(s);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(canvas);
}

/* ????????????????????????????????????????????????????
   SKILLS VIEW TOGGLE (skills.html)
???????????????????????????????????????????????????? */
function initSkillsToggle() {
  if (document.body.dataset.page !== 'skills') return;
  const chartView = $('#chartView');
  const tagView = $('#tagView');
  const btnChart = $('#btnChartView');
  const btnTag = $('#btnTagView');
  if (!chartView || !tagView) return;
  on(btnChart, 'click', () => {
    chartView.style.display = 'block'; tagView.style.display = 'none';
    btnChart.classList.add('active'); btnTag.classList.remove('active');
    if (window._radarChart) window._radarChart.resize();
  });
  on(btnTag, 'click', () => {
    tagView.style.display = 'block'; chartView.style.display = 'none';
    btnTag.classList.add('active'); btnChart.classList.remove('active');
  });
}

/* ????????????????????????????????????????????????????
   PROFICIENCY BARS ANIMATE (skills.html)
???????????????????????????????????????????????????? */
function initProficiencyBars() {
  const bars = $$('.proficiency-fill[data-width]');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

/* ????????????????????????????????????????????????????
   CONTACT FORM - SWEETALERT2 (contact.html)
???????????????????????????????????????????????????? */
function initContactForm() {
  if (document.body.dataset.page !== 'contact') return;
  const form = $('#contactForm');
  if (!form || typeof Swal === 'undefined') return;
  on(form, 'submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const isEmpty = !data.name?.trim() || !data.email?.trim() || !data.message?.trim();
    if (isEmpty) {
      Swal.fire({ title: 'Oops!', text: 'Please fill in all required fields.', icon: 'warning', background: 'var(--bg-2)', color: 'var(--text-1)', confirmButtonColor: 'var(--accent-1)' });
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(data.email)) {
      Swal.fire({ title: 'Invalid Email', text: 'Please enter a valid email address.', icon: 'error', background: 'var(--bg-2)', color: 'var(--text-1)', confirmButtonColor: 'var(--accent-1)' });
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; }
    await new Promise(r => setTimeout(r, 1200));
    Swal.fire({
      title: 'Message Sent!', html: `Thank you, <strong>${data.name}</strong>! I'll get back to you within 24-48 hours.`,
      icon: 'success', background: 'var(--bg-2)', color: 'var(--text-1)',
      confirmButtonColor: 'var(--accent-1)', confirmButtonText: 'Awesome!'
    });
    form.reset();
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
  });
}

/* ????????????????????????????????????????????????????
   PROJECT DETAILS MODAL (SweetAlert)
???????????????????????????????????????????????????? */
function initProjectModals() {
  on(document, 'click', e => {
    const btn = e.target.closest('.project-details-btn');
    if (!btn || typeof Swal === 'undefined') return;
    Swal.fire({
      title: btn.dataset.title,
      html: `<p style="color:var(--text-2);text-align:left;line-height:1.7">${btn.dataset.desc}</p>`,
      background: 'var(--bg-2)', color: 'var(--text-1)',
      confirmButtonColor: 'var(--accent-1)', confirmButtonText: 'Close',
      width: '520px',
    });
  });
}

/* ????????????????????????????????????????????????????
   SHARE BUTTON
???????????????????????????????????????????????????? */
function initShare() {
  const btn = $('#shareBtn');
  if (!btn) return;
  on(btn, 'click', () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      });
    }
  });
}

/* ????????????????????????????????????????????????????
   PWA INSTALL PROMPT
???????????????????????????????????????????????????? */
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  let deferredPrompt = null;
  on(window, 'beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    setTimeout(showBanner, 30000);
  });
  const showBanner = () => {
    if (!deferredPrompt) return;
    const banner = $('#pwaBanner');
    if (banner) banner.classList.remove('hidden');
  };
  on($('#pwaInstall'), 'click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') { $('#pwaBanner')?.classList.add('hidden'); }
    deferredPrompt = null;
  });
  on($('#pwaDismiss'), 'click', () => { $('#pwaBanner')?.classList.add('hidden'); });
}

/* ????????????????????????????????????????????????????
   HERO HOME CTA LINKS (home page)
???????????????????????????????????????????????????? */
function initHomeLinks() {
  if (document.body.dataset.page !== 'home') return;
  $$('a[href^="#"]').forEach(link => {
    on(link, 'click', e => {
      const target = $(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ????????????????????????????????????????????????????
   GSAP PAGE ENTRANCE (if GSAP available)
???????????????????????????????????????????????????? */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-content > *', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3
  });
}

/* ????????????????????????????????????????????????????
   HERO PARTICLES (canvas on home)
???????????????????????????????????????????????????? */
function initHeroParticles() {
  if (document.body.dataset.page !== 'home') return;
  const container = $('#heroParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
      border-radius:50%;
      background:rgba(255,140,66,${Math.random() * 0.5 + 0.2});
      animation:float ${Math.random() * 6 + 4}s ease-in-out ${Math.random() * -6}s infinite;
    `;
    container.appendChild(p);
  }
}

/* ????????????????????????????????????????????????????
   INIT ALL
???????????????????????????????????????????????????? */
async function init() {
  await Theme.init();
  initNav();
  initLoader();
  initScrollProgress();
  initBackToTop();
  initMouseFollower();
  initSparkTrail();
  initCanvasMesh();
  initRipple();
  initMagnetic();
  initTilt();
  initAOS();
  initCounters();
  initDividers();
  initSkillTooltips();
  initProjectModals();
  initPWA();
  initHomeLinks();
  initHeroParticles();

  // Page-specific
  initThreeHero();
  initTyped();
  initGitHubFeed();
  initRadarChart();
  initSkillsToggle();
  initProficiencyBars();
  initContactForm();
  initProjectFilters();

  // GSAP (if available)
  if (typeof gsap !== 'undefined') initGSAP();
  else on(window, 'load', () => { if (typeof gsap !== 'undefined') initGSAP(); });
}

if (document.readyState === 'loading') {
  on(document, 'DOMContentLoaded', init);
} else {
  init();
}
