/**
 * Metsanduse arengukava aastani 2030 (MAK2030) — väljundid.
 * Allikas: Vabariigi Valitsus, "Metsanduse arengukava aastani 2030 koostamise
 * ettepanek" (2019); Kliimaministeerium MAK2030 lehed; Forest Europe
 * jätkusuutliku metsamajanduse kriteeriumid ja indikaatorid.
 */

export interface Subgoal {
  number: number;
  shortLabel: string;
  title: string;
  description: string;
  icon: string;
}

export interface Indicator {
  label: string;
  value: string;
  unit: string;
  context: string;
  status: "saavutatud" | "edenemas" | "vajab_tegevust";
}

export interface ProblemGroup {
  category: string;
  forestEuropeCriterion: string;
  problems: { number: number; title: string; background: string }[];
}

export interface Source {
  title: string;
  publisher: string;
  url: string;
}

export const MAK2030_OVERALL = {
  title: "Metsanduse arengukava 2030",
  period: "2021–2030",
  approver: "Riigikogu",
  baseLaw: "Metsaseadus § 7",
  longViewYear: 2100,
  generalGoals: [
    "Metsade kasutamine on võimalikult mitmekülgne, vastab ühiskonna ootustele ja vajadustele, aitab leevendada kliimamuutusi ja nendega kohaneda ning tagab sotsiaalselt tasakaalustatud elu- ja majanduskeskkonna ning metsaökosüsteemide soodsa seisundi.",
    "Nüüdisaegne haridussüsteem ja metsateadus, samuti selgelt mõistetav ja avalikkusele kergelt kättesaadav teave metsandusest suurendavad ühiskonna teadlikkust ja kujundavad hoiakuid jätkusuutliku metsanduse suunas ning tagavad puidu maksimaalse väärindamise ja kõigi metsaga seotud hüvede targa kasutuse.",
  ],
} as const;

/**
 * 6 alaeesmärki, sõnastatud MAK2030 juhtkogu poolt (2020).
 */
export const MAK2030_SUBGOALS: Subgoal[] = [
  {
    number: 1,
    shortLabel: "Süsinik ja kliima",
    title:
      "Metsa majandatakse eesmärgiga pikas perspektiivis suurendada Eesti looduse süsinikuvaru",
    description:
      "Metsade süsinikuvaru ja sidumisvõime kasvavad, säilib elurikkus ja metsa pindala. LULUCFi sektori kasvuhoonegaaside heide ei tohi ületada süsiniku sidumist.",
    icon: "🌫️",
  },
  {
    number: 2,
    shortLabel: "Ökosüsteemi funktsioonid",
    title:
      "Metsa puiduliste ja mittepuiduliste saaduste ja teenuste kasutamisel säilitatakse metsaökosüsteemi erinevad funktsioonid",
    description:
      "Puidu kõrval säilivad mulla-, vee- ja maastikuväärtused ning korilus, jahindus, loodusturism. Kasutus on kaskaadne ja ringmajanduse põhimõtetel.",
    icon: "🌊",
  },
  {
    number: 3,
    shortLabel: "Elurikkus",
    title: "Metsa elurikkus on säilinud ja paranenud",
    description:
      "Raietel jäetakse piisavalt säilikpuid, surnud puitu, põlispuid; väärislehtpuude esinemine kasvab. Range kaitse all on vähemalt 10% metsamaast (saavutatud).",
    icon: "🦉",
  },
  {
    number: 4,
    shortLabel: "Teadus ja teadlikkus",
    title:
      "Metsandusotsused tehakse parima teadmise ja andmete alusel, ühiskond on teadlik metsandusega seotud probleemidest",
    description:
      "Pidev seire, rakendusuuringud, läbipaistev andmestik (metsaregister, SMI). Haridus ja kommunikatsioon kujundavad teadlikke hoiakuid.",
    icon: "📊",
  },
  {
    number: 5,
    shortLabel: "Konkurentsivõime",
    title:
      "Metsandussektor on innovaatiline ja konkurentsivõimeline, kasvatab metsa väärtust",
    description:
      "Puit väärindatakse Eestis maksimaalse lisandväärtusega — biomaterjalid, biokemikaalid, bioplastik, bioenergia; klastripõhine lähenemine, puidu kasutamine ehituses.",
    icon: "🏭",
  },
  {
    number: 6,
    shortLabel: "Ressursi-efektiivsus",
    title:
      "Metsavarusid kasutatakse arukalt ja mitmekülgselt, maksimaalse väärtuse saavutamiseks",
    description:
      "Kaskaadkasutus, jäätmete taaskasutus, biomajanduse arendamine. Metsaomanik teab oma metsa väärtust, ühistegevus annab pikaajalise kindluse.",
    icon: "♻️",
  },
];

