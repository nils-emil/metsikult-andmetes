export interface HistoricalDecade {
  year: number; // calendar year
  totalMm3: number; // standing volume, M m³
}

// Eesti puistute kogutagavara ligikaudsed väärtused, aastakümneti.
// Allikad: Keskkonnaagentuuri SMI aastaraamatud (alates 1999) ja
// varasemate aegade metsainventuuride kokkuvõtted. Pre-1999 väärtused
// on rekonstrueeritud Nõukogude perioodi metsataksatsioonidest ja on
// suunavad — täpne aegrida pole avalikult ühes tabelis kättesaadav.
// Mõeldud hariva kontekstina, mitte ametliku aegreana.
export const HISTORICAL_DECADES: HistoricalDecade[] = [
  { year: 1960, totalMm3: 275 },
  { year: 1970, totalMm3: 245 },
  { year: 1980, totalMm3: 265 },
  { year: 1990, totalMm3: 305 },
  { year: 2000, totalMm3: 395 },
  { year: 2010, totalMm3: 460 },
];

// Simulatsiooni t=0 vastab kalendrias sellele aastale.
// SMI 2023 andmestik on lähtepunkt, kuid aastakümne joondamiseks
// kasutame baasaastana 2020.
export const SIM_BASE_YEAR = 2020;
