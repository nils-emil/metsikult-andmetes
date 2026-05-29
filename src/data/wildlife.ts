import type {
  AgeClass,
  AgeClassId,
  Species,
  SpeciesId,
} from "../wildlife/species";
import type {
  HabitatRow,
  Layer,
  LayerId,
  SuccessionFrame,
} from "../wildlife/habitat";
import type { ConservationTool } from "../wildlife/conservation";

export const WILDLIFE_SPECIES: Record<SpeciesId, Species> = {
  metsis: {
    id: "metsis",
    name: "Metsis",
    latin: "Tetrao urogallus",
    emoji: "🦃",
    group: "lind",
    status: "II_kat",
    bodyMassKg: [1.5, 5.0],
  },
  lendorav: {
    id: "lendorav",
    name: "Lendorav",
    latin: "Pteromys volans",
    emoji: "🐿️",
    group: "imetaja",
    status: "I_kat",
    bodyMassKg: [0.12, 0.2],
  },
  must_toonekurg: {
    id: "must_toonekurg",
    name: "Must-toonekurg",
    latin: "Ciconia nigra",
    emoji: "🦢",
    group: "lind",
    status: "I_kat",
    bodyMassKg: [2.4, 3.2],
  },
  valgeselg_rahn: {
    id: "valgeselg_rahn",
    name: "Valgeselg-kirjurähn",
    latin: "Dendrocopos leucotos",
    emoji: "🪶",
    group: "lind",
    status: "II_kat",
    bodyMassKg: [0.1, 0.12],
  },
  ilves: {
    id: "ilves",
    name: "Ilves",
    latin: "Lynx lynx",
    emoji: "🐱",
    group: "imetaja",
    status: "III_kat",
    bodyMassKg: [17, 30],
  },
  pruunkaru: {
    id: "pruunkaru",
    name: "Pruunkaru",
    latin: "Ursus arctos",
    emoji: "🐻",
    group: "imetaja",
    status: "III_kat",
    bodyMassKg: [80, 250],
  },
  poder: {
    id: "poder",
    name: "Põder",
    latin: "Alces alces",
    emoji: "🫎",
    group: "imetaja",
    status: "tavaline",
    bodyMassKg: [300, 600],
  },
  metsnugis: {
    id: "metsnugis",
    name: "Metsnugis",
    latin: "Martes martes",
    emoji: "🦦",
    group: "imetaja",
    status: "tavaline",
    bodyMassKg: [0.8, 1.8],
  },
  handkakk: {
    id: "handkakk",
    name: "Händkakk",
    latin: "Strix uralensis",
    emoji: "🦉",
    group: "lind",
    status: "III_kat",
    bodyMassKg: [0.5, 1.3],
  },
  kanakull: {
    id: "kanakull",
    name: "Kanakull",
    latin: "Accipiter gentilis",
    emoji: "🦅",
    group: "lind",
    status: "II_kat",
    bodyMassKg: [0.6, 1.4],
  },
  laanepuu: {
    id: "laanepuu",
    name: "Laanepüü",
    latin: "Tetrastes bonasia",
    emoji: "🐦",
    group: "lind",
    status: "tavaline",
    bodyMassKg: [0.3, 0.45],
  },
  raudkull: {
    id: "raudkull",
    name: "Raudkull",
    latin: "Accipiter nisus",
    emoji: "🪽",
    group: "lind",
    status: "tavaline",
    bodyMassKg: [0.1, 0.3],
  },
};

export const WILDLIFE_AGE_CLASSES: Record<AgeClassId, AgeClass> = {
  raiesmik: {
    id: "raiesmik",
    label: "Raiesmik",
    ageRange: "0–10 a",
    description:
      "Värske raiesmik või väga noor uuendus — domineerib rohurinne, vaarikas ja võsa.",
    color: "#c4a86a",
  },
  noorendik: {
    id: "noorendik",
    label: "Noorendik",
    ageRange: "10–30 a",
    description:
      "Tihe noor mets, kus puud on jõudnud latvuse kõrgusele, kuid alusmets pole veel arenenud.",
    color: "#7fa863",
  },
  keskealine: {
    id: "keskealine",
    label: "Keskealine",
    ageRange: "30–60 a",
    description:
      "Vertikaalne kihistus hakkab tekkima — võra sulgub, alusmets kasvab sisse.",
    color: "#5b9a5b",
  },
  vana: {
    id: "vana",
    label: "Vana mets",
    ageRange: "60–100 a",
    description:
      "Küps mets mitmekihilise rinnastikuga, esimese põlvkonna lamapuit tekib.",
    color: "#3a7a4a",
  },
  vana_pluss: {
    id: "vana_pluss",
    label: "Üle 100 a",
    ageRange: "100+ a",
    description:
      "Väga vana mets rohke lamapuiduga, mitmekihiline elupaik — Eesti looduse haruldane vorm.",
    color: "#1f5a3c",
  },
};

