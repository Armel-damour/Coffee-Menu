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
