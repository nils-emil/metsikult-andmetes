export const fmtInt = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("et-EE") : "—";

export const fmtMoney = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `€${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${Math.round(n).toLocaleString("et-EE")}`;
};

export const fmtMoneyFull = (n: number) =>
  Number.isFinite(n)
    ? `€${Math.round(n).toLocaleString("et-EE")}`
    : "—";

export const fmtNumber = (n: number, digits = 1) =>
  Number.isFinite(n) ? n.toFixed(digits) : "—";

export const fmtPct = (n: number, digits = 1) =>
  Number.isFinite(n) ? `${n.toFixed(digits)}%` : "—";
