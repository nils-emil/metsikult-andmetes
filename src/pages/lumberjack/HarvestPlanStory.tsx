const PROCESS_STEPS = [
  {
    title: "Metsa kirjeldamine",
    body: "Metsakorraldaja käib metsa läbi ja kirjeldab iga metsatüki: mis puu kasvab, kui vana see on ja kui palju puitu seal on.",
  },
  {
    title: "Metsamajandamiskava",
    body: "Kirjelduste põhjal koostatakse 10 aastaks kava: mida, kus ja millal metsas teha — sealhulgas millal ja kuidas raiuda.",
  },
  {
    title: "Metsateatis",
    body: "Enne raiet esitab omanik Keskkonnaametile metsateatise. Amet kontrollib, kas kavandatud raie on lubatud.",
  },
  {
    title: "Raie",
    body: "Alles siis tuleb saag. Raie tehakse kava ja seaduse piires — õige puistu, õige aeg, õige raieviis.",
  },
  {
    title: "Uuendamine",
    body: "Raiutud ala pannakse uuesti kasvama: istutus, külv või looduslik uuendus. Uus mets peab seaduse järgi tagasi tulema.",
  },
];

const PLAN_SECTORS = [
  {
    icon: "🌲",
    title: "Puuliik",
    body: "Milline puu metsatükil valitseb — kuusk, mänd, kask või muu.",
  },
  {
    icon: "📅",
    title: "Vanus",
    body: "Kui vana puistu on. See määrab, kas raieaeg on käes või veel vara.",
  },
  {
    icon: "📈",
    title: "Boniteet",
    body: "Kasvukoha headus — kui kiiresti mets just selles kohas kasvab.",
  },
  {
    icon: "🪵",
    title: "Tagavara",
    body: "Kui palju puitu hektaril seisab (m³/ha) — metsa puiduvaru.",
  },
  {
    icon: "🌿",
    title: "Kasvukohatüüp",
    body: "Mullastik ja taimkond, nt jänesekapsa-mustika kuusik.",
  },
  {
    icon: "🪓",
    title: "Soovitatav raie",
    body: "Milline raie ja umbes mis aastal seda teha tasub.",
  },
  {
    icon: "🌱",
    title: "Uuendusviis",
    body: "Kuidas mets pärast raiet taastada — istutus, külv või loodus.",
  },
];

const CUT_TYPES = [
  {
    icon: "🌱",
    title: "Hooldusraie",
    body: "Noores metsas: eemaldatakse kehvemad puud, et parimad saaksid valgust ja ruumi.",
  },
  {
    icon: "✂️",
    title: "Harvendusraie",
    body: "Keskealises metsas hõrendamine — annab vahepealset tulu ja kiirendab jämeda puidu kasvu.",
  },
  {
    icon: "🪓",
    title: "Uuendusraie (lageraie)",
    body: "Küps mets raiutakse, et asemele tuleks uus põlvkond. Lageraie on selle levinuim viis.",
  },
  {
    icon: "🩺",
    title: "Sanitaarraie",
    body: "Haigete, tormi- või putukakahjustusega puude eemaldamine, et kahju ei leviks.",
  },
];

