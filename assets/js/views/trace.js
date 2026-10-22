// 선수 개념 역추적(#/t/u2-l3): 막힌 개념에서 앞 개념을 거꾸로 하나씩 확인해 약한 곳을 찾는다.
// 앞 개념마다 개념 질문 하나(답 + 이유). 틀리면 그보다 더 앞 개념으로 먼저 내려간다. 최대 TRACE_MAX문항.
import { LESSON_BY_ID, CQ_BY_ID } from '../content/lessons/index.js';
import { UNIT_BY_ID, unitLabel } from '../content/units.js';
import { MISCONCEPTIONS } from '../content/misconceptions.js';
import { getState, update, logActivity, today } from '../store.js';
import { ancestorsOf, lessonProgress, traceStart, traceNext, traceAnswer, traceSummary, traceRecord, TRACE_MAX } from '../model.js';
import { cqHTML, cqClick } from './cq.js';
import { esc } from '../lib/ui.js';

let sess = null; // { root, queue, asked } — 화면을 떠났다 돌아와도 같은 개념이면 이어서

const DEPTH = ['', '바로 앞 개념', '두 단계 앞 개념', '세 단계 앞 개념', '네 단계 앞 개념'];
const depthText = (d) => DEPTH[d] || `${d}단계 앞 개념`;

function itemTag(a) {
  const L = LESSON_BY_ID[a.lid];
  return `${depthText(a.depth)} · ${L.title}`;
}

function summaryHTML(root, s) {
  const st = getState();
  if (!s.weak.length) {
    return `<section class="paper tr-sum ok">
      <h2 class="paper-title">앞 개념은 탄탄해요</h2>
      <p>확인한 앞 개념 ${s.passed.length}개를 모두 답과 이유까지 맞혔어요. 막힌 곳은 <strong>${esc(root.title)}</strong> 자체일 가능성이 커요. 핵심 정리와 "왜 그럴까"를 다시 읽고, "이유까지 답하기"를 풀어 보세요.</p>
      ${s.left.length ? `<p class="hint-text">문항 수 제한(${TRACE_MAX}개)으로 확인하지 못한 앞 개념: ${s.left.map((x) => esc(LESSON_BY_ID[x.lid].title)).join(', ')}</p>` : ''}
      <p class="row"><a class="btn btn-primary" href="#/l/${root.id}">${esc(root.title)} 다시 보기</a><a class="btn btn-quiet" href="#/map/${root.id}">개념 지도에서 보기</a><button type="button" class="btn btn-quiet" data-act="tr-again">처음부터 다시</button></p>
    </section>`;
  }
  const rootIds = new Set(s.roots.map((a) => a.lid));
  const row = (a) => {
    const L = LESSON_BY_ID[a.lid];
    const learned = lessonProgress(L).state !== 'new';
    const m = a.mis && MISCONCEPTIONS[a.mis];
    const rc = st.lessons[a.lid]?.recheck;
    return `<li class="tr-step${rootIds.has(a.lid) ? ' is-root' : ''}">
      <a class="tr-t" href="#/l/${L.id}">${esc(L.title)}</a>
      <span class="tr-sub">${esc(unitLabel(UNIT_BY_ID[L.unit]))}${rootIds.has(a.lid) ? ' · <strong>여기부터</strong>' : ''}</span>
      ${m ? `<span class="tr-mis">고른 이유: ${esc(m.name)}</span>` : ''}
      <span class="tr-next">${learned ? (rc ? '다시 확인할 개념에 넣었어요(오늘 화면과 복습에 나와요).' : '배운 개념이에요. 핵심 정리를 다시 보세요.') : '아직 배우지 않은 개념이에요. 이 소단원부터 공부하세요.'}</span>
    </li>`;
  };
  return `<section class="paper tr-sum miss">
    <h2 class="paper-title">약한 앞 개념을 찾았어요</h2>
    <p>아래 순서로 다시 보고 <strong>${esc(root.title)}</strong>로 돌아오세요. 앞쪽 개념이 흔들리면 뒤 개념은 외워도 금방 무너집니다.</p>
    <ol class="tr-path">${s.weak.map(row).join('')}<li class="tr-step is-goal"><a class="tr-t" href="#/l/${root.id}">${esc(root.title)}</a><span class="tr-sub">막혔던 개념</span></li></ol>
    ${s.left.length ? `<p class="hint-text">문항 수 제한(${TRACE_MAX}개)으로 확인하지 못한 앞 개념: ${s.left.map((x) => esc(LESSON_BY_ID[x.lid].title)).join(', ')}</p>` : ''}
    <p class="row"><a class="btn btn-primary" href="#/l/${s.roots[0].lid}">${esc(LESSON_BY_ID[s.roots[0].lid].title)}부터 보기</a><a class="btn btn-quiet" href="#/map/${root.id}">개념 지도에서 보기</a><button type="button" class="btn btn-quiet" data-act="tr-again">처음부터 다시</button></p>
  </section>`;
}

