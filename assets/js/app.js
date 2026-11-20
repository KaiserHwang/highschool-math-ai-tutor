import { subscribe, getState, isMemoryOnly } from './store.js';
import { conceptsDue, reviewToday, activeCourseTitles } from './model.js';
import { toast, hideToast, esc } from './lib/ui.js';
import { ID_PART } from './lib/ids.js';
import { renderHome } from './views/home.js';
import { renderDiagnosis } from './views/diagnosis.js';
import { renderUnits, renderUnit } from './views/units.js';
import { renderProblem } from './views/problem.js';
import { renderLesson } from './views/lesson.js';
import { renderQuiz } from './views/quiz.js';
import { renderReview } from './views/review.js';
import { renderConcepts } from './views/concepts.js';
import { renderMap } from './views/map.js';
import { renderTrace } from './views/trace.js';
import { renderRecheck } from './views/recheck.js';
import { renderReport } from './views/report.js';
import { renderSettings } from './views/settings.js';

const view = document.getElementById('view');
let cleanup = null;

// 주소의 id 형식은 lib/ids.js에서 가져온다(#24). 형식이 맞아도 실제로 없는 id는 각 화면이 목록으로 돌려보낸다.
const P = ID_PART;
const re = (s) => new RegExp(`^${s}$`);
const routes = [
  [/^\/?$/, () => renderHome, 'home'],
  [/^\/diagnosis$/, () => renderDiagnosis, 'diagnosis'],
  [/^\/units$/, () => renderUnits, 'units'],
  [re(`/u/(${P.unit})`), () => renderUnit, 'units'],
  [re(`/l/(${P.lesson})`), () => renderLesson, 'units'],
  [re(`/p/(${P.problem})`), () => renderProblem, 'units'],
  [re(`/v/(${P.generator})`), () => renderProblem, 'units'],
  [/^\/review$/, () => renderReview, 'review'],
  [/^\/cr$/, () => renderConcepts, 'home'],
  [re(`/map(?:/(${P.lesson}))?`), () => renderMap, 'units'],
  [re(`/t/(${P.lesson})`), () => renderTrace, 'units'],
  [re(`/rc/(${P.lesson})`), () => renderRecheck, 'review'],
  [/^\/quiz$/, () => renderQuiz, 'units'],
  [/^\/report$/, () => renderReport, 'report'],
  [/^\/settings$/, () => renderSettings, 'settings'],
];

function parse() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  return { path, params: new URLSearchParams(query || '') };
}

function route() {
  const { path, params } = parse();
  hideToast(); // 이전 화면의 안내는 새 화면으로 가져가지 않는다
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  let matched = false;
  for (const [re, get, nav] of routes) {
    const m = path.match(re);
    if (m) {
      matched = true;
      setActive(nav);
      try {
        cleanup = get()(view, { args: m.slice(1), params }) || null;
      } catch (e) {
        console.error(e);
        view.innerHTML = `<section class="page"><h1 class="page-title">화면을 그리지 못했습니다</h1><p class="lead">${String(e.message || e)}</p><p><a class="btn" href="#/">처음으로</a></p></section>`;
      }
      break;
    }
  }
  if (!matched) {
    location.replace('#/');
    return;
  }
  window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}

/** 데스크톱 레일 아래에 공부하는 과목을 보인다(고정 문구 대신) */
function updateRailCourses() {
  const el = document.getElementById('rail-courses');
  if (el) el.innerHTML = `2022 개정 교육과정<br>${activeCourseTitles().map(esc).join(' · ')}`;
}

function setActive(nav) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  updateBadges();
}

function updateBadges() {
  const counts = {
    review: reviewToday().total, // 복습 화면의 "오늘 할 복습"과 같은 수
    concepts: conceptsDue().length,
  };
  for (const [k, n] of Object.entries(counts)) {
    document.querySelectorAll(`[data-badge="${k}"]`).forEach((b) => {
      b.textContent = n ? String(n) : '';
      b.hidden = !n;
    });
  }
}

function applyTheme() {
  const t = getState().settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

subscribe(() => { updateBadges(); applyTheme(); updateRailCourses(); });
window.addEventListener('hashchange', route);
updateRailCourses();
// '본문으로 건너뛰기'는 해시를 바꾸면 라우터가 다른 화면으로 보내므로, 해시를 그대로 두고 본문에 포커스만 옮긴다
document.querySelector('.skip')?.addEventListener('click', (e) => { e.preventDefault(); view.focus(); view.scrollIntoView({ block: 'start' }); });
applyTheme();
route();

if (isMemoryOnly()) {
  toast('이 브라우저는 기록을 저장할 수 없습니다(사생활 보호 모드 등). 창을 닫으면 기록이 사라집니다.', 7000);
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  // 새 버전이 배포되면 서비스 워커가 바뀐다. 막 연 화면이면 바로 새로고침하고,
  // 풀이 도중이면 기록이 끊기지 않도록 알림만 띄운다.
  const loadedAt = Date.now();
  const hadController = !!navigator.serviceWorker.controller;
  let handled = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || handled) return;
    handled = true;
    if (Date.now() - loadedAt < 8000) location.reload();
    else toast('앱이 업데이트되었어요. 지금 문제를 마친 뒤 새로고침하면 적용됩니다.', 7000);
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
