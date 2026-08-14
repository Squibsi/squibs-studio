const root = document.documentElement;
const body = document.body;

const menuTrigger = document.querySelector(
  ".menu-trigger"
);

const menuLabel = document.querySelector(
  ".menu-trigger__label"
);

const navigation = document.querySelector(
  ".primary-navigation"
);

const navigationLinks =
  navigation.querySelectorAll("a");

const settings = document.querySelector(
  ".settings"
);

const siteHeader = document.querySelector(
  ".site-header"
);

const hero = document.querySelector(".hero");

const carousel = document.querySelector(
  ".project-carousel"
);

const projectItems = document.querySelectorAll(
  ".project-item"
);

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

let previousScrollPosition = window.scrollY;
let scrollTicking = false;


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

  menuTrigger.setAttribute(
    "aria-expanded",
    "true"
  );

  menuLabel.textContent = "Close";

  siteHeader.dataset.hidden = "false";
  body.classList.add("menu-is-open");
}

function closeMenu() {
  navigation.dataset.open = "false";

  menuTrigger.setAttribute(
    "aria-expanded",
    "false"
  );

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

  const heroHidePoint =
    hero.offsetTop + hero.offsetHeight * 0.8;

  const isInsideHero =
    currentScrollPosition < heroHidePoint;

  const isScrollingUp =
    currentScrollPosition < previousScrollPosition;

  const isMenuOpen =
    menuTrigger.getAttribute("aria-expanded") === "true";

  const shouldShowHeader =
    isInsideHero ||
    isScrollingUp ||
    isMenuOpen;

  siteHeader.dataset.hidden =
    String(!shouldShowHeader);

  previousScrollPosition = currentScrollPosition;
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(
        updateHeaderVisibility
      );

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

  if (
    !clickedInsideSettings &&
    window.innerWidth > 720
  ) {
    settings.removeAttribute("open");
  }
});


/* ---------------------------------
   Project carousel
--------------------------------- */

let activeSlideIndex = 0;
let carouselTimer;

function showCarouselSlide(index) {
  carouselSlides.forEach(
    (slide, slideIndex) => {
      slide.dataset.active =
        String(slideIndex === index);
    }
  );

  carouselStatus.textContent =
    `Project ${index + 1} of ${carouselSlides.length}`;
}

function showNextCarouselSlide() {
  activeSlideIndex =
    (activeSlideIndex + 1) %
    carouselSlides.length;

  showCarouselSlide(activeSlideIndex);
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = undefined;
}

function startCarousel() {
  stopCarousel();

  if (
    !carousel ||
    carouselSlides.length < 2 ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  carouselTimer = window.setInterval(
    showNextCarouselSlide,
    4000
  );
}

function previewProject(index, item) {
  stopCarousel();

  activeSlideIndex = index;
  showCarouselSlide(activeSlideIndex);

  projectItems.forEach((projectItem) => {
    projectItem.dataset.preview =
      String(projectItem === item);
  });
}

function endProjectPreview(item) {
  const isStillActive =
    item.matches(":hover") ||
    item.matches(":focus-within");

  if (isStillActive) {
    return;
  }

  projectItems.forEach((projectItem) => {
    delete projectItem.dataset.preview;
  });

  startCarousel();
}

projectItems.forEach((item, index) => {
  item.addEventListener("pointerenter", () => {
    previewProject(index, item);
  });

  item.addEventListener("pointerleave", () => {
    endProjectPreview(item);
  });

  item.addEventListener("focusin", () => {
    previewProject(index, item);
  });

  item.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      endProjectPreview(item);
    });
  });
});

showCarouselSlide(activeSlideIndex);
startCarousel();


/* ---------------------------------
   Scroll and heading reveals
--------------------------------- */

const scrollRevealElements =
  document.querySelectorAll(
    [
      ".section-image",
      ".section-copy",
      ".project-carousel",
      ".project-links",
      ".tools-wheel",
      ".contact-introduction",
      ".contact-links",
      "#contact aside"
    ].join(",")
  );

const headingRevealElements =
  document.querySelectorAll(
    ".content-section h2"
  );

scrollRevealElements.forEach((element) => {
  element.classList.add("scroll-reveal");
});

headingRevealElements.forEach((heading) => {
  heading.classList.add("heading-reveal");
});

if ("IntersectionObserver" in window) {
  const animationObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -5% 0px"
      }
    );

  scrollRevealElements.forEach((element) => {
    animationObserver.observe(element);
  });

  const headingObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const heading =
            entry.target.querySelector("h2");

          if (heading) {
            heading.dataset.visible = "true";
          }

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -5% 0px"
      }
    );

  headingRevealElements.forEach((heading) => {
    const section = heading.closest(
      ".content-section"
    );

    if (section) {
      headingObserver.observe(section);
    }
  });
} else {
  scrollRevealElements.forEach((element) => {
    element.dataset.visible = "true";
  });

  headingRevealElements.forEach((heading) => {
    heading.dataset.visible = "true";
  });
}


/* ---------------------------------
   Footer underline
--------------------------------- */

const siteFooter = document.querySelector(
  ".site-footer"
);

if (
  siteFooter &&
  "IntersectionObserver" in window
) {
  const footerObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2
      }
    );

  footerObserver.observe(siteFooter);
} else if (siteFooter) {
  siteFooter.dataset.visible = "true";
}


/* ---------------------------------
   Interactive tools wheel
--------------------------------- */

const toolsWheel = document.querySelector(
  ".tools-wheel"
);

