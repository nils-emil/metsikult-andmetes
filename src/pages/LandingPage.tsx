const LUMBERJACK_FLOATERS = ["🌲", "🌲", "🪵", "🍃", "🌲", "🪓", "🍂", "🌲", "🪵", "🍃"];
const ANIMAL_FLOATERS = ["🦊", "🦌", "🐿️", "🦉", "🐻", "🐇", "🦝", "🐺", "🦔", "🪶"];

function Floaters({ items }: { items: string[] }) {
  return (
    <div className="floaters" aria-hidden>
      {items.map((emoji, i) => (
        <span
          key={i}
          className="floater"
          style={{
            left: `${(i * 53) % 90 + 5}%`,
            top: `${(i * 37) % 80 + 8}%`,
            animationDelay: `${(i * 0.7) % 6}s`,
            animationDuration: `${8 + (i % 5)}s`,
            fontSize: `${20 + (i % 4) * 8}px`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-split">
        <header className="landing-header">
          <span className="landing-eyebrow">Metsa perspektiivid</span>
          <h1 className="landing-headline">Metsa raiel on mitu vastandlikku vaadet</h1>
          <p className="landing-intro">
            Et seda ausalt hinnata, tuleb mõista kõiki perspektiive. Vali,
            kelle pilguga sa täna metsa vaatad.
          </p>
        </header>

        <a
          className="landing-side lumberjack-side"
          href="#/raidur/1"
          aria-label="Vaata metsaraiduri perspektiivist"
        >
          <Floaters items={LUMBERJACK_FLOATERS} />
          <div className="landing-content">
            <div className="landing-emoji landing-emoji-wiggle" aria-hidden>🪓</div>
            <p className="landing-tagline">Vaata sellest perspektiivist</p>
            <h2 className="landing-title">Metsaraidur</h2>
            <p className="landing-sub">
              Mets kui ressurss. Puuliik, kasvukoht, raievanus — millal toob
              raie kõige rohkem tulu.
            </p>
            <span className="landing-cta">
              Ava see vaade <span className="cta-arrow">→</span>
            </span>
          </div>
        </a>

        <div className="landing-divider" aria-hidden />

        <a
          className="landing-side animal-side"
          href="#/loomad"
          aria-label="Vaata elurikkuse ja süsiniku perspektiivist"
        >
          <Floaters items={ANIMAL_FLOATERS} />
          <div className="landing-content">
            <div className="landing-emoji landing-emoji-bounce" aria-hidden>🦌</div>
            <p className="landing-tagline">Vaata sellest perspektiivist</p>
            <h2 className="landing-title">Elurikkus ja süsinik</h2>
            <p className="landing-sub">
              Mets kui elupaik liikidele ja hoidla süsinikule. Mida raie
              tähendab elustikule ja kliimale.
            </p>
            <span className="landing-cta">
              Ava see vaade <span className="cta-arrow">→</span>
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
