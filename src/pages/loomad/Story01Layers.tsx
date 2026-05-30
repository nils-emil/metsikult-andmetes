import { useState } from "react";
import { ForestLayersDiagram } from "../../components/ForestLayersDiagram";
import {
  LAYERS,
  LAYER_ORDER,
  type LayerId,
} from "../../wildlife/habitat";
import { SPECIES, STATUS_LABEL } from "../../wildlife/species";

export function Story01Layers() {
  const [selectedLayer, setSelectedLayer] = useState<LayerId | null>("vora");
  const [clearedView, setClearedView] = useState(false);

  const layers = LAYER_ORDER.map((id) => LAYERS[id]);
  const layer = selectedLayer ? LAYERS[selectedLayer] : null;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Metsa kihid on elupaik</h1>
          <p className="subtitle">
            Lugu 1 / 5 — küps mets pole üks ruum, vaid kuus kihti. Iga kiht on
            keegi koju.
          </p>
        </div>
      </header>

      <div className="row">
        <div className="panel">
          <div className="section-title">
            <h2>{clearedView ? "Pärast lageraiet" : "Küps mets"}</h2>
            <label className="layer-toggle" data-on={clearedView}>
              <span className="layer-toggle-label">Lageraie</span>
              <input
                type="checkbox"
                role="switch"
                checked={clearedView}
                onChange={(e) => setClearedView(e.target.checked)}
              />
              <span className="layer-toggle-track" aria-hidden>
                <span className="layer-toggle-thumb" />
              </span>
            </label>
          </div>

          <ForestLayersDiagram
            layers={layers}
            selectedLayer={selectedLayer}
            onSelect={setSelectedLayer}
            clearedView={clearedView}
            speciesById={SPECIES}
          />
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Klõpsa kihile, et näha, kes selles elab.{" "}
            <strong>Lageraie eemaldab korraga viis kihti</strong> kuuest — alles
            jääb vaid maapind, ka see häiritud.
          </p>
        </div>

        <aside className="panel">
          {layer ? (
            <>
              <div className="section-title">
                <h2>{layer.label}</h2>
                <span
                  className="header-chip"
                  style={{ borderColor: "var(--accent-dim)" }}
                >
                  Kiht {LAYER_ORDER.indexOf(layer.id) + 1} / 6
                </span>
              </div>
              <p style={{ marginBottom: 12 }}>{layer.shortDesc}</p>
              <div className="field">
                <div className="field-row">
                  <span className="field-label">Tüüpilised liigid</span>
                </div>
                <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
                  {layer.examples}
                </div>
              </div>
              <div className="field">
                <div className="field-row">
                  <span className="field-label">Kasutavad seda kihti</span>
                </div>
                <div className="species-strip">
                  {layer.speciesUsing.map((sid) => {
                    const sp = SPECIES[sid];
                    return (
                      <span key={sid} className="species-chip" title={sp.latin}>
                        <span className="species-chip-emoji" aria-hidden>
                          {sp.emoji}
                        </span>
                        {sp.name}
                        <span className="species-chip-status">
                          {STATUS_LABEL[sp.status]}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="section-title">
                <h2>Vali kiht</h2>
              </div>
              <p>Klõpsa diagrammil mõnele kihile, et näha selle elanikke.</p>
            </>
          )}
        </aside>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Mis juhtub lageraiel?</h2>
          <span className="hint">
            Vaheta diagrammi vaadet ülal — vt simulatsioon Raidur loos 3
          </span>
        </div>
        <p className="story-takeaway">
          Lageraie järel jääb alles üks kiht — <strong>maapind</strong> — ja
          seegi mehaaniliselt häiritud. Võra, alusmets, põõsarinne, rohurinne ja
          lamapuit kaovad korraga. Need kihid taastuvad eri kiirusel:{" "}
          <strong>rohurinne aastatega</strong>, võra ja alusmets{" "}
          <strong>aastakümnetega</strong>, päris lamapuit{" "}
          <strong>sajandiga</strong>. Raiutud puit ise kannab edasi süsinikku —
          mis sellega juhtub, vaata 3. loos.
        </p>
      </div>
    </div>
  );
}