export function HarvestPlanStory() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Kuidas raie toimub</h1>
          <p className="subtitle">
            Lugu 1 / 5 — raie ei alga mootorsaest, vaid plaanist. Vaatame,
            kuidas Eestis metsa majandama hakatakse. Kõik algab
            metsamajandamiskavast.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Raie algab plaanist</h2>
            <span className="hint">Viis sammu metsast saeni ja tagasi</span>
          </div>
          <div className="process-flow">
            {PROCESS_STEPS.map((step, i) => (
              <div className="process-step" key={step.title}>
                <span className="process-step-nr">{i + 1}</span>
                <div className="process-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Mis on metsamajandamiskava?</h2>
          </div>
          <p>
            Metsamajandamiskava on ühe metsaomandi kasutusjuhend. See kirjeldab,
            mis metsas kasvab, ja annab soovitused, mida järgmise{" "}
            <strong>10 aasta</strong> jooksul teha. Kava koostab litsentseeritud
            metsakorraldaja ning suurematel erametsaomanikel ja riigimetsal
            (RMK) on see majandamise alus.
          </p>
          <p style={{ marginTop: 8 }}>
            Selleks jagatakse mets väikesteks ühtlasteks tükkideks —{" "}
            <strong>eraldisteks</strong> — ja iga eraldise kohta on kavas oma
            kirje. Üks eraldis on ala, kus mets on enam-vähem ühesugune: sama
            puuliik, sama vanus, sama kasvukoht.
          </p>
          <figure className="plan-figure">
            <img
              src="/kava.png"
              alt="Puistuplaan: metsaomand jagatud värviliseks eraldisteks, igaüks oma metsatüübiga"
              loading="lazy"
            />
            <figcaption>
              Puistuplaan — metsaomand on jagatud eraldisteks ja iga värv näitab
              metsatüüpi (lage ala, noorendik, latimets, keskealine ja küps
              mets). Just selline kaart on metsamajandamiskava alus.
            </figcaption>
          </figure>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Mida kava iga metsatüki kohta sisaldab</h2>
            <span className="hint">Need andmed on iga eraldise kirjes</span>
          </div>
          <div className="balance-tiers">
            {PLAN_SECTORS.map((s) => (
              <div className="balance-tier" key={s.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {s.icon}
                  </span>
                  <h3>{s.title}</h3>
                </div>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Millised raied kava ette näeb</h2>
            <span className="hint">Metsa eluea eri etappidel eri raie</span>
          </div>
          <div className="balance-tiers">
            {CUT_TYPES.map((c) => (
              <div className="balance-tier" key={c.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {c.icon}
                  </span>
                  <h3>{c.title}</h3>
                </div>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Millal jätta mets looduslikule uuendamisele?</h2>
          </div>
          <p>
            Pärast uuendusraiet tuleb uus mets kasvama panna. Kava soovitab kas
            inimese abi (istutus või külv) või looduslikku uuendust — kumb
            antud kohas paremini töötab.
          </p>
          <div className="balance-tiers" style={{ marginTop: 14 }}>
            <div className="balance-tier">
              <div className="balance-tier-head">
                <span className="balance-tier-icon" aria-hidden>
                  🌱
                </span>
                <h3>Looduslik uuendamine</h3>
              </div>
              <p>
                Loodus külvab ise. Kava soovitab seda, kui koht ja puuliik seda
                hästi võimaldavad.
              </p>
              <div className="balance-tier-tools">
                <span className="balance-tool-chip">Seemnepuud jäetakse alles</span>
                <span className="balance-tool-chip">Mänd liivasel pinnasel</span>
                <span className="balance-tool-chip">Kask ja sanglepp</span>
                <span className="balance-tool-chip">Odav, kuid aeglasem</span>
              </div>
            </div>
            <div className="balance-tier">
              <div className="balance-tier-head">
                <span className="balance-tier-icon" aria-hidden>
                  🌳
                </span>
                <h3>Istutamine või külv</h3>
              </div>
              <p>
                Inimene paneb taimed ise maha. Kava soovitab seda, kui looduslik
                uuendus oleks ebakindel.
              </p>
              <div className="balance-tier-tools">
                <span className="balance-tool-chip">Kuusk viljakal pinnasel</span>
                <span className="balance-tool-chip">Soovitud puuliik kindlalt</span>
                <span className="balance-tool-chip">Kiire ja ühtlane algus</span>
                <span className="balance-tool-chip">Kallim</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="story-takeaway">
            <strong>Kava on kogu raie selgroog:</strong> see ütleb, mida, millal
            ja kuidas teha — ja millal lasta hoopis loodusel ise töö ära teha.
            Järgmistes lugudes vaatame, kuidas mets üldse kasvab ja millal raie
            kõige rohkem tulu toob.
          </p>
        </div>
      </div>
    </div>
  );
}
