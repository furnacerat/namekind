import type { BabyNameTrendPoint } from "../../baby-name-trends";

function rankLabel(rank: number | null) {
  return rank === null ? "Outside the Top 1,000" : `#${rank}`;
}

export function BabyNamePopularity({ name, trend }: { name: string; trend: BabyNameTrendPoint[] }) {
  const ranked = trend.filter((point): point is { year:number; rank:number } => point.rank !== null);
  const current = trend.at(-1)!;
  const first = trend[0];
  const best = ranked.reduce((winner, point) => point.rank < winner.rank ? point : winner, ranked[0]);
  const worstRank = Math.max(...ranked.map((point) => point.rank));
  const bestRank = Math.min(...ranked.map((point) => point.rank));
  const range = Math.max(1, worstRank - bestRank);
  const movement = first.rank === null
    ? `${name} entered the Top 1,000 during this ten-year view.`
    : current.rank === null
      ? `${name} moved outside the Top 1,000 during this ten-year view.`
      : current.rank < first.rank
        ? `${name} climbed ${first.rank - current.rank} places from 2016 to 2025.`
        : current.rank > first.rank
          ? `${name} moved down ${current.rank - first.rank} places from 2016 to 2025.`
          : `${name} held the same rank in 2016 and 2025.`;

  return <section id="popularity" className="popularity-section">
    <h2>{name} popularity over the last 10 years</h2>
    <p>{movement} Each year and spelling is counted separately in the Social Security Administration data.</p>
    <div className="trend-facts">
      <div><span>2025 rank</span><strong>{rankLabel(current.rank)}</strong></div>
      <div><span>2016 rank</span><strong>{rankLabel(first.rank)}</strong></div>
      <div><span>Decade best</span><strong>#{best.rank} in {best.year}</strong></div>
    </div>
    <div className="rank-chart" aria-label={`${name} annual U.S. ranking from 2016 through 2025`}>
      {trend.map((point) => {
        const height = point.rank === null ? 8 : 22 + Math.round(((worstRank - point.rank) / range) * 78);
        return <div className="rank-column" key={point.year}>
          <span className="rank-value">{point.rank === null ? ">1k" : `#${point.rank}`}</span>
          <span className="rank-bar-track" aria-hidden="true"><i style={{ height:`${height}%` }} /></span>
          <span className="rank-year">{String(point.year).slice(2)}</span>
        </div>;
      })}
    </div>
    <details className="trend-table-wrap">
      <summary>View the complete yearly rankings</summary>
      <table className="trend-table">
        <thead><tr><th>Year</th><th>U.S. rank</th></tr></thead>
        <tbody>{[...trend].reverse().map((point) => <tr key={point.year}><td>{point.year}</td><td>{rankLabel(point.rank)}</td></tr>)}</tbody>
      </table>
    </details>
    <p className="source-line">Source: <a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer">U.S. Social Security Administration ↗</a>. SSA reports spellings separately and suppresses names used fewer than five times.</p>
  </section>;
}
