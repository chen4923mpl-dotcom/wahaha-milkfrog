const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const siteHeader = document.querySelector('.site-header');
const heroFigure = document.querySelector('.hero-figure');
const heroImage = document.getElementById('heroImage');
const laughButton = document.getElementById('laughBtn');
const laughCount = document.getElementById('laughCount');
const year = document.getElementById('year');

let scrollFrame = 0;
let count = 0;
let laughAnimation;

function updateScroll() {
  scrollFrame = 0;
  const offset = window.scrollY;
  siteHeader?.classList.toggle('is-scrolled', offset > 12);

  if (heroFigure && !motionPreference.matches) {
    const shift = Math.max(0, Math.min(offset * 0.075, 24));
    heroFigure.style.setProperty('--hero-shift', `${-shift}px`);
  }
}

function requestScrollUpdate() {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScroll);
  }
}

updateScroll();
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('pageshow', requestScrollUpdate);
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) {
    laughAnimation?.cancel();
  }
  requestScrollUpdate();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -24px' });

  for (const element of document.querySelectorAll('.reveal')) {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.classList.add('is-pending');
      revealObserver.observe(element);
    }
  }
}

laughButton?.addEventListener('click', () => {
  count += 1;
  laughCount.textContent = String(count);

  if (!motionPreference.matches && heroImage?.animate) {
    laughAnimation?.cancel();
    laughAnimation = heroImage.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'ease-in-out' }
    );
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
