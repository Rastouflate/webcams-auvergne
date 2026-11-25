// Webcams touristiques / paysage de la zone.
// Les caméras routières (Bison Futé) sont chargées en direct par app.js.
//
// Champs :
//   nom, lieu, lat, lon
//   image   : URL de l'image rafraîchie (aperçu)
//   cors    : true si le serveur permet de lire la date de l'image (statut "en direct" fiable)
//   player  : URL d'un lecteur vidéo intégrable (optionnel)
//   site    : page d'origine
//   youtube : identifiant de vidéo YouTube en direct (optionnel)

const VE = "https://s1.vision-environnement.com/live/modules/timelapse/";
const VEP = "https://www.vision-environnement.com/live/player/";
const TRINUM = "https://www.trinum.com/ibox/ftpcam/";

window.WEBCAMS_TOURISME = [
  // --- Clermont / Chaîne des Puys ---
  { nom: "Clermont-Ferrand – Panorama", lieu: "Clermont-Ferrand", lat: 45.7765, lon: 3.0850,
    image: VE + "capture/clermont-ferrand.jpg", player: VEP + "player.php?id=clermont-ferrand",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/3720-clermont-ferrand/" },
  { nom: "Miremont – Lac", lieu: "Miremont", lat: 45.9262, lon: 2.7680,
    image: VE + "capture/miremont.jpg", player: VEP + "player.php?id=miremont",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/3326-miremont/" },

  // --- Massif du Sancy ---
  { nom: "Le Mont-Dore – Bas de station", lieu: "Le Mont-Dore", lat: 45.5390, lon: 2.8130,
    image: TRINUM + "sancy_bas-station.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/le-mont-dore/webcams/" },
  { nom: "Le Mont-Dore – Sommet", lieu: "Puy de Sancy", lat: 45.5300, lon: 2.8170,
    image: TRINUM + "sancy_sommet-station.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/le-mont-dore/webcams/" },
  { nom: "Le Mont-Dore – Vue station (direct vidéo)", lieu: "Le Mont-Dore", lat: 45.5450, lon: 2.8137,
    youtube: "YkKGantlWH0",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/21102-skyline-france-mont-dore-le-mont-dore/" },
  { nom: "Le Mont-Dore – Village (direct vidéo)", lieu: "Le Mont-Dore", lat: 45.5760, lon: 2.8100,
    player: "https://www.youtube.com/embed/live_stream?channel=UCjGrBtlwuneaSMmi32yhrXQ&autoplay=1&mute=1&playsinline=1",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/1014-montdore/" },
  { nom: "Chastreix-Sancy – Station", lieu: "Chastreix", lat: 45.5230, lon: 2.7780,
    image: TRINUM + "sancy_chastreix-sancy-station.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/chastreix/webcam/" },
  { nom: "La Bourboule – Murat-le-Quaire", lieu: "Murat-le-Quaire", lat: 45.5980, lon: 2.7460,
    image: TRINUM + "sancy_la-bourboule-murat-le-quaire.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/murat-le-quaire/webcam-murat-le-quaire/" },
  { nom: "Lac Chambon", lieu: "Chambon-sur-Lac", lat: 45.5720, lon: 2.9150,
    image: TRINUM + "sancy_lac-de-chambon.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/chambon-sur-lac/webcam-lac-chambon/" },
  { nom: "Château de Murol", lieu: "Murol", lat: 45.5750, lon: 2.9440,
    image: TRINUM + "sancy_chateau-de-murol.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/murol/webcam-chateau-murol/" },
  { nom: "Super-Besse – Front de neige", lieu: "Super-Besse", lat: 45.5118, lon: 2.8526,
    image: TRINUM + "superbesse_front-de-neige.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/super-besse/webcams/" },
  { nom: "Super-Besse – Haut des pistes", lieu: "Super-Besse", lat: 45.5040, lon: 2.8420,
    image: TRINUM + "sancy_superbesse-haut.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/super-besse/webcams/" },
  { nom: "Super-Besse – École de ski", lieu: "Super-Besse", lat: 45.5100, lon: 2.8560,
    image: TRINUM + "sancy_superbesse-ecole.jpg", cors: true,
    site: "https://www.sancy.com/decouvrir/toutes-les-communes/super-besse/webcams/" },
  { nom: "Besse – Domaine nordique de Pertuyzat", lieu: "Besse-et-Saint-Anastaise", lat: 45.4985, lon: 2.9030,
    image: TRINUM + "sancy_domaine-nordique-pertuyzat.jpg", cors: true,
    site: "https://www.sancy.com/voir-faire/activites-neige/ski-de-fond/webcams-besse-pertuyzat-la-stele/" },
  { nom: "Domaine nordique de La Stèle", lieu: "La Tour-d'Auvergne", lat: 45.5150, lon: 2.7230,
    image: TRINUM + "sancy_domaine-nordique-la-stele.jpg", cors: true,
    site: "https://www.sancy.com/voir-faire/activites-neige/ski-de-fond/webcams-besse-pertuyzat-la-stele/" },

  // --- Monts du Cantal ---
  { nom: "Puy Mary (direct vidéo)", lieu: "Puy Mary", lat: 45.1140, lon: 2.6708,
    image: "https://ipcamlive.com/player/snapshot.php?alias=5fb5716ce3dae",
    player: "https://g0.ipcamlive.com/player/player.php?alias=5fb5716ce3dae&autoplay=1",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/1924-puymary/" },
  { nom: "Salers – Village", lieu: "Salers", lat: 45.1390, lon: 2.4950,
    player: "https://pv.viewsurf.com/2106/Salers",
    site: "https://www.salers-tourisme.fr/webcams" },
  { nom: "Le Lioran – Station", lieu: "Le Lioran", lat: 45.0830, lon: 2.7550,
    image: TRINUM + "lioran_station.jpg", cors: true,
    player: "https://app.webcam-hd.com/lioran/lioran_station",
    site: "https://www.lelioran.com/hiver/webcam/" },
  { nom: "Le Lioran – La Combe", lieu: "Le Lioran", lat: 45.0780, lon: 2.7480,
    image: TRINUM + "lioran_combe.jpg", cors: true,
    player: "https://app.webcam-hd.com/lioran/lioran_combe",
    site: "https://www.lelioran.com/hiver/webcam/" },
  { nom: "Le Lioran – Font d'Alagnon", lieu: "Le Lioran", lat: 45.0700, lon: 2.7330,
    image: TRINUM + "lioran_font-d-alagnon.jpg", cors: true,
    player: "https://app.webcam-hd.com/lioran/lioran_font-d-alagnon",
    site: "https://www.lelioran.com/hiver/webcam/" },
  { nom: "Le Lioran – Panorama", lieu: "Le Lioran", lat: 45.0714, lon: 2.7589,
    image: VE + "capture/lelioran.jpg", player: VEP + "player.php?id=le-lioran",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/4277-le-lioran/" },
  { nom: "Plomb du Cantal", lieu: "Le Lioran", lat: 45.0573, lon: 2.7617,
    image: VE + "captureptz/lelioran2.jpg", player: VEP + "player.php?id=lioran2-",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/67-lioran2/" },
  { nom: "Prat de Bouc", lieu: "Albepierre-Bredons", lat: 45.0523, lon: 2.7927,
    image: VE + "capture/pratdebouc.jpg", player: VEP + "player.php?id=pratdebouc",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/2334-pratdebouc/" },
  { nom: "Montarnal – Vallée du Lot", lieu: "Montarnal", lat: 44.6469, lon: 2.4552,
    image: VE + "capture/asvolt.jpg", player: VEP + "player.php?id=Montarnal",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/1376-montarnal/" },

  // --- Corrèze / Margeride / Aubrac ---
  { nom: "Égletons – Ville", lieu: "Égletons", lat: 45.4197, lon: 2.0691,
    image: VE + "capture/egletons.jpg", player: VEP + "player.php?id=egletons",
    site: "https://www.vision-environnement.com/webcam/france/auvergne-rhone-alpes/68-egletons/" },
  { nom: "Égletons – Panorama", lieu: "Égletons", lat: 45.4003, lon: 2.0538,
    image: VE + "captureptz/egleton2.jpg", player: VEP + "player.php?id=eglefor",
    site: "https://www.vision-environnement.com/webcam/france/nouvelle-aquitaine/1834-eglefor/" },
  { nom: "Le Malzieu", lieu: "Malzieu-Forain", lat: 44.8685, lon: 3.3548,
    image: VE + "capture/malzieu.jpg", player: VEP + "webcams-paris/malzieu0.php",
    site: "https://www.vision-environnement.com/webcam/france/occitanie/3330-malzieu/" },
  { nom: "Col de Bonnecombe", lieu: "Aubrac", lat: 44.5595, lon: 3.1156,
    image: VE + "capture/bonnecombe.jpg", player: VEP + "bonnecombe0.php",
    site: "https://www.vision-environnement.com/webcam/france/occitanie/3288-col-de-bonnecombe/" },
  { nom: "Saint-Rome-de-Dolan – Gorges du Tarn", lieu: "Saint-Rome-de-Dolan", lat: 44.2730, lon: 3.2159,
    image: VE + "capture/dolan.jpg", player: VEP + "player.php?id=dolan",
    site: "https://www.vision-environnement.com/webcam/france/occitanie/3474-dolan/" },
];
