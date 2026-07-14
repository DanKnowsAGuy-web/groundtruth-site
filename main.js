document.documentElement.classList.add("js");

// Header state after scrolling past the hero top
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Reveal-on-scroll enhancement. Content must never be able to stay hidden:
// elements already in the viewport reveal immediately, IntersectionObserver
// handles the rest, and a safety timer reveals everything regardless (paused
// or headless renderers never deliver IO callbacks).
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = [...document.querySelectorAll(".reveal")];
const show = (el) => el.classList.add("in-view");

if (prefersReduced || !("IntersectionObserver" in window)) {
  targets.forEach(show);
} else {
  const vh = window.innerHeight;
  targets.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) show(el);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  targets.forEach((el) => { if (!el.classList.contains("in-view")) io.observe(el); });

  setTimeout(() => targets.forEach(show), 2500);
}