export const WILDLIFE_LAYERS: Record<LayerId, Layer> = {
  vora: {
    id: "vora",
    label: "Võra",
    shortDesc:
      "Puude latvad — pesakohad röövlindudele, toidulaud käbisööjatele ja okastest sõltuvatele liikidele.",
    examples: "kuusk, mänd, kask",
    speciesUsing: [
      "kanakull",
      "raudkull",
      "must_toonekurg",
      "metsis",
      "handkakk",
    ],
    yPercent: 0,
    heightPercent: 28,
  },
  alusmets: {
    id: "alusmets",
    label: "Alusmets",
    shortDesc:
      "Teine puurinne — varjualune linnupesadele ja liikumisrajad puuoks-elanikele.",
    examples: "noored kuused, pihlakas, raagremmelgas",
    speciesUsing: ["lendorav", "metsnugis", "handkakk", "valgeselg_rahn"],
    yPercent: 28,
    heightPercent: 22,
  },
  poosarinne: {
    id: "poosarinne",
    label: "Põõsarinne",
    shortDesc:
      "Põõsad ja noored puud — peidukohad ja pesad madalpesitsejatele, talvine toidubaas.",
    examples: "sarapuu, kuslapuu, paakspuu, vaarikas",
    speciesUsing: ["laanepuu", "metsis", "poder"],
    yPercent: 50,
    heightPercent: 16,
  },
  rohurinne: {
    id: "rohurinne",
    label: "Rohurinne",
    shortDesc:
      "Rohttaimed, mustikas, pohl — metsise kanade, põdrate ja paljude putukate toidulaud.",
    examples: "mustikas, pohl, jänesekapsas, kõrrelised",
    speciesUsing: ["metsis", "laanepuu", "poder", "pruunkaru"],
    yPercent: 66,
    heightPercent: 14,
  },
  maapind: {
    id: "maapind",
    label: "Maapind",
    shortDesc:
      "Sammal, varis, mullapind — talvituspaik, pesakoht maapinnal ja toiduallikas (seemned, putukad).",
    examples: "samblavaip, lehevaris, mullaelustik",
    speciesUsing: ["metsis", "laanepuu", "pruunkaru", "ilves"],
    yPercent: 80,
    heightPercent: 10,
  },
  lamapuit: {
    id: "lamapuit",
    label: "Lamapuit",
    shortDesc:
      "Surnud puud, tüvelamud ja vanad kännud — elupaik tuhandetele liikidele, mis küpses metsas asustamata.",
    examples: "kuusetüved, kased, vanad mändkännud",
    speciesUsing: [
      "valgeselg_rahn",
      "metsnugis",
      "lendorav",
      "handkakk",
      "pruunkaru",
    ],
    yPercent: 90,
    heightPercent: 10,
  },
};

