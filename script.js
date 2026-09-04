const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const topButton = document.querySelector('.top-button');
const contactLabels = ['Email', 'TikTok', 'Telegram'];
const contactForm = document.querySelector('form[name="contact"]');
const telegramLink = document.querySelector('.contact-links a[href="https://t.me/tesfu458"]');

if (contactForm) {
  contactForm.setAttribute('action', '/success.html');
}

if (telegramLink) {
  telegramLink.dataset.social = 'telegram';
  telegramLink.setAttribute('aria-label', 'Telegram');
  telegramLink.innerHTML = '<div class="filled"></div><svg viewBox="0 0 100 100" version="1.1" aria-hidden="true"><path fill="currentColor" d="M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z M30,58.3l47.7-31.6c0.1-0.1,0.3-0.3,0.4-0.3c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2-0.1c-0.1,0.1-0.2,0.4-0.4,0.6L66,38.1c-8.4,7.7-19.4,17.8-26.7,24.4c0,0,0,0,0,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0.1,0,0.1-0.1,0.2c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1c-0.5,5.6-1.4,15.2-1.8,19.5c0,0,0,0,0-0.1C36.8,81.4,31.2,62.3,30,58.3z"></path></svg><div class="tooltip">Telegram</div>';
}

document.querySelectorAll('.contact-links a').forEach((link, index) => {
  link.setAttribute('aria-label', contactLabels[index]);
});

let activeVimeoPlayer = null;
let activePlayButton = null;

document.querySelectorAll('.play-toggle').forEach((button) => {
  const frame = button.closest('.video-slot').querySelector('.vimeo-frame');
  const player = window.Vimeo ? new Vimeo.Player(frame) : null;

  button.addEventListener('click', async () => {
    if (!player) return;
    try {
      if (activeVimeoPlayer && activeVimeoPlayer !== player) {
        await activeVimeoPlayer.setMuted(true);
        activePlayButton?.classList.remove('is-playing');
        activePlayButton?.setAttribute('aria-label', 'Play video with sound');
      }

      if (activeVimeoPlayer === player) {
        await player.setMuted(true);
        button.classList.remove('is-playing');
        button.setAttribute('aria-label', 'Play video with sound');
        activeVimeoPlayer = null;
        activePlayButton = null;
        return;
      }

      await player.setMuted(false);
      await player.setVolume(1);
      await player.play();
      button.classList.add('is-playing');
      button.setAttribute('aria-label', 'Mute video');
      activeVimeoPlayer = player;
      activePlayButton = button;
    } catch (error) {
      button.setAttribute('aria-label', 'Play video with sound');
    }
  });
});

function updateScrollState() {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle('scrolled', isScrolled);
  topButton.classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const navSections = [...siteNav.querySelectorAll('a[href^="#"]')]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(({ section }) => section);
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const item = navSections.find(({ section }) => section === entry.target);
    if (item && entry.isIntersecting) {
      navSections.forEach(({ link }) => link.removeAttribute('aria-current'));
      item.link.setAttribute('aria-current', 'page');
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

navSections.forEach(({ section }) => navObserver.observe(section));

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));
