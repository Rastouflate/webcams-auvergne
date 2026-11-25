// ===================================================================
// Webcams Auvergne – carte des webcams entre Clermont-Ferrand et Aurillac
// ===================================================================

// ---- Zone de recherche (invisible pour l'utilisateur) --------------
// Toutes les webcams à moins de ZONE_KM de la ligne Clermont-Ferrand → Aurillac.
const ZONE_A = [45.7772, 3.0870];  // Clermont-Ferrand
const ZONE_B = [44.9264, 2.4396];  // Aurillac
const ZONE_KM = 100;

// Seuils du statut "en direct"
const LIVE_MIN = 30;     // image de moins de 30 min  -> En direct
const RECENT_MIN = 180;  // image de moins de 3 h     -> Récente

const BISON = "https://www.bison-fute.gouv.fr/";

// Liste de secours si Bison Futé ne répond pas (id, nom, lat, lon, fichier)
const BISON_FALLBACK = [["at_aprr28","A75 Clermont-Ferrand",45.7671,3.1389,"camera-upload/at_aprr28.mp4"],["dirmc_issoire_camera97","Polminhac N122",44.9449,2.5569,"camera-upload/dirmc_issoire_camera97.mp4"],["at_aprr56","A71 gare de Clermont-Gerzat vers Paris",45.8392,3.1614,"camera-upload/at_aprr56.mp4"],["dirmc_issoire_camera69","Le Crest A75",45.6731,3.1423,"camera-upload/dirmc_issoire_camera69.mp4"],["dirmc_issoire_camera39","Tunnel Lioran côté Aurillac N122",45.077,2.7282,"camera-upload/dirmc_issoire_camera39.mp4"],["dirmc_issoire_camera38","Tunnel Lioran côté Murat N122",45.0875,2.7455,"camera-upload/dirmc_issoire_camera38.mp4"],["dirmc_issoire_camera70","Coudes A75",45.6124,3.2084,"camera-upload/dirmc_issoire_camera70.mp4"],["at_aprr58","A71 aire des Volcans d'Auvergne vers Paris",46.0575,3.1134,"camera-upload/at_aprr58.mp4"],["dirmc_issoire_camera78","Col de la Fageole A75",45.1031,3.1294,"camera-upload/dirmc_issoire_camera78.mp4"],["dirmc_issoire_camera79","Coren A75",45.0753,3.1159,"camera-upload/dirmc_issoire_camera79.mp4"],["at_asf14","A89 aire des Suchères vers Clermont-Ferrand",45.8542,3.7258,"camera-upload/at_asf14.mp4"],["at_asf19","A89 Egletons vers Lyon",45.3994,1.9953,"camera-upload/at_asf19.mp4"],["dirmc_issoire_camera80","La Garde A75",44.8713,3.2496,"camera-upload/dirmc_issoire_camera80.mp4"],["at_aprr59","A71 gare de Montmarault",46.328,2.9686,"camera-upload/at_aprr59.mp4"],["dirmc_issoire_camera82","Col des Issartets A75",44.6516,3.2493,"camera-upload/dirmc_issoire_camera82.mp4"],["fix","Col de Fix N102",45.136,3.6396,"camera-upload/fix.jpg"],["geneys","Fix Saint Geneys N102",45.1405,3.6787,"camera-upload/geneys.jpg"],["dirco_camera30","A20 Noailles",45.0987,1.5202,"camera-upload/dirco_camera30.mp4"],["dirco_camera28","A20 / A89 Est",45.3004,1.5731,"camera-upload/dirco_camera28.mp4"],["dirco_camera29","A20 / A89 Ouest",45.1873,1.4922,"camera-upload/dirco_camera29.mp4"],["dirmc_issoire_camera92","Col de la Fagette A75",44.3969,3.1405,"camera-upload/dirmc_issoire_camera92.mp4"],["nce_41","Bessay N7",46.4748,3.3675,"camera-upload/nce_41.mp4"],["dirmc_issoire_camera76","Col d'Auberoques A75",44.3571,3.1134,"camera-upload/dirmc_issoire_camera76.mp4"],["nce_67","Vendranges N82",45.9431,4.1408,"camera-upload/nce_67.mp4"],["dirmc_issoire_camera90","Montalies A75",44.2752,3.0899,"camera-upload/dirmc_issoire_camera90.mp4"],["dirmc_issoire_camera77","Col d'Engayresque A75",44.244,3.0547,"camera-upload/dirmc_issoire_camera77.mp4"],["at_asf20","A20 Cahors vers Paris",44.39,1.5164,"camera-upload/at_asf20.mp4"],["dirmc_issoire_camera93","Montferrat N88",45.0648,3.9827,"camera-upload/dirmc_issoire_camera93.mp4"],["nce_25","Col du Pin Bouchain N7",45.9158,4.3431,"camera-upload/nce_25.mp4"]];

