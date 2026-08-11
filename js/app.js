const root = document.documentElement;
const body = document.body;

const menuTrigger = document.querySelector(".menu-trigger");
const menuLabel = document.querySelector(".menu-trigger__label");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = navigation.querySelectorAll("a");
const settings = document.querySelector(".settings");

const themeSwitch = document.querySelector(
  ".theme-switch__input"
);

const themeText = document.querySelector(
  ".theme-switch__text"
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
   Initial state
--------------------------------- */

applyDarkMode(getSavedDarkMode());
closeMenu();