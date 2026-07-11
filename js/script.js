document.getElementById('year').textContent = new Date().getFullYear();

// Entrance splash
const splash = document.getElementById('splash');
const shell = document.getElementById('shell');
const splashEnter = document.getElementById('splashEnter');

function enterSite() {
  splash.classList.add('is-hidden');
  shell.removeAttribute('aria-hidden');
  shell.removeAttribute('inert');
}

splashEnter.addEventListener('click', enterSite);
splash.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') enterSite();
});
splashEnter.focus();

shell.setAttribute('aria-hidden', 'true');
shell.setAttribute('inert', '');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    localStorage.setItem('dv-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('dv-theme', 'light');
  }
});

// Horizontal track navigation
const track = document.getElementById('scrollTrack');
const panels = Array.from(track.querySelectorAll('.panel'));
const dots = Array.from(document.querySelectorAll('[data-panel-link]'));

function scrollToPanel(index) {
  const panel = panels[index];
  if (!panel) return;
  panel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
}

dots.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToPanel(Number(el.dataset.index));
  });
});

function setActivePanel(index) {
  dots.forEach((el) => {
    el.classList.toggle('is-active', Number(el.dataset.index) === index);
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          setActivePanel(Number(entry.target.dataset.index));
        }
      });
    },
    { root: track, threshold: [0.55] }
  );
  panels.forEach((panel) => observer.observe(panel));
}

// Redirect vertical wheel input into horizontal scroll — the page has no
// vertical scroll, so this keeps a normal mouse/trackpad usable.
track.addEventListener(
  'wheel',
  (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }
  },
  { passive: false }
);

// Contact form placeholder submit
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = 'Thanks — this is a placeholder form. Connect it to your email or CRM to go live.';
  form.reset();
});