// ---- Outils géographiques ------------------------------------------
function kmXY(lat, lon) {
  return [lon * 111.32 * Math.cos(45.35 * Math.PI / 180), lat * 110.57];
}
function distanceToZoneKm(lat, lon) {
  const a = kmXY(...ZONE_A), b = kmXY(...ZONE_B), p = kmXY(lat, lon);
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
const inZone = (lat, lon) => distanceToZoneKm(lat, lon) <= ZONE_KM;

function haversineKm(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Lambert-93 (EPSG:2154) -> WGS84, utilisé par Bison Futé
function lambert93ToWgs84(x, y) {
  const n = 0.7256077650532670, C = 11754255.426096, xs = 700000, ys = 12655612.049876;
  const e = 0.0818191910428158, lon0 = 3 * Math.PI / 180;
  const dx = x - xs, dy = ys - y;
  const R = Math.hypot(dx, dy), g = Math.atan2(dx, dy);
  const lon = lon0 + g / n, L = -Math.log(R / C) / n;
  let phi = 2 * Math.atan(Math.exp(L)) - Math.PI / 2;
  for (let i = 0; i < 10; i++) {
    const es = e * Math.sin(phi);
    phi = 2 * Math.atan(Math.pow((1 + es) / (1 - es), e / 2) * Math.exp(L)) - Math.PI / 2;
  }
  return [phi * 180 / Math.PI, lon * 180 / Math.PI];
}

// ---- Chargement des webcams ----------------------------------------
function roadCam(id, nom, lat, lon, file, ok = true) {
  const url = BISON + file;
  const isVideo = file.endsWith(".mp4");
  return {
    id, nom, lat, lon, kind: "road", ok,
    lieu: "Caméra routière",
    video: isVideo ? url : null,
    image: isVideo ? null : url,
    cors: true,
    site: "https://www.bison-fute.gouv.fr/maintenant.html",
    source: "Bison Futé – caméra de trafic",
  };
}

function parisStamp(ms) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(ms)).map(p => [p.type, p.value]));
  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
}

async function loadRoadCams() {
  try {
    const it = await (await fetch(BISON + "data/iteration/date.json", { cache: "no-store" })).json();
    const url = `${BISON}data/data-${parisStamp(it[0])}/trafic/maintenant/camerasOL6/camerasOL6.json`;
    const data = await (await fetch(url)).json();
    const cams = [];
    for (const f of data.features) {
      const [lat, lon] = lambert93ToWgs84(...f.geometry.coordinates);
      if (!inZone(lat, lon)) continue;
      const p = f.properties;
      const nom = p.libelleCamera.replace(/_/g, " ").replace(/\s*PR\d+\+\d+/, "");
      cams.push(roadCam(f.id, nom, lat, lon, p.sourceFlux, p.fluxCameraOk !== false));
    }
    if (cams.length) return cams;
    throw new Error("liste vide");
  } catch (err) {
    console.warn("Bison Futé indisponible, liste de secours utilisée", err);
    return BISON_FALLBACK.map(c => roadCam(...c));
  }
}

