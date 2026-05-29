import raw from "./estonian-stand-ages.json";

export type SpeciesName =
  | "Mänd"
  | "Kuusk"
  | "Kask"
  | "Haab"
  | "Sanglepp"
  | "Hall lepp"
  | "Teised";

export interface StandAgesData {
  pealkiri: string;
  allikas: {
    nimi: string;
    valdaja: string;
    url: string;
    tabeli_kuupaev: string;
    ulatus: string;
  };
  yhik: string;
  kokku_tuh_ha: number;
  keskmine_vanus_a: number;
  suurim_klass: string;
  vanuseklassid: string[];
  puuliigid: Record<SpeciesName, number[]>;
  kokku_klassiti_tuh_ha: number[];
  puuliikide_varvid: Record<SpeciesName, string>;
}

export const STAND_AGES: StandAgesData = raw as StandAgesData;

export const SPECIES_ORDER: SpeciesName[] = [
  "Kask",
  "Mänd",
  "Kuusk",
  "Hall lepp",
  "Haab",
  "Sanglepp",
  "Teised",
];

export interface StandAgesRow {
  klass: string;
  total: number;
  Mänd: number;
  Kuusk: number;
  Kask: number;
  Haab: number;
  Sanglepp: number;
  "Hall lepp": number;
  Teised: number;
}

export function standAgesRows(): StandAgesRow[] {
  const { vanuseklassid, puuliigid, kokku_klassiti_tuh_ha } = STAND_AGES;
  return vanuseklassid.map((klass, i) => ({
    klass,
    total: kokku_klassiti_tuh_ha[i],
    Mänd: puuliigid["Mänd"][i],
    Kuusk: puuliigid["Kuusk"][i],
    Kask: puuliigid["Kask"][i],
    Haab: puuliigid["Haab"][i],
    Sanglepp: puuliigid["Sanglepp"][i],
    "Hall lepp": puuliigid["Hall lepp"][i],
    Teised: puuliigid["Teised"][i],
  }));
}
