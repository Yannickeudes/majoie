/* ============================================================
   MAJOIE — interactions & animations
   Tout le contenu personnalisable est regroupé ici en haut de
   fichier (prénoms, textes des lettres, réglages de timing).
   ============================================================ */

"use strict";

/* ---------- Contenu & réglages centralisés ---------- */
const CONFIG = {
  letters: [
    {
      letter: "M",
      word: "Magnétique",
      text: "Il y a des personnes qui n'ont pas besoin d'en faire beaucoup pour attirer l'attention. Il y a quelque chose dans leur façon d'être qui suffit."
    },
    {
      letter: "A",
      word: "Authentique",
      text: "Ce qui est beau, ce n'est pas de chercher à être parfaite. C'est d'être soi, même dans les détails que personne ne remarque."
    },
    {
      letter: "J",
      word: "Jolie",
      text: "Et je ne parle pas seulement de ce que les yeux peuvent voir."
    },
    {
      letter: "O",
      word: "Originale",
      text: "Parce qu'il y a des personnes qu'on ne pourrait pas confondre avec d'autres, même en essayant."
    },
    {
      letter: "I",
      word: "Inoubliable",
      text: "Certaines rencontres, certains échanges et certaines présences restent dans un coin de la tête sans prévenir."
    },
    {
      letter: "E",
      word: "Exceptionnelle",
      text: "Pas parce qu'il faudrait te placer au-dessus de tout le monde, mais parce que tu as ta propre façon d'être, et qu'elle mérite d'être appréciée."
    }
  ],

  autoAdvanceMs: 6200,   // rythme de défilement automatique des lettres
  letterStaggerMs: 140,  // délai entre chaque lettre à l'apparition
  finaleStaggerMs: 1400  // délai entre chaque prénom final
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   Initialisation au chargement
   ============================================================ */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  initDust();
  initPetals();
  initProgress();
  initHeroEnter();
  initParallax();
  initMagnetic();
  initReveals();
  initLetters();
  initNamedReveals();
  initPortrait();
  initFinale();
  initLightbox();
  initTopButton();
  initLightSection();
});

/* ============================================================
   Pétales — générés aléatoirement dans chaque .petals
   ============================================================ */
function initPetals() {
  if (reduceMotion) return;

  document.querySelectorAll(".petals[data-count]").forEach((layer) => {
    const count = parseInt(layer.dataset.count || "6", 10);
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const size = 6 + Math.random() * 8;          // 6–14px de large
      p.style.left = `${2 + Math.random() * 96}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size * 1.35}px`;
      p.style.animationDuration = `${11 + Math.random() * 11}s`;
      p.style.animationDelay = `${-Math.random() * 20}s`;
      layer.appendChild(p);
    }
  });
}

/* ============================================================
   Particules lumineuses (canvas discret)
   ============================================================ */
function initDust() {
  if (reduceMotion) return;

  const canvas = document.getElementById("dust");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h, raf;

  const COUNT = window.innerWidth < 700 ? 26 : 55;
  const COLORS = ["214,183,122", "201,154,168", "244,238,233"];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.18 + 0.05),   // dérive lente vers le haut
      vx: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.5 + 0.12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2
    }));
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(t / 2400 + p.phase) * 0.06;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const twinkle = 0.6 + 0.4 * Math.sin(t / 1600 + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${(p.alpha * twinkle).toFixed(3)})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(raf);
    if (document.hidden) return;
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", start);
  window.addEventListener("resize", () => { resize(); spawn(); });

  resize();
  spawn();
  start();
}

/* ============================================================
   Barre de progression
   ============================================================ */