function tourismCams() {
  return window.WEBCAMS_TOURISME
    .filter(c => inZone(c.lat, c.lon))
    .map((c, i) => ({
      id: "t" + i, kind: "tourism", ...c,
      thumb: c.image || (c.youtube ? `https://i.ytimg.com/vi/${c.youtube}/hqdefault_live.jpg` : null),
      source: new URL(c.site).hostname.replace(/^www\./, ""),
    }));
}

// ---- Statut "en direct" --------------------------------------------
const bust = (url) => url + (url.includes("?") ? "&" : "?") + "t=" + Math.floor(Date.now() / 60000);

function ageText(min) {
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${Math.round(min)} min`;
  if (min < 48 * 60) return `il y a ${Math.round(min / 60)} h`;
  return `il y a ${Math.round(min / 1440)} jours`;
}

function testImage(url) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(true);
    img.onerror = () => res(false);
    img.src = bust(url);
    setTimeout(() => res(false), 15000);
  });
}

async function computeStatus(cam) {
  if (cam.ok === false) return { cls: "offline", label: "Hors ligne", detail: "Caméra signalée hors service" };
  const media = cam.video || cam.image;
  if ((cam.cors || cam.corsGet) && media) {
    try {
      const r = await fetch(bust(media), { method: cam.corsGet ? "GET" : "HEAD", cache: "no-store" });
      if (!r.ok) return { cls: "offline", label: "Hors ligne", detail: "Image indisponible" };
      const lm = r.headers.get("Last-Modified");
      if (lm) {
        const min = (Date.now() - new Date(lm).getTime()) / 60000;
        const when = new Date(lm).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        const detail = `Mise à jour ${ageText(min)} (${when})`;
        if (min <= LIVE_MIN) return { cls: "live", label: "En direct", detail };
        if (min <= RECENT_MIN) return { cls: "recent", label: "Récente", detail };
        return { cls: "old", label: "Image ancienne", detail };
      }
    } catch (e) { /* on retombe sur le test simple */ }
  }
  if (cam.image) {
    const ok = await testImage(cam.image);
    return ok
      ? { cls: "unknown", label: "Image disponible", detail: "Heure de mise à jour non communiquée par le site" }
      : { cls: "offline", label: "Hors ligne", detail: "Image indisponible" };
  }
  if (cam.youtube || cam.player) return { cls: "unknown", label: "Flux vidéo", detail: "Lecteur vidéo du site, à lancer avec « Voir le direct »" };
  return { cls: "unknown", label: "Inconnu", detail: "" };
}

// ---- Carte ---------------------------------------------------------
const map = L.map("map", { zoomControl: true, minZoom: 7, maxZoom: 18, attributionControl: true });
map.zoomControl.setPosition("topleft");

const LAYERS = [
  { name: "Plan", layer: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }) },
  { name: "Relief", layer: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17, subdomains: "abc",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a>' }) },
  { name: "Satellite", layer: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Imagerie &copy; Esri" }) },
];
let layerIdx = 0;
LAYERS[0].layer.addTo(map);
map.setView([45.35, 2.76], 8);

document.getElementById("btn-layer").onclick = () => {
  map.removeLayer(LAYERS[layerIdx].layer);
  layerIdx = (layerIdx + 1) % LAYERS.length;
  LAYERS[layerIdx].layer.addTo(map);
  toast("Fond de carte : " + LAYERS[layerIdx].name);
};

// ---- Repère Aurillac -----------------------------------------------
const AURILLAC = [44.9264, 2.4396];
L.circle(AURILLAC, { radius: 3000, color: "#c2410c", weight: 2, fillColor: "#f97316", fillOpacity: 0.15, interactive: false }).addTo(map);
L.marker(AURILLAC, {
  icon: L.divIcon({ className: "city-marker", html: '<div class="city-pin">Aurillac</div>', iconSize: [96, 40], iconAnchor: [48, 40] }),
  zIndexOffset: -1000, title: "Aurillac",
}).on("click", e => { L.DomEvent.stopPropagation(e); map.flyTo(AURILLAC, 13); }).addTo(map);

const cluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: true,
  disableClusteringAtZoom: 15,
  maxClusterRadius: z => (z <= 8 ? 80 : z <= 11 ? 55 : 40),
  iconCreateFunction: c => {
    const n = c.getChildCount();
    return L.divIcon({
      className: "cluster" + (n >= 10 ? " big" : ""),
      html: `<div><span>${n}<small>webcams</small></span></div>`,
      iconSize: n >= 10 ? [56, 56] : [46, 46],
    });
  },
});
map.addLayer(cluster);

const ICON_ROAD = '<svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>';
const ICON_VIDEO = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

function bubbleHtml(cam) {
  const inner = cam.kind === "tourism" && cam.thumb
    ? `<img src="${bust(cam.thumb)}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : (cam.kind === "road" ? ICON_ROAD : ICON_VIDEO);
  return `<div class="bubble ${cam.kind} ${cam.status ? cam.status.cls : "old"}" title="${cam.nom}"><div class="inner">${inner}</div></div>`;
}

