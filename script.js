// Small, dependency-free interactions for the portfolio.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Dismiss the intro screen after the page is ready.
window.addEventListener('load', () => setTimeout(() => $('.loader')?.classList.add('done'), 450));

const header = $('.site-header');
const progress = $('.progress');
const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
const navAnchors = $$('.nav-links a');
const sections = $$('main section[id]');

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollY > 18);
}
addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  navLinks.classList.toggle('open', open);
});
navAnchors.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}));

// Add recognizable technology marks to the skill chips.
const skillLogos = {
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'java (basics)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'sql (basics)': 'https://cdn.simpleicons.org/mysql/4479A1',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  'flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  'rest apis': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/plug.svg',
  'machine learning': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/brain.svg',
  'generative ai': 'https://cdn.simpleicons.org/openai/6BE4DA',
  'prompt engineering': 'https://cdn.simpleicons.org/openai/6BE4DA',
  'deep learning': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/brain.svg',
  'nlp': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/network-wired.svg',
  'pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  'numpy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
  'scikit-learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'vs code': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'jupyter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg'
};
$$('.skill-list span').forEach(skill => {
  const logo = skillLogos[skill.textContent.trim().toLowerCase()];
  if (!logo) return;
  const image = document.createElement('img');
  image.className = 'skill-logo';
  image.src = logo;
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  image.loading = 'lazy';
  skill.prepend(image);
});

// Give each project title a matching visual icon.
const projectIcons = [
  'utensils',
  'graduation-cap',
  'music',
  'laptop-code'
];
$$('.project-card').forEach((card, index) => {
  const title = $('.project-info h3', card);
  if (!title) return;
  const heading = document.createElement('div');
  heading.className = 'project-title';
  const icon = document.createElement('img');
  icon.className = 'project-icon';
  icon.src = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/${projectIcons[index] || 'code'}.svg`;
  icon.alt = '';
  icon.setAttribute('aria-hidden', 'true');
  icon.loading = 'lazy';
  title.parentNode.insertBefore(heading, title);
  heading.append(icon, title);
});

// Keep the section indicator in sync with what is on screen.
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-32% 0px -58% 0px' });
  sections.forEach(section => activeObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(item => revealObserver.observe(item));
} else $$('.reveal').forEach(item => item.classList.add('visible'));

// Typing cycle. Disable the animation when the visitor prefers reduced motion.
const roles = ['AI & ML Student', 'Python Developer', 'Backend Developer', 'ML Enthusiast'];
const typed = $('.typed');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let roleIndex = 0;
  const typeNext = () => {
    roleIndex = (roleIndex + 1) % roles.length;
    const next = roles[roleIndex];
    let position = typed.textContent.length;
    const erase = setInterval(() => {
      position--;
      typed.textContent = next.slice(0, Math.max(0, position));
      if (position <= 0) {
        clearInterval(erase);
        let add = 0;
        const write = setInterval(() => {
          typed.textContent = next.slice(0, ++add);
          if (add >= next.length) {
            clearInterval(write);
            setTimeout(typeNext, 2100);
          }
        }, 55);
      }
    }, 28);
  };
  setTimeout(typeNext, 2300);
}

// Theme preference persists locally; colors are defined in CSS custom properties.
const themeToggle = $('.theme-toggle');
const savedTheme = localStorage.getItem('tabrez-theme');
if (savedTheme === 'light') document.body.classList.add('light');
function updateThemeControl() {
  const light = document.body.classList.contains('light');
  $('.theme-icon', themeToggle).textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}
updateThemeControl();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('tabrez-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeControl();
});

// Project filter keeps the layout and counts in CSS/HTML rather than re-rendering markup.
const filterButtons = $$('.filter-button');
const projects = $$('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  const filter = button.dataset.filter;
  projects.forEach(card => {
    const categories = card.dataset.category.split(' ');
    const hide = filter !== 'all' && !categories.includes(filter);
    card.classList.toggle('filtered-out', hide);
    card.setAttribute('aria-hidden', String(hide));
  });
}));

// Certificate cards open an accessible dialog; credential imagery can be added later.
const modal = $('.certificate-modal');
$$('.cert-card').forEach(card => card.addEventListener('click', () => {
  $('#modal-title').textContent = card.dataset.cert;
  $('#modal-org').textContent = card.dataset.org.toUpperCase();
  $('.modal-date').textContent = card.dataset.date;
  $('.modal-desc').textContent = card.dataset.desc;
  modal.showModal();
}));
$('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

// Replace the obvious bracketed tokens in links with real URLs before publishing.
const toast = $('.toast');
let toastTimer;
$$('[data-placeholder-link]').forEach(link => link.addEventListener('click', event => {
  if (!link.getAttribute('href').includes('[')) return;
  event.preventDefault();
  toast.textContent = 'Add your real profile or project URL here before publishing.';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}));

// Validate the contact fields, then send them to the configured Formspree endpoint.
const form = $('.contact-form');
const formStatus = $('.form-status');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const subject = $('#subject').value.trim();
  const message = $('#message').value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  formStatus.className = 'form-status';
  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please complete each field before continuing.';
    formStatus.classList.add('error');
    return;
  }
  if (!validEmail) {
    formStatus.textContent = 'Please enter a valid email address.';
    formStatus.classList.add('error');
    $('#email').focus();
    return;
  }

  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  formStatus.textContent = 'Sending your message…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = Array.isArray(result.errors)
        ? result.errors.map(error => error.message).filter(Boolean).join(' ')
        : '';
      throw new Error(details || 'Please try again in a moment.');
    }

    form.reset();
    formStatus.textContent = 'Thanks! Your message was sent successfully.';
    formStatus.classList.add('success');
  } catch (error) {
    formStatus.textContent = error instanceof TypeError
      ? 'Your message could not be sent. Check your connection and try again.'
      : `Your message could not be sent. ${error.message}`;
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
  }
});
