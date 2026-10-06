/* SenseBeat landing — interactions
   Entrance spec: y150→0, 0.6s, cubic-bezier(.2,.8,.2,1), fires once in view */
(function () {
  "use strict";

  /* ---------- entrance animations ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".appear").forEach((el) => io.observe(el));

  /* ---------- tickers: duplicate set for a continuous loop ---------- */
  document.querySelectorAll(".ticker-track").forEach((track) => {
    const set = track.querySelector(".ticker-set");
    if (set) track.appendChild(set.cloneNode(true));
  });

  /* ---------- benefits: one card open, hover swaps (desktop/tablet) ---------- */
  const beneCards = document.querySelectorAll(".bene-card");
  const wideMQ = window.matchMedia("(min-width: 810px)");
  function setOpen(i) {
    beneCards.forEach((c, j) => c.classList.toggle("open", j === i));
  }
  beneCards.forEach((c, i) => {
    c.addEventListener("mouseenter", () => { if (wideMQ.matches) setOpen(i); });
    c.addEventListener("focusin", () => { if (wideMQ.matches) setOpen(i); });
  });
  function initBene() {
    if (wideMQ.matches && ![...beneCards].some((c) => c.classList.contains("open"))) setOpen(1);
  }
  initBene();
  wideMQ.addEventListener ? wideMQ.addEventListener("change", initBene) : wideMQ.addListener(initBene);
  window.addEventListener("resize", initBene, { passive: true });

  /* ---------- tab groups: features + how it works ---------- */
  function tabs(btnSel, attr, panelSel, panelAttr) {
    const btns = document.querySelectorAll(btnSel);
    const panels = document.querySelectorAll(panelSel);
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        btns.forEach((el) => {
          const on = el === b;
          el.classList.toggle("active", on);
          el.setAttribute("aria-selected", on);
        });
        panels.forEach((p) => p.classList.toggle("active", p.dataset[panelAttr] === b.dataset[attr]));
      });
    });
  }
  tabs(".feat-item", "tab", ".feat-stage .screen", "screen");
  tabs(".htab", "step", ".hscreen", "step");

  /* ---------- FAQ accordion (animated, one open at a time) ---------- */
  const qas = document.querySelectorAll(".qa");
  function expand(el) {
    const b = el.querySelector(".qa-body");
    el.setAttribute("open", "");
    const h = b.scrollHeight;
    b.style.height = "0px";
    b.offsetHeight;
    b.style.transition = "height .38s cubic-bezier(.2,.8,.2,1)";
    b.style.height = h + "px";
    b.addEventListener("transitionend", function te() {
      b.style.height = "auto"; b.removeEventListener("transitionend", te);
    });
  }
  function collapse(el) {
    const b = el.querySelector(".qa-body");
    b.style.height = b.scrollHeight + "px";
    b.offsetHeight;
    b.style.transition = "height .32s cubic-bezier(.2,.8,.2,1)";
    b.style.height = "0px";
    b.addEventListener("transitionend", function te() {
      el.removeAttribute("open"); b.style.height = ""; b.style.transition = "";
      b.removeEventListener("transitionend", te);
    });
  }
  qas.forEach((qa) => {
    qa.querySelector("summary").addEventListener("click", (ev) => {
      ev.preventDefault();
      const isOpen = qa.hasAttribute("open");
      qas.forEach((other) => { if (other !== qa && other.hasAttribute("open")) collapse(other); });
      isOpen ? collapse(qa) : expand(qa);
    });
  });

  /* ---------- integrations pulse stagger ---------- */
  document.querySelectorAll("#intGrid .int").forEach((el, i) => el.style.setProperty("--i", i));

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  function closeMenu() {
    menu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
})();
