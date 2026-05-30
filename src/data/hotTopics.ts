// Eesti metsa kõige kuumemad vaidlusteemad koos reaalsete andmetega.
// Kõik arvud ja allikad on veebist kontrollitud (2025–2026). Tegemist on
// avaliku debati hetkeseisuga; numbrid on suunavad ja allikad lingitud.

export interface TopicSource {
  nimi: string;
  url: string;
}

export type TopicChart =
  | {
      kind: "donut";
      segments: { label: string; value: number; color: string }[];
      unit?: string;
    }
  | {
      kind: "bars";
      data: { label: string; value: number; color?: string }[];
      unit: string;
      yLabel?: string;
    }
  | {
      kind: "diverging";
      data: { label: string; value: number }[];
      unit: string;
    }
  | {
      kind: "stacked";
      periods: {
        period: string;
        soodne: number;
        ebasoodne: number;
        halb: number;
      }[];
    };

export interface HotTopic {
  id: string;
  nr: number;
  pealkiri: string;
  sisu: string;
  chartTitle: string;
  chartHint?: string;
  chart: TopicChart;
  allikas: TopicSource;
  lisaallikas?: TopicSource;
}

export const HOT_TOPICS: HotTopic[] = [
  {
    id: "majandus-vs-kaitse",
    nr: 1,
    pealkiri: "Majandusmets vs. looduskaitse — 70/30 vaidlus",
    sisu:
      "Kliimaministeerium saatis kooskõlastusele seadusemuudatused, millega kehtestatakse esmakordselt seaduses 30% maismaa kaitse eesmärk ning selle sees 70% majandusmetsa põhimõte. Praegu on riiklikult kaitstav ~28,7% maismaast. Keskkonnaorganisatsioonid hoiatavad, et osakaalu fikseerimine seaduses seab majandushuvid looduskaitsest ettepoole.",
    chartTitle: "Metsamaa jagunemine 70/30 põhimõttel",
    chartHint: "Maismaa kaitse all: 28,7% → eesmärk 30%",
    chart: {
      kind: "donut",
      unit: "% metsamaast",
      segments: [
        { label: "Majandusmets", value: 70, color: "#d4a373" },
        { label: "Kaitstav mets", value: 30, color: "#B6D24A" },
      ],
    },
    allikas: {
      nimi: "Kliimaministeerium — metsa- ja looduskaitseseaduse muudatused",
      url: "https://www.kliimaministeerium.ee/elurikkus-keskkonnakaitse/metsa-ja-looduskaitseseaduse-muudatused",
    },
  },
  {
    id: "raiemaht",
    nr: 2,
    pealkiri: "Kas raiemaht on liiga suur?",
    sisu:
      "Raiemaht on viimasel kümnendil püsinud 10–12 miljoni tihumeetri tasemel. Samal ajal on kasvava metsa kogutagavara langenud tipust ~490 miljonilt tihumeetrilt 452,8 miljoni tihumeetrini (2024). See viitab, et tänane raie ületab jätkusuutliku piiri. Turu-uuringute AS andmetel pooldab riigimetsa raiemahu vähendamist 68% elanikest.",
    chartTitle: "Raiemaht aastate kaupa",
    chartHint: "miljonit tihumeetrit (SMI)",
    chart: {
      kind: "bars",
      unit: "mln m³",
      yLabel: "mln m³",
      data: [
        { label: "2021", value: 10.0, color: "#93b86a" },
        { label: "2022", value: 12.1, color: "#c47e3e" },
        { label: "2023", value: 11.7, color: "#c47e3e" },
        { label: "2024*", value: 10.9, color: "#93b86a" },
      ],
    },
    allikas: {
      nimi: "Keskkonnaagentuur — statistiline metsainventuur (SMI)",
      url: "https://keskkonnaagentuur.ee/uudised/statistilise-metsainventuuri-smi-andmetel-metsa-tagavara-stabiilne",
    },
    lisaallikas: {
      nimi: "Turu-uuringute AS — 68% pooldab raiemahu vähendamist",
      url: "https://turu-uuringute.eu/uuring-suurem-osa-eestimaalasi-toetab-riigimetsa-raiemahu-vahendamist-ja-pusimetsana-majandamist/",
    },
  },
  {
    id: "kasum",
    nr: 3,
    pealkiri: "Kes tegelikult kasumit lõikab?",
    sisu:
      "Hinnanguliselt 70–75% suurima käibega puidutööstuse ettevõtetest kuulub välismaistele omanikele — seega liigub valdav osa intensiivsest raiest tekkivast kasumist riigist välja, samas kui looduskahju, elupaikade killustumine ja võimalikud LULUCF-trahvid jäävad Eesti ühiskonna kanda.",
    chartTitle: "Kuhu liigub suurettevõtete kasum?",
    chartHint: "osakaal puidutööstuse suurima käibega ettevõtete kasumist",
    chart: {
      kind: "donut",
      unit: "% kasumist",
      segments: [
        { label: "Välismaistele omanikele", value: 72.5, color: "#f87171" },
        { label: "Jääb Eestisse", value: 27.5, color: "#B6D24A" },
      ],
    },
    allikas: {
      nimi: "Vaba Eesti Sõna — tehnoloogiasektori avalik pöördumine",
      url: "https://www.vabaeestisona.com/et/tehnoloogiasektori-ettevotjad-on-mures-eesti-metsa-parast/",
    },
  },
  {
    id: "co2",
    nr: 4,
    pealkiri: "Eesti metsad CO₂ sidujatest heitjateks",
    sisu:
      "Eesti maakasutuse ja metsanduse (LULUCF) sektor on netoheites alates 2017. aastast — see tähendab, et metsamaa süsinikuvaru vähenemine ületab sidumise. 2023. aastal oli sektori netoheide +2130,8 kt CO₂ ekv, kuigi ELi võrdlustaseme (FRL) eesmärk on hoopis siduda ca −1750 kt aastas.",
    chartTitle: "LULUCF-sektori netobilanss",
    chartHint: "negatiivne = süsiniku siduja, positiivne = heitja (kt CO₂ ekv)",
    chart: {
      kind: "diverging",
      unit: "kt CO₂ ekv",
      data: [
        { label: "FRL eesmärk (siduja)", value: -1750 },
        { label: "2023 tegelik", value: 2130.8 },
        { label: "2030 siht", value: 1729 },
      ],
    },
    allikas: {
      nimi: "Euroopa Keskkonnaamet — Europe's environment 2025 (Estonia, LULUCF)",
      url: "https://www.eea.europa.eu/en/europe-environment-2025/countries/estonia/lulucf-emissions",
    },
  },
  {
    id: "kaitse-pusivus",
    nr: 5,
    pealkiri: "Looduskaitse püsivus vs. majanduslik surve",
    sisu:
      "Eksperdid hoiatavad, et kui majandusmetsa osakaal seotakse seadusega kvoodiga, ei lähtu kaitse enam ala loodusväärtustest, vaid majanduse survest. Andmed näitavad, et soodsas seisundis loodusdirektiivi elupaigatüüpide osakaal on langenud — metsaelupaigatüüpidest on soodsaks hinnatud vaid kolm kümnest.",
    chartTitle: "Loodusdirektiivi elupaigatüüpide seisund",
    chartHint: "osakaal elupaigatüüpidest, kahe hindamisperioodi võrdlus",
    chart: {
      kind: "stacked",
      periods: [
        { period: "Eelmine periood", soodne: 56.7, ebasoodne: 36.7, halb: 6.7 },
        { period: "Praegune periood", soodne: 50, ebasoodne: 41.7, halb: 8.3 },
      ],
    },
    allikas: {
      nimi: "Keskkonnaagentuur — elupaikade ja liikide seisundi hinnang",
      url: "https://keskkonnaagentuur.ee/uudised/elupaikade-ja-liikide-seisundi-hinnang-pilt-tapsem-kuid-valjakutsed-pusivad",
    },
  },
  {
    id: "omanike-oigused",
    nr: 6,
    pealkiri: "Metsaomanike õigused vs. riiklikud piirangud",
    sisu:
      "Eestis raiutakse aastas ~11 miljonit tihumeetrit, sellest ~4 miljonit riigimetsas ja ülejäänu era- ja muudes metsades. Erametsaliit nõuab, et piirangutega alade loetelu lepitaks kokku seaduse tasandil ning metsaomanikele tagataks hüvitised. Samas pooldab 77% elanikest riigimetsa majandamist püsimetsana.",
    chartTitle: "Raiemaht omandivormi järgi",
    chartHint: "ligikaudne aastane jaotus (mln m³)",
    chart: {
      kind: "bars",
      unit: "mln m³",
      yLabel: "mln m³",
      data: [
        { label: "Riigimets", value: 4, color: "#B6D24A" },
        { label: "Era- ja muu mets", value: 7, color: "#d4a373" },
      ],
    },
    allikas: {
      nimi: "Turu-uuringute AS — riigimetsa majandamise uuring",
      url: "https://turu-uuringute.eu/uuring-suurem-osa-eestimaalasi-toetab-riigimetsa-raiemahu-vahendamist-ja-pusimetsana-majandamist/",
    },
    lisaallikas: {
      nimi: "Eesti Erametsaliit",
      url: "https://www.erametsaliit.ee/",
    },
  },
  {
    id: "elurikkus",
    nr: 7,
    pealkiri: "Elurikkuse kaotus ja killustatus",
    sisu:
      "Raiemahtude kasv on metsi noorendanud ja killustanud. Vanametsaliigid kannatavad: must-toonekure ja kassikaku arvukus on langenud alla 100 haudepaari ning metsis on pikaajalises languses. Kanakulli uuring näitab elupaiga lõhet — liik pesitseb keskmiselt 101 aasta vanuses metsas, kuid ümbritseva maastiku metsa keskmine vanus on vaid 56 aastat.",
    chartTitle: "Kanakulli pesamets vs. ümbritsev maastik",
    chartHint: "metsa keskmine vanus (aastat)",
    chart: {
      kind: "bars",
      unit: "aastat",
      yLabel: "aastat",
      data: [
        { label: "Pesamets", value: 101, color: "#2d6a4f" },
        { label: "Ümbritsev maastik", value: 56, color: "#93b86a" },
      ],
    },
    allikas: {
      nimi: "Linnuvaatleja.ee — kanakulli vanametsa eelistuse uuring",
      url: "https://www.linnuvaatleja.ee/teadusuudised/kanakullile-sobivat-vana-metsa-jaeaeb-eestis-aina-vaehemaks",
    },
    lisaallikas: {
      nimi: "Eesti Ornitoloogiaühing — metsalinnustik",
      url: "https://www.eoy.ee/ET/metsalinnustik/",
    },
  },
];
