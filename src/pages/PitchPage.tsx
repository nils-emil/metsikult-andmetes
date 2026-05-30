const TEAM_NAME = "Metsa vaatenurgad";

const PEOPLE = [
  "Nils-Emil Lille",
  "Kristjan Erik Ruubel",
  "Kaspar Haavajõe",
];

export function PitchPage() {
  return (
    <div className="pitch-slide">
      <div className="pitch-inner">
        <span className="pitch-eyebrow">Pitch</span>
        <h1 className="pitch-team">{TEAM_NAME}</h1>
        <p className="pitch-solution">
          <strong>Interaktiivne andmelugu Eesti metsast</strong> — kaks
          vastandlikku vaadet (raidur ja keskkond) kõrvuti, et raie mõju
          ausalt hinnata.
        </p>
        <div className="pitch-audience">
          <span className="pitch-audience-label">Kellele</span>
          <p className="pitch-audience-value">
            Tavainimesele — lihtsustatud sissejuhatus, mis teeb metsanduse
            algteadmised kergelt kättesaadavaks ja populariseerib teemat.
          </p>
        </div>
        <div className="pitch-people">
          {PEOPLE.map((name) => (
            <span key={name} className="pitch-person">
              {name}
            </span>
          ))}
        </div>
        <a className="pitch-home" href="#/">
          <span aria-hidden>←</span> Esilehele
        </a>
      </div>
    </div>
  );
}
