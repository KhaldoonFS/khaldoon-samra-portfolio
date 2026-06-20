const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

function closeNavigation() {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const opening = navToggle.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("is-open", opening);
  navToggle.setAttribute("aria-expanded", String(opening));
  navToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("nav-open", opening);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const tabs = [...document.querySelectorAll("[data-case]")];
const panels = [...document.querySelectorAll("[data-panel]")];

function selectCase(caseId) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.case === caseId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const selected = panel.dataset.panel === caseId;
    panel.hidden = !selected;
    if (selected) panel.classList.add("is-visible");
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCase(tab.dataset.case));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + tabs.length) % tabs.length;
    tabs[next].focus();
    selectCase(tabs[next].dataset.case);
  });
});

if (tabs.length > 0) selectCase(tabs[0].dataset.case);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const indexedSections = ["top", "work", "experience", "credentials", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const railLinks = [...document.querySelectorAll(".rail-link")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
    },
    { rootMargin: "-20% 0px -55%", threshold: [0.05, 0.2, 0.5] },
  );
  indexedSections.forEach((section) => sectionObserver.observe(section));
}
