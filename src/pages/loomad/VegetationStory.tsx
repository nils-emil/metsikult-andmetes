const IMPACTS = [
  {
    icon: "🧭",
    title: "Näitab kasvukohta",
    body: "Mis taimed kasvavad, reedab mulla viljakuse ja niiskuse. Metsamees loeb maapinda enne istutamist.",
  },
  {
    icon: "🫐",
    title: "Toidab elustikku",
    body: "Marjad ja rohttaimed on toidulaud metsisele, põdrale, karule ja paljudele putukatele.",
  },
  {
    icon: "🌱",
    title: "Mõjutab uuenemist",
    body: "Tihe rohi ja vaarikas lämmatavad puutaimed; sammal ja varis mõjutavad seemnete idanemist.",
  },
  {
    icon: "💧",
    title: "Hoiab pinnast, vett ja süsinikku",
    body: "Sammal ja huumus seovad vett ning kaitsevad mulda; alustaimestik ja muld talletavad suure osa metsa süsinikust.",
  },
];

const INDICATORS = [
  { icon: "🍃", name: "Pohl ja kanarbik", signal: "vaene, kuiv männik" },
  { icon: "🫐", name: "Mustikas", signal: "värske, keskmise viljakusega mets" },
  { icon: "☘️", name: "Jänesekapsas, sõnajalg", signal: "viljakas kuusik" },
  { icon: "🌾", name: "Tarn ja angervaks", signal: "märg, soostuv kasvukoht" },
];

const RAIE_EFFECTS = [
  {
    icon: "☀️",
    title: "Valgus tulvab sisse",
    body: "Võra kadudes jõuab maapinnale palju rohkem valgust ja soojust kui varjulises metsas.",
  },
  {
    icon: "🌿",
    title: "Pioneerid võtavad võimust",
    body: "Kõrrelised, vaarikas ja põdrakanep vohavad — tekib tüüpiline raismikutaimestik.",
  },
  {
    icon: "🫐",
    title: "Metsataimed taanduvad",
    body: "Mustikas, samblad ja varjulembesed taimed kahanevad. Mustikas taastub aeglaselt — see lööb metsise toidulauda.",
  },
  {
    icon: "🔄",
    title: "Taastub aastakümnetega",
    body: "Kui uus mets võra taas sulgeb, naaseb metsataimestik tasapisi — kümnendite jooksul.",
  },
];

export function VegetationStory() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Taimestik — väike kiht, suur mõju</h1>
          <p className="subtitle">
            Lugu 5 / 6 — metsa põhi pole tühi. Samblad, marjavarred ja rohi
            moodustavad õhukese kihi, mis mõjutab kogu metsa: mullast ja veest
            kuni selleni, kes metsas elab.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Mida taimestik mõjutab</h2>
            <span className="hint">Neli rolli, üks õhuke kiht</span>
          </div>
          <div className="balance-tiers">
            {IMPACTS.map((i) => (
              <div className="balance-tier" key={i.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {i.icon}
                  </span>
                  <h3>{i.title}</h3>
                </div>
                <p>{i.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Taimed kui kasvukoha märguanne</h2>
            <span className="hint">Mida alustaimestik reedab</span>
          </div>
          <div className="balance-tiers">
            {INDICATORS.map((p) => (
              <div className="balance-tier" key={p.name}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {p.icon}
                  </span>
                  <h3>{p.name}</h3>
                </div>
                <p>→ {p.signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Kuidas raie taimestikku muudab</h2>
            <span className="hint">Lageraie pöörab alustaimestiku pea peale</span>
          </div>
          <div className="balance-tiers">
            {RAIE_EFFECTS.map((e) => (
              <div className="balance-tier" key={e.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {e.icon}
                  </span>
                  <h3>{e.title}</h3>
                </div>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Miks see loeb</h2>
          </div>
          <p className="story-takeaway">
            Taimestik on metsa <strong>peegel ja mootor korraga</strong>: see
            näitab, mis kasvukohaga on tegu, toidab elustikku ja otsustab, kas
            uus mets tuleb peale loomulikult või tuleb appi inimene. Sama
            lageraie mõjub eri taimestikuga metsale väga erinevalt.
          </p>
        </div>
      </div>
    </div>
  );
}
