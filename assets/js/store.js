// 학습 기록 저장소. 모든 데이터는 이 기기의 브라우저(localStorage)에만 저장된다.
const KEY = 'mathpulse:v2';
const listeners = new Set();

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

export const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
};

function blank() {
  return {
    version: 2,
    createdAt: new Date().toISOString(),
    profile: { name: '', track: null, dailyGoal: 5 },
    diagnoses: [], // 최신이 마지막
    attempts: {}, // pid → 시도 기록
    wrong: {}, // pid → 오답노트 항목
    notes: {}, // pid → 풀이 메모
    activity: {}, // 'YYYY-MM-DD' → { solved, attempted, seconds }
    settings: { theme: 'auto', ai: { gemini: '', chatgpt: '', claude: '' }, preferredAi: 'claude' },
  };
}

let state = load();
let memoryOnly = false;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) {
    memoryOnly = true;
  }
  return blank();
}

function migrate(s) {
  const base = blank();
  const out = { ...base, ...s };
  out.profile = { ...base.profile, ...(s.profile || {}) };
  out.settings = { ...base.settings, ...(s.settings || {}), ai: { ...base.settings.ai, ...((s.settings || {}).ai || {}) } };
  for (const k of ['attempts', 'wrong', 'notes', 'activity']) out[k] = s[k] && typeof s[k] === 'object' ? s[k] : {};
  out.diagnoses = Array.isArray(s.diagnoses) ? s.diagnoses : [];
  out.version = 2;
  return out;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    memoryOnly = false;
  } catch (e) {
    memoryOnly = true;
  }
}

export const isMemoryOnly = () => memoryOnly;
export const getState = () => state;

export function update(fn) {
  fn(state);
  persist();
  listeners.forEach((l) => l(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function exportData() {
  return JSON.stringify({ app: 'MathPulse', exportedAt: new Date().toISOString(), data: state }, null, 2);
}

export function importData(text) {
  const parsed = JSON.parse(text);
  const data = parsed && parsed.app === 'MathPulse' ? parsed.data : parsed;
  if (!data || typeof data !== 'object' || !('attempts' in data)) throw new Error('MathPulse 백업 파일이 아닙니다.');
  state = migrate(data);
  persist();
  listeners.forEach((l) => l(state));
}

export function resetAll() {
  state = blank();
  persist();
  listeners.forEach((l) => l(state));
}

export function logActivity({ solved = 0, attempted = 0, seconds = 0 }) {
  const d = today();
  const a = state.activity[d] || { solved: 0, attempted: 0, seconds: 0 };
  a.solved += solved;
  a.attempted += attempted;
  a.seconds += Math.round(seconds);
  state.activity[d] = a;
}
