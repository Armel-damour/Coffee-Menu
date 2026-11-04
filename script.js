(() => {
  const root = document.documentElement;
  const revealItems = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll(".menu-section");
  const categoryLinks = document.querySelectorAll(".category-link");

  root.classList.add("js-enabled");

  const setActiveCategory = (sectionId) => {
    categoryLinks.forEach((link) => {
      if (link.hash === `#${sectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const hero = document.querySelector(".hero");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerPreference = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (hero && pointerPreference.matches && !motionPreference.matches) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      hero.style.setProperty("--hero-tilt-x", `${-y * 3}deg`);
      hero.style.setProperty("--hero-tilt-y", `${x * 3}deg`);
      hero.style.setProperty("--cup-x", `${x * 10}px`);
      hero.style.setProperty("--cup-y", `${y * 8}px`);
      hero.style.setProperty("--beans-x", `${-x * 12}px`);
      hero.style.setProperty("--beans-y", `${-y * 8}px`);
      hero.style.setProperty("--orbit-x", `${x * 8}px`);
      hero.style.setProperty("--orbit-y", `${y * 8}px`);
    });

    hero.addEventListener("pointerleave", () => {
      [
        "--hero-tilt-x",
        "--hero-tilt-y",
        "--cup-x",
        "--cup-y",
        "--beans-x",
        "--beans-y",
        "--orbit-x",
        "--orbit-y",
      ].forEach((property) => hero.style.removeProperty(property));
    });
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const categoryObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);

      if (visibleSections.length > 0) {
        const nearestSection = visibleSections.reduce((nearest, entry) =>
          Math.abs(entry.boundingClientRect.top) <
          Math.abs(nearest.boundingClientRect.top)
            ? entry
            : nearest
        );

        setActiveCategory(nearestSection.target.id);
      }
    },
    { rootMargin: "-30% 0px -55% 0px" }
  );

  sections.forEach((section) => categoryObserver.observe(section));
})();
