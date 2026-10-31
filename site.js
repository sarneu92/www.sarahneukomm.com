
(() => {
  'use strict';
  const video = document.getElementById('ocean');
  const motionButton = document.querySelector('.motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manualPause = false;
  let failed = false;
  function labelMotion() {
    const en = document.documentElement.lang === 'en';
    const label = video.paused ? (en ? 'Play video' : 'Video abspielen') : (en ? 'Pause video' : 'Video anhalten');
    motionButton.textContent = '';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('title', label);
    motionButton.setAttribute('aria-controls', 'ocean');
    motionButton.setAttribute('data-state', video.paused ? 'paused' : 'playing');
  }
  function setLang(lang) {
    const en = lang === 'en';
    document.documentElement.lang = lang;
    document.body.classList.toggle('en', en);
    ['de','en'].forEach(l => {
      document.getElementById(l).classList.toggle('active', l === lang);
      document.getElementById(l).setAttribute('aria-pressed', String(l === lang));
    });
    document.querySelectorAll('[data-alt-de]').forEach(img => img.alt = img.dataset[en ? 'altEn' : 'altDe']);
    document.title = en ? 'Sarah Neukomm | Administration · Organisation · Business Support' : 'Sarah Neukomm | Administration · Organisation · Business Support';
    document.querySelector('meta[name="description"]').content = en ? 'Reliable administrative and organisational support for independent professionals, small businesses and projects.' : 'Zuverlässige administrative und organisatorische Unterstützung für Selbstständige, kleine Unternehmen und Projekte.';
    try { localStorage.setItem('sarah-language', lang); } catch (_) {}
    labelMotion();
  }
  document.getElementById('de').addEventListener('click', () => setLang('de'));
  document.getElementById('en').addEventListener('click', () => setLang('en'));
  let language = 'de';
  try { if (localStorage.getItem('sarah-language') === 'en') language = 'en'; } catch (_) {}
  setLang(language);
  document.getElementById('year').textContent = new Date().getFullYear();
  function fallback() {
    failed = true;
    video.classList.remove('is-playing');
    video.pause();
    motionButton.hidden = true;
  }
  function startVideo() {
    if (reduced.matches || failed || manualPause || document.hidden) return;
    const source = video.querySelector('source');
    if (!source.hasAttribute('src')) {
      source.src = source.dataset.src;
      video.muted = true;
      video.defaultMuted = true;
      video.load();
    }
    motionButton.hidden = false;
    const play = video.play();
    if (play) play.catch(() => { video.classList.remove('is-playing'); labelMotion(); });
  }
  video.addEventListener('playing', () => {
    if (reduced.matches) { video.pause(); return; }
    video.classList.add('is-playing');
    motionButton.hidden = false;
    labelMotion();
  });
  video.addEventListener('pause', labelMotion);
  video.addEventListener('error', fallback);
  video.querySelector('source').addEventListener('error', fallback);
  motionButton.addEventListener('click', () => {
    if (video.paused) { manualPause = false; startVideo(); }
    else { manualPause = true; video.pause(); }
    labelMotion();
  });
  function updateMotion() {
    if (reduced.matches) {
      video.pause();
      video.classList.remove('is-playing');
      motionButton.hidden = true;
    } else startVideo();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', updateMotion);
  else reduced.addListener(updateMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else startVideo();
  });
  updateMotion();
})();