function makeIcon(cam) {
  return L.divIcon({ className: "cam-marker", html: bubbleHtml(cam), iconSize: [52, 59], iconAnchor: [26, 59] });
}

function setStatusClass(cam) {
  const el = cam.marker.getElement();
  const b = el && el.querySelector(".bubble");
  if (b) b.className = `bubble ${cam.kind} ${cam.status.cls}`;
  else cam.marker.setIcon(makeIcon(cam));
}

// ---- Panneau de détail ---------------------------------------------
const panel = document.getElementById("panel");
const mediaEl = document.getElementById("media");
const btnLive = document.getElementById("btn-live");
let current = null, refreshTimer = null;

function renderStatus(cam) {
  const s = cam.status;
  document.getElementById("status").innerHTML = s
    ? `<span class="badge"><i class="dot ${s.cls}"></i>${s.label}</span><span class="detail">${s.detail}</span>`
    : `<span class="badge"><i class="dot old"></i>Vérification…</span>`;
}

function showMedia(cam) {
  clearInterval(refreshTimer);
  if (cam.video) {
    mediaEl.innerHTML = `<video src="${bust(cam.video)}" autoplay muted loop playsinline controls></video>`;
  } else if (cam.image || cam.thumb) {
    const src = cam.image || cam.thumb;
    mediaEl.innerHTML = `<img class="zoom" src="${bust(src)}" alt="${cam.nom}">`;
    const img = mediaEl.querySelector("img");
    img.onclick = () => window.open(bust(src), "_blank", "noopener");
    img.onerror = () => { mediaEl.innerHTML = `<div class="placeholder">Image indisponible pour le moment.<br>Essayez « Ouvrir le site ».</div>`; };
    if (cam.image) refreshTimer = setInterval(() => { img.src = src + (src.includes("?") ? "&" : "?") + "r=" + Date.now(); }, 60000);
  } else {
    mediaEl.innerHTML = `<div class="placeholder">Webcam vidéo en direct.<br>Appuyez sur « Voir le direct ».</div>`;
  }
}

