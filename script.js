(function () {
  "use strict";

  /* ---------- scrollspy for the sticky nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".side nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Set();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      // highlight the topmost section currently on screen
      for (var i = 0; i < sections.length; i++) {
        if (visible.has(sections[i].id)) {
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + sections[i].id);
          });
          break;
        }
      }
    }, { rootMargin: "-28% 0px -58% 0px", threshold: 0 });

    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- slide-in reveal on scroll ---------- */
  var REVEAL = "main .section-label, main .sticky-label, main .prose p, " +
               "main .entry, main .kit > div, main .coursework";

  var items = Array.prototype.slice.call(document.querySelectorAll(REVEAL));
  var reduced = window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() { items.forEach(function (el) { el.classList.add("in"); }); }

  if (!items.length) {
    // nothing to do
  } else if (reduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    // Stagger each block against the first one in its own section. The value
    // is read only by the .in rule, so it never delays the exit.
    document.querySelectorAll("main section").forEach(function (sec) {
      Array.prototype.forEach.call(sec.querySelectorAll(REVEAL), function (el, i) {
        el.style.setProperty("--reveal-delay", Math.min(i * 60, 300) + "ms");
      });
    });

    // Reversible: blocks animate in when they enter and back out when they
    // leave, so scrolling up plays the sequence again in either direction.
    // The near-full-viewport margin means a block only resets once it is
    // essentially off screen — nothing fades while you are still reading it.
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("in", e.isIntersecting);
      });
    }, { rootMargin: "-8% 0px -8% 0px", threshold: 0 });

    items.forEach(function (el) { reveal.observe(el); });
  }

})();
