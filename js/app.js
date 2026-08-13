const root = document.documentElement;
const body = document.body;

const menuTrigger = document.querySelector(".menu-trigger");
const menuLabel = document.querySelector(".menu-trigger__label");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = navigation.querySelectorAll("a");
const settings = document.querySelector(".settings");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const carousel = document.querySelector(".project-carousel");

let previousScrollPosition = window.scrollY;
let scrollTicking = false;

const themeSwitch = document.querySelector(
  ".theme-switch__input"
);

const themeText = document.querySelector(
  ".theme-switch__text"
);

const carouselSlides = document.querySelectorAll(
  ".project-carousel__slide"
);

const carouselStatus = document.querySelector(
  ".project-carousel__status"
);

/* ---------------------------------
   Dark mode
--------------------------------- */

function getSavedDarkMode() {
  try {
    return (
      localStorage.getItem("squibs-dark-mode") === "true"
    );
  } catch {
    return false;
  }
}

function saveDarkMode(isDark) {
  try {
    localStorage.setItem(
      "squibs-dark-mode",
      String(isDark)
    );
  } catch {
    // The site still works if storage is unavailable.
  }
}

function applyDarkMode(isDark) {
  root.dataset.theme = isDark ? "dark" : "light";

  themeSwitch.checked = isDark;

  themeSwitch.setAttribute(
    "aria-label",
    isDark
      ? "Turn off dark mode"
      : "Turn on dark mode"
  );

  themeText.textContent = isDark
    ? "Dark mode on"
    : "Dark mode off";
}

themeSwitch.addEventListener("change", () => {
  const isDark = themeSwitch.checked;

  saveDarkMode(isDark);
  applyDarkMode(isDark);
});


/* ---------------------------------
   Mobile navigation
--------------------------------- */

function openMenu() {
  navigation.dataset.open = "true";

  menuTrigger.setAttribute("aria-expanded", "true");
  menuLabel.textContent = "Close";

  siteHeader.dataset.hidden = "false";
  body.classList.add("menu-is-open");
}

function closeMenu() {
  navigation.dataset.open = "false";

  menuTrigger.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Menu";

  body.classList.remove("menu-is-open");
  settings.removeAttribute("open");
}

function toggleMenu() {
  const isOpen =
    menuTrigger.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

menuTrigger.addEventListener("click", toggleMenu);

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ---------------------------------
   Header visibility while scrolling
--------------------------------- */

function updateHeaderVisibility() {
  const currentScrollPosition = window.scrollY;
  const heroBottom = hero.offsetTop + hero.offsetHeight;

  const isInsideHero =
    currentScrollPosition < heroBottom;

  const isScrollingUp =
    currentScrollPosition < previousScrollPosition;

  const isMenuOpen =
    menuTrigger.getAttribute("aria-expanded") === "true";

  const shouldShowHeader =
    isInsideHero ||
    isScrollingUp ||
    isMenuOpen;

  siteHeader.dataset.hidden = String(!shouldShowHeader);

  previousScrollPosition = currentScrollPosition;
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      scrollTicking = true;
    }
  },
  { passive: true }
);


/* ---------------------------------
   Keyboard and resizing
--------------------------------- */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    settings.removeAttribute("open");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMenu();
  }
  updateHeaderVisibility();
});


/* ---------------------------------
   Close desktop settings on
   outside click
--------------------------------- */

document.addEventListener("click", (event) => {
  const clickedInsideSettings =
    settings.contains(event.target);

  if (!clickedInsideSettings && window.innerWidth > 720) {
    settings.removeAttribute("open");
  }
});

/* ---------------------------------
   Project carousel
--------------------------------- */

let activeSlideIndex = 0;
let carouselTimer;

function showCarouselSlide(index) {
  carouselSlides.forEach((slide, slideIndex) => {
    slide.dataset.active = String(slideIndex === index);
  });

  carouselStatus.textContent =
    `Project ${index + 1} of ${carouselSlides.length}`;
}

function showNextCarouselSlide() {
  activeSlideIndex =
    (activeSlideIndex + 1) % carouselSlides.length;

  showCarouselSlide(activeSlideIndex);
}

function startCarousel() {
  if (
    !carousel ||
    carouselSlides.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  carouselTimer = window.setInterval(
    showNextCarouselSlide,
    4000
  );
}

showCarouselSlide(activeSlideIndex);
startCarousel();

/* ---------------------------------
   Initial state
--------------------------------- */

applyDarkMode(getSavedDarkMode());
closeMenu();