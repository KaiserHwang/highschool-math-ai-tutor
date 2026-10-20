// 5대 역량 레이더 차트 (SVG). 축은 항상 0~100으로 고정한다.
import { SKILLS } from '../content/units.js';
import { esc } from './ui.js';

export function radar(series, { size = 260, labels = true } = {}) {
  // series: [{ values: {key: 0~100|null}, cls: 'now'|'diag', name }]
  const n = SKILLS.length;
  const pad = labels ? 96 : 12;
  const W = size + pad * 2;
  const cx = W / 2, cy = W / 2 + (labels ? 6 : 0);
  const R = size / 2;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, v) => [cx + Math.cos(ang(i)) * R * (v / 100), cy + Math.sin(ang(i)) * R * (v / 100)];
  const ring = (v) => SKILLS.map((_, i) => pt(i, v).map((c) => c.toFixed(1)).join(',')).join(' ');

  let g = '';
  for (const v of [20, 40, 60, 80, 100]) {
    g += `<polygon class="rd-grid${v === 100 ? ' rd-outer' : ''}" points="${ring(v)}"/>`;
  }
  SKILLS.forEach((_, i) => {
    const [x, y] = pt(i, 100);
    g += `<line class="rd-axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  });
  // 눈금 숫자(위쪽 축)
  for (const v of [50, 100]) {
    const [, y] = pt(0, v);
    g += `<text class="rd-tick" x="${cx + 4}" y="${(y + 3).toFixed(1)}">${v}</text>`;
  }

  for (const s of series) {
    if (SKILLS.some((k) => s.values[k.key] == null)) continue;
    const pts = SKILLS.map((k, i) => pt(i, Math.max(0, Math.min(100, s.values[k.key]))).map((c) => c.toFixed(1)).join(',')).join(' ');
    g += `<polygon class="rd-area rd-${s.cls}" points="${pts}"/>`;
    SKILLS.forEach((k, i) => {
      const [x, y] = pt(i, Math.max(0, Math.min(100, s.values[k.key])));
      g += `<circle class="rd-dot rd-${s.cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"/>`;
    });
  }

  if (labels) {
    const main = series[0];
    SKILLS.forEach((k, i) => {
      const [x, y] = pt(i, 118);
      const anchor = Math.abs(x - cx) < 8 ? 'middle' : x > cx ? 'start' : 'end';
      const val = main && main.values[k.key] != null ? main.values[k.key] : '–';
      g += `<text class="rd-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${esc(k.label)}</text>`;
      g += `<text class="rd-value" x="${x.toFixed(1)}" y="${(y + 17).toFixed(1)}" text-anchor="${anchor}">${val}</text>`;
    });
  }
  const summary = series[0] ? SKILLS.map((k) => `${k.label} ${series[0].values[k.key] ?? '없음'}`).join(', ') : '';
  return `<svg class="radar" viewBox="0 0 ${W} ${W + (labels ? 12 : 0)}" role="img" aria-label="역량 레이더 차트: ${esc(summary)}">${g}</svg>`;
}
