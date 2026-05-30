export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-top">
        <div className="landing-top-inner">
          <div className="landing-brand">
            <span className="landing-brand-mark" aria-hidden>🌲</span>
            <span>Eesti mets — andmevaade</span>
          </div>
          <span className="landing-meta">SMI 2023 · MAK2030</span>
        </div>
      </header>

      <section className="landing-hero">
        <span className="landing-eyebrow">Metsa perspektiivid</span>
        <h1 className="landing-headline">
          Metsa raiel on mitu vastandlikku vaadet
        </h1>
        <p className="landing-intro">
          Et seda ausalt hinnata, tuleb mõista kõiki perspektiive. Vali, kelle
          pilguga sa täna metsa vaatad — või uuri kõrvuti, kuidas ressursi- ja
          elurikkuse vaade kokku saavad.
        </p>
      </section>

      <section className="landing-cards">
        <a
          className="landing-card"
          href="#/raidur/1"
          aria-label="Vaata metsaraiduri perspektiivist"
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
          href="#/loomad"
          aria-label="Vaata elurikkuse ja süsiniku perspektiivist"
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

      <section className="landing-stats" aria-label="Eesti metsa põhinäitajad">
        <div>
          <div className="landing-stat-label">Metsamaad Eestis</div>
          <div className="landing-stat-value">
            51<span className="kpi-unit">%</span>
          </div>
          <div className="landing-stat-sub">pindalast (SMI 2023)</div>
        </div>
        <div>
          <div className="landing-stat-label">Tagavara</div>
          <div className="landing-stat-value">
            489<span className="kpi-unit"> mln m³</span>
          </div>
          <div className="landing-stat-sub">üldine kasvav tagavara</div>
        </div>
        <div>
          <div className="landing-stat-label">Aastane juurdekasv</div>
          <div className="landing-stat-value">
            16<span className="kpi-unit"> mln m³/a</span>
          </div>
          <div className="landing-stat-sub">keskmine kasv</div>
        </div>
        <div>
          <div className="landing-stat-label">Range kaitse all</div>
          <div className="landing-stat-value">
            16<span className="kpi-unit">%</span>
          </div>
          <div className="landing-stat-sub">metsamaast (MAK2030)</div>
        </div>
      </section>
    </div>
  );
}
