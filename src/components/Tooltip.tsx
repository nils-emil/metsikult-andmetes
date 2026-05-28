interface RowSpec {
  name: string;
  key: string;
  color: string;
  format: (v: number) => string;
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number | string;
}

interface TooltipArgs {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadItem>;
  label?: number | string;
}

export function makeTooltip(
  labelFormat: (label: number | string) => string,
  rows: RowSpec[],
) {
  return function CustomTooltip(props: TooltipArgs) {
    const { active, payload, label } = props;
    if (!active || !payload || payload.length === 0) return null;
    const byKey = new Map<string, TooltipPayloadItem>();
    for (const p of payload) {
      if (p?.dataKey != null) byKey.set(String(p.dataKey), p);
    }
    return (
      <div className="chart-tooltip">
        <div className="tt-label">{labelFormat(label as number | string)}</div>
        {rows.map((row) => {
          const p = byKey.get(row.key);
          if (!p || p.value == null) return null;
          return (
            <div className="tt-row" key={row.key}>
              <span className="tt-name" style={{ color: row.color }}>
                ● {row.name}
              </span>
              <span className="tt-value">{row.format(Number(p.value))}</span>
            </div>
          );
        })}
      </div>
    );
  };
}