export const WILDLIFE_HABITAT: HabitatRow[] = [
  {
    species: "metsis",
    byClass: {
      raiesmik: 0,
      noorendik: 0,
      keskealine: 1,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Vanad männikud rohke mustikavarrega — mängud avanevad mändide all hommikuhämaruses.",
    food:
      "Talvel männi okkad, suvel mustikad ja marjad, kanad otsivad maapinnalt putukaid.",
    notes:
      "Mängupaikade püsikvaliteet eeldab 80+ aastaseid männikuid ja vaikust kevadel.",
  },
  {
    species: "lendorav",
    byClass: {
      raiesmik: 0,
      noorendik: 0,
      keskealine: 1,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Vanad õõnsustega haavad — pesakoht ja päevane peidukoht; vajab külgnevaid kuuski liuglemiseks.",
    food:
      "Lehtpuu lehed ja pungad, eriti haab ja sanglepp; talvel okkad.",
    notes:
      "Eesti üks haruldasemaid metsaimetajaid — esinemine ainult Kirde-Eestis.",
  },
  {
    species: "must_toonekurg",
    byClass: {
      raiesmik: 0,
      noorendik: 0,
      keskealine: 1,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Suure võraga vanad haavad ja kuused — pesa toetatakse jämedale küljeharule.",
    food:
      "Kalad ja kahepaiksed metsajõgedest ja -kraavidest pesa lähedal.",
    notes:
      "Pesapuu püsielupaiga ümber kehtib raierahu pesitsusperioodil.",
  },
  {
    species: "valgeselg_rahn",
    byClass: {
      raiesmik: 0,
      noorendik: 0,
      keskealine: 1,
      vana: 2,
      vana_pluss: 3,
    },
    primaryNeed: "lamapuit",
    shelter:
      "Vanad lehtpuud, eriti haavad — õõnsus raiutakse pehkinud tüvesse.",
    food:
      "Tüves elavad putukad ja röövikud; toitumise eeldus on rohke lamapuit.",
    notes:
      "Eesti üks tundlikumaid indikaatorliike vana lehtmetsa kvaliteedile.",
  },
  {
    species: "ilves",
    byClass: {
      raiesmik: 1,
      noorendik: 2,
      keskealine: 3,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "segamets",
    shelter:
      "Tihedad noored kuusikud ja kivikangrud — varjab pesakonda ja jälitusvarju.",
    food:
      "Metskits, valgejänes, mäger; jaht eeldab pikki liikumisradu vanemas metsas.",
  },
  {
    species: "pruunkaru",
    byClass: {
      raiesmik: 1,
      noorendik: 1,
      keskealine: 2,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Tihe vanametsa alusmets ja juurikate alused — talveuneks juuretukk või mätaspesa.",
    food:
      "Marjad, mesilaste pere, raipe, suvel rohu- ja mustikalehed.",
    notes:
      "Talvituspaiga rahu on kriitiline detsembrist märtsini.",
  },
  {
    species: "poder",
    byClass: {
      raiesmik: 3,
      noorendik: 3,
      keskealine: 2,
      vana: 1,
      vana_pluss: 1,
    },
    primaryNeed: "noor_mets",
    shelter:
      "Tihedam noor mets ja võsa varjavad talvel ja sünnitusperioodil.",
    food:
      "Lehtpuu võrsed ja koor — raiesmikud ja noorendikud on toidu poolest kõige rikkamad.",
    notes:
      "Tugev kasvulõhe noore ja vana metsa vahel — põder on raie ‚võitja‘.",
  },
  {
    species: "metsnugis",
    byClass: {
      raiesmik: 0,
      noorendik: 1,
      keskealine: 2,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Õõnsused vanades puudes ja oravapesad — kasutab ka veneerist hakkepuud, kui võra on suletud.",
    food:
      "Oravad, närilised, linnupojad, marjad — toitumine eeldab puult-puule liikumist.",
  },
  {
    species: "handkakk",
    byClass: {
      raiesmik: 0,
      noorendik: 0,
      keskealine: 2,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Vanade haabade ja kuuskede suured õõnsused; ka katkenud tüvedel olevad murdpesad.",
    food:
      "Hiired, värbkakk ja muud närilised — saaki jälitatakse alusmetsa servalt.",
  },
  {
    species: "kanakull",
    byClass: {
      raiesmik: 0,
      noorendik: 1,
      keskealine: 2,
      vana: 3,
      vana_pluss: 3,
    },
    primaryNeed: "vana_mets",
    shelter:
      "Vanad kuusikud ja segametsa servad — pesa ehitatakse suletud võraga kõrgesse puusse.",
    food:
      "Kodulinnud, mets-laanepüü, oravad; saagijaht eeldab pikemaid avatud liinpaiku.",
  },
  {
    species: "laanepuu",
    byClass: {
      raiesmik: 0,
      noorendik: 2,
      keskealine: 3,
      vana: 3,
      vana_pluss: 2,
    },
    primaryNeed: "segamets",
    shelter:
      "Tihedad noored ja keskealised segametsad — kasutab põõsa- ja rohurinde varju.",
    food:
      "Marjad, lehepungad ja kasekäbid; talvel kasepungad pakuvad põhitoitu.",
  },
  {
    species: "raudkull",
    byClass: {
      raiesmik: 1,
      noorendik: 2,
      keskealine: 3,
      vana: 2,
      vana_pluss: 2,
    },
    primaryNeed: "segamets",
    shelter:
      "Tihedad keskealised kuuse- või segapuistud — varjatud pesa täiskasvanud puu võras.",
    food:
      "Väikelinnud — jaht eeldab tihedat võrastikku, kust varitseda lagedaid servasid.",
  },
];

export const WILDLIFE_PRECUT_BASELINE: SpeciesId[] = [
  "metsis",
  "lendorav",
  "must_toonekurg",
  "valgeselg_rahn",
  "ilves",
  "pruunkaru",
  "metsnugis",
  "handkakk",
  "kanakull",
  "laanepuu",
  "raudkull",
];

// 21 frames at years 0, 5, 10, …, 100.
// Recovery values are illustrative — kvalitatiivne kirjandus, mitte mõõdetud kõverad.
export const WILDLIFE_SUCCESSION: SuccessionFrame[] = [
  {
    year: 0,
    phase: "Lageraie hetk",
    phaseDesc:
      "Tüved on lõigatud, raidmed maas, mullapind on häiritud. Avatud taevas.",
    recovery: { elupaik: 5, varjualune: 0, toidubaas: 10 },
    speciesPresent: ["poder"],
    speciesGained: ["poder"],
  },
  {
    year: 5,
    phase: "Pioneeride faas",
    phaseDesc:
      "Vaarikas, kõrrelised ja noored kased katavad maapinda. Lehtpuu võrsed on põdratoiduks.",
    recovery: { elupaik: 12, varjualune: 4, toidubaas: 28 },
    speciesPresent: ["poder"],
  },
  {
    year: 10,
    phase: "Noore uuenduse faas",
    phaseDesc:
      "Kase- ja kuusekultuur kasvab üle 2 m, võsa katab maapinna. Põdratoit on tipus.",
    recovery: { elupaik: 18, varjualune: 9, toidubaas: 42 },
    speciesPresent: ["poder"],
  },
  {
    year: 15,
    phase: "Tihenev noorendik",
    phaseDesc:
      "Latvused katavad maapinda, kuid alusmets puudub. Tihe ja monotoonne ruum.",
    recovery: { elupaik: 22, varjualune: 18, toidubaas: 40 },
    speciesPresent: ["poder"],
  },
  {
    year: 20,
    phase: "Noorendik",
    phaseDesc:
      "10–15 m kõrgune tihe mets — laanepüü ja raudkull leiavad esimesi varjekohti.",
    recovery: { elupaik: 26, varjualune: 28, toidubaas: 38 },
    speciesPresent: ["poder", "laanepuu"],
    speciesGained: ["laanepuu"],
  },
  {
    year: 25,
    phase: "Latvustumise lõpp",
    phaseDesc:
      "Puud kasvavad konkurentsis — alusmets veel puudub, kuid varjualune on hea.",
    recovery: { elupaik: 30, varjualune: 36, toidubaas: 36 },
    speciesPresent: ["poder", "laanepuu"],
  },
  {
    year: 30,
    phase: "Keskealine — varase faasi",
    phaseDesc:
      "Esimene harvendus on möödas, valguslõhed lasevad alusmetsale kasvada.",
    recovery: { elupaik: 36, varjualune: 44, toidubaas: 40 },
    speciesPresent: ["poder", "laanepuu", "raudkull"],
    speciesGained: ["raudkull"],
  },
  {
    year: 40,
    phase: "Keskealine",
    phaseDesc:
      "Alusmets areneb, esimene struktuurne kihistus — ilves ja metsnugis kasutavad serva.",
    recovery: { elupaik: 44, varjualune: 54, toidubaas: 46 },
    speciesPresent: ["poder", "laanepuu", "raudkull", "ilves", "metsnugis"],
    speciesGained: ["ilves", "metsnugis"],
  },
  {
    year: 50,
    phase: "Keskealine — küps",
    phaseDesc:
      "Mets on vertikaalselt mitmekihiline — kanakull pesitseb, varjualune täidab eeldused.",
    recovery: { elupaik: 50, varjualune: 62, toidubaas: 50 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
    ],
    speciesGained: ["kanakull"],
  },
  {
    year: 60,
    phase: "Vananev mets",
    phaseDesc:
      "Üksikud puud saavutavad metsise küpsusvanuse — lamapuit hakkab tekkima.",
    recovery: { elupaik: 56, varjualune: 68, toidubaas: 54 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
    ],
  },
  {
    year: 65,
    phase: "Algav vana mets",
    phaseDesc:
      "Männikud küpsusvanuses; pruunkaru talvituspaigad muutuvad sobivaks.",
    recovery: { elupaik: 62, varjualune: 72, toidubaas: 58 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
    ],
    speciesGained: ["pruunkaru"],
  },
  {
    year: 70,
    phase: "Vana mets",
    phaseDesc:
      "Esimesed õõnsused tekivad vanematesse haabadesse; händkakk leiab pesakoha.",
    recovery: { elupaik: 68, varjualune: 76, toidubaas: 62 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
    ],
    speciesGained: ["handkakk"],
  },
  {
    year: 75,
    phase: "Vana mets — kihistunud",
    phaseDesc:
      "Männikud on metsisemängu jaoks vanad, kuid mängu taastumine eeldab püsivat rahu.",
    recovery: { elupaik: 72, varjualune: 80, toidubaas: 66 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
    ],
  },
  {
    year: 80,
    phase: "Küps mets",
    phaseDesc:
      "Metsis võib mängu pidada, kui rahu on hoitud; valgeselg-kirjurähn pole veel kohal.",
    recovery: { elupaik: 76, varjualune: 84, toidubaas: 70 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
      "metsis",
    ],
    speciesGained: ["metsis"],
  },
  {
    year: 85,
    phase: "Küps mets — kihistus",
    phaseDesc:
      "Lamapuit kuhjub — lendorava potentsiaalsed õõnsused valmivad lähikümnenditel.",
    recovery: { elupaik: 80, varjualune: 86, toidubaas: 73 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
      "metsis",
    ],
  },
  {
    year: 90,
    phase: "Vana mets — sügav",
    phaseDesc:
      "Suured õõnsushaavad — lendorav võib uuesti tulla, kui Kirde-Eesti populatsioonist on lähedal.",
    recovery: { elupaik: 84, varjualune: 88, toidubaas: 76 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
      "metsis",
      "lendorav",
    ],
    speciesGained: ["lendorav"],
  },
  {
    year: 95,
    phase: "Vana mets — küps lamapuit",
    phaseDesc:
      "Valgeselg-kirjurähn leiab esimesi sobivaid tüvepehkmeid — naasev väga aeglaselt.",
    recovery: { elupaik: 86, varjualune: 90, toidubaas: 78 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
      "metsis",
      "lendorav",
      "valgeselg_rahn",
    ],
    speciesGained: ["valgeselg_rahn"],
  },
  {
    year: 100,
    phase: "Vana mets — küps",
    phaseDesc:
      "Sajandivanune mets — kihistus on olemas, kuid must-toonekurg eelistab veel vanemaid haaba.",
    recovery: { elupaik: 88, varjualune: 92, toidubaas: 80 },
    speciesPresent: [
      "poder",
      "laanepuu",
      "raudkull",
      "ilves",
      "metsnugis",
      "kanakull",
      "pruunkaru",
      "handkakk",
      "metsis",
      "lendorav",
      "valgeselg_rahn",
    ],
  },
];

export const WILDLIFE_TOOLS: ConservationTool[] = [
  {
    id: "vaarielupaik",
    label: "Vääriselupaigad (VEP)",
    shortDesc:
      "Riigi- ja erametsas eristatavad väikesed metsalapikesed, kus säilib looduslähedane mets ja sellega seotud liigid.",
    legalBasis: "Metsaseadus § 23, MM määrus nr 113",
    protects: ["valgeselg_rahn", "lendorav", "metsis", "must_toonekurg"],
    coverage:
      "≈ 36 000 ha (~1.5% erametsast); riigimetsas RMK kaardistus ulatuslikum",
    mak2030Link:
      "Alaeesmärk 2 (looduslik mitmekesisus) — VEPide võrgu täiendamine",
  },
  {
    id: "sailikpuud",
    label: "Säilikpuud ja surnud puit",
    shortDesc:
      "Raie järel jäetakse vähemalt 5 m³/ha säilikpuid ja lamatüvesid, et tagada lamapuidu järjepidevus uuel põlvkonnal.",
    legalBasis: "Metsaseadus § 29 lg 5, RMK keskkonnajuhendid",
    protects: ["valgeselg_rahn", "metsnugis", "handkakk", "lendorav"],
    coverage: "Kohustuslik kõigil uuendusraietel ≥ 2 ha",
    mak2030Link:
      "Alaeesmärk 2 ja Alaeesmärk 4 (säästev metsamajandus) — surnud puidu mahu indikaator",
  },
  {
    id: "puhverribad",
    label: "Veekogu puhverribad",
    shortDesc:
      "Metsa serv jõe, oja või järve ääres jäetakse raiumata — varjab kalu ja kahepaikseid ning loob koridori.",
    legalBasis: "Veeseadus § 118, Metsaseadus § 23",
    protects: ["must_toonekurg", "pruunkaru", "metsnugis"],
    coverage: "10–20 m laiused ribad enamikul Eesti metsajõgedest",
    mak2030Link:
      "Alaeesmärk 2 — sinise võrgustiku ja metsa servade kaitse",
  },
  {
    id: "raierahu",
    label: "Raierahu pesitsusperioodil",
    shortDesc:
      "Lindude pesitsusperioodil (15. apr – 15. juuli) on uuendusraie piiratud, et mitte häirida pesakondi.",
    legalBasis: "Looduskaitseseadus § 55, MM määrus nr 23",
    protects: [
      "must_toonekurg",
      "metsis",
      "kanakull",
      "handkakk",
      "valgeselg_rahn",
    ],
    coverage:
      "Üleriigiline kohustus; täiendavad eritähtajad Natura ja püsielupaikadel",
    mak2030Link:
      "Alaeesmärk 2 ja Alaeesmärk 4 — pesitsusedukuse indikaatorid",
  },
  {
    id: "natura2000",
    label: "Natura 2000 metsaalad",
    shortDesc:
      "Euroopa Liidu loodusdirektiivi alusel kaitstud metsad — elupaigatüüpide soodne seisund on ametlik eesmärk.",
    legalBasis: "Looduskaitseseadus § 1; EL loodusdirektiiv 92/43/EMÜ",
    protects: ["metsis", "lendorav", "must_toonekurg", "valgeselg_rahn"],
    coverage:
      "≈ 467 000 ha metsa (~21% Eesti metsamaast on Natura võrgustikus)",
    mak2030Link:
      "Alaeesmärk 2 — Natura elupaigatüüpide soodsa seisundi saavutamine",
  },
  {
    id: "puselupaik",
    label: "Püsielupaigad (PEP)",
    shortDesc:
      "Liigi- või pesapuu-põhised kaitseterritooriumid, kus on raierahu ja kaitsekord 5–250 ha raadiuses.",
    legalBasis: "Looduskaitseseadus § 50; liigipõhised määrused",
    protects: ["lendorav", "must_toonekurg", "kanakull", "metsis"],
    coverage:
      "Tuhanded eraldiseisvad alad — kaardid Maa-ameti looduskaitserakenduses",
    mak2030Link:
      "Alaeesmärk 2 — liigikaitse tegevuskavad ja PEP-võrgu täiustamine",
  },
];

export const WILDLIFE_SOURCES: { title: string; publisher: string; url: string }[] = [
  {
    title: "Riigi metsainventuur (SMI)",
    publisher: "Keskkonnaagentuur",
    url: "https://keskkonnaagentuur.ee/keskkonnaagentuur/seire-ja-andmehoidla/mets",
  },
  {
    title: "Eesti haudelindude levik ja arvukus",
    publisher: "Eesti Ornitoloogiaühing (EOÜ)",
    url: "https://www.eoy.ee/",
  },
  {
    title: "eElurikkus — liigikirjeldused",
    publisher: "Tartu Ülikooli loodusmuuseum",
    url: "https://elurikkus.ee/",
  },
  {
    title: "Metsaseadus (RT I, 07.06.2006)",
    publisher: "Riigi Teataja",
    url: "https://www.riigiteataja.ee/akt/MS",
  },
  {
    title: "Looduskaitseseadus (RT I, 21.04.2004)",
    publisher: "Riigi Teataja",
    url: "https://www.riigiteataja.ee/akt/LKS",
  },
  {
    title: "Natura 2000 metsaalade ülevaade",
    publisher: "Kliimaministeerium",
    url: "https://kliimaministeerium.ee/elurikkus-keskkond/looduskaitse/natura-2000",
  },
  {
    title: "Metsise tegevuskava ja seire kokkuvõte",
    publisher: "Keskkonnaagentuur",
    url: "https://keskkonnaagentuur.ee/",
  },
  {
    title: "Lendorava kaitse tegevuskava",
    publisher: "Keskkonnaamet",
    url: "https://keskkonnaamet.ee/",
  },
];
