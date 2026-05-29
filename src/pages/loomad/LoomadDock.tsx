import { LOOMAD_STEPS } from "./steps";

export function LoomadDock({ currentIndex }: { currentIndex: number }) {
  const total = LOOMAD_STEPS.length;
  const prevStep = currentIndex > 0 ? LOOMAD_STEPS[currentIndex - 1] : null;
  const nextStep =
    currentIndex < total - 1 ? LOOMAD_STEPS[currentIndex + 1] : null;

  const prevHref = prevStep ? prevStep.hash : "#/";
  const nextHref = nextStep ? nextStep.hash : "#/";
  const prevLabel = prevStep ? "← Eelmine" : "← Avalehele";
  const nextLabel = nextStep ? "Edasi →" : "Lõpeta →";

  return (
    <nav className="story-dock" aria-label="Loo navigeerimine">
      <a className="dock-btn dock-prev" href={prevHref}>
        {prevLabel}
      </a>
      <span className="dock-step">
        {currentIndex + 1} / {total}
      </span>
      <a className="dock-btn dock-next" href={nextHref}>
        {nextLabel}
      </a>
    </nav>
  );
}
