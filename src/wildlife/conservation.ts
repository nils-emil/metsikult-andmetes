import type { SpeciesId } from "./species";

export type ToolId =
  | "vaarielupaik"
  | "sailikpuud"
  | "puhverribad"
  | "raierahu"
  | "natura2000"
  | "puselupaik";

export interface ConservationTool {
  id: ToolId;
  label: string;
  shortDesc: string;
  legalBasis: string;
  protects: SpeciesId[];
  coverage: string;
  mak2030Link?: string;
}

export const TOOL_ICON: Record<ToolId, string> = {
  vaarielupaik: "🌳",
  sailikpuud: "🪵",
  puhverribad: "🏞️",
  raierahu: "🪺",
  natura2000: "🇪🇺",
  puselupaik: "📍",
};

export { WILDLIFE_TOOLS as CONSERVATION_TOOLS } from "../data/wildlife";
