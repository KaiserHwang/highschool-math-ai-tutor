import { subscribe, getState, isMemoryOnly } from './store.js';
import { dueReviews } from './model.js';
import { toast } from './lib/ui.js';
import { renderHome } from './views/home.js';
import { renderDiagnosis } from './views/diagnosis.js';
import { renderUnits, renderUnit } from './views/units.js';
import { renderProblem } from './views/problem.js';
import { renderLesson } from './views/lesson.js';
import { renderReview } from './views/review.js';
import { renderReport } from './views/report.js';
import { renderSettings } from './views/settings.js';

const view = document.getElementById('view');
let cleanup = null;

const routes = [
  [/^\/?$/, () => renderHome, 'home'],
  [/^\/diagnosis$/, () => renderDiagnosis, 'diagnosis'],
  [/^\/units$/, () => renderUnits, 'units'],
  [/^\/u\/(u\d)$/, () => renderUnit, 'units'],
  [/^\/l\/(u\d-l\d+)$/, () => renderLesson, 'units'],
  [/^\/p\/(u\d-\d\d)$/, () => renderProblem, 'units'],
  [/^\/v\/(g-[a-z0-9-]+)$/, () => renderProblem, 'units'],
  [/^\/review$/, () => renderReview, 'review'],
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

function setActive(nav) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  updateBadges();
}

function updateBadges() {
  const n = dueReviews().length;
  document.querySelectorAll('[data-badge="review"]').forEach((b) => {
    b.textContent = n ? String(n) : '';
    b.hidden = !n;
  });
}

function applyTheme() {
  const t = getState().settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

subscribe(() => { updateBadges(); applyTheme(); });
window.addEventListener('hashchange', route);
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
