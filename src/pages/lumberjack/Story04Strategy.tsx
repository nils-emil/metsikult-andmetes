const REGEN = [
  {
    icon: "🌱",
    title: "Looduslik uuendus",
    body: "Loodus külvab ise — seemnepuud ja naabermets varistavad seemned langile.",
    when: ["Mänd liival", "Kask ja sanglepp", "Seemnepuud alles jäetud"],
    cost: "Odavaim, kuid aeglane ja vähem kindel.",
  },
  {
    icon: "🌾",
    title: "Külv",
    body: "Inimene puistab seemned ettevalmistatud mulda — looduse ja istutuse vahepealne tee.",
    when: ["Mänd mineraalmullal", "Seemnepuid napib", "Kiirem kui loodus"],
    cost: "Keskmine hind; tulemus sõltub põuast ja seemnesööjatest.",
  },
  {
    icon: "🌳",
    title: "Istutus",
    body: "Taimlas kasvatatud taimed pannakse maha — kindlaim ja kiireim viis.",
    when: ["Kuusk viljakal pinnasel", "Soovitud liik kindlalt", "Kiire algus"],
    cost: "Kalleim, kuid kõige usaldusväärsem.",
  },
];

export function Story04Strategy() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Mis juhtub peale lageraiet</h1>
          <p className="subtitle">
            Lugu 5 / 5 — seadus on selge: pärast lageraiet tuleb mets uuendada.
            Küsimus on, <strong>kuidas</strong> — kas lasta loodusel ise või
            külvata ja istutada.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Mets tuleb uuendada</h2>
          </div>
          <p>
            Lageraie järel ei tohi maa metsata jääda — uus metsapõlv on{" "}
            <strong>Metsaseadusega kohustuslik</strong>. Selleks on kolm teed:
            jätta loodusele, külvata või istutada. Eesti erametsas uuendatakse
            ligi pool lankidest istutuse või külviga, ülejäänu jäetakse loodusele.
          </p>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Looduslik uuendus, külv või istutus?</h2>
            <span className="hint">Odavam ja vabam ↔ kallim ja kindlam</span>
          </div>
          <div className="balance-tiers">
            {REGEN.map((r) => (
              <div className="balance-tier" key={r.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {r.icon}
                  </span>
                  <h3>{r.title}</h3>
                </div>
                <p>{r.body}</p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-mute)",
                    margin: "6px 0 0",
                  }}
                >
                  {r.cost}
                </p>
                <div className="balance-tier-tools">
                  {r.when.map((w) => (
                    <span className="balance-tool-chip" key={w}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Millal jätta loodusele?</h2>
          </div>
          <p className="story-takeaway">
            <strong>Rusikareegel:</strong> jäta loodusele, kui läheduses on
            seemneallikas ja tegu on isekülvavate pioneeridega — mänd kuival
            liivamullal, kask, sanglepp. <strong>Külva või istuta</strong>, kui
            tahad kindlat liiki ja kiiret algust, või kui viljakal pinnasel
            kataks rohi ja võsa looduslikud taimekesed kinni. Loodus on odav,
            aga aeglane ja ettearvamatu; istutus kindel, aga kallis — külv jääb
            vahepeale.
          </p>
        </div>
      </div>
    </div>
  );
}
