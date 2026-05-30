const TRANSITIONS = [
  {
    from: "🌲",
    to: "🌾",
    title: "Mets põlluks",
    sub: "raadamine",
    body: "Mets raadatakse põllu, tee või karjääri alla. Elupaik ja puidus seotud süsinik kaovad — ja see vajab luba.",
    tag: "Elupaik kaob",
  },
  {
    from: "🌾",
    to: "🌲",
    title: "Põld metsaks",
    sub: "metsastumine",
    body: "Hüljatud põld kasvab tasapisi metsaks. Elupaik ja süsinikuvaru taastuvad aastakümnetega. Nii kahekordistus Eesti metsapindala 20. sajandil.",
    tag: "Elupaik tekib",
  },
  {
    from: "🌲",
    to: "🏘️",
    title: "Mets taristuks",
    sub: "ehitus, teed, linnad",
    body: "Kõige püsivam muutus — sellelt maalt mets enam tagasi ei tule.",
    tag: "Püsiv kadu",
  },
];

const PROBLEMS = [
  {
    icon: "🧩",
    title: "Elupaikade killustumine",
    body: "Põllud, teed ja karjäärid lõikavad metsa tükkideks — liikidel kaovad ühendusteed.",
  },
  {
    icon: "💨",
    title: "Süsiniku heide",
    body: "Mets → põld vabastab mullas ja puudes seotud süsiniku; maa võib muutuda siduja asemel heitjaks.",
  },
  {
    icon: "🚜",
    title: "Raadamissurve",
    body: "Põllumaa, taristu, karjäärid ja päikesepargid suurendavad survet metsa raadamiseks.",
  },
  {
    icon: "🌧️",
    title: "Soometsade kuivendamine",
    body: "Kuivendatud turbamuld laguneb ja paiskab õhku suurel hulgal süsinikku.",
  },
];

const MEASURES = [
  {
    icon: "📋",
    title: "Raadamisluba",
    body: "Metsa tohib muuks maaks muuta ainult loaga; põhjendamatut raadamist ei lubata.",
  },
  {
    icon: "🇪🇺",
    title: "LULUCF-i reeglid",
    body: "EL nõuab, et maasektor ei oleks netoheitja ja seoks 2030. aastaks rohkem süsinikku.",
  },
  {
    icon: "🛡️",
    title: "Kaitsealad ja Natura 2000",
    body: "Kaitsealadel on maakasutuse muutmine piiratud või keelatud.",
  },
  {
    icon: "🌱",
    title: "Taasmetsastamine ja soode taastamine",
    body: "Uus mets vähekasutatud maale ja kuivendatud soode taasmärgastamine toovad elupaiga ja süsiniku tagasi.",
  },
];

export function LandUseStory() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Maakasutus muutub</h1>
          <p className="subtitle">
            Lugu 4 / 6 — maa pole igavesti sama. Mets võib saada põlluks, põld
            metsaks, mets teeks või linnaks. Iga muutus muudab elupaika ja
            süsinikku — ja mõni neist on jäädav.
          </p>
        </div>
      </header>

      <div className="story-cards story-cards-3">
        <div className="story-card story-card-accent">
          <div className="story-card-label">Mets Eestis täna</div>
          <div className="story-card-value">
            ~51<span className="story-card-unit">% maismaast</span>
          </div>
          <div className="story-card-sub">SMI 2023</div>
        </div>
        <div className="story-card">
          <div className="story-card-label">Sada aastat tagasi</div>
          <div className="story-card-value">
            ~22<span className="story-card-unit">% maismaast</span>
          </div>
          <div className="story-card-sub">metsapindala on kahekordistunud</div>
        </div>
        <div className="story-card">
          <div className="story-card-label">Raadamine</div>
          <div className="story-card-value">
            Vajab<span className="story-card-unit">luba</span>
          </div>
          <div className="story-card-sub">mets → muu maakasutus</div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Kolm muutust</h2>
          <span className="hint">Maa liigub kasutuselt kasutusele</span>
        </div>
        <div className="balance-tiers">
          {TRANSITIONS.map((t) => (
            <div className="balance-tier" key={t.title}>
              <div className="landuse-transition">
                <span aria-hidden>{t.from}</span>
                <span className="landuse-arrow" aria-hidden>
                  →
                </span>
                <span aria-hidden>{t.to}</span>
              </div>
              <h3 style={{ margin: "0 0 2px" }}>{t.title}</h3>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-mute)",
                  marginBottom: 6,
                }}
              >
                {t.sub}
              </div>
              <p>{t.body}</p>
              <div className="balance-tier-tools">
                <span className="balance-tool-chip">{t.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Mis on probleem?</h2>
          <span className="hint">Miks maakasutuse muutus loeb</span>
        </div>
        <div className="balance-tiers">
          {PROBLEMS.map((p) => (
            <div className="balance-tier" key={p.title}>
              <div className="balance-tier-head">
                <span className="balance-tier-icon" aria-hidden>
                  {p.icon}
                </span>
                <h3>{p.title}</h3>
              </div>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Mida kaitseks tehakse</h2>
          <span className="hint">Reeglid ja meetmed</span>
        </div>
        <div className="balance-tiers">
          {MEASURES.map((m) => (
            <div className="balance-tier" key={m.title}>
              <div className="balance-tier-head">
                <span className="balance-tier-icon" aria-hidden>
                  {m.icon}
                </span>
                <h3>{m.title}</h3>
              </div>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
        <p className="story-takeaway" style={{ marginTop: 14 }}>
          Metsa enda kaitsest raie kõrval räägib lähemalt lugu{" "}
          <a href="#/sild">„Mida saab teha"</a>.
        </p>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Raie ei ole raadamine</h2>
        </div>
        <p className="story-takeaway">
          <strong>Oluline vahe:</strong> lageraie järel jääb maa metsaks — uus
          mets kasvab peale. <strong>Raadamise</strong> järel pole seal enam
          metsa: põld, tee või linn. Just see püsiv maakasutuse muutus, mitte
          raie ise, võtab elupaiga ja seotud süsiniku jäädavalt.
        </p>
        <p
          className="story-takeaway"
          style={{ marginTop: 12, color: "var(--text-mute)", fontSize: 13 }}
        >
          EL jälgib maakasutuse muutuse süsinikumõju LULUCF-sektoris (Land Use,
          Land-Use Change and Forestry): mets → põld lisab heidet, põld → mets
          seob süsinikku. Numbrid on ümardatud; allikas: SMI 2023,
          Keskkonnaagentuur.
        </p>
      </div>
    </div>
  );
}