function playLive(cam) {
  clearInterval(refreshTimer);
  const src = cam.youtube
    ? `https://www.youtube.com/embed/${cam.youtube}?autoplay=1&mute=1&playsinline=1`
    : cam.player;
  mediaEl.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="origin-when-cross-origin"></iframe>`;
  btnLive.hidden = true;
}

function openPanel(cam) {
  current = cam;
  document.getElementById("p-title").textContent = cam.nom;
  document.getElementById("p-place").textContent = cam.lieu;
  document.getElementById("p-orient").innerHTML = orientationHtml(cam.orientation);
  document.getElementById("btn-site").href = cam.site;
  document.getElementById("p-source").textContent = "Source : " + cam.source;
  btnLive.hidden = !(cam.player || cam.youtube);
  btnLive.onclick = () => playLive(cam);
  renderStatus(cam);
  showMedia(cam);
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  // statut frais à l'ouverture
  computeStatus(cam).then(s => { cam.status = s; setStatusClass(cam); if (current === cam) renderStatus(cam); });
}

function closePanel() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  clearInterval(refreshTimer);
  mediaEl.innerHTML = "";
  current = null;
}
document.getElementById("panel-close").onclick = closePanel;
map.on("click", closePanel);
document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

// Glisser vers le bas pour fermer (mobile)
let touchY = null;
panel.addEventListener("touchstart", e => { if (e.target.closest(".panel-body") && panel.querySelector(".panel-body").scrollTop > 0) return; touchY = e.touches[0].clientY; }, { passive: true });
panel.addEventListener("touchend", e => { if (touchY !== null && e.changedTouches[0].clientY - touchY > 80) closePanel(); touchY = null; });

// ---- Orientation de la webcam --------------------------------------
const ORIENTATIONS = {
  N: ["le nord", 0], NE: ["le nord-est", 45], E: ["l'est", 90], SE: ["le sud-est", 135],
  S: ["le sud", 180], SO: ["le sud-ouest", 225], O: ["l'ouest", 270], NO: ["le nord-ouest", 315],
};
function orientationHtml(code) {
  const o = code && ORIENTATIONS[code.toUpperCase()];
  if (!o) return `<span class="compass unknown"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span>Orientation inconnue`;
  return `<span class="compass"><svg viewBox="0 0 24 24" style="transform:rotate(${o[1]}deg)"><circle cx="12" cy="12" r="9"/><path d="M12 4l3.5 8h-7z"/></svg></span>Vue orientée vers ${o[0]}`;
}

// ---- Recherche (villages + webcams) --------------------------------
const sInput = document.getElementById("search-input");
const sList = document.getElementById("search-results");
const sClear = document.getElementById("search-clear");
let sTimer = null, sItems = [], sSeq = 0, placeMarker = null;
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[-'’]/g, " ");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderResults() {
  if (!sItems.length) {
    sList.innerHTML = `<li class="empty">Aucun résultat</li>`;
  } else {
    sList.innerHTML = sItems.map((it, i) => `<li role="option" data-i="${i}" class="${i === 0 ? "active" : ""}">
      <span class="r-ico ${it.type}"></span><span class="r-txt"><b>${esc(it.label)}</b><small>${esc(it.sub)}</small></span></li>`).join("");
  }
  sList.hidden = false;
}

async function runSearch(q) {
  const seq = ++sSeq;
  const nq = norm(q);
  const cams = allCams.filter(c => norm(c.nom + " " + c.lieu).includes(nq)).slice(0, 5)
    .map(c => ({ type: "cam", label: c.nom, sub: "Webcam · " + c.lieu, cam: c }));
  sItems = cams; renderResults();
  if (q.length < 2) return;
  try {
    const url = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(q)}&type=municipality&autocomplete=1&limit=6&lat=45.35&lon=2.76`;
    const data = await (await fetch(url)).json();
    if (seq !== sSeq) return;
    const places = data.features.map(f => ({
      type: "place", label: f.properties.name,
      sub: `${f.properties.postcode || ""} · ${(f.properties.context || "").split(",").slice(1).join(",").trim()}`,
      lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0],
    }));
    sItems = [...places, ...cams];
    renderResults();
  } catch (e) { /* hors ligne : on garde les webcams */ }
}

