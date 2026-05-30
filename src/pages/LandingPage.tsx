export function LandingPage() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <span className="landing-eyebrow">Metsa vaatenurgad</span>
        <h1 className="landing-headline">
          Metsa raiel on mitu vastandlikku vaadet
        </h1>
        <p className="landing-intro">
          Et seda ausalt hinnata, tuleb mõista kõiki vaatenurki. Vali, kelle
          pilguga sa täna metsa vaatad — või uuri kõrvuti, kuidas ressursi- ja
          elurikkuse vaade kokku saavad.
        </p>
      </section>

      <section className="landing-cards">
        <a
          className="landing-card"
          href="#/raidur/1"
          aria-label="Vaata metsaraiduri vaatenurgast"
        >
          <span className="landing-card-tag">Vaade 1 · Ressurss</span>
          <span className="landing-card-emoji" aria-hidden>🪓</span>
          <h2 className="landing-card-title">Metsaraidur</h2>
          <p className="landing-card-sub">
            Mets kui ressurss. Puuliik, kasvukoht, raievanus — kuidas
            kujuneb raieplaan ning millal toob raie kõige rohkem tulu.
          </p>
          <span className="landing-card-cta">
            Ava vaade <span className="cta-arrow">→</span>
          </span>
        </a>

        <a
          className="landing-card"
          href="#/keskkond"
          aria-label="Vaata elurikkuse ja süsiniku vaatenurgast"
        >
          <span className="landing-card-tag">Vaade 2 · Keskkond</span>
          <span className="landing-card-emoji" aria-hidden>🦌</span>
          <h2 className="landing-card-title">Keskkond</h2>
          <p className="landing-card-sub">
            Mets kui elupaik liikidele ja hoidla süsinikule. Mida raie
            tähendab elustikule, kliimale ning kaitsealadele.
          </p>
          <span className="landing-card-cta">
            Ava vaade <span className="cta-arrow">→</span>
          </span>
        </a>
      </section>
    </div>
  );
}
