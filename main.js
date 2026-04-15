/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderCottages();
  renderAmenities();
  initParticles();
  initNavbar();
  initReveal();
  initCounters();
  initModal();
});

/* ===== RENDER STATS ===== */
function renderStats() {
  const container = document.getElementById('stats-grid');
  if (!container) return;
  container.innerHTML = STATS.map(s => `
    <div class="stat">
      <div class="stat__value" data-count="${s.value}" data-suffix="${s.suffix}">0</div>
      <div class="stat__label">${s.label}</div>
    </div>
  `).join('');
}

/* ===== RENDER COTTAGES ===== */
function renderCottages() {
  const container = document.getElementById('cottages-grid');
  if (!container) return;
  container.innerHTML = COTTAGES.map((c, i) => `
    <div class="card reveal reveal--delay-${(i % 4) + 1}" data-id="${c.id}">
      <div class="card__img">
        <div class="card__img-inner card__img-inner--${c.id}"></div>
        <span class="badge ${c.badgeClass}">${c.badge}</span>
      </div>
      <div class="card__body">
        <div class="card__type">${c.type}</div>
        <h3 class="card__name">${c.name}</h3>
        <div class="card__specs">
          <span class="card__spec"><span class="card__spec-icon">📐</span>${c.area} м²</span>
          <span class="card__spec"><span class="card__spec-icon">🌳</span>${c.land} соток</span>
          <span class="card__spec"><span class="card__spec-icon">🛏</span>${c.bedrooms} спальни</span>
          <span class="card__spec"><span class="card__spec-icon">🚿</span>${c.bathrooms} с/у</span>
        </div>
        <p style="font-size:.85rem;color:var(--text-light);margin-bottom:14px;line-height:1.5;">${c.description}</p>
        <div class="card__features">
          ${c.features.map(f => `<span class="card__feature">${f}</span>`).join('')}
        </div>
        <div class="card__price">
          <span class="card__price-value">${formatPrice(c.price)}</span>
          <span class="card__price-currency">₸</span>
        </div>
        <button class="card__btn" onclick="openModal(${c.id})">Узнать подробнее</button>
      </div>
    </div>
  `).join('');
}

/* ===== RENDER AMENITIES ===== */
function renderAmenities() {
  const container = document.getElementById('amenities-grid');
  if (!container) return;
  container.innerHTML = AMENITIES.map((a, i) => `
    <div class="amenity reveal reveal--delay-${(i % 3) + 1}">
      <div class="amenity__icon">${a.icon}</div>
      <h3 class="amenity__title">${a.title}</h3>
      <p class="amenity__desc">${a.desc}</p>
    </div>
  `).join('');
}

/* ===== PARTICLES ===== */
function initParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${8 + Math.random() * 14}s;
      animation-delay: ${Math.random() * 10}s;
      width: ${1.5 + Math.random() * 2.5}px;
      height: ${1.5 + Math.random() * 2.5}px;
      opacity: ${.3 + Math.random() * .5};
    `;
    container.appendChild(p);
  }
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.navbar__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  burger?.addEventListener('click', () => {
    links?.classList.toggle('open');
    burger.classList.toggle('active');
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger?.classList.remove('active');
    });
  });
}

/* ===== REVEAL ON SCROLL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: .5 });

  const statsEl = document.querySelector('.stats');
  if (statsEl) observer.observe(statsEl);
}

function animateCounters() {
  document.querySelectorAll('.stat__value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  });
}

/* ===== MODAL ===== */
let activeModal = null;

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(cottageId) {
  const cottage = COTTAGES.find(c => c.id === cottageId) || null;
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const subtitle = document.getElementById('modal-subtitle');

  if (cottage && title) {
    title.textContent = 'Запрос на ' + cottage.name;
    subtitle.textContent = `${cottage.type} · ${cottage.area} м² · ${formatPrice(cottage.price)} ₸`;
    document.getElementById('modal-cottage').value = cottage.name;
  } else {
    title.textContent = 'Оставить заявку';
    subtitle.textContent = 'Мы свяжемся с вами в течение 30 минут';
  }

  activeModal = cottageId;
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  activeModal = null;
}

function submitModal(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#modal-name').value.trim();
  const phone = form.querySelector('#modal-phone').value.trim();
  if (!name || !phone) return;
  closeModal();
  showToast('Заявка принята! Перезвоним вам в ближайшее время 🏡');
  form.reset();
}

/* ===== MAIN FORM ===== */
function submitMainForm(e) {
  e.preventDefault();
  showToast('Заявка принята! Наш менеджер свяжется с вами скоро 🌲');
  e.target.reset();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ===== UTILS ===== */
function formatPrice(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('ru-RU') + ' млн';
  return n.toLocaleString('ru-RU');
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
