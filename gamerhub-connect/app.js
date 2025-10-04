// Dados de exemplo (pode migrar para JSON/API depois)
const games = [
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
  root.innerHTML = `
    <article class="featured-card">
      <img class="featured-img" src="${game.banner}" alt="${game.title}"/>
      <div class="featured-gradient"></div>
      <div class="featured-inner">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="${platformBadgeClass(game.platformKey)}">${game.platform.toUpperCase()}</span>
          <span class="progress-chip">${game.progress}%<small>PROGRESSO</small></span>
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
  ul.innerHTML = '';
  list.forEach(g => {
    const li = document.createElement('li');
    li.className = 'game-item';
    li.innerHTML = `
      <div class="thumb-wrap">
        <img class="thumb" src="${g.cover}" alt="${g.title}" />
        <div class="thumb-progress">${g.progress}%<small>PROGRESSO</small></div>
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

function openDetails(game){
  const modal = el('#details-modal');
  modal.setAttribute('aria-hidden', 'false');

  const hero = el('#details-hero');
  hero.innerHTML = `
    <img src="${game.banner}" alt="${game.title}"/>
    <div class="details-hero-overlay"></div>
    <div class="details-hero-meta">
      <span id="details-platform" class="${platformBadgeClass(game.platformKey)}">${game.platform.toUpperCase()}</span>
      <span id="details-progress" class="progress-chip">${game.progress}%<small>PROGRESSO</small></span>
    </div>
    <h3 id="details-title" class="details-title">${game.title}</h3>
    <div id="details-acquired" class="details-acquired">Adquirido em: ${formatDate(game.acquiredAt)}</div>
  `;

  const gal = el('#details-gallery');
  gal.innerHTML = '';
  game.gallery.forEach(src => {
    const d = document.createElement('div');
    d.className = 'g-item';
    d.innerHTML = `<img src="${src}" alt="Galeria de ${game.title}">`;
    gal.appendChild(d);
  });

  el('#details-description').textContent = game.description;
  el('#details-more').href = game.moreUrl || '#';
  el('#details-release').textContent = formatDate(game.releaseDate);
  el('#details-publisher').textContent = game.publisher || '—';
  el('#details-genre').textContent = game.genre || '—';

  // focus trap simples
  setTimeout(() => el('.modal-close').focus(), 50);
}

function closeDetails(){
  const modal = el('#details-modal');
  modal.setAttribute('aria-hidden', 'true');
}

function wireEvents(){
  document.addEventListener('click', (e) => {
    const infoBtn = e.target.closest('[data-info]');
    if (infoBtn){
      const id = infoBtn.getAttribute('data-id');
      const g = games.find(x => x.id === id);
      if (g) openDetails(g);
    }
    if (e.target.matches('[data-close]')){
      closeDetails();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetails();
  });
}

function init(){
  // usa o primeiro como destaque
  renderFeatured(games[0]);
  renderList(games);
  wireEvents();
}

init();

