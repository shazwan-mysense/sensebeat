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

  /* ---------- seeded pixel-mosaic decorations ---------- */
  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const TINTS = ["#0A5CE8", "#5B8FF0", "#B9CEF6"];
  document.querySelectorAll("svg.mosaic").forEach((svg) => {
    const cols = +svg.dataset.cols || 14;
    const rows = +svg.dataset.rows || 5;
    const rnd = mulberry(+svg.dataset.seed || 1);
    const cell = 20, pad = 2;
    svg.setAttribute("viewBox", `0 0 ${cols * cell} ${rows * cell}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    let out = "";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const r = rnd();
        if (r < 0.14) {
          const tint = TINTS[Math.floor(rnd() * TINTS.length)];
          const s = cell - pad * 2;
          out += `<rect x="${x * cell + pad}" y="${y * cell + pad}" width="${s}" height="${s}" rx="2" fill="${tint}" opacity="${0.5 + rnd() * 0.5}"/>`;
        }
      }
    }
    svg.innerHTML = out;
  });

  /* ---------- tickers: duplicate set for seamless loop ---------- */
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

  /* ---------- features tabs ---------- */
  const featItems = document.querySelectorAll(".feat-item");
  const screens = document.querySelectorAll(".feat-stage .screen");
  featItems.forEach((item) => {
    item.addEventListener("click", () => {
      const i = +item.dataset.tab;
      featItems.forEach((el) => {
        const on = el === item;
        el.classList.toggle("active", on);
        el.setAttribute("aria-selected", on);
      });
      screens.forEach((s) => s.classList.toggle("active", +s.dataset.screen === i));
    });
  });

  /* ---------- pricing toggle ---------- */
  const PRICES = {
    solo:   { price: "RM 1,600", bill: "per clinic / month, all-in · 6-month minimum" },
    bundle: { price: "RM 800",   bill: "with any MYSense retainer ≥ RM3,000/mo · locked for life" }
  };
  const priceEl = document.getElementById("mainPrice");
  const billEl = document.getElementById("mainBill");
  document.querySelectorAll("#priceToggle .tg").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#priceToggle .tg").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on);
      });
      const m = PRICES[btn.dataset.mode];
      [priceEl, billEl].forEach((el) => { el.style.opacity = 0; el.style.transform = "translateY(6px)"; });
      setTimeout(() => {
        priceEl.textContent = m.price;
        billEl.textContent = m.bill;
        [priceEl, billEl].forEach((el) => {
          el.style.transition = "opacity .3s cubic-bezier(.2,.8,.2,1), transform .3s cubic-bezier(.2,.8,.2,1)";
          el.style.opacity = 1; el.style.transform = "none";
        });
      }, 160);
    });
  });

  /* ---------- how-it-works tabs ---------- */
  const htabs = document.querySelectorAll(".htab");
  const hscreens = document.querySelectorAll(".hscreen");
  htabs.forEach((t) => {
    t.addEventListener("click", () => {
      htabs.forEach((el) => {
        const on = el === t;
        el.classList.toggle("active", on);
        el.setAttribute("aria-selected", on);
      });
      hscreens.forEach((s) => s.classList.toggle("active", +s.dataset.step === +t.dataset.step));
    });
  });

  /* ---------- FAQ accordion (animated, one open at a time) ---------- */
  const qas = document.querySelectorAll(".qa");
  qas.forEach((qa) => {
    const summary = qa.querySelector("summary");
    const body = qa.querySelector(".qa-body");
    summary.addEventListener("click", (ev) => {
      ev.preventDefault();
      const isOpen = qa.hasAttribute("open");
      qas.forEach((other) => {
        if (other !== qa && other.hasAttribute("open")) collapse(other);
      });
      isOpen ? collapse(qa) : expand(qa);
    });
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
  });

  /* ---------- integrations pulse stagger ---------- */
  document.querySelectorAll("#intGrid .int").forEach((el, i) => el.style.setProperty("--i", i));

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
})();
