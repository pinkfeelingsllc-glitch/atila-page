/* =====================================================================
   ÁTILA — portfolio app
   No framework, no build step. Reads window.PORTFOLIO (data/projects.js).
   ===================================================================== */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO || {};
  var PROFILE = DATA.profile || {};
  var SETTINGS = Object.assign(
    { defaultCategory: 'music', defaultLang: 'auto', showPendingCredits: true, showEmptySlots: false },
    DATA.settings || {}
  );
  var LANG_KEY = 'atila-lang-v2';
  var ALL = (DATA.projects || []).slice().sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  // a category with nothing to show (only empty slots / hidden credits) leaves the tab bar
  var CATS = (DATA.categories || []).filter(function (c) {
    return SETTINGS.showEmptySlots || ALL.some(function (p) { return p.category === c.id && isNamed(p); });
  });
  if (!CATS.length) CATS = DATA.categories || [];

  var I18N = {
    en: {
      present: 'Present',
      exitPresent: 'Exit',
      presentOn: 'Presentation mode',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      sound: 'Sound',
      muted: 'Muted',
      soon: 'Coming soon',
      materialSoon: 'Work coming soon',
      pending: 'Credit pending',
      noMedia: 'Media not added yet',
      mediaError: 'This file could not be loaded',
      loading: 'Loading…',
      emptyCat: 'No projects in this category yet.',
      profiles: 'Profiles',
      categories: 'Categories',
      artists: 'Artists'
    },
    pt: {
      present: 'Apresentar',
      exitPresent: 'Sair',
      presentOn: 'Modo apresentação',
      close: 'Fechar',
      prev: 'Anterior',
      next: 'Próximo',
      soundOn: 'Ativar som',
      soundOff: 'Desativar som',
      sound: 'Som',
      muted: 'Mudo',
      soon: 'Em breve',
      materialSoon: 'Material em breve',
      pending: 'Crédito a confirmar',
      noMedia: 'Mídia ainda não adicionada',
      mediaError: 'Não foi possível carregar este arquivo',
      loading: 'Carregando…',
      emptyCat: 'Nenhum projeto nesta categoria ainda.',
      profiles: 'Perfis',
      categories: 'Categorias',
      artists: 'Artistas'
    }
  };

  var $ = function (id) { return document.getElementById(id); };

  var el = {
    avatar: $('avatar'),
    wordmark: $('wordmark'),
    tagline: $('tagline'),
    location: $('location'),
    artists: $('artists'),
    linkInstagram: $('link-instagram'),
    linkBehance: $('link-behance'),
    footName: $('foot-name'),
    footInstagram: $('foot-instagram'),
    footBehance: $('foot-behance'),
    footEmail: $('foot-email'),
    presentBtn: $('present-btn'),
    exitPresent: $('exit-present'),
    cats: $('cats'),
    catsTrack: $('cats-track'),
    catsSentinel: $('cats-sentinel'),
    work: $('work'),
    viewer: $('viewer'),
    viewerTitle: $('viewer-title'),
    viewerPos: $('viewer-pos'),
    viewerClose: $('viewer-close'),
    viewerStage: $('viewer-stage'),
    viewerDots: $('viewer-dots'),
    viewerPrev: $('viewer-prev'),
    viewerNext: $('viewer-next'),
    viewerSound: $('viewer-sound'),
    viewerSoundText: $('viewer-sound-text')
  };

  var state = {
    lang: 'en',
    cat: null,
    presenting: false,
    firstRender: true
  };

  var V = { open: false, list: [], index: 0, sound: false, hideTimer: null, scrollY: 0 };

  /* ---------- helpers ---------- */

  function t(key) {
    var dict = I18N[state.lang] || I18N.en;
    return dict[key] != null ? dict[key] : (I18N.en[key] || key);
  }

  function label(cat) {
    var l = cat.label || {};
    return l[state.lang] || l.en || cat.id;
  }

  // name can be a plain string or { "en": "...", "pt": "..." }
  function nameOf(p) {
    var n = p.name;
    if (n && typeof n === 'object') return n[state.lang] || n.en || n.pt || '';
    return n || '';
  }

  function arCSS(aspect) {
    var m = /^\s*(\d+(?:\.\d+)?)\s*[:\/]\s*(\d+(?:\.\d+)?)\s*$/.exec(aspect || '');
    if (!m) return '4 / 3';
    return m[1] + ' / ' + m[2];
  }

  function isCategory(id) {
    return CATS.some(function (c) { return c.id === id; });
  }

  function catIndex(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return i;
    return -1;
  }

  // Warm tint pair for a project without a cover, stable per id
  var TINTS = [
    ['rgba(255, 179, 64, 0.30)', 'rgba(255, 106, 61, 0.22)'],
    ['rgba(255, 106, 61, 0.28)', 'rgba(255, 47, 123, 0.22)'],
    ['rgba(255, 47, 123, 0.24)', 'rgba(140, 40, 110, 0.30)'],
    ['rgba(255, 209, 102, 0.26)', 'rgba(255, 106, 61, 0.20)']
  ];

  function tintFor(id) {
    var h = 0, s = String(id || '');
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return TINTS[h % TINTS.length];
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function projectsOf(catId) {
    return ALL.filter(function (p) { return p.category === catId; });
  }

  function isNamed(p) {
    if (p.published === false) return false;
    if (p.credit === 'pending' && !SETTINGS.showPendingCredits) return false;
    return true;
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function detectLang() {
    var saved = storageGet(LANG_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
    if (SETTINGS.defaultLang === 'en' || SETTINGS.defaultLang === 'pt') return SETTINGS.defaultLang;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function hashCategory() {
    var h = (window.location.hash || '').replace(/^#/, '');
    return isCategory(h) ? h : null;
  }

  function setHash(catId) {
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(window.history.state, '', '#' + catId);
      }
    } catch (e) { /* ignore */ }
  }

  /* ---------- profile / static text ---------- */

  function renderProfile() {
    var name = PROFILE.name || 'ÁTILA';
    el.wordmark.textContent = name;
    el.footName.textContent = name.charAt(0) + name.slice(1).toLowerCase();
    el.tagline.textContent = PROFILE.tagline || '';
    if (el.location) el.location.textContent = PROFILE.location || '';

    // artists he has worked for: a label (translated by applyI18n) + names
    var artists = PROFILE.artists || [];
    if (el.artists && artists.length) {
      var lbl = document.createElement('span');
      lbl.className = 'artists-label';
      lbl.setAttribute('data-i18n', 'artists');
      el.artists.appendChild(lbl);
      el.artists.appendChild(document.createTextNode(artists.join(' · ')));
    }

    if (PROFILE.photo) {
      el.avatar.style.backgroundImage = 'url("' + PROFILE.photo + '")';
      el.avatar.classList.add('has-photo');
      el.avatar.textContent = '';
    } else {
      el.avatar.textContent = name.charAt(0).toUpperCase();
    }

    var links = PROFILE.links || {};
    [el.linkInstagram, el.footInstagram].forEach(function (a) {
      if (links.instagram) { a.href = links.instagram; } else { a.hidden = true; }
    });
    [el.linkBehance, el.footBehance].forEach(function (a) {
      if (links.behance) { a.href = links.behance; } else { a.hidden = true; }
    });
    if (el.footEmail) {
      if (links.email) {
        el.footEmail.href = 'mailto:' + links.email;
        el.footEmail.textContent = links.email;
      } else {
        el.footEmail.hidden = true;
      }
    }
  }

  function applyI18n() {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    }
    var arias = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < arias.length; j++) {
      arias[j].setAttribute('aria-label', t(arias[j].getAttribute('data-i18n-aria')));
    }

    var langBtns = document.querySelectorAll('.lang-btn');
    for (var k = 0; k < langBtns.length; k++) {
      var on = langBtns[k].getAttribute('data-lang') === state.lang;
      langBtns[k].classList.toggle('is-on', on);
      langBtns[k].setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    el.cats.setAttribute('aria-label', t('categories'));
    document.querySelector('.social').setAttribute('aria-label', t('profiles'));
    updateSoundButton();
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'pt') return;
    state.lang = lang;
    storageSet(LANG_KEY, lang);
    applyI18n();
    renderCats();
    renderWork(false);
    if (V.open) updateViewerMeta();
  }

  /* ---------- categories ---------- */

  function renderCats() {
    el.catsTrack.innerHTML = '';
    CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat' + (c.id === state.cat ? ' is-on' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', c.id === state.cat ? 'true' : 'false');
      b.setAttribute('data-cat', c.id);
      b.textContent = label(c);
      b.addEventListener('click', function () { setCategory(c.id, true); });
      el.catsTrack.appendChild(b);
    });
    scrollActiveTabIntoView();
  }

  function scrollActiveTabIntoView() {
    var active = el.catsTrack.querySelector('.cat.is-on');
    if (!active) return;
    var track = el.catsTrack;
    var left = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
    try {
      track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    } catch (e) {
      track.scrollLeft = Math.max(0, left);
    }
    setTimeout(updateTrackEdge, 400);
  }

  function updateTrackEdge() {
    var track = el.catsTrack;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    track.classList.toggle('at-end', atEnd);
  }

  function setCategory(catId, animate) {
    if (!isCategory(catId)) return;
    var changed = catId !== state.cat;
    var dir = catIndex(catId) > catIndex(state.cat) ? 'dir-next' : 'dir-prev';
    state.cat = catId;
    setHash(catId);

    var tabs = el.catsTrack.querySelectorAll('.cat');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-cat') === catId;
      tabs[i].classList.toggle('is-on', on);
      tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
    }
    scrollActiveTabIntoView();
    renderWork(changed && animate, dir);
    if (changed && animate) {
      // keep the first work in view after a switch
      var top = el.work.getBoundingClientRect().top + window.scrollY - 62;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function stepCategory(delta) {
    var i = catIndex(state.cat);
    if (i < 0) return;
    var n = (i + delta + CATS.length) % CATS.length;
    setCategory(CATS[n].id, true);
  }

  /* ---------- work grid ---------- */

  function makeEmpty(p, named) {
    var box = document.createElement('div');
    box.className = 'card-empty';
    if (named) {
      var strong = document.createElement('strong');
      strong.textContent = nameOf(p);
      box.appendChild(strong);
      box.appendChild(document.createTextNode(t('materialSoon')));
    } else {
      box.appendChild(document.createTextNode(t('soon')));
    }
    return box;
  }

  function makePlaceholder(btn, p, named, i) {
    var tint = tintFor(p.id);
    btn.classList.add('is-placeholder');
    btn.classList.remove('is-loading');
    btn.style.setProperty('--pa', tint[0]);
    btn.style.setProperty('--pb', tint[1]);
    var idx = document.createElement('span');
    idx.className = 'card-index';
    idx.textContent = pad2(i + 1);
    btn.insertBefore(idx, btn.firstChild);
    btn.insertBefore(makeEmpty(p, named), btn.firstChild);
  }

  function makeCard(p, i, list) {
    var named = isNamed(p);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card';
    btn.style.setProperty('--ar', arCSS(p.aspect));
    btn.style.setProperty('--i', String(i));
    btn.setAttribute('data-type', p.type === 'video' || p.type === 'embed' ? 'video' : 'image');
    btn.setAttribute('data-id', p.id || '');

    // empty slot or hidden credit: a "Coming soon" card that does not open
    if (!named) {
      btn.disabled = true;
      makePlaceholder(btn, p, false, i);
      btn.setAttribute('aria-label', t('soon'));
      return btn;
    }

    btn.setAttribute('aria-label', nameOf(p));

    if (p.cover) {
      var img = document.createElement('img');
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.alt = '';
      btn.classList.add('is-loading');
      img.addEventListener('load', function () { btn.classList.remove('is-loading'); });
      img.addEventListener('error', function () {
        img.remove();
        makePlaceholder(btn, p, named, i);
      });
      img.src = p.cover;
      btn.appendChild(img);
    } else {
      makePlaceholder(btn, p, named, i);
    }

    var scrim = document.createElement('div');
    scrim.className = 'card-scrim';
    btn.appendChild(scrim);

    var nm = document.createElement('span');
    nm.className = 'card-name';
    nm.textContent = nameOf(p);
    btn.appendChild(nm);

    if (p.credit === 'pending') {
      var tag = document.createElement('span');
      tag.className = 'card-tag';
      tag.textContent = t('pending');
      btn.appendChild(tag);
    }

    var play = document.createElement('span');
    play.className = 'card-play';
    play.setAttribute('aria-hidden', 'true');
    btn.appendChild(play);

    btn.addEventListener('click', function () {
      var openable = list.filter(isNamed);
      var idx = openable.indexOf(p);
      if (idx < 0) return;
      openViewer(openable, idx);
    });

    return btn;
  }

  function renderWork(animate, dir) {
    var list = projectsOf(state.cat);
    if (!SETTINGS.showEmptySlots) {
      list = list.filter(isNamed);
    }
    el.work.innerHTML = '';
    el.work.classList.remove('is-switching', 'dir-next', 'dir-prev');
    if (dir) el.work.classList.add(dir);

    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'work-empty';
      empty.textContent = t('emptyCat');
      el.work.appendChild(empty);
      return;
    }

    list.forEach(function (p, i) {
      el.work.appendChild(makeCard(p, i, list));
    });

    if (animate || state.firstRender) {
      // restart the entrance animation
      void el.work.offsetWidth;
      el.work.classList.add('is-switching');
    }
    state.firstRender = false;
  }

  /* ---------- viewer ---------- */

  function embedURL(url) {
    var m;
    m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/.exec(url);
    if (m) {
      return 'https://www.youtube-nocookie.com/embed/' + m[1] +
        '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=' + m[1];
    }
    m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
    if (m) {
      return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1&muted=1&playsinline=1&loop=1&title=0&byline=0&portrait=0';
    }
    m = /instagram\.com\/(?:[^\/]+\/)?(?:reel|reels|p)\/([A-Za-z0-9_-]+)/.exec(url);
    if (m) {
      return 'https://www.instagram.com/p/' + m[1] + '/embed/';
    }
    return url;
  }

  function isEmbedURL(url) {
    return /youtube\.com|youtu\.be|vimeo\.com|instagram\.com/.test(url || '');
  }

  function updateViewerMeta() {
    var p = V.list[V.index];
    if (!p) return;
    var cat = CATS.filter(function (c) { return c.id === p.category; })[0];
    el.viewerTitle.textContent = isNamed(p) ? nameOf(p) : t('soon');
    el.viewerPos.textContent = (V.index + 1) + ' / ' + V.list.length + (cat ? '  ·  ' + label(cat) : '');
    if (el.viewerDots) {
      el.viewerDots.innerHTML = '';
      for (var i = 0; i < V.list.length; i++) {
        var d = document.createElement('span');
        d.className = 'dot' + (i === V.index ? ' is-on' : '');
        el.viewerDots.appendChild(d);
      }
    }
    updateSoundButton();
  }

  function updateSoundButton() {
    var b = el.viewerSound;
    if (!b) return;
    b.classList.toggle('is-on', V.sound);
    b.setAttribute('aria-label', V.sound ? t('soundOff') : t('soundOn'));
    el.viewerSoundText.textContent = V.sound ? t('sound') : t('muted');
  }

  function stopMedia() {
    var vids = el.viewerStage.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      try {
        vids[i].pause();
        vids[i].removeAttribute('src');
        vids[i].load();
      } catch (e) { /* ignore */ }
    }
    el.viewerStage.innerHTML = '';
  }

  function showItem() {
    var p = V.list[V.index];
    if (!p) return;
    stopMedia();
    updateViewerMeta();

    var stage = el.viewerStage;
    var named = isNamed(p);
    var type = p.type || 'image';
    var media = p.media || '';
    // the URL decides: a YouTube/Vimeo/Instagram link is an embed, a .mp4 is a video,
    // whatever the "type" field says — so a wrong type never breaks playback
    var isFile = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(media);
    var isEmbed = media && (isEmbedURL(media) || (type === 'embed' && !isFile));
    if (isFile && type !== 'video') type = 'video';

    el.viewerSound.hidden = !(type === 'video' && media && !isEmbed);

    if (!media && !p.cover) {
      var empty = document.createElement('div');
      empty.className = 'stage-empty';
      var s = document.createElement('strong');
      s.textContent = named ? nameOf(p) : t('soon');
      empty.appendChild(s);
      empty.appendChild(document.createTextNode(t('noMedia')));
      stage.appendChild(empty);
      return;
    }

    if (isEmbed && media) {
      var loading = document.createElement('div');
      loading.className = 'stage-empty';
      loading.textContent = t('loading');
      stage.appendChild(loading);
      var frame = document.createElement('iframe');
      frame.addEventListener('load', function () { loading.remove(); });
      frame.src = embedURL(media);
      frame.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      frame.title = nameOf(p);
      stage.appendChild(frame);
      return;
    }

    if (type === 'video' && media) {
      var v = document.createElement('video');
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.muted = !V.sound;
      v.autoplay = true;
      v.loop = true;
      v.preload = 'metadata';
      v.controls = false;
      if (p.cover) v.poster = p.cover;
      v.src = media;
      v.addEventListener('click', function () {
        if (v.paused) { v.play().catch(function () {}); } else { v.pause(); }
      });
      stage.appendChild(v);
      var pr = v.play();
      if (pr && typeof pr.catch === 'function') {
        pr.catch(function () {
          // autoplay with sound refused: fall back to muted playback
          v.muted = true;
          V.sound = false;
          updateSoundButton();
          v.play().catch(function () {});
        });
      }
      return;
    }

    var img = document.createElement('img');
    img.alt = named ? nameOf(p) : '';
    img.decoding = 'async';
    img.addEventListener('error', function () {
      img.remove();
      var fail = document.createElement('div');
      fail.className = 'stage-empty';
      var fs = document.createElement('strong');
      fs.textContent = named ? nameOf(p) : t('soon');
      fail.appendChild(fs);
      fail.appendChild(document.createTextNode(t('mediaError')));
      stage.appendChild(fail);
    });
    img.src = media || p.cover;
    stage.appendChild(img);
  }

  function openViewer(list, index) {
    if (!list.length) return;
    if (V.hideTimer) { clearTimeout(V.hideTimer); V.hideTimer = null; }
    V.list = list;
    V.index = index;
    V.open = true;
    V.sound = false;

    el.viewer.hidden = false;
    el.viewer.setAttribute('aria-hidden', 'false');
    // lock page scroll (also on iOS, where overflow:hidden alone is ignored)
    V.scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('viewer-open', 'scroll-locked');
    document.body.style.top = (-V.scrollY) + 'px';
    requestAnimationFrame(function () { el.viewer.classList.add('is-open'); });

    showItem();

    try {
      if (window.history && window.history.pushState) {
        window.history.pushState({ atilaViewer: true }, '');
      }
    } catch (e) { /* ignore */ }

    el.viewerClose.focus({ preventScroll: true });
  }

  function closeViewer(viaHistory) {
    if (!V.open) return;
    V.open = false;
    stopMedia();
    el.viewer.classList.remove('is-open');
    el.viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open', 'scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, V.scrollY);
    V.hideTimer = setTimeout(function () { el.viewer.hidden = true; V.hideTimer = null; }, 230);

    if (!viaHistory) {
      try {
        if (window.history && window.history.state && window.history.state.atilaViewer) {
          window.history.back();
        }
      } catch (e) { /* ignore */ }
    }

    var card = el.work.querySelector('.card[data-id="' + ((V.list[V.index] || {}).id || '') + '"]');
    if (card) card.focus({ preventScroll: true });
  }

  function go(delta) {
    if (!V.open || V.list.length < 2) return;
    V.index = (V.index + delta + V.list.length) % V.list.length;
    showItem();
  }

  function toggleSound() {
    V.sound = !V.sound;
    var v = el.viewerStage.querySelector('video');
    if (v) {
      v.muted = !V.sound;
      if (V.sound) v.play().catch(function () {});
    }
    updateSoundButton();
  }

  /* ---------- presentation mode ---------- */

  function setPresenting(on) {
    state.presenting = !!on;
    document.body.classList.toggle('presenting', state.presenting);
    el.presentBtn.setAttribute('aria-pressed', state.presenting ? 'true' : 'false');
    if (state.presenting) {
      window.scrollTo(0, 0);
    }
  }

  /* ---------- events ---------- */

  function bind() {
    el.presentBtn.addEventListener('click', function () { setPresenting(true); });
    el.exitPresent.addEventListener('click', function () { setPresenting(false); });

    var langBtns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function (e) {
        setLang(e.currentTarget.getAttribute('data-lang'));
      });
    }

    el.viewerClose.addEventListener('click', function () { closeViewer(false); });
    el.viewerPrev.addEventListener('click', function () { go(-1); });
    el.viewerNext.addEventListener('click', function () { go(1); });
    el.viewerSound.addEventListener('click', toggleSound);

    // swipe: left/right = next/prev, down = close
    var tx = 0, ty = 0, tt = 0;
    el.viewerStage.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
      tt = Date.now();
    }, { passive: true });

    el.viewerStage.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      var dt = Date.now() - tt;
      if (dt > 900) return;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        go(dx < 0 ? 1 : -1);
      } else if (dy > 90 && dy > Math.abs(dx) * 1.3) {
        closeViewer(false);
      }
    }, { passive: true });

    // swipe sideways on the work area = previous / next category
    var wx = 0, wy = 0, wt = 0;
    el.work.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      wx = e.touches[0].clientX;
      wy = e.touches[0].clientY;
      wt = Date.now();
    }, { passive: true });

    el.work.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches.length || V.open) return;
      var dx = e.changedTouches[0].clientX - wx;
      var dy = e.changedTouches[0].clientY - wy;
      if (Date.now() - wt > 700) return;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 2) {
        stepCategory(dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!V.open) {
        if (e.key === 'ArrowRight' && e.altKey) stepCategory(1);
        if (e.key === 'ArrowLeft' && e.altKey) stepCategory(-1);
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); closeViewer(false); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'm' || e.key === 'M') { toggleSound(); }
    });

    window.addEventListener('popstate', function () {
      if (V.open) closeViewer(true);
    });

    window.addEventListener('hashchange', function () {
      var c = hashCategory();
      if (c && c !== state.cat) setCategory(c, true);
    });

    el.catsTrack.addEventListener('scroll', updateTrackEdge, { passive: true });
    window.addEventListener('resize', updateTrackEdge);

    // sticky state of the category bar
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        el.cats.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }, { threshold: [0] });
      io.observe(el.catsSentinel);
    }
  }

  /* ---------- init ---------- */

  function init() {
    state.lang = detectLang();
    state.cat = hashCategory() || (isCategory(SETTINGS.defaultCategory) ? SETTINGS.defaultCategory : (CATS[0] && CATS[0].id));

    renderProfile();
    applyI18n();
    renderCats();
    setHash(state.cat);
    renderWork(true);
    bind();
    updateTrackEdge();

    document.body.classList.add('is-intro');
    setTimeout(function () { document.body.classList.remove('is-intro'); }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
