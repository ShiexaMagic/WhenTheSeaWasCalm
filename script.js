/* When Sea Was Calm — interactions
   - Tide progress bar
   - Reveal events on scroll
   - Background color shift from calm blue → stormy red as scroll progresses
   - Optional ambient ocean audio
*/

(function () {
  const tideFill = document.querySelector(".tide-fill");
  const events = document.querySelectorAll(".event");
  const body = document.body;

  // Color stops: calm sea → night → embers
  const palette = [
    { stop: 0.00, color: [4, 20, 29] },     // sea-deep
    { stop: 0.45, color: [10, 26, 37] },    // darker sea
    { stop: 0.75, color: [26, 14, 16] },    // ember-dark
    { stop: 1.00, color: [22, 8, 10] },     // night-ember
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function mixColor(p) {
    for (let i = 0; i < palette.length - 1; i++) {
      const a = palette[i], b = palette[i + 1];
      if (p >= a.stop && p <= b.stop) {
        const t = (p - a.stop) / (b.stop - a.stop);
        return [
          Math.round(lerp(a.color[0], b.color[0], t)),
          Math.round(lerp(a.color[1], b.color[1], t)),
          Math.round(lerp(a.color[2], b.color[2], t)),
        ];
      }
    }
    return palette[palette.length - 1].color;
  }

  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, window.scrollY / docH));
    tideFill.style.width = (p * 100) + "%";

    const [r, g, b] = mixColor(p);
    body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal hero titles on first scroll (any direction, any device)
  const scrollTitles = document.querySelectorAll('.scroll-title');
  function revealTitles() {
    scrollTitles.forEach(el => el.classList.add('title-visible'));
    window.removeEventListener('scroll', revealTitles);
    window.removeEventListener('touchmove', revealTitles);
    window.removeEventListener('wheel', revealTitles);
  }
  window.addEventListener('scroll',    revealTitles, { passive: true });
  window.addEventListener('touchmove', revealTitles, { passive: true });
  window.addEventListener('wheel',     revealTitles, { passive: true });

  // Reveal timeline events as they enter the viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  events.forEach((el) => io.observe(el));

  // Ambient sound toggle (off by default — respect user)
  const btn = document.getElementById("soundToggle");
  const audio = document.getElementById("ambient");
  let playing = false;
  if (btn && audio) {
    audio.volume = 0.18;
    btn.addEventListener("click", () => {
      if (playing) {
        audio.pause();
        btn.classList.remove("on");
      } else {
        audio.play().catch(() => { /* autoplay blocked, that's fine */ });
        btn.classList.add("on");
      }
      playing = !playing;
    });
  }
})();