export function renderTrace(view, { args: [id] }) {
  const root = LESSON_BY_ID[id];
  if (!root) { location.replace('#/units'); return; }
  const start = () => ({ ...traceStart(id), date: today() });
  if (!sess || sess.root !== id || sess.date !== today()) sess = start();
  const anc = ancestorsOf(id);

  const draw = () => {
    const next = traceNext(sess);
    const s = traceSummary(sess);
    const n = sess.asked.length;
    view.innerHTML = `
    <section class="page narrow trace">
      <nav class="crumbs" aria-label="위치"><a href="#/map/${root.id}">개념 지도</a><span aria-hidden="true">/</span><a href="#/l/${root.id}">${esc(root.title)}</a></nav>
      <header class="page-head">
        <h1 class="page-title">앞 개념 거꾸로 확인</h1>
        <p class="lead"><strong>${esc(root.title)}</strong>에서 막혔다면, 이 개념이 기대는 앞 개념을 하나씩 확인해 약한 곳을 찾습니다. 앞 개념마다 개념 질문 하나(답 + 이유)를 풀고, 틀리면 그보다 더 앞 개념으로 내려갑니다. 최대 ${TRACE_MAX}문항(약 5분)이에요.</p>
        ${anc.length ? `<p class="pre-row"><span class="pre-l">앞 개념</span>${anc.map((a) => `<span class="chip tr-chip d${Math.min(a.depth, 3)}${sess.asked.some((x) => x.lid === a.l.id) ? (sess.asked.find((x) => x.lid === a.l.id).ok ? ' is-ok' : ' is-miss') : ''}" title="${depthText(a.depth)}">${esc(a.l.title)}</span>`).join('')}</p>` : ''}
      </header>
      ${anc.length ? `<ol class="ck-list tr-list">${sess.asked.map((a, k) => cqHTML(CQ_BY_ID[a.qid], { num: k + 1, done: a.resp, tag: itemTag(a) })).join('')}${next ? cqHTML(CQ_BY_ID[next.qid], { num: n + 1, tag: itemTag(next), attrs: `data-tr-cur="1"` }) : ''}</ol>
        ${next ? `<p class="hint-text tr-prog">${n + 1}번째 문항${n ? ` · 지금까지 맞힘 ${s.passed.length}, 틀림 ${s.weak.length}` : ''}</p>` : summaryHTML(root, s)}`
      : `<section class="paper tr-sum ok"><h2 class="paper-title">고1 과정의 앞 소단원이 없는 개념이에요</h2><p>이 개념은 중학교 내용에 바로 기댑니다. 핵심 정리와 "왜 그럴까"부터 다시 보세요.</p><p class="row"><a class="btn btn-primary" href="#/l/${root.id}">${esc(root.title)} 다시 보기</a></p></section>`}
    </section>`;
  };

  view.onclick = (e) => {
    if (cqClick(e.target, {
      find: (qid) => CQ_BY_ID[qid],
      onGrade: (li, q, a, r) => {
        if (!li.hasAttribute('data-tr-cur')) return;
        const item = traceNext(sess);
        if (!item || item.qid !== q.id) return;
        let res;
        update((s) => { res = traceRecord(s, item.lid, q.id, a, r); logActivity({ checks: 1 }); });
        sess = traceAnswer(sess, { ...item, resp: { a, r } }, res.ok, res.mis);
        const y = window.scrollY;
        draw();
        window.scrollTo(0, y);
        const cur = view.querySelector('[data-tr-cur]') || view.querySelector('.tr-sum');
        if (cur) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      },
    })) return;
    if (e.target.closest('[data-act="tr-again"]')) { sess = start(); draw(); window.scrollTo(0, 0); }
  };
  draw();
  return () => { view.onclick = null; };
}
