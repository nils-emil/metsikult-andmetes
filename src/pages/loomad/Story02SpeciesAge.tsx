import { useMemo, useState } from "react";
import { SpeciesAgeMatrix } from "../../components/SpeciesAgeMatrix";
import { SpeciesDetailCard } from "../../components/SpeciesDetailCard";
import {
  HABITAT,
  suitabilityColor,
  suitabilityLabel,
} from "../../wildlife/habitat";
import {
  AGE_CLASSES,
  AGE_CLASS_ORDER,
  SPECIES,
  type SpeciesId,
} from "../../wildlife/species";

export function Story02SpeciesAge() {
  const [selected, setSelected] = useState<SpeciesId>(HABITAT[0].species);

  const ageClasses = useMemo(
    () => AGE_CLASS_ORDER.map((id) => AGE_CLASSES[id]),
    [],
  );
  const selectedRow = HABITAT.find((r) => r.species === selected)!;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Liik × metsa vanus</h1>
          <p className="subtitle">
            Lugu 2 / 6 — 12 Eesti metsaelanikku, viis vanuseklassi. Iga lahter
            näitab, kui hästi see vanusega mets liigi vajadusi täidab.
          </p>
        </div>
      </header>

      <div className="row">
        <div className="panel">
          <div className="section-title">
            <h2>Sobivusmaatriks</h2>
            <span className="hint">Klõpsa reale — paremal avaneb detail</span>
          </div>
          <SpeciesAgeMatrix
            rows={HABITAT}
            ageClasses={ageClasses}
            speciesById={SPECIES}
            selected={selected}
            onSelect={setSelected}
          />
          <div
            className="legend"
            style={{ marginTop: 14, justifyContent: "center" }}
          >
            {([0, 1, 2, 3] as const).map((s) => (
              <span key={s} className="legend-chip">
                <span
                  className="legend-dot"
                  style={{ background: suitabilityColor(s) }}
                />
                {s} — {suitabilityLabel(s)}
              </span>
            ))}
          </div>
          <p
            style={{
              color: "var(--text-mute)",
              fontSize: 12,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Sobivushinnangud on valgustavad — kirjandusel ja liigikirjeldustel
            põhinevad lähendused, mitte mõõdetud tihedused.
          </p>
        </div>

        <aside className="panel">
          <div className="section-title">
            <h2>Detail</h2>
            <span className="hint">Liigi vajadused metsas</span>
          </div>
          <SpeciesDetailCard species={SPECIES[selected]} row={selectedRow} />
        </aside>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <p className="story-takeaway">
          <strong>Muster on selge:</strong> enamus liike vajab vanu või
          keskealisi metsi — neid lahtreid maatriksi paremal pool on rohelisem.
          Põder on erand: tema toidubaas on raiesmikul ja noorendikul.{" "}
          <strong>Mida vanem mets, seda suurem liigirikkus</strong> — see on
          põhjus, miks 60+ aastaste metsade pindala on liigikaitse võti.
        </p>
      </div>
    </div>
  );
}
