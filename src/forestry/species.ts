export type SpeciesId = "spruce" | "pine" | "birch";

export interface SpeciesParams {
  id: SpeciesId;
  name: string;
  latin: string;
  emoji: string;
  description: string;
  // Chapman-Richards growth: V(t) = vMax * (1 - exp(-k*t))^p
  vMax: number; // m³/ha asymptote, medium site
  k: number;
  p: number;
  // Max share of volume that can become veneer in very old stands
  veneerCap: number;
  // Color used in charts
  color: string;
}

export const SPECIES: Record<SpeciesId, SpeciesParams> = {
  spruce: {
    id: "spruce",
    name: "Harilik kuusk",
    latin: "Picea abies",
    emoji: "🌲",
    description:
      "Kõige levinum okaspuu Eestis ja Põhjamaades. Annab palju puitu ja head palki. Tavaliselt raiutakse 70–90 aasta vanuses.",
    vMax: 720,
    k: 0.024,
    p: 3.0,
    veneerCap: 0.05,
    color: "#2d6a4f",
  },
  pine: {
    id: "pine",
    name: "Harilik mänd",
    latin: "Pinus sylvestris",
    emoji: "🌲",
    description:
      "Kasvab aeglasemalt kui kuusk, aga sobib ka kehvema mulla peale. Annab tugevat palki. Tavaliselt raiutakse 80–110 aasta vanuses.",
    vMax: 560,
    k: 0.020,
    p: 2.8,
    veneerCap: 0.03,
    color: "#cc8b3c",
  },
  birch: {
    id: "birch",
    name: "Arukask",
    latin: "Betula pendula",
    emoji: "🍃",
    description:
      "Kiirekasvuline lehtpuu. Puidu kogus on väiksem, aga ilus puit sobib spoonipakuks. Raiutakse juba 50–70 aastaselt.",
    vMax: 380,
    k: 0.034,
    p: 2.4,
    veneerCap: 0.18,
    color: "#9ab87a",
  },
};

export type SiteId = "poor" | "medium" | "good" | "excellent";

export interface SiteParams {
  id: SiteId;
  name: string;
  description: string;
  factor: number; // multiplier on vMax
  kFactor: number; // multiplier on k (better sites grow faster too)
}

export const SITES: Record<SiteId, SiteParams> = {
  poor: {
    id: "poor",
    name: "Kehv",
    description: "Kuiv ja toitevaene muld — puud kasvavad aeglaselt.",
    factor: 0.55,
    kFactor: 0.85,
  },
  medium: {
    id: "medium",
    name: "Keskmine",
    description: "Tavaline majandusmetsa muld.",
    factor: 1.0,
    kFactor: 1.0,
  },
  good: {
    id: "good",
    name: "Hea",
    description: "Rohurikas värske muld — keskmisest parem kasv.",
    factor: 1.3,
    kFactor: 1.1,
  },
  excellent: {
    id: "excellent",
    name: "Suurepärane",
    description: "Toitainerikas sügav muld — kõige kiirem kasv.",
    factor: 1.55,
    kFactor: 1.2,
  },
};
