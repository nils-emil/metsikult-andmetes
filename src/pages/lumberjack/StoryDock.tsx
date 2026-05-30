import { LUMBERJACK_STEPS } from "./steps";

export function StoryDock({ currentIndex }: { currentIndex: number }) {
  const total = LUMBERJACK_STEPS.length;
  const prevStep = currentIndex > 0 ? LUMBERJACK_STEPS[currentIndex - 1] : null;
  const nextStep =
    currentIndex < total - 1 ? LUMBERJACK_STEPS[currentIndex + 1] : null;

  const prevHref = prevStep ? prevStep.hash : "#/";
  const nextHref = nextStep ? nextStep.hash : "#/sild";
  const prevLabel = prevStep ? "← Eelmine" : "← Avalehele";
  const nextLabel = nextStep ? "Edasi →" : "Kokkuvõte →";

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
