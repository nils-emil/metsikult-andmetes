import { useState } from "react";
import { LUMBERJACK_STEPS } from "./steps";
import { StoryEndModal } from "../../components/StoryEndModal";

export function StoryDock({ currentIndex }: { currentIndex: number }) {
  const [endOpen, setEndOpen] = useState(false);
  const total = LUMBERJACK_STEPS.length;
  const prevStep = currentIndex > 0 ? LUMBERJACK_STEPS[currentIndex - 1] : null;
  const nextStep =
    currentIndex < total - 1 ? LUMBERJACK_STEPS[currentIndex + 1] : null;

  const prevHref = prevStep ? prevStep.hash : "#/";
  const prevLabel = prevStep ? "← Eelmine" : "← Avalehele";

  return (
    <>
      <nav className="story-dock" aria-label="Loo navigeerimine">
        <a className="dock-btn dock-prev" href={prevHref}>
          {prevLabel}
        </a>
        <span className="dock-step">
          {currentIndex + 1} / {total}
        </span>
        {nextStep ? (
          <a className="dock-btn dock-next" href={nextStep.hash}>
            Edasi →
          </a>
        ) : (
          <button
            type="button"
            className="dock-btn dock-next"
            onClick={() => setEndOpen(true)}
          >
            Edasi →
          </button>
        )}
      </nav>
      <StoryEndModal
        open={endOpen}
        onClose={() => setEndOpen(false)}
        otherHref="#/keskkond/1"
        otherEmoji="🦌"
        otherTitle="Keskkonna vaade"
      />
    </>
  );
}