/**
 * Mõõdetavad sihttasemed, indikaatorid ja saavutused.
 * Algandmed dokumendist + MAK2020 täitmise aruandest.
 */
export const MAK2030_INDICATORS: Indicator[] = [
  {
    label: "Range kaitse metsamaast",
    value: "13,1",
    unit: "% (sihttase ≥10%)",
    context:
      "MAK2020 sihttase saavutatud (SMI 2017). Kokku rangem või leebem kaitserežiim 25,6% metsamaast.",
    status: "saavutatud",
  },
  {
    label: "Eesti metsamaa pindala",
    value: "2,33",
    unit: "mln ha",
    context:
      "Üle 50% Eesti maismaa pindalast. Sihttase: senise metsamaa pindala säilimine.",
    status: "saavutatud",
  },
  {
    label: "Erametsa uuendamine istutuse/külviga",
    value: "35 → 40",
    unit: "% uuendusraielankidest",
    context:
      "2017. a saavutatud 35%, MAK2020 sihttase 2020. aastaks 40%. Nõuab ~11,7 mln metsataime/a.",
    status: "edenemas",
  },
  {
    label: "Eesti metsataimede puudujääk",
    value: "+5",
    unit: "mln taime/a",
    context:
      "2017: kasvatati 29 mln, imporditi 4,1 mln. Vajadus: senisest 5 mln rohkem aastas.",
    status: "vajab_tegevust",
  },
  {
    label: "Raiemaht (kogumaht)",
    value: "10,99",
    unit: "mln m³/a (2017)",
    context:
      "RMK 4,32 + füüsilised isikud 2,82 + juriidilised isikud 3,8. Ettevõtjate prognoos 2019: 12 mln m³.",
    status: "edenemas",
  },
  {
    label: "Lageraie osakaal uuendusraietest",
    value: "93",
    unit: "% (2012–2016)",
    context:
      "Valikraied 320 ha 161 000 ha kohta. Sihttase: turberaie ja püsimetsanduse osakaalu kasv.",
    status: "vajab_tegevust",
  },
  {
    label: "Säilikpuude tõhusus",
    value: "~60",
    unit: "% täidab eesmärki",
    context:
      "Hinnanguliselt ~40% säilikpuudest ei täida efektiivselt elurikkuse eesmärki (LPM uuringud).",
    status: "vajab_tegevust",
  },
  {
    label: "Metsasektori müügitulu",
    value: "3,5",
    unit: "mld € (2017)",
    context: "6,3% Eesti kõigi ettevõtete müügitulust. Töötleva tööstuse osa 24%.",
    status: "saavutatud",
  },
  {
    label: "Puidupõhiste toodete eksport",
    value: "2,12",
    unit: "mld € (2017)",
    context: "17% kogu Eesti kaupade ekspordist.",
    status: "saavutatud",
  },
  {
    label: "Otsene lisandväärtus sektoris",
    value: "930",
    unit: "mln € (2017)",
    context: "Kogu sektori (puidu-, paberi-, mööblitööstus + metsamajandus) tegevus. SKPst 10,1% (2014).",
    status: "saavutatud",
  },
  {
    label: "Tööhõive metsasektoris",
    value: "34 000",
    unit: "töötajat (otsene)",
    context:
      "Koos kaudsete mõjudega ~67 000 töökohta, üle 10% Eesti hõivatutest. 113 000 erametsaomanikku.",
    status: "saavutatud",
  },
  {
    label: "Metsaomanike puidutulu",
    value: "205–220",
    unit: "mln €/a kännuraha",
    context: "Puidu müügist; mittepuiduliste hüviste käivet pole võimalik usaldusväärselt hinnata.",
    status: "saavutatud",
  },
  {
    label: "Riigile laekuv maksutulu sektorist",
    value: "652",
    unit: "mln € (2017)",
    context: "Kogu sektori tegevus arvesse võttes.",
    status: "saavutatud",
  },
  {
    label: "Erametsa kuivendussüsteemide vajadus",
    value: "14 600",
    unit: "ha/a rekonstrueerida",
    context:
      "Erametsa kuivenduspind ~220 000 ha, keskmine vanus 30–50 a. RMK uuendab 20 000 ha/a.",
    status: "vajab_tegevust",
  },
  {
    label: "Puidu kasutus energeetikas",
    value: "~7",
    unit: "mln m³/a biomassi",
    context:
      "Ümarpuit ja raiejäätmed ~4,5 mln m³. Energiapoliitika soosib, LULUCF-i süsinikuarvestus ei soosi.",
    status: "edenemas",
  },
  {
    label: "Geenireservimetsade pindala",
    value: "1 154",
    unit: "ha (sobivad)",
    context:
      "1985. plaan: 18 ala, ~3 540 ha. Tänaseks juriidiline regulatsioon puudub; uute valimine prioriteediks seatud, kuid ei ole tehtud.",
    status: "vajab_tegevust",
  },
];

