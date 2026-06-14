/* ============================================================
   FERDAWS QAEM — PORTFOLIO JAVASCRIPT
   Features: Smooth nav, active links, scroll reveal,
             mobile menu, typing animation, back-to-top
   ============================================================ */

'use strict';

// ============================================================
// 1. TYPING ANIMATION
// ============================================================
const typingEl = document.getElementById('tagline-typed');
const phrases = [
  'Mobile Apps with Flutter',
  'Embedded IoT Systems',
  'Algorithms & Data Structures',
  'Cross-platform Experiences',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = currentPhrase.substring(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = currentPhrase.substring(0, charIndex);
  }

  let delay = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of phrase
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Start typing after hero animations settle
setTimeout(typeEffect, 800);

// ============================================================
// 2. STICKY HEADER — add 'scrolled' class on scroll
// ============================================================
const header = document.getElementById('site-header');

function handleHeaderScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // run on init

// ============================================================
// 3. ACTIVE NAV LINK — highlight current section
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let currentSection = '';
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollMid >= sectionTop && scrollMid < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.dataset.section === currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ============================================================
// 4. MOBILE HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

function toggleMenu(open) {
  const isOpen = open !== undefined ? open : !navLinksEl.classList.contains('open');
  navLinksEl.classList.toggle('open', isOpen);
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

// Close menu when a nav link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinksEl.contains(e.target)) {
    toggleMenu(false);
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

// ============================================================
// 5. SCROLL REVEAL — fade-in sections as they enter viewport
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animations for sibling elements
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal:not(.revealed)')
        );
        const delay = siblings.indexOf(entry.target) * 80;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, Math.min(delay, 400));

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ============================================================
// 6. BACK TO TOP BUTTON
// ============================================================
const backToTopBtn = document.getElementById('back-to-top');

function handleBackToTop() {
  const shouldShow = window.scrollY > 500;
  backToTopBtn.classList.toggle('visible', shouldShow);
}

window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 7. SMOOTH SCROLL for anchor links (polyfill for older Safari)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// 8. PROJECT CARD — subtle parallax tilt on mouse move
// ============================================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// 9. SKILL PILLS — stagger entrance animation
// ============================================================
const skillCategories = document.querySelectorAll('.skill-category');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.pill');
        pills.forEach((pill, i) => {
          setTimeout(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

skillCategories.forEach((cat) => {
  const pills = cat.querySelectorAll('.pill');
  pills.forEach((pill) => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(8px)';
    pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  skillObserver.observe(cat);
});

// ============================================================
// 10. CONSOLE EASTER EGG — for developers who inspect the page
// ============================================================
console.log(
  '%c👋 Hey recruiter / developer!',
  'font-size: 18px; font-weight: bold; color: #5B5EF4;'
);
console.log(
  '%cThis portfolio was hand-coded with HTML, CSS & Vanilla JS.\nCheck the source: https://github.com/Ferdaws-c/portfolio',
  'font-size: 13px; color: #00E5C3;'
);
