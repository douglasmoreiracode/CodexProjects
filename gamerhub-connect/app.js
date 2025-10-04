const STORAGE_KEY = 'ghc-games';
const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Dados de exemplo (pode migrar para JSON/API depois)
const defaultGames = [
  {
    id: "crash4",
    title: "Crash Bandicoot 4: It's About Time",
    platform: "Nintendo Switch",
    platformKey: "switch",
    progress: 45,
    acquiredAt: "2024-11-02",
    cover: "https://picsum.photos/seed/crashcover/300/300",
    banner: "https://picsum.photos/seed/crashbanner/1000/560",
    description:
      "Quarto título numerado da saga Crash, com fases desafiadoras, novas mecânicas de máscara e co-op local.",
    moreUrl: "https://www.nintendo.com/",
    releaseDate: "2020-10-02",
    publisher: "Activision",
    genre: "Plataforma",
    gallery: [
      "https://picsum.photos/seed/crashg1/300/200",
      "https://picsum.photos/seed/crashg2/300/200",
      "https://picsum.photos/seed/crashg3/300/200"
    ]
  },
  {
    id: "pop",
    title: "Prince of Persia: The Lost Crown",
    platform: "Nintendo Switch",
    platformKey: "switch",
    progress: 70,
    acquiredAt: "2023-08-15",
    cover: "https://picsum.photos/seed/popcover/300/300",
    banner: "https://picsum.photos/seed/popbanner/1000/560",
    description:
      "Metroidvania ágil e estiloso no universo de Prince of Persia.",
    moreUrl: "https://www.ubisoft.com/",
    releaseDate: "2024-01-18",
    publisher: "Ubisoft",
    genre: "Ação/Plataforma",
    gallery: [
      "https://picsum.photos/seed/popg1/300/200",
      "https://picsum.photos/seed/popg2/300/200",
      "https://picsum.photos/seed/popg3/300/200"
    ]
  },
  {
    id: "boltgun",
    title: "Warhammer 40000: Boltgun",
    platform: "Nintendo Switch",
    platformKey: "switch",
    progress: 25,
    acquiredAt: "2023-08-15",
    cover: "https://picsum.photos/seed/boltcover/300/300",
    banner: "https://picsum.photos/seed/boltbanner/1000/560",
    description:
      "BoomeR-shooter retrô no universo de Warhammer 40k.",
    moreUrl: "https://www.focus-entmt.com/",
    releaseDate: "2023-05-23",
    publisher: "Focus Entertainment",
    genre: "FPS",
    gallery: [
      "https://picsum.photos/seed/boltg1/300/200",
      "https://picsum.photos/seed/boltg2/300/200",
      "https://picsum.photos/seed/boltg3/300/200"
    ]
  },
  {
    id: "deadcells",
    title: "Dead Cells",
    platform: "Nintendo Switch",
    platformKey: "switch",
    progress: 80,
    acquiredAt: "2023-08-15",
    cover: "https://picsum.photos/seed/deadcover/300/300",
    banner: "https://picsum.photos/seed/deadbanner/1000/560",
    description:
      "Roguelite de ação 2D com combate preciso e muita rejogabilidade.",
    moreUrl: "https://dead-cells.com/",
    releaseDate: "2018-08-07",
    publisher: "Motion Twin",
    genre: "Roguelite/Plataforma",
    gallery: [
      "https://picsum.photos/seed/deadg1/300/200",
      "https://picsum.photos/seed/deadg2/300/200",
      "https://picsum.photos/seed/deadg3/300/200"
    ]
  },
  {
    id: "nome",
    title: "Nome do Card",
    platform: "PlayStation 4",
    platformKey: "ps",
    progress: 20,
    acquiredAt: "2023-08-15",
    cover: "https://picsum.photos/seed/pscover/300/300",
    banner: "https://picsum.photos/seed/psbanner/1000/560",
    description: "Descrição exemplo do jogo no PlayStation.",
    moreUrl: "https://www.playstation.com/",
    releaseDate: "2021-05-20",
    publisher: "Sony",
    genre: "Ação",
    gallery: [
      "https://picsum.photos/seed/psg1/300/200",
      "https://picsum.photos/seed/psg2/300/200"
    ]
  },
  {
    id: "ln",
    title: "Little Nightmares I & II",
    platform: "Nintendo Switch",
    platformKey: "switch",
    progress: 20,
    acquiredAt: "2023-08-15",
    cover: "https://picsum.photos/seed/lncover/300/300",
    banner: "https://picsum.photos/seed/lnbanner/1000/560",
    description: "Terror/plataforma com atmosfera única.",
    moreUrl: "https://en.bandainamcoent.eu/",
    releaseDate: "2021-02-11",
    publisher: "Bandai Namco",
    genre: "Terror/Plataforma",
    gallery: [
      "https://picsum.photos/seed/lng1/300/200",
      "https://picsum.photos/seed/lng2/300/200",
      "https://picsum.photos/seed/lng3/300/200"
    ]
  }
];

