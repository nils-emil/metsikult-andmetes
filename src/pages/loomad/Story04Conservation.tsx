import { ConservationToolGrid } from "../../components/ConservationToolGrid";
import { CONSERVATION_TOOLS } from "../../wildlife/conservation";
import { SPECIES } from "../../wildlife/species";
import { WILDLIFE_SOURCES } from "../../data/wildlife";

export function Story04Conservation() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Mida saab teha</h1>
          <p className="subtitle">
            Lugu 4 / 4 — kaitsemeetmed, mis Eesti mets-elustiku säilitavad raie
            kõrval. Iga vahend on seadusandlik kompromiss kasutamise ja
            säilitamise vahel.
          </p>
        </div>
      </header>

      <div className="panel">
        <div className="section-title">
          <h2>Kuus peamist kaitsevahendit</h2>
          <span className="hint">
            Kaetuse arvud on illustratiivsed; täpsed sihttasemed
            kliimaministeerium.ee/MAK2030
          </span>
        </div>
        <ConservationToolGrid tools={CONSERVATION_TOOLS} speciesById={SPECIES} />
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Allikad</h2>
          <span className="hint">Riigi andmed ja teadusbaas</span>
        </div>
        <ul className="source-list">
          {WILDLIFE_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
              <span className="source-publisher"> — {s.publisher}</span>
            </li>
          ))}
        </ul>
        <p className="story-takeaway" style={{ marginTop: 12 }}>
          <strong>Side MAK2030-ga:</strong> need meetmed on osa{" "}
          <strong>alaeesmärgist 2 (looduslik mitmekesisus)</strong> ja{" "}
          <strong>alaeesmärgist 4 (säästev metsamajandus)</strong>{" "}
          tegevuskavast. Loomavaade lõpeb siin, kuid raidurivaade jätkab
          strateegia 12 prioriteetse probleemiga — vaata <a href="#/raidur/5">
          Raiduri lugu 5
          </a>. Mõlemad vaated kohtuvad lõpuks ühel skaalal:{" "}
          <a href="#/sild">Otsusta ise: kaks vaadet, üks raievanus</a>.
        </p>
      </div>
    </div>
  );
}