function pick(it) {
  sList.hidden = true;
  sInput.value = it.label;
  sClear.hidden = false;
  sInput.blur();
  if (it.type === "cam") {
    map.flyTo([it.cam.lat, it.cam.lon], 15);
    map.once("moveend", () => openPanel(it.cam));
    return;
  }
  closePanel();
  if (placeMarker) placeMarker.remove();
  placeMarker = L.marker([it.lat, it.lon], {
    icon: L.divIcon({ className: "place-marker", html: `<div class="place-pin">${esc(it.label)}</div>`, iconSize: [0, 0] }),
    zIndexOffset: -900, interactive: false,
  }).addTo(map);
  map.flyTo([it.lat, it.lon], 13);
  const near = allCams.map(c => ({ c, d: haversineKm([it.lat, it.lon], [c.lat, c.lon]) })).sort((a, b) => a.d - b.d)[0];
  if (near) toast(near.d <= 1 ? `Webcam sur place : ${near.c.nom}` : `Webcam la plus proche : ${near.c.nom} (${near.d.toFixed(1)} km)`);
}

sInput.addEventListener("input", () => {
  const q = sInput.value.trim();
  sClear.hidden = !q;
  clearTimeout(sTimer);
  if (!q) { sList.hidden = true; return; }
  sTimer = setTimeout(() => runSearch(q), 250);
});
sInput.addEventListener("keydown", e => {
  const lis = [...sList.querySelectorAll("li[data-i]")];
  let a = lis.findIndex(li => li.classList.contains("active"));
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!lis.length) return;
    a = (a + (e.key === "ArrowDown" ? 1 : -1) + lis.length) % lis.length;
    lis.forEach((li, i) => li.classList.toggle("active", i === a));
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (sItems[a >= 0 ? a : 0]) pick(sItems[a >= 0 ? a : 0]);
  } else if (e.key === "Escape") {
    sList.hidden = true;
  }
});
sList.addEventListener("click", e => {
  const li = e.target.closest("li[data-i]");
  if (li) pick(sItems[+li.dataset.i]);
});
sClear.onclick = () => {
  sInput.value = ""; sClear.hidden = true; sList.hidden = true;
  if (placeMarker) { placeMarker.remove(); placeMarker = null; }
  sInput.focus();
};
document.addEventListener("click", e => { if (!e.target.closest("#search")) sList.hidden = true; });
L.DomEvent.disableClickPropagation(document.getElementById("search"));

// ---- Repère personnel (appui long) ---------------------------------
// Appui long sur téléphone, clic long ou clic droit sur ordinateur.
// Le repère reste en place (et après rechargement de la page) jusqu'à ce qu'on le retire.
let myPin = null;
const PIN_KEY = "webcams-auvergne-repere";

// Coordonnées en degrés et minutes décimales (ex. N 45° 17,141′)
function toDMM(value, pos, neg) {
  const hemi = value >= 0 ? pos : neg;
  const a = Math.abs(value);
  let deg = Math.floor(a);
  let min = (a - deg) * 60;
  if (min >= 59.9995) { deg += 1; min = 0; }
  return `${hemi} ${deg}° ${min.toFixed(3).replace(".", ",")}′`;
}

function goToCam(cam) {
  if (myPin) myPin.closePopup();
  map.flyTo([cam.lat, cam.lon], 15);
  map.once("moveend", () => openPanel(cam));
}

