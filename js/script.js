document.getElementById('year').textContent = new Date().getFullYear();

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

// Contact form placeholder submit
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = 'Thanks — this is a placeholder form. Connect it to your email or CRM to go live.';
  form.reset();
});