function cloneGame(game){
  return {
    ...game,
    gallery: Array.isArray(game.gallery) ? [...game.gallery] : []
  };
}

function cloneDefaultGames(){
  return defaultGames.map(cloneGame);
}

function loadGames(){
  const fallback = cloneDefaultGames();
  if (!storageAvailable) return fallback;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored){
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  } catch (err) {
    console.warn('GHC storage load falhou', err);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    } catch (seedErr) {
      console.warn('GHC storage seed falhou', seedErr);
    }
    return fallback;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
  } catch (err) {
    console.warn('GHC storage seed falhou', err);
  }
  return fallback;
}

function saveGames(){
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (err) {
    console.warn('GHC storage save falhou', err);
  }
}

let games = loadGames();

const el = (sel, ctx=document) => ctx.querySelector(sel);
const elAll = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function formatDate(iso){
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function platformBadgeClass(key){
  switch(key){
    case 'ps': return 'badge ps';
    case 'pc': return 'badge pc';
    default: return 'badge'; // switch default vermelho
  }
}

function renderFeatured(game){
  const root = el('#featured');
  if (!root) return;
  if (!game){
    root.innerHTML = '';
    return;
  }
  root.innerHTML = `
    <article class="featured-card">
      <img class="featured-img" src="${game.banner}" alt="${game.title}"/>
      <div class="featured-gradient"></div>
      <div class="featured-inner">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="${platformBadgeClass(game.platformKey)}">${game.platform.toUpperCase()}</span>
          <span class="progress-chip">${game.progress}%<button type="button" class="progress-link" data-progress-trigger data-id="${game.id}">PROGRESSO</button></span>
        </div>
        <h1 class="featured-title">${game.title}</h1>
        <div class="featured-row">
          <button class="btn btn-info" data-info data-id="${game.id}">+ INFORMAÇÕES</button>
          <div class="meta">AQUISIÇÃO EM: ${formatDate(game.acquiredAt)}</div>
        </div>
      </div>
    </article>
  `;
}

function renderList(list){
  const ul = el('#game-list');
  if (!ul) return;
  ul.innerHTML = '';
  list.forEach(g => {
    const li = document.createElement('li');
    li.className = 'game-item';
    li.innerHTML = `
      <button class="card-delete" data-delete data-id="${g.id}" aria-label="Remover ${g.title}">&times;</button>
      <div class="thumb-wrap">
        <img class="thumb" src="${g.cover}" alt="${g.title}" />
        <div class="thumb-progress">${g.progress}%<button type="button" class="progress-link" data-progress-trigger data-id="${g.id}">PROGRESSO</button></div>
      </div>
      <div class="game-info">
        <h3 class="game-title">${g.title}</h3>
        <div class="pill-row">
          <span class="${platformBadgeClass(g.platformKey)}">${g.platform.toUpperCase()}</span>
          <button class="btn btn-ghost" data-info data-id="${g.id}">+ INFORMAÇÕES</button>
        </div>
        <div class="acquired">AQUISIÇÃO EM: ${formatDate(g.acquiredAt)}</div>
      </div>
    `;
    ul.appendChild(li);
  });
}

function refreshFeatured(){
  if (!games.length){
    renderFeatured(null);
  } else {
    renderFeatured(games[0]);
  }
}

function openDetails(game){
  const modal = el('#details-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.dataset.targetId = game.id;

  const hero = el('#details-hero');
  const gal = el('#details-gallery');
  if (!hero || !gal) return;
  hero.innerHTML = `
    <img src="${game.banner}" alt="${game.title}"/>
    <div class="details-hero-overlay"></div>
    <div class="details-hero-meta">
      <span id="details-platform" class="${platformBadgeClass(game.platformKey)}">${game.platform.toUpperCase()}</span>
      <span id="details-progress" class="progress-chip">${game.progress}%<button type="button" class="progress-link" data-progress-trigger data-id="${game.id}">PROGRESSO</button></span>
    </div>
    <h3 id="details-title" class="details-title">${game.title}</h3>
    <div id="details-acquired" class="details-acquired">Adquirido em: ${formatDate(game.acquiredAt)}</div>
  `;

  gal.innerHTML = '';
  game.gallery.forEach(src => {
    const d = document.createElement('div');
    d.className = 'g-item';
    d.innerHTML = `<img src="${src}" alt="Galeria de ${game.title}">`;
    gal.appendChild(d);
  });

  const desc = el('#details-description');
  if (desc) desc.textContent = game.description;
  const more = el('#details-more');
  if (more) more.href = game.moreUrl || '#';
  const release = el('#details-release');
  if (release) release.textContent = formatDate(game.releaseDate);
  const publisher = el('#details-publisher');
  if (publisher) publisher.textContent = game.publisher || '-';
  const genre = el('#details-genre');
  if (genre) genre.textContent = game.genre || '-';

  // focus trap simples
  setTimeout(() => el('.modal-close').focus(), 50);
}

function closeDetails(){
  const modal = el('#details-modal');
  if (modal){
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.targetId;
  }
}

function openAddModal(){
  const modal = el('#add-game-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    const first = el('#game-name');
    if (first) first.focus();
  }, 50);
}

function resetAddForm(){
  const form = el('#add-game-form');
  if (form) form.reset();
}

function closeAddModal(){
  const modal = el('#add-game-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  resetAddForm();
}

function openDeleteModal(id){
  const modal = el('#delete-modal');
  if (!modal) return;
  modal.dataset.targetId = id;
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    const confirmBtn = modal.querySelector('[data-confirm-delete]');
    if (confirmBtn) confirmBtn.focus();
  }, 50);
}