function pinPopup() {
  const p = myPin.getLatLng();
  const list = allCams.map(c => ({ c, d: haversineKm([p.lat, p.lng], [c.lat, c.lon]) }))
    .sort((a, b) => a.d - b.d).slice(0, 3);
  const dmm = `${toDMM(p.lat, "N", "S")}  ${toDMM(p.lng, "E", "O")}`;
  const dec = `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`;
  const div = document.createElement("div");
  div.className = "pin-popup";
  div.innerHTML = `<strong>Mon repère</strong>
    <div class="pin-coords">
      <span class="pin-dmm">${toDMM(p.lat, "N", "S")}<br>${toDMM(p.lng, "E", "O")}</span>
      <span class="pin-dec">${dec}</span>
      <button type="button" class="pin-copy">Copier</button>
    </div>
    <div class="pin-label">Webcams les plus proches</div>
    <ul class="pin-cams">${list.map((x, i) => `<li><button type="button" data-i="${i}">
      <span class="dot ${x.c.status ? x.c.status.cls : "old"}"></span>
      <span class="pin-cam-name">${esc(x.c.nom)}</span><span class="pin-cam-d">${x.d.toFixed(1)} km</span></button></li>`).join("")}</ul>
    <button type="button" class="btn pin-remove">Retirer le repère</button>`;
  div.querySelectorAll(".pin-cams button").forEach(b => { b.onclick = () => goToCam(list[+b.dataset.i].c); });
  div.querySelector(".pin-remove").onclick = removePin;
  div.querySelector(".pin-copy").onclick = async ev => {
    const btn = ev.currentTarget;
    const text = `${dmm} (${dec})`;
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copié ✓"; }
    catch (e) {
      const r = document.createRange(); r.selectNodeContents(div.querySelector(".pin-coords"));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Sélectionné";
    }
    setTimeout(() => { btn.textContent = "Copier"; }, 1800);
  };
  L.DomEvent.disableClickPropagation(div);
  return div;
}

function placePin(latlng, silent) {
  if (myPin) myPin.setLatLng(latlng);
  else {
    myPin = L.marker(latlng, {
      icon: L.divIcon({ className: "my-pin", html: '<div class="my-pin-body"></div>', iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -40] }),
      draggable: true, zIndexOffset: 2000, title: "Mon repère (glisser pour déplacer)",
    }).addTo(map);
    myPin.bindPopup(pinPopup, { closeButton: true, autoPan: true, maxWidth: 280,
      autoPanPaddingTopLeft: L.point(16, 140), autoPanPaddingBottomRight: L.point(16, 70) });
    myPin.on("dragend", () => { savePin(); if (myPin.isPopupOpen()) myPin.setPopupContent(pinPopup); });
  }
  savePin();
  if (!silent) {
    if (navigator.vibrate) try { navigator.vibrate(30); } catch (e) {}
    toast("Repère placé · touchez-le pour voir les webcams proches ou le retirer");
  }
}
function removePin() {
  if (!myPin) return;
  myPin.remove(); myPin = null;
  try { localStorage.removeItem(PIN_KEY); } catch (e) {}
  toast("Repère retiré");
}
function savePin() {
  try { const p = myPin.getLatLng(); localStorage.setItem(PIN_KEY, JSON.stringify([p.lat, p.lng])); } catch (e) {}
}
function restorePin() {
  try {
    const v = JSON.parse(localStorage.getItem(PIN_KEY) || "null");
    if (Array.isArray(v) && v.length === 2) placePin(L.latLng(v[0], v[1]), true);
  } catch (e) {}
}

