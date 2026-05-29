import type { StandParams } from "./stand";

export interface Stand extends StandParams {
  id: string;
  name: string;
}

const STORAGE_KEY = "metsaomaniku-portfell-v1";

function isStand(v: unknown): v is Stand {
  if (typeof v !== "object" || v == null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.name === "string" &&
    typeof s.speciesId === "string" &&
    typeof s.siteId === "string" &&
    typeof s.currentAge === "number" &&
    typeof s.area === "number"
  );
}

export function loadPortfolio(): Stand[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStand);
  } catch {
    return [];
  }
}

export function savePortfolio(stands: Stand[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stands));
  } catch {
    // storage unavailable (private mode etc.) — silently ignore
  }
}

export function addStand(stand: StandParams, name: string): Stand[] {
  const current = loadPortfolio();
  const entry: Stand = {
    ...stand,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || "Nimetu metsatukk",
  };
  const next = [...current, entry];
  savePortfolio(next);
  return next;
}

export function removeStand(id: string): Stand[] {
  const next = loadPortfolio().filter((s) => s.id !== id);
  savePortfolio(next);
  return next;
}
