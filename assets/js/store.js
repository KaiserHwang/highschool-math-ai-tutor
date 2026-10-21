// 학습 기록 저장소. 모든 데이터는 이 기기의 브라우저(localStorage)에만 저장된다.
import { blankState, checkState, parseBackup } from './backup.js';

const KEY = 'mathpulse:v2';
const listeners = new Set();

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

/** 저장된 시각(ISO, UTC)을 이 기기의 현지 날짜('YYYY-MM-DD')로 바꾼다. 날짜 비교는 모두 이 기준으로 한다. */
export const localDay = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : today(d);
};

export const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
};

const blank = blankState;

// 주의: memoryOnly 는 load() 보다 먼저 선언해야 한다(저장소 접근이 막힌 브라우저에서 load()가 이 값을 바꾼다).
let memoryOnly = false;
let state = load();

function load() {
  let raw;
  try {
    raw = localStorage.getItem(KEY);
  } catch (e) {
    memoryOnly = true;
    return blank();
  }
  if (!raw) return blank();
  try {
    // 저장된 기록은 관대하게 검사한다: 망가진 항목만 버리고 나머지는 살린다
    return checkState(JSON.parse(raw), { strict: false }).state;
  } catch (e) {
    return blank();
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    memoryOnly = false;
    return true;
  } catch (e) {
    memoryOnly = true;
    return false;
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

/**
 * 백업을 가져온다. 전체를 검사한 뒤에만 기록을 바꾸고, 검사나 저장에 실패하면 기존 기록을 그대로 둔다.
 * @returns {{ dropped: number }} 지금 앱에 없는 문제 등으로 버린 항목 수
 */
export function importData(text) {
  const { state: next, dropped } = parseBackup(text); // 잘못되면 여기서 BackupError
  const prev = state;
  const prevRaw = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  state = next;
  if (!persist() && prevRaw !== null) {
    state = prev;
    try { localStorage.setItem(KEY, prevRaw); } catch { /* 저장소를 쓸 수 없음 */ }
    throw new Error('기록을 저장하지 못해 가져오기를 취소했습니다. 기존 기록은 그대로입니다.');
  }
  listeners.forEach((l) => l(state));
  return { dropped };
}

export function resetAll() {
  state = blank();
  persist();
  listeners.forEach((l) => l(state));
}

export function logActivity({ solved = 0, attempted = 0, seconds = 0, checks = 0 }) {
  const d = today();
  const a = state.activity[d] || { solved: 0, attempted: 0, seconds: 0 };
  a.solved += solved;
  a.attempted += attempted;
  a.seconds += Math.round(seconds);
  if (checks) a.checks = (a.checks || 0) + checks; // 개념 확인 문제 풀이 수(문제 은행과 따로 센다)
  state.activity[d] = a;
}
