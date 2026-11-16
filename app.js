/* ==========================================================================
   HORIZON // FIGMA DESIGN LAB - INTERACTIVE JAVASCRIPT
   Smooth controls, dynamic radar, accordion, canvas & Figma cursor effects
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCosmicHorizonCanvas();
  initRadarInteractions();
  initAccordion();
  initCasesFilter();
  initModal();
  initFigmaCursors();
  initNewsletter();
});

/* --------------------------------------------------------------------------
   1. COSMIC HORIZON CANVAS (Atmospheric Earth & Stars Effect)
   -------------------------------------------------------------------------- */
function initCosmicHorizonCanvas() {
  const canvas = document.getElementById('horizonCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawHorizon();
  }

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;

  window.addEventListener('resize', resizeCanvas);
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = (e.clientX - rect.left - rect.width / 2) * 0.05;
  });

  // Star field generation
  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random() * 0.7,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      flickerSpeed: Math.random() * 0.02 + 0.005
    });
  }

  function drawHorizon() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Smooth camera lag
    mouseX += (targetX - mouseX) * 0.08;

    // Deep cosmic background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#040605');
    bgGrad.addColorStop(0.6, '#080d09');
    bgGrad.addColorStop(1, '#0e1610');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    stars.forEach(star => {
      star.alpha += star.flickerSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.flickerSpeed = -star.flickerSpeed;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, star.alpha))})`;
      ctx.beginPath();
      ctx.arc(star.x * w + mouseX * 0.3, star.y * h, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sun flare & atmosphere glow
    const sunX = w * 0.65 + mouseX;
    const sunY = h * 0.42;

    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, w * 0.55);
    sunGlow.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
    sunGlow.addColorStop(0.15, 'rgba(212, 255, 0, 0.5)');
    sunGlow.addColorStop(0.4, 'rgba(163, 230, 53, 0.15)');
    sunGlow.addColorStop(0.8, 'rgba(34, 197, 94, 0.03)');
    sunGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, w, h);

    // Earth Curvature
    const earthRadius = w * 1.35;
    const earthCenterX = w * 0.5 + mouseX * 0.5;
    const earthCenterY = h * 1.45;

    ctx.save();
    ctx.beginPath();
    ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Earth surface texture / shading
    const earthGrad = ctx.createRadialGradient(
      earthCenterX, earthCenterY - earthRadius * 0.9, 50,
      earthCenterX, earthCenterY, earthRadius
    );
    earthGrad.addColorStop(0, '#1c2920');
    earthGrad.addColorStop(0.3, '#101a14');
    earthGrad.addColorStop(0.7, '#080c09');
    earthGrad.addColorStop(1, '#020403');

    ctx.fillStyle = earthGrad;
    ctx.fillRect(0, 0, w, h);

    // City lights / continent textures
    ctx.fillStyle = 'rgba(212, 255, 0, 0.15)';
    for (let c = 0; c < 30; c++) {
      const cx = (earthCenterX - 300) + Math.sin(c * 2) * 400;
      const cy = (h * 0.55) + Math.cos(c * 3) * 120;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.random() * 15 + 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Atmosphere glowing ring border
    ctx.save();
    ctx.beginPath();
    ctx.arc(earthCenterX, earthCenterY, earthRadius + 2, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(212, 255, 0, 0.7)';
    ctx.shadowColor = '#d4ff00';
    ctx.shadowBlur = 35;
    ctx.stroke();

    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.25)';
    ctx.shadowBlur = 60;
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(drawHorizon);
  }

  resizeCanvas();
}

/* --------------------------------------------------------------------------
   2. RADAR SYNERGY INTERACTION
   -------------------------------------------------------------------------- */
const radarData = {
  1: {
    title: "Дизайн-системи у Figma",
    desc: "Побудова уніфікованих бібліотек компонентів, автолейаутів та глобальних токенів для команд будь-якого масштабу."
  },
  2: {
    title: "UX Архітектура та Дослідження",
    desc: "Глибокий аналіз шляху користувача (CJM), валідація гіпотез та структурування складних SaaS продуктів."
  },
  3: {
    title: "Мікроанімації та Прототипи",
    desc: "Розширене прототипування у Figma з умовними виразами (Variables) та інтерактивними переходами."
  },
  4: {
    title: "Синхронізація з кодом (Dev Mode)",
    desc: "Передача дизайну розробникам у реальному часі без втрат точності: React, Vue, Swift, Tailwind CSS."
  },
  5: {
    title: "Figma Variables & Токени",
    desc: "Автоматична зміна темної/світлої теми, адаптивні сітки та багатомовні інтерфейси в один клік."
  },
  6: {
    title: "Тестування інтерфейсів (A/B Test)",
    desc: "Перевірка клікабельності, юзабіліті-тести на цільовій аудиторії та оптимізація коефіцієнта конверсії."
  }
};

function initRadarInteractions() {
  const nodes = document.querySelectorAll('.radar-node');
  const tooltipText = document.getElementById('radarTooltipText');
  const centerCore = document.querySelector('.radar-center-core');

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const id = node.getAttribute('data-node-id');
      if (radarData[id] && tooltipText) {
        tooltipText.innerHTML = `<strong>${radarData[id].title}:</strong> ${radarData[id].desc}`;
      }
    });

    node.addEventListener('click', () => {
      const id = node.getAttribute('data-node-id');
      if (radarData[id] && tooltipText) {
        tooltipText.innerHTML = `<strong>${radarData[id].title}:</strong> ${radarData[id].desc}`;
      }
      // Pulsing effect
      node.style.transform = 'scale(1.25)';
      setTimeout(() => { node.style.transform = ''; }, 300);
    });
  });

  if (centerCore && tooltipText) {
    centerCore.addEventListener('click', () => {
      tooltipText.innerHTML = `<strong>Figma Core AI:</strong> Централізована дизайн-інфраструктура, яка об'єднує всі напрямки розробки у єдину систему.`;
    });
  }
}

