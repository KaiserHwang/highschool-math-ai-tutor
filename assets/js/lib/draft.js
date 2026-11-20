// 풀던 진단·혼합 평가의 임시 저장(#48 1-A). 학습 기록(store)과 따로 두어 백업·저장 형식에 영향을 주지 않는다.
// 새로고침이나 탭 재로드로 응답을 잃지 않게 하는 용도이며, 오래된 임시 저장은 버린다.
const KEY = (name) => `mathpulse.draft.${name}`;
const MAX_AGE_MS = 14 * 864e5;

export function saveDraft(name, data) {
  try { localStorage.setItem(KEY(name), JSON.stringify({ v: 1, at: Date.now(), ...data })); } catch { /* 저장할 수 없는 브라우저면 이어 풀기만 안 된다 */ }
}

export function loadDraft(name) {
  try {
    const d = JSON.parse(localStorage.getItem(KEY(name)) || 'null');
    if (!d || d.v !== 1 || typeof d.at !== 'number' || Date.now() - d.at > MAX_AGE_MS) { clearDraft(name); return null; }
    return d;
  } catch { return null; }
}

export function clearDraft(name) {
  try { localStorage.removeItem(KEY(name)); } catch { /* 무시 */ }
}

// 모든 기록을 지울 때 화면이 메모리에 들고 있는 진행 상태도 버리도록 알린다(같은 탭에서 되살아나지 않게)
const clearListeners = new Set();
export const onDraftsCleared = (fn) => clearListeners.add(fn);
export const clearAllDrafts = () => {
  clearDraft('diag'); clearDraft('quiz');
  try { localStorage.removeItem('mathpulse.lessonpos'); } catch { /* 무시 */ } // 소단원에서 마지막으로 본 단계도 지운다
  clearListeners.forEach((fn) => fn());
};

const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);

/** 진단 임시 저장을 검사해 이어 풀 상태로 바꾼다. 문항 구성이 바뀌었거나 값이 이상하면 null.
 *  items: 지금 그 진단 묶음의 문항 목록 */
export function restoreDiagRun(d, items) {
  if (!d || !Array.isArray(d.ids) || !Array.isArray(items) || !isObj(d.responses)) return null;
  if (d.ids.join() !== items.map((q) => q.id).join()) return null; // 문항이 추가·변경되면 처음부터
  if (!Number.isInteger(d.i) || d.i < 0 || d.i >= items.length) return null;
  const responses = {};
  for (const q of items) {
    const r = d.responses[q.id];
    if (!isObj(r)) continue;
    responses[q.id] = {
      response: q.type === 'mc' ? (Number.isInteger(r.response) && r.response >= 0 && r.response < q.options.length ? r.response : null) : (typeof r.response === 'string' ? r.response.slice(0, 40) : null),
      conf: ['sure', 'unsure', 'guess'].includes(r.conf) ? r.conf : null,
      hint: r.hint === true,
      sec: Number.isFinite(r.sec) && r.sec >= 0 ? Math.min(r.sec, 3600) : 0,
    };
  }
  return { i: d.i, responses };
}

/** 답한 문항 수(이어 풀기 안내용): 실제 답이 들어간 문항만 센다("모르겠어요"로 넘긴 문항은 빼고) */
export const answeredCount = (responses) => Object.values(responses || {}).filter((r) => r && r.response != null && r.response !== '').length;
