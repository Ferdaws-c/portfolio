"use strict";

const root = document.documentElement;
const body = document.body;
const header = document.getElementById("site-header");
const progress = document.getElementById("page-progress");
const backToTop = document.getElementById("back-to-top");
const themeToggle = document.getElementById("theme-toggle");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(theme, persist = true) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#08111f" : "#f2f6fb");
  if (persist) {
    try { localStorage.setItem("portfolio-theme", theme); } catch (_) { /* Storage may be unavailable. */ }
  }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (_) { /* Use system preference. */ }
setTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"), false);
themeToggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("is-scrolled", scrollTop > 18);
  backToTop.classList.toggle("is-visible", scrollTop > 650);
  progress.style.width = `${pageHeight > 0 ? Math.min((scrollTop / pageHeight) * 100, 100) : 0}%`;
}

let scrollFrame = null;
window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { updateScrollUI(); scrollFrame = null; });
}, { passive: true });
updateScrollUI();

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  hamburger.classList.toggle("is-active", open);
  hamburger.setAttribute("aria-expanded", String(open));
  hamburger.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  body.classList.toggle("menu-open", open);
}

hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth > 820) setMenu(false); });

const sections = [...document.querySelectorAll("main section[id]")];
const sectionLinks = [...document.querySelectorAll(".nav-link")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.section === entry.target.id));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const filterButtons = [...document.querySelectorAll(".filter-button")];
const projectCards = [...document.querySelectorAll(".project-card")];
const projectCount = document.getElementById("project-count");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
  });
});

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -2.2;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 2.2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

const certificateDialog = document.getElementById("certificate-dialog");
const certificateImage = document.getElementById("certificate-dialog-image");
const certificateTitle = document.getElementById("certificate-dialog-title");
const certificateIssuer = document.getElementById("certificate-dialog-issuer");
const dialogClose = document.getElementById("dialog-close");

function openCertificate(button) {
  certificateImage.src = button.dataset.certificate;
  certificateImage.alt = `${button.dataset.title} certificate awarded to Ferdaws Qaem`;
  certificateTitle.textContent = button.dataset.title;
  certificateIssuer.textContent = button.dataset.issuer;
  certificateDialog.showModal();
  body.classList.add("dialog-open");
}

document.querySelectorAll("[data-certificate]").forEach((button) => button.addEventListener("click", () => openCertificate(button)));
dialogClose.addEventListener("click", () => certificateDialog.close());
certificateDialog.addEventListener("click", (event) => {
  const rect = certificateDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) certificateDialog.close();
});
certificateDialog.addEventListener("close", () => { body.classList.remove("dialog-open"); certificateImage.src = ""; });

const copyEmailButton = document.getElementById("copy-email");
const toast = document.getElementById("toast");
let toastTimer = null;
copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyEmailButton.dataset.email);
    toast.textContent = "Email copied to clipboard";
  } catch (_) {
    toast.textContent = "Copy failed — email is shown below";
  }
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