function initProgress() {
  const bar = document.querySelector("#progress span");
  const wrap = document.getElementById("progress");
  const hero = document.getElementById("hero");

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${p})`;
    const pastHero = window.scrollY > hero.offsetHeight * 0.6;
    wrap.classList.toggle("on", pastHero);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ============================================================
   Étape 1 — Entrée
   ============================================================ */
function initHeroEnter() {
  const btn = document.getElementById("enterBtn");
  const target = document.getElementById("majoie");

  function go() {
    const y = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  }

  btn.addEventListener("click", go);

  // La touche Entrée/Espace fonctionne aussi quand le héros a le focus
  document.getElementById("hero").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === btn) go();
  });
}

/* ============================================================
   Parallaxe douce du héros (souris uniquement)
   ============================================================ */
function initParallax() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const hero = document.getElementById("hero");
  const inner = hero.querySelector(".hero-inner");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 14;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });

  function tick() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    inner.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }
}

/* ============================================================
   Bouton magnétique (micro-interaction)
   ============================================================ */
function initMagnetic() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const btn = document.getElementById("enterBtn");
  let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;

  btn.addEventListener("pointermove", (e) => {
    const r = btn.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2)) * 0.22;
    ty = (e.clientY - (r.top + r.height / 2)) * 0.28;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  btn.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });

  function tick() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    btn.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }
}

/* ============================================================
   Révélations génériques au scroll
   ============================================================ */
function initReveals() {
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  els.forEach((el) => io.observe(el));
}

/* ============================================================
   Étape 2 — MAJOIE : lettres interactives
   ============================================================ */
function initLetters() {
  const wordEl = document.getElementById("majoieWord");
  const stage = document.getElementById("letterStage");
  const cardLetter = document.getElementById("cardLetter");
  const cardWord = document.getElementById("cardWord");
  const cardText = document.getElementById("cardText");
  const dotsWrap = document.getElementById("cardDots");
  const letters = Array.from(wordEl.querySelectorAll(".wletter"));

  let current = 0;
  let timer = null;
  let started = false;

  // Points de navigation
  CONFIG.letters.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Lettre ${CONFIG.letters[i].letter}`);
    dot.addEventListener("click", () => show(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  // Clic sur une lettre du prénom → saute à cette lettre
  letters.forEach((el, i) => {
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `Lettre ${CONFIG.letters[i].letter}`);
    const jump = () => show(i, true);
    el.addEventListener("click", jump);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
    });
  });

  function swap(el) {
    el.classList.remove("card-swap");
    void el.offsetWidth; // re-déclenche l'animation
    el.classList.add("card-swap");
  }

  function render(i) {
    const item = CONFIG.letters[i];
    cardLetter.textContent = item.letter;
    cardLetter.classList.toggle("gold", i > 0);
    cardWord.textContent = item.word;
    cardText.textContent = item.text;
    swap(cardWord);
    swap(cardText);

    letters.forEach((el, j) => {
      el.classList.toggle("active", j === i);
      el.classList.toggle("dim", j !== i);
    });
    dots.forEach((d, j) => d.classList.toggle("on", j === i));
  }

  function show(i, restartTimer = false) {
    current = (i + CONFIG.letters.length) % CONFIG.letters.length;
    render(current);
    if (restartTimer) schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (!started || reduceMotion) return;
    timer = setTimeout(() => show(current + 1), CONFIG.autoAdvanceMs);
  }

  // Apparition des lettres une à une quand la section entre dans le champ
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.disconnect();
      letters.forEach((el, i) => {
        setTimeout(() => el.classList.add("in"), i * CONFIG.letterStaggerMs);
      });
      setTimeout(() => {
        stage.style.opacity = "1";
        stage.style.transform = "none";
        stage.classList.add("revealed");
        started = true;
        show(0);
        schedule();
      }, CONFIG.letters.length * CONFIG.letterStaggerMs + 350);
      break;
    }
  }, { threshold: 0.35 });

  stage.style.opacity = "0";
  stage.style.transform = "translateY(24px)";
  stage.style.transition = "opacity 1s ease, transform 1s var(--ease-out)";

  if (reduceMotion) {
    letters.forEach((el) => el.classList.add("in"));
    stage.style.opacity = "1";
    stage.style.transform = "none";
    stage.classList.add("revealed");
    render(0);
    return;
  }

  io.observe(wordEl);
}

/* ============================================================
   Étapes 3 & 4 — noms animés (Dziedzom, Joy)
   ============================================================ */
function initNamedReveals() {
  const targets = document.querySelectorAll("#dziedzomName, .joy .name-big");

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.4 });

  targets.forEach((el) => io.observe(el));
}

/* ============================================================
   Étape 5 — Portrait : révélation + lightbox
   ============================================================ */
function initPortrait() {
  const frame = document.getElementById("portraitFrame");
  const img = document.getElementById("portraitImg");

  // Rendre le portrait focusable au clavier (ouverture de la lightbox)
  frame.setAttribute("tabindex", "0");
  frame.setAttribute("role", "button");
  frame.setAttribute("aria-label", "Agrandir le portrait");

  // Précharge douce de l'image
  img.loading = "eager";

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        frame.classList.add("in");
        io.disconnect();
      }
    }
  }, { threshold: 0.3 });

  io.observe(frame);
}

function initLightbox() {
  const frame = document.getElementById("portraitFrame");
  const box = document.getElementById("lightbox");
  const close = document.getElementById("lightboxClose");
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("open"));
    document.body.style.overflow = "hidden";
    close.focus();
  }

  function shut() {
    box.classList.remove("open");
    setTimeout(() => { box.hidden = true; }, 500);
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  frame.addEventListener("click", open);
  frame.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
  close.addEventListener("click", shut);
  box.addEventListener("click", (e) => { if (e.target === box) shut(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.hidden) shut();
  });
}

/* ============================================================
   Étape 7 — Finale : prénoms en cascade
   ============================================================ */
function initFinale() {
  const names = document.querySelectorAll(".final-name");
  const section = document.getElementById("finale");
  let done = false;

  function play() {
    if (done) return;
    done = true;
    names.forEach((el) => {
      const d = parseInt(el.dataset.delay || "0", 10);
      setTimeout(() => el.classList.add("in"), d * CONFIG.finaleStaggerMs);
    });
  }

  if (reduceMotion) { play(); return; }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) { play(); io.disconnect(); }
    }
  }, { threshold: 0.25 });

  io.observe(section);
}

/* ============================================================
   Bouton retour en haut
   ============================================================ */
function initTopButton() {
  document.getElementById("topBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

/* ============================================================
   Section claire (Joy) → ajuste l'opacité des particules
   ============================================================ */
function initLightSection() {
  const joy = document.getElementById("joy");
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      document.body.classList.toggle("on-light", entry.isIntersecting);
    }
  }, { threshold: 0.05 });
  io.observe(joy);
}