/**
 * 12 prioriteetset probleemi, mille MAK2030 koostamise käigus lahendamist vajab.
 * Grupeeritud Forest Europe jätkusuutliku metsamajanduse kriteeriumide järgi.
 */
export const MAK2030_PROBLEMS: ProblemGroup[] = [
  {
    category: "Rahandus ja õiglane hüvitamine",
    forestEuropeCriterion: "Sotsiaalmajanduslikud meetmed",
    problems: [
      {
        number: 1,
        title:
          "Metsa loodusväärtuste hoidmise finantsmehhanism ei ole piisav, jätkusuutlik ega õiglane",
        background:
          "Piiranguvööndi kaitsemeetmete kompenseerimiseks erametsamaal puudu üle 0,8 mln €/a. Vääriselupaiga lepingute eelarve puudub.",
      },
      {
        number: 2,
        title: "Piirangute õiglase hüvitamise meetmed ei ole olnud piisavad",
        background:
          "Maadevahetust ei kasutata. EL ja vääriselupaikade kompensatsioonid on maksustatud. Elektriliinidealuse metsa taluvustasu madal.",
      },
      {
        number: 3,
        title:
          "Saamata jäänud tulu kompenseerimine metsaomanikele ja KOV-le pole sageli piisav",
        background:
          "Maamaksusoodustused vähendavad KOV laekumisi, mis halvendab seadusega pandud ülesannete täitmist.",
      },
    ],
  },
  {
    category: "Süsinik ja metsavaru",
    forestEuropeCriterion: "Metsavaru ja panus globaalsesse süsinikuringesse",
    problems: [
      {
        number: 4,
        title:
          "Metsamajanduse ja maakasutuse mõju Eesti metsade süsinikuvarudele vajab selgitamist",
        background:
          "Eri majandamisviisi (lageraie, turberaied, kuivendus, hooldus) mõju süsiniku sidumisele on erinev. Küttepuidu suur osakaal raiutud tagavaras on probleem.",
      },
      {
        number: 5,
        title:
          "Raiemahud on tasemel, mis võib ohustada elurikkust ja metsade ökoloogilisi funktsioone",
        background:
          "Selle probleemi sõnastuse kohta puudus töörühmas konsensus. Raiesmike ja noorendike osakaal on alates 1990. aastatest oluliselt suurenenud.",
      },
    ],
  },
  {
    category: "Taristu",
    forestEuropeCriterion: "Tootlike funktsioonide säilitamine",
    problems: [
      {
        number: 6,
        title: "Metsandusega seotud taristute (teede) korrashoid ja areng pole piisavalt tagatud",
        background:
          "Metsateid ja kuivendusvõrke on ebarahuldavas seisukorras; metsaomanikud ei ole majanduslikult ise suutelised investeeringuid tegema.",
      },
    ],
  },
  {
    category: "Elurikkus ja puuliikide koosseis",
    forestEuropeCriterion: "Bioloogilise mitmekesisuse säilitamine",
    problems: [
      {
        number: 7,
        title:
          "Erametsade puuliigiline koosseis on muutunud majanduslikult väheväärtuslike puuliikide suunas",
        background:
          "Erametsade lageraiealadest uueneb okaspuuga vaid 15,6% noorendikest. Männikute lankidest 7%, kuusikute lankidest 12% uueneb eelmise põlve peapuuliigiga.",
      },
    ],
  },
  {
    category: "Sotsiaalmajanduslik korraldus",
    forestEuropeCriterion: "Sotsiaalmajanduslike funktsioonide säilitamine",
    problems: [
      {
        number: 8,
        title: "Metsade majandamine ja metsade kaitsmine on ühes ministeeriumis",
        background:
          "Eesmärgi konflikt: üks ministeerium peab hea seisma nii raie piiramise kui ka lubamise eest.",
      },
      {
        number: 9,
        title:
          "Puudub pikaajaline terviklik plaan majandatavate, piirangutega ja rangelt kaitstavate metsade osakaalu kohta",
        background:
          "Erinev raieintensiivsus mõjutab tööhõivet, SKPd, väliskaubandust ja küttemajandust. Puudub investeeringukindlus.",
      },
      {
        number: 10,
        title:
          "Talumetsaomanike arvu vähenemine ja firmametsaomanike pindala intensiivne suurenemine",
        background:
          "Juriidilised isikud on metsamajanduslikel töödel ~1,8 korda aktiivsemad kui füüsilised. Sõjaeelne maaomandi järjepidevus kaob.",
      },
    ],
  },
  {
    category: "Kultuur ja haridus",
    forestEuropeCriterion: "Metsanduse seos kultuuri ja kogukonnaga",
    problems: [
      {
        number: 11,
        title:
          "Loodushoidlike tavade ja metsaga seotud rahvakultuuri traditsioonide ebapiisav õpetamine koolides",
        background:
          "Talupojapärimuste ja esivanemate loodushoidlikud tavad on koolides ebapiisavalt käsitletud. Pärimuslik loodustundmine väheneb.",
      },
      {
        number: 12,
        title:
          "Looduslikud pühapaigad kõnetaksid tänapäeva kultuuris rohkem, kui neid seostataks tervisega",
        background:
          "Pärimuslike pühapaikade rituaalid olid teraapilised; tänapäeval on neil eelkõige usundiline väärtus, kaasaegse tervisekäitumisega side puudub.",
      },
    ],
  },
];

