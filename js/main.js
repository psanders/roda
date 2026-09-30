/* Rodado Creativo — interacciones del sitio */
(() => {
  const WA_NUMBER = "17853178070";
  const SRC = {instagram: "Instagram", facebook: "Facebook", whatsapp: "WhatsApp"};
  const utm = new URLSearchParams(location.search).get("utm_source");
  try { if (utm) sessionStorage.setItem("roda_src", utm); } catch (_) {}
  let src = utm;
  try { src = src || sessionStorage.getItem("roda_src"); } catch (_) {}
  const via = src && SRC[src.toLowerCase()] ? ` (vía ${SRC[src.toLowerCase()]})` : "";
  const WA_TEXT = `Hola Roda, quiero mis 3 anuncios para mi producto.${via}`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // WhatsApp links con mensaje prellenado
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", () => {
      if (window.fbq) fbq("track", "Contact", { content_name: a.dataset.wa || "whatsapp", source: src || "directo" });
    });
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Reproductor del hero ----------
  const player = document.querySelector("[data-hero-player]");
  const video = player?.querySelector("video");
  const toggle = player?.querySelector("[data-sound-toggle]");
  
  const progress = player?.querySelector("[data-progress]");
  let fullMode = false; // false = versión limpia en loop (sin música ni textos)

  const fmt = (t) => {
    const s = Math.floor(t || 0);
    return `00:${String(s).padStart(2, "0")}`;
  };

  const setPressed = (on) => {
    toggle?.setAttribute("aria-pressed", String(on));
    toggle?.setAttribute("aria-label", on ? "Silenciar" : "Activar sonido");
  };

  const swapSource = (src, { loop, muted, fromStart = true }) => {
    video.pause();
    video.innerHTML = "";
    video.src = src;
    video.loop = loop;
    video.muted = muted;
    if (fromStart) video.currentTime = 0;
    video.load();
    return video.play().catch(() => {});
  };

  const playFullWithSound = () => {
    if (!video) return;
    fullMode = true;
    swapSource(video.dataset.srcFull, { loop: false, muted: false });
    setPressed(true);
    if (window.innerWidth < 960 || window.scrollY > 200) {
      player.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
  };

  const backToClean = () => {
    fullMode = false;
    const src = video.canPlayType("video/webm") ? video.dataset.srcCleanWebm : video.dataset.srcClean;
    swapSource(src, { loop: true, muted: true });
    setPressed(false);
  };

  if (video) {
    if (reduceMotion) video.removeAttribute("autoplay");
    video.addEventListener("timeupdate", () => {
      if (progress && video.duration) progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    });
    video.addEventListener("ended", () => { if (fullMode) backToClean(); });

    toggle?.addEventListener("click", () => {
      if (!fullMode) return playFullWithSound();
      video.muted = !video.muted;
      setPressed(!video.muted);
    });

    // Pausa el hero cuando no está en pantalla
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!reduceMotion || fullMode) video.play().catch(() => {}); }
      else video.pause();
    }, { threshold: 0.25 }).observe(video);
  }
  document.querySelectorAll("[data-play-sound]").forEach((b) => b.addEventListener("click", playFullWithSound));

  // ---------- Cortes 30/20/15 ----------
  const cuts = [...document.querySelectorAll("[data-cut]")];
  const cutVideos = cuts.map((c) => c.querySelector("video"));
  const cutObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !reduceMotion) { target.preload = "auto"; target.play().catch(() => {}); }
      else target.pause();
    });
  }, { threshold: 0.4 });
  cutVideos.forEach((v) => cutObserver.observe(v));

  cuts.forEach((cut) => {
    const v = cut.querySelector("video");
    const btn = cut.querySelector(".cut-sound");
    btn.addEventListener("click", () => {
      const turnOn = v.muted;
      // Un solo video con sonido a la vez
      cutVideos.forEach((o) => { o.muted = true; });
      cuts.forEach((c) => c.querySelector(".cut-sound").setAttribute("aria-pressed", "false"));
      if (video && !video.muted) { video.muted = true; setPressed(false); }
      if (turnOn) {
        v.muted = false; v.currentTime = 0; v.play().catch(() => {});
        btn.setAttribute("aria-pressed", "true");
      }
    });
  });

  // Si el hero suena, silencia los cortes
  video?.addEventListener("volumechange", () => {
    if (!video.muted) {
      cutVideos.forEach((o) => { o.muted = true; });
      cuts.forEach((c) => c.querySelector(".cut-sound").setAttribute("aria-pressed", "false"));
    }
  });

  // ---------- Botón flotante de WhatsApp (móvil) ----------
  const fab = document.querySelector(".fab");
  const hero = document.querySelector(".hero");
  const cta = document.querySelector(".cta");
  if (fab && hero) {
    let heroVisible = true, ctaVisible = false;
    const update = () => fab.classList.toggle("is-visible", !heroVisible && !ctaVisible);
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }, { threshold: 0.05 }).observe(hero);
    if (cta) new IntersectionObserver(([e]) => { ctaVisible = e.isIntersecting; update(); }, { threshold: 0.2 }).observe(cta);
  }
})();