function closeDeleteModal(){
  const modal = el('#delete-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  delete modal.dataset.targetId;
}

function openProgressModal(id){
  const modal = el('#progress-modal');
  if (!modal) return;
  const game = games.find(g => g.id === id);
  if (!game) return;
  modal.dataset.targetId = id;
  modal.setAttribute('aria-hidden', 'false');
  const display = el('#progress-display', modal);
  if (display) display.textContent = `${game.progress}%`;
  const input = el('#progress-input', modal);
  if (input){
    input.value = game.progress;
    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  }
}

function closeProgressModal(){
  const modal = el('#progress-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  delete modal.dataset.targetId;
}

function clampProgress(value){
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
}

function updateProgressDisplay(value){
  const modal = el('#progress-modal');
  if (!modal) return;
  const display = el('#progress-display', modal);
  if (display) display.textContent = `${value}%`;
}

function updateDetailsIfOpen(game){
  const modal = el('#details-modal');
  if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
  if (modal.dataset.targetId !== game.id) return;
  openDetails(game);
}

function wireEvents(){
  const appRoot = el('#app');
  const menuBtn = el('#menu-toggle');

  document.addEventListener('click', (e) => {
    const addTrigger = e.target.closest('#add-game-btn');
    if (addTrigger){
      if (appRoot && appRoot.classList.contains('menu-open')){
        appRoot.classList.remove('menu-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
      openAddModal();
      return;
    }

    const cancelAdd = e.target.closest('[data-cancel-add]');
    if (cancelAdd){
      closeAddModal();
      return;
    }

    const progressTrigger = e.target.closest('[data-progress-trigger]');
    if (progressTrigger){
      const id = progressTrigger.getAttribute('data-id');
      if (id) openProgressModal(id);
      return;
    }

    const cancelProgress = e.target.closest('[data-cancel-progress]');
    if (cancelProgress){
      closeProgressModal();
      return;
    }

    const confirmProgress = e.target.closest('[data-confirm-progress]');
    if (confirmProgress){
      const modal = el('#progress-modal');
      const targetId = modal ? modal.dataset.targetId : null;
      if (targetId){
        const input = el('#progress-input', modal);
        const nextValue = clampProgress(input ? input.value : 0);
        if (input) input.value = nextValue;
        updateProgressDisplay(nextValue);
        const game = games.find(g => g.id === targetId);
        if (game){
          game.progress = nextValue;
          saveGames();
          refreshFeatured();
          renderList(games);
          updateDetailsIfOpen(game);
        }
      }
      closeProgressModal();
      return;
    }

    const deleteTrigger = e.target.closest('[data-delete]');
    if (deleteTrigger){
      const id = deleteTrigger.getAttribute('data-id');
      if (id) openDeleteModal(id);
      return;
    }

    const cancelDelete = e.target.closest('[data-cancel-delete]');
    if (cancelDelete){
      closeDeleteModal();
      return;
    }

    const confirmDelete = e.target.closest('[data-confirm-delete]');
    if (confirmDelete){
      const modal = el('#delete-modal');
      const targetId = modal ? modal.dataset.targetId : null;
      if (targetId){
        const idx = games.findIndex(g => g.id === targetId);
        if (idx >= 0){
          games.splice(idx, 1);
          saveGames();
          refreshFeatured();
          renderList(games);
          closeDetails();
        }
      }
      closeDeleteModal();
      return;
    }

    const infoBtn = e.target.closest('[data-info]');
    if (infoBtn){
      const id = infoBtn.getAttribute('data-id');
      const g = games.find(x => x.id === id);
      if (g) openDetails(g);
      if (appRoot && appRoot.classList.contains('menu-open')){
        appRoot.classList.remove('menu-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    if (e.target.matches('[data-close]')){
      closeDetails();
      closeAddModal();
      closeDeleteModal();
      closeProgressModal();
      return;
    }

    // toggle do menu hamburger
    if (menuBtn && appRoot && e.target.closest('#menu-toggle')){
      const isOpen = appRoot.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      return;
    }
    // click fora fecha o menu
    if (appRoot && appRoot.classList.contains('menu-open')){
      const insideMenu = e.target.closest('.ghc-menu');
      if (!insideMenu) {
        appRoot.classList.remove('menu-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      closeDetails();
      closeAddModal();
      closeDeleteModal();
      closeProgressModal();
      // fecha menu via Esc
      const appRoot = el('#app');
      const menuBtn = el('#menu-toggle');
      if (appRoot && appRoot.classList.contains('menu-open')){
        appRoot.classList.remove('menu-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  const addForm = el('#add-game-form');
  if (addForm){
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(addForm);
      const name = String(formData.get('name') || '').trim();
      const platformKey = formData.get('platform');
      const acquired = formData.get('acquired');
      const bannerInput = String(formData.get('banner') || '').trim();
      const gameInfo = String(formData.get('description') || '').trim();
      if (!name || !platformKey || !acquired) return;

      const platformSelect = addForm.querySelector('#game-platform');
      const platformLabel = platformSelect ? platformSelect.options[platformSelect.selectedIndex].text.trim() : String(platformKey);

      const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'game';
      const stamp = Date.now();
      const seed = `${slug}-${stamp}`;

      const fallbackCover = `https://picsum.photos/seed/${seed}/300/300`;
      const fallbackBanner = `https://picsum.photos/seed/${seed}-hero/1000/560`;
      const resolvedBanner = bannerInput || fallbackBanner;
      const resolvedCover = bannerInput || fallbackCover;
      const descriptionText = gameInfo || 'Adicionado manualmente a biblioteca.';

      const newGame = {
        id: seed,
        title: name,
        platform: platformLabel,
        platformKey,
        progress: 0,
        acquiredAt: acquired,
        cover: resolvedCover,
        banner: resolvedBanner,
        description: descriptionText,
        moreUrl: '#',
        releaseDate: acquired,
        publisher: '-',
        genre: '-',
        gallery: bannerInput ? [bannerInput] : []
      };

      games.unshift(newGame);
      saveGames();
      refreshFeatured();
      renderList(games);
      closeAddModal();
    });
  }

  document.addEventListener('input', (e) => {
    if (e.target.matches('#progress-input')){
      const value = clampProgress(e.target.value);
      updateProgressDisplay(value);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('#progress-input')){
      e.preventDefault();
      const confirmBtn = el('[data-confirm-progress]');
      if (confirmBtn) confirmBtn.click();
    }
  });
}

function init(){
  // usa o primeiro como destaque
  if (el('#featured') && el('#game-list')){
    refreshFeatured();
    renderList(games);
  }
  wireEvents();
}

init();