/* --------------------------------------------------------------------------
   3. ACCORDION (WHAT WE DO BEST)
   -------------------------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      items.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle clicked item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* --------------------------------------------------------------------------
   4. CASES FILTER
   -------------------------------------------------------------------------- */
function initCasesFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.case-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. CONSULTATION MODAL
   -------------------------------------------------------------------------- */
function initModal() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const backdrop = document.getElementById('consultationModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('consultationForm');

  if (!backdrop) return;

  function openModal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Дякуємо! Ваш запит отримано. Наш лід-дизайнер зв\'яжеться з вами протягом 2 годин.');
      form.reset();
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   6. SIMULATED FIGMA MULTI-PLAYER CURSORS
   -------------------------------------------------------------------------- */
function initFigmaCursors() {
  const container = document.getElementById('figmaCursorsLayer');
  if (!container) return;

  const cursorsData = [
    { name: 'Олена (Lead UI)', color: '#d4ff00', x: 20, y: 35, vx: 0.4, vy: 0.3 },
    { name: 'Максим (Dev Mode)', color: '#00e5ff', x: 75, y: 25, vx: -0.3, vy: 0.4 },
    { name: 'Анна (UX Design)', color: '#ff3366', x: 60, y: 70, vx: 0.25, vy: -0.35 }
  ];

  // Render cursors
  const elements = cursorsData.map(c => {
    const el = document.createElement('div');
    el.className = 'figma-cursor';
    el.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="${c.color}">
        <path d="M5.5 3.2L18.8 12.8L12.5 14.5L16.2 21.2L13.1 22.8L9.5 16.2L5.5 20.2V3.2Z" />
      </svg>
      <div class="figma-cursor-tag" style="background-color: ${c.color};">${c.name}</div>
    `;
    container.appendChild(el);
    return { el, data: c };
  });

  function animateCursors() {
    elements.forEach(({ el, data }) => {
      data.x += data.vx;
      data.y += data.vy;

      if (data.x < 5 || data.x > 90) data.vx *= -1;
      if (data.y < 10 || data.y > 85) data.vy *= -1;

      el.style.left = `${data.x}%`;
      el.style.top = `${data.y}%`;
    });

    requestAnimationFrame(animateCursors);
  }

  animateCursors();
}

/* --------------------------------------------------------------------------
   7. NEWSLETTER FORM
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (input && input.value) {
      alert(`Дякуємо! Ви підписалися на наш дайджест із email: ${input.value}`);
      input.value = '';
    }
  });
}
