import { SPECIES, SITES, type SpeciesId, type SiteId } from "../forestry/species";
import type { Prices, Costs } from "../forestry/model";

interface Props {
  speciesId: SpeciesId;
  setSpecies: (s: SpeciesId) => void;
  siteId: SiteId;
  setSite: (s: SiteId) => void;
  rotationAge: number;
  setRotationAge: (a: number) => void;
  discountRate: number;
  setDiscountRate: (r: number) => void;
  prices: Prices;
  setPrices: (p: Prices) => void;
  costs: Costs;
  setCosts: (c: Costs) => void;
  optimalAge: number;
  onUseOptimal: () => void;
}

export function ControlsPanel(props: Props) {
  const {
    speciesId,
    setSpecies,
    siteId,
    setSite,
    rotationAge,
    setRotationAge,
    discountRate,
    setDiscountRate,
    prices,
    setPrices,
    costs,
    setCosts,
    optimalAge,
    onUseOptimal,
  } = props;

  return (
    <div className="col">
      <div className="panel">
        <h2>Puuliik</h2>
        <div className="picker">
          {Object.values(SPECIES).map((sp) => (
            <button
              key={sp.id}
              className={`picker-option${speciesId === sp.id ? " active" : ""}`}
              onClick={() => setSpecies(sp.id)}
            >
              <span className="opt-title">
                <span>{sp.emoji}</span>
                {sp.name}
                <span style={{ color: "var(--text-mute)", fontWeight: 400, fontStyle: "italic", fontSize: 12 }}>
                  {sp.latin}
                </span>
              </span>
              <span className="opt-sub">{sp.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Kasvukoha headus</h2>
        <div className="picker">
          {Object.values(SITES).map((s) => (
            <button
              key={s.id}
              className={`picker-option compact${siteId === s.id ? " active" : ""}`}
              onClick={() => setSite(s.id)}
            >
              <span className="opt-title">{s.name}</span>
              <span className="opt-sub">×{s.factor.toFixed(2)} kogust</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Raie ja intress</h2>
        <div className="field">
          <div className="field-row">
            <span className="field-label">Raievanus (millal raiuda)</span>
            <span className="field-value">{rotationAge} aastat</span>
          </div>
          <input
            type="range"
            min={20}
            max={180}
            step={1}
            value={rotationAge}
            onChange={(e) => setRotationAge(Number(e.target.value))}
          />
          <button className="optimal-btn" onClick={onUseOptimal}>
            Vali parim raievanus: {optimalAge} a
          </button>
        </div>

        <div className="field">
          <div className="field-row">
            <span className="field-label">Intressimäär (raha ajaväärtus)</span>
            <span className="field-value">{(discountRate * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={6}
            step={0.1}
            value={discountRate * 100}
            onChange={(e) => setDiscountRate(Number(e.target.value) / 100)}
          />
        </div>
      </div>

      <div className="panel">
        <h2>Puidu hinnad (€/m³)</h2>
        <PriceSlider
          label="Paberipuit"
          value={prices.pulp}
          min={10}
          max={80}
          onChange={(v) => setPrices({ ...prices, pulp: v })}
        />
        <PriceSlider
          label="Palk"
          value={prices.saw}
          min={40}
          max={150}
          onChange={(v) => setPrices({ ...prices, saw: v })}
        />
        <PriceSlider
          label="Spoonipakk"
          value={prices.veneer}
          min={60}
          max={250}
          onChange={(v) => setPrices({ ...prices, veneer: v })}
        />
      </div>

      <div className="panel">
        <h2>Kulud</h2>
        <PriceSlider
          label="Istutus €/ha"
          value={costs.establishment}
          min={500}
          max={4000}
          step={100}
          onChange={(v) => setCosts({ ...costs, establishment: v })}
        />
        <PriceSlider
          label="Raietööd €/m³"
          value={costs.harvestPerM3}
          min={5}
          max={25}
          step={1}
          onChange={(v) => setCosts({ ...costs, harvestPerM3: v })}
        />
      </div>
    </div>
  );
}

function PriceSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="field">
      <div className="field-row">
        <span className="field-label">{label}</span>
        <span className="field-value">{value.toLocaleString("et-EE")}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
