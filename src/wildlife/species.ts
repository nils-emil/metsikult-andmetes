export type SpeciesId =
  | "metsis"
  | "lendorav"
  | "must_toonekurg"
  | "valgeselg_rahn"
  | "ilves"
  | "pruunkaru"
  | "poder"
  | "metsnugis"
  | "handkakk"
  | "kanakull"
  | "laanepuu"
  | "raudkull";

export type ConservationStatus = "I_kat" | "II_kat" | "III_kat" | "tavaline";

export interface Species {
  id: SpeciesId;
  name: string;
  latin: string;
  emoji: string;
  group: "imetaja" | "lind";
  status: ConservationStatus;
  bodyMassKg: [number, number];
}

export type AgeClassId =
  | "raiesmik"
  | "noorendik"
  | "keskealine"
  | "vana"
  | "vana_pluss";

export interface AgeClass {
  id: AgeClassId;
  label: string;
  ageRange: string;
  description: string;
  color: string;
}

export const AGE_CLASS_ORDER: AgeClassId[] = [
  "raiesmik",
  "noorendik",
  "keskealine",
  "vana",
  "vana_pluss",
];

export const STATUS_LABEL: Record<ConservationStatus, string> = {
  I_kat: "I kat.",
  II_kat: "II kat.",
  III_kat: "III kat.",
  tavaline: "Tavaline",
};

export { WILDLIFE_SPECIES as SPECIES } from "../data/wildlife";
export { WILDLIFE_AGE_CLASSES as AGE_CLASSES } from "../data/wildlife";
