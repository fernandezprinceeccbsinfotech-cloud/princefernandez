const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

function setMenuOpen(open) {
  if (!menuToggle || !navbar) return;
  navbar.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.addEventListener("click", event => {
  if (navbar?.classList.contains("open") && !navbar.contains(event.target)) setMenuOpen(false);
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const profilePhoto = document.querySelector(".profile-photo");
profilePhoto?.addEventListener("error", () => {
  profilePhoto.hidden = true;
});

document.querySelectorAll(".tool-logo img").forEach(logo => {
  const holder = logo.closest(".tool-logo");
  const showLogo = () => holder?.classList.add("logo-loaded");
  logo.addEventListener("load", showLogo);
  if (logo.complete && logo.naturalWidth > 0) showLogo();
});

const imageViewer = document.querySelector(".image-viewer");
const imageViewerPhoto = imageViewer?.querySelector(".image-viewer-photo");
const imageViewerClose = imageViewer?.querySelector(".image-viewer-close");

const projectTrack = document.querySelector("#project-track");
const projectCards = projectTrack ? [...projectTrack.querySelectorAll(".project-card")] : [];
const projectPrevious = document.querySelector(".project-carousel-previous");
const projectNext = document.querySelector(".project-carousel-next");

function updateProjectCarouselButtons() {
  if (!projectTrack || !projectPrevious || !projectNext) return;
  const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
  projectPrevious.disabled = projectTrack.scrollLeft <= 1;
  projectNext.disabled = projectTrack.scrollLeft >= maxScroll - 1;
}

function scrollProject(direction) {
  if (!projectTrack || projectCards.length === 0) return;
  const trackLeft = projectTrack.getBoundingClientRect().left;
  const cardPositions = projectCards.map(card =>
    card.getBoundingClientRect().left - trackLeft + projectTrack.scrollLeft
  );
  const currentIndex = cardPositions.reduce((closest, position, index) =>
    Math.abs(position - projectTrack.scrollLeft) < Math.abs(cardPositions[closest] - projectTrack.scrollLeft)
      ? index
      : closest, 0
  );
  const nextIndex = Math.max(0, Math.min(projectCards.length - 1, currentIndex + direction));
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  projectTrack.scrollTo({ left: cardPositions[nextIndex], behavior });
}

projectPrevious?.addEventListener("click", () => scrollProject(-1));
projectNext?.addEventListener("click", () => scrollProject(1));
projectTrack?.addEventListener("scroll", updateProjectCarouselButtons, { passive: true });
window.addEventListener("resize", updateProjectCarouselButtons, { passive: true });
updateProjectCarouselButtons();

document.querySelectorAll("[data-image-viewer]").forEach(trigger => {
  trigger.addEventListener("click", event => {
    if (!imageViewer || typeof imageViewer.showModal !== "function" || !imageViewerPhoto) return;

    event.preventDefault();
    imageViewerPhoto.src = trigger.querySelector("img")?.currentSrc || trigger.href;
    imageViewerPhoto.alt = trigger.querySelector("img")?.alt || "";
    imageViewer.showModal();
  });
});

imageViewerClose?.addEventListener("click", () => {
  if (imageViewer && typeof imageViewer.close === "function") imageViewer.close();
});

imageViewer?.addEventListener("click", event => {
  if (event.target === imageViewer && typeof imageViewer.close === "function") imageViewer.close();
});