// Appui long (doigt ou souris) : 0,5 s sans bouger, détecté avec les "pointer events"
// qui fonctionnent pareil sur téléphone et ordinateur. Le clic droit marche aussi.
let lastPinAt = 0;
function pinAtClient(x, y) {
  const r = map.getContainer().getBoundingClientRect();
  lastPinAt = Date.now();
  placePin(map.containerPointToLatLng([x - r.left, y - r.top]));
}
(function longPress() {
  const el = map.getContainer();
  const pointers = new Map();
  let timer = null, start = null, fired = false;
  const cancel = () => { clearTimeout(timer); timer = null; };
  el.addEventListener("pointerdown", ev => {
    pointers.set(ev.pointerId, true);
    if (pointers.size > 1) return cancel();                       // pincement (zoom) : pas de repère
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    if (ev.target.closest(".leaflet-marker-icon, .leaflet-popup, .leaflet-control")) return;
    start = [ev.clientX, ev.clientY]; fired = false;
    cancel();
    timer = setTimeout(() => { timer = null; fired = true; pinAtClient(start[0], start[1]); }, 500);
  }, true);
  el.addEventListener("pointermove", ev => {
    if (timer && start && Math.hypot(ev.clientX - start[0], ev.clientY - start[1]) > 10) cancel();
  }, true);
  const up = ev => { pointers.delete(ev.pointerId); cancel(); };
  el.addEventListener("pointerup", up, true);
  el.addEventListener("pointercancel", up, true);
  el.addEventListener("pointerleave", up, true);
  // Le clic qui suit un appui long ne doit rien fermer
  el.addEventListener("click", ev => { if (fired) { ev.stopPropagation(); fired = false; } }, true);
  // Bloque le menu du navigateur sur la carte ; clic droit = poser le repère
  el.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    if (Date.now() - lastPinAt > 1500 && !ev.target.closest(".leaflet-marker-icon, .leaflet-popup, .leaflet-control")) {
      pinAtClient(ev.clientX, ev.clientY);
    }
  }, true);
})();

// ---- Ma position ---------------------------------------------------
let meMarker = null, allCams = [];
document.getElementById("btn-locate").onclick = () => {
  if (!navigator.geolocation) return toast("Géolocalisation non disponible");
  toast("Recherche de votre position…");
  navigator.geolocation.getCurrentPosition(pos => {
    const me = [pos.coords.latitude, pos.coords.longitude];
    if (meMarker) meMarker.remove();
    meMarker = L.marker(me, { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18] }), zIndexOffset: 1000 }).addTo(map);
    document.getElementById("btn-locate").classList.add("on");
    const sorted = allCams.map(c => ({ c, d: haversineKm(me, [c.lat, c.lon]) })).sort((a, b) => a.d - b.d);
    const near = sorted[0];
    const within10 = sorted.filter(x => x.d <= 10).length;
    if (!near) return;
    toast(`Webcam la plus proche : ${near.c.nom} (${near.d.toFixed(1)} km)` + (within10 > 1 ? ` · ${within10} à moins de 10 km` : ""));
    map.fitBounds(L.latLngBounds([me, [near.c.lat, near.c.lon]]).pad(0.6), { maxZoom: 13 });
  }, () => toast("Position refusée ou indisponible"), { enableHighAccuracy: true, timeout: 10000 });
};

// ---- Toast ---------------------------------------------------------
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

// ---- Démarrage -----------------------------------------------------
async function refreshStatuses() {
  await Promise.all(allCams.map(async cam => {
    cam.status = await computeStatus(cam);
    setStatusClass(cam);
  }));
  const live = allCams.filter(c => c.status && c.status.cls === "live").length;
  const hh = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("count").textContent = `${allCams.length} webcams · ${live} en direct · ${hh}`;
  if (current) renderStatus(current);
}

(async function init() {
  const road = await loadRoadCams();
  allCams = [...tourismCams(), ...road];
  for (const cam of allCams) {
    cam.marker = L.marker([cam.lat, cam.lon], { icon: makeIcon(cam), title: cam.nom });
    cam.marker.on("click", e => { L.DomEvent.stopPropagation(e); openPanel(cam); });
    cluster.addLayer(cam.marker);
  }
  map.fitBounds(cluster.getBounds(), { padding: [30, 30] });
  restorePin();
  document.getElementById("count").textContent = `${allCams.length} webcams · vérification…`;
  // les marqueurs reprennent leur couleur quand le groupe s'ouvre
  cluster.on("animationend spiderfied", () => allCams.forEach(c => c.status && setStatusClass(c)));
  map.on("zoomend moveend", () => allCams.forEach(c => c.status && setStatusClass(c)));
  await refreshStatuses();
  setInterval(refreshStatuses, 5 * 60 * 1000);
})();
