import { useEffect } from "react";

interface StoryEndModalProps {
  open: boolean;
  onClose(): void;
  otherHref: string;
  otherEmoji: string;
  otherTitle: string;
}

export function StoryEndModal({
  open,
  onClose,
  otherHref,
  otherEmoji,
  otherTitle,
}: StoryEndModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Kuhu edasi?"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Sulge"
        >
          ×
        </button>
        <h2 className="modal-title">Lugu läbi! 🎉</h2>
        <p className="modal-sub">Kuhu edasi?</p>
        <div className="modal-choices">
          <a className="modal-choice modal-choice-primary" href="#/sild">
            <span className="modal-choice-emoji" aria-hidden>
              ⚖️
            </span>
            <span className="modal-choice-title">Kokkuvõte</span>
            <span className="modal-choice-sub">
              Kus raie ja kaitse kohtuvad
            </span>
          </a>
          <a className="modal-choice" href={otherHref}>
            <span className="modal-choice-emoji" aria-hidden>
              {otherEmoji}
            </span>
            <span className="modal-choice-title">Vaheta vaadet</span>
            <span className="modal-choice-sub">{otherTitle}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