export const MAK2030_SOURCES: Source[] = [
  {
    title: "Metsanduse arengukava 2021–2030",
    publisher: "Kliimaministeerium",
    url: "https://kliimaministeerium.ee/MAK2030",
  },
  {
    title: "Metsanduse arengukava aastani 2030 koostamise ettepanek",
    publisher: "Vabariigi Valitsus (2019)",
    url: "https://valitsus.ee/sites/default/files/documents/2021-01/metsanduse_arengukava_koostamise_ettepanek.pdf",
  },
  {
    title: "MAK2030 arengustsenaariumite mõju analüüs",
    publisher: "Stockholm Environment Institute Tallinn (2020)",
    url: "https://www.sei.org/wp-content/uploads/2020/02/metsanduse-arengukava-2030-arengustsenaariumite-m%C3%B5ju-anal%C3%BC%C3%BCs.pdf",
  },
  {
    title: "MAK2030 keskkonnamõju strateegilise hindamise aruanne",
    publisher: "Kliimaministeerium",
    url: "https://kliimaministeerium.ee/media/5111/download",
  },
  {
    title: "Metsanduse arengukava alusuuringu aruanne",
    publisher: "Eesti ülikoolid (2019)",
    url: "https://kliimaministeerium.ee/sites/default/files/documents/2022-04/Metsanduse%20arengukava%20aastani%202030%20alusuuring.pdf",
  },
];

export const POST_CLEARCUT_FACTS = [
  {
    label: "Uuendamise kohustus",
    fact:
      "Lageraie järel tuleb mets uuendada — MAK2020 sihttase: 40% erametsa lankidest istutuse/külviga (2017: 35%).",
  },
  {
    label: "Säilikpuud",
    fact:
      "Metsaseadus nõuab säilikpuude jätmist; ~40% neist ei täida hinnangu järgi efektiivselt elurikkuse eesmärki.",
  },
  {
    label: "Süsinikuvaru langeb",
    fact:
      "Lageraie vabastab puidus, varises ja mullas ladestunud süsiniku. Asendusefekt puittoodetes ja fossiilkütuste asemel kompenseerib osaliselt.",
  },
  {
    label: "Elupaikade kadu",
    fact:
      "Lageraiepõhise metsanduse põhilised ohud: elupaikade lokaalne hävimine, ökoloogiliste seoste muutused, maastiku homogeniseerumine.",
  },
];