if (toolsWheel) {
  const toolItems = toolsWheel.querySelectorAll(
    ".tools-wheel__item"
  );

  const toolButtons = toolsWheel.querySelectorAll(
    ".tools-wheel__button"
  );

  const toolsInformation = document.querySelector(
    ".tools-information"
  );

  const toolsInformationTitle =
    toolsInformation.querySelector(
      ".tools-information__title"
    );

  const toolsInformationDescription =
    toolsInformation.querySelector(
      ".tools-information__description"
    );

  let wheelAngle = 0;
  let previousTime = performance.now();

  let isDraggingWheel = false;
  let isToolHovered = false;

  let previousPointerAngle = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let wheelWasDragged = false;

  const reducedWheelMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function positionToolItems() {
    const wheelRadius =
      toolsWheel.getBoundingClientRect().width * 0.4;

    toolsWheel.style.setProperty(
      "--wheel-radius",
      `${wheelRadius}px`
    );

    toolItems.forEach((item, index) => {
      const itemAngle =
        (360 / toolItems.length) * index;

      item.style.setProperty(
        "--item-angle",
        `${itemAngle}deg`
      );
    });
  }

  function updateWheelAngle() {
    toolsWheel.style.setProperty(
      "--wheel-angle",
      `${wheelAngle}deg`
    );
  }

  function getPointerAngle(event) {
    const bounds =
      toolsWheel.getBoundingClientRect();

    const centreX =
      bounds.left + bounds.width / 2;

    const centreY =
      bounds.top + bounds.height / 2;

    return (
      Math.atan2(
        event.clientY - centreY,
        event.clientX - centreX
      ) *
      180 /
      Math.PI
    );
  }

  function animateToolsWheel(currentTime) {
    const elapsedTime =
      currentTime - previousTime;

    previousTime = currentTime;

    if (
      !isDraggingWheel &&
      !isToolHovered &&
      !reducedWheelMotion.matches
    ) {
      wheelAngle += elapsedTime * 0.008;
      updateWheelAngle();
    }

    window.requestAnimationFrame(
      animateToolsWheel
    );
  }

  toolsWheel.addEventListener(
    "pointerdown",
    (event) => {
      isDraggingWheel = true;
      wheelWasDragged = false;

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;

      previousPointerAngle =
        getPointerAngle(event);

      toolsWheel.dataset.dragging = "true";
    }
  );

  toolsWheel.addEventListener(
    "pointermove",
    (event) => {
      if (!isDraggingWheel) {
        return;
      }

      const pointerDistance = Math.hypot(
        event.clientX - pointerStartX,
        event.clientY - pointerStartY
      );

      if (pointerDistance > 6) {
        wheelWasDragged = true;

        if (
          !toolsWheel.hasPointerCapture(
            event.pointerId
          )
        ) {
          toolsWheel.setPointerCapture(
            event.pointerId
          );
        }
      }

      const currentPointerAngle =
        getPointerAngle(event);

      let angleDifference =
        currentPointerAngle -
        previousPointerAngle;

      if (angleDifference > 180) {
        angleDifference -= 360;
      }

      if (angleDifference < -180) {
        angleDifference += 360;
      }

      wheelAngle += angleDifference;

      previousPointerAngle =
        currentPointerAngle;

      updateWheelAngle();
    }
  );

  function releaseToolsWheel(event) {
    if (!isDraggingWheel) {
      return;
    }

    isDraggingWheel = false;
    delete toolsWheel.dataset.dragging;

    if (
      toolsWheel.hasPointerCapture(
        event.pointerId
      )
    ) {
      toolsWheel.releasePointerCapture(
        event.pointerId
      );
    }
  }

  toolsWheel.addEventListener(
    "pointerup",
    releaseToolsWheel
  );

  toolsWheel.addEventListener(
    "pointercancel",
    releaseToolsWheel
  );

  toolButtons.forEach((button) => {
    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener("click", (event) => {
      if (wheelWasDragged) {
        event.preventDefault();
        return;
      }

      toolsInformationTitle.textContent =
        button.dataset.toolTitle;

      toolsInformationDescription.textContent =
        button.dataset.toolDescription;

      toolButtons.forEach((toolButton) => {
        toolButton.setAttribute(
          "aria-expanded",
          String(toolButton === button)
        );
      });

      toolsInformation.dataset.open = "true";
      toolsInformation.dataset.open = "true";
      animateToolsInformation();
    });

    function animateToolsInformation() {
      if (reducedWheelMotion.matches) {
        return;
      }

      const informationElements = [
        toolsInformationTitle,
        toolsInformationDescription
      ];

      informationElements.forEach((element, index) => {
        element.getAnimations().forEach((animation) => {
          animation.cancel();
        });

        element.animate(
          [
            {
              opacity: 0,
              transform: "translateY(16px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 1750,
            delay: index * 80,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both"
          }
        );
      });
    }

  });

  toolItems.forEach((item) => {
    item.addEventListener(
      "pointerenter",
      () => {
        isToolHovered = true;
      }
    );

    item.addEventListener(
      "pointerleave",
      () => {
        isToolHovered = false;
      }
    );
  });

  if ("ResizeObserver" in window) {
    const wheelResizeObserver =
      new ResizeObserver(positionToolItems);

    wheelResizeObserver.observe(toolsWheel);
  } else {
    window.addEventListener(
      "resize",
      positionToolItems
    );
  }

  positionToolItems();
  updateWheelAngle();

  window.requestAnimationFrame(
    animateToolsWheel
  );
}


/* ---------------------------------
   Initial state
--------------------------------- */

applyDarkMode(getSavedDarkMode());
closeMenu();