// 브라우저 종단 테스트: 진단 → 결과 → 문제 풀이(오답·힌트·정답) → 오답 복습 → 리포트 → 백업
// 실행: python3 -m http.server 8080 & node tests/e2e.mjs [--shots 폴더]
// playwright가 필요하다(npm i -D playwright 또는 전역 설치).
import { createRequire } from 'module';
import { mkdirSync } from 'fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = createRequire('/opt/npm-tools/node_modules/')('playwright'); }
const { chromium } = playwright;

const BASE = process.env.BASE_URL || 'http://localhost:8080/';
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

const { DIAGNOSIS } = await import('../assets/js/content/diagnosis.js');
const { PROBLEM_BY_ID } = await import('../assets/js/content/problems.js');
const { makeVariant } = await import('../assets/js/content/generators.js');

let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) failures++; };

const browser = await chromium.launch();

async function run(viewport, tag) {
  const ctx = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_TUNNEL|ERR_NAME|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  const shot = async (name) => { if (shotsDir) await page.screenshot({ path: `${shotsDir}/${tag}-${name}.png`, fullPage: true }); };

  await page.goto(BASE + '#/');
  await page.waitForSelector('h1');
  await shot('home-empty');
  ok(await page.locator('text=수준 진단 시작').count() > 0, `[${tag}] 첫 화면에 진단 안내가 보인다`);

  // ── 진단: 앞 8문제는 정답(확실), 나머지는 오답(확실)으로 응답
  await page.goto(BASE + '#/diagnosis');
  await page.click('button:has-text("진단 시작")');
  for (let i = 0; i < DIAGNOSIS.length; i++) {
    const q = DIAGNOSIS[i];
    const right = i < 8;
    if (q.type === 'mc') {
      const k = right ? q.answer : (q.answer + 1) % 5;
      await page.click(`[data-opt="${k}"]`);
    } else {
      await page.fill('.short-in', right ? q.answer : '999');
    }
    if (i === 2) await page.click('[data-act="hint"]');
    await page.click(`[data-conf="${i === 1 ? 'guess' : 'sure'}"]`);
    if (i === 0) await shot('diag-question');
    await page.click('[data-act="next"]');
  }
  await page.waitForSelector('text=진단 결과');
  await shot('diag-result');
  const lead = await page.locator('.lead').first().textContent();
  ok(new RegExp(`${DIAGNOSIS.length}문제 중 8문제 정답`).test(lead), `[${tag}] 진단 결과에 정답 수가 맞게 나온다 (${lead.trim()})`);
  ok(await page.locator('svg.radar polygon.rd-area').count() === 1, `[${tag}] 레이더 차트가 그려진다`);
  ok(await page.locator('text=확신했는데 틀린 문제').count() === 1, `[${tag}] 확신 오답이 따로 표시된다`);

  // ── 문제 풀이: u1-05 (단답형, 정답 1)
  const p = PROBLEM_BY_ID['u1-05'];
  await page.goto(BASE + '#/p/u1-05');
  await page.waitForSelector('.q-text .katex');
  ok(await page.locator('[data-hint="2"]').isDisabled(), `[${tag}] 2단계 힌트는 1단계를 열기 전엔 잠겨 있다`);
  await page.fill('.short-in', '4');
  await page.click('.short-form button[type="submit"]');
  await page.waitForSelector('.fb-wrong');
  ok(await page.locator('.mark-wrong').count() === 1, `[${tag}] 오답이면 빗금 표시`);
  await page.click('[data-reason="조건 누락"]');
  await page.click('[data-hint="1"]');
  await page.click('[data-ask] > summary');
  ok(!(await page.locator('[data-hint="2"]').isDisabled()), `[${tag}] 1단계를 열면 2단계가 열린다`);
  await page.fill('[data-note]', 'R(x)=a(x-1)^2+x+2 로 두었다');
  await page.fill('[data-question]', '왜 이렇게 두나요?');
  await page.click('.prompt-preview summary');
  await page.waitForFunction(() => document.querySelector('[data-preview]').textContent.length > 0);
  const prompt = await page.locator('[data-preview]').textContent();
  ok(prompt.includes('R(x)=a(x-1)^2+x+2') && prompt.includes('1단계') && !prompt.includes('정답: 1'), `[${tag}] AI 질문에 풀이 메모와 본 힌트가 들어가고 정답은 빠진다`);
  await page.fill('.short-in', p.answer);
  await page.click('.short-form button[type="submit"]');
  await page.waitForSelector('.fb-right');
  ok(await page.locator('.mark-right').count() === 1, `[${tag}] 정답이면 동그라미 표시`);
  await page.waitForTimeout(700);
  await shot('problem-solved');

  // ── AI 버튼: 새 창이 claude.ai 로 열린다
  const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), page.click('[data-ai="claude"]')]);
  ok(popup && popup.url().startsWith('https://claude.ai/new?q='), `[${tag}] Claude 버튼이 질문을 채운 주소로 연다`);
  if (popup) await popup.close();

  // ── 객관식 u4-03
  await page.goto(BASE + '#/p/u4-03');
  await page.waitForSelector('.opt');
  await page.click(`[data-opt="${PROBLEM_BY_ID['u4-03'].answer}"]`);
  await page.click('[data-act="submit"]');
  await page.waitForSelector('.fb-right');
  ok(true, `[${tag}] 객관식 채점`);

  // ── 오답노트: u1-05 가 원인과 함께 있고, 오늘은 복습 대상이 아님
  await page.goto(BASE + '#/review');
  await page.waitForSelector('.wn');
  ok(await page.locator('.wn-reason:has-text("조건 누락")').count() === 1, `[${tag}] 오답노트에 원인이 기록된다`);
  await shot('review');

  // 복습일을 오늘로 당겨 복습 흐름 확인
  await page.evaluate(() => {
    const k = 'mathpulse:v2';
    const s = JSON.parse(localStorage.getItem(k));
    s.wrong['u1-05'].due = '2000-01-01';
    localStorage.setItem(k, JSON.stringify(s));
  });
  await page.goto(BASE + '#/p/u1-05?review=1');
  await page.reload();
  await page.waitForSelector('.banner');
  await page.fill('.short-in', p.answer);
  await page.click('.short-form button[type="submit"]');
  await page.waitForSelector('text=복습 통과');
  const stage = await page.evaluate(() => JSON.parse(localStorage.getItem('mathpulse:v2')).wrong['u1-05'].stage);
  ok(stage === 1, `[${tag}] 힌트 없이 복습을 통과하면 다음 단계로 (stage=${stage})`);

  // ── #1 회귀: URL 매개변수로 HTML을 끼워 넣을 수 없다
  for (const payload of ['"><img src=x onerror="window.__xss=1">', "'><span id=injected>x</span>", 'u1-01" onmouseover="window.__xss=1', 'u1-01&s=1#<b>', '<script>window.__xss=1</script>']) {
    await page.goto(BASE + '#/v/g-sym?' + new URLSearchParams({ s: '123', from: payload, review: payload }).toString());
    await page.waitForSelector('.banner.variant');
    const injected = await page.evaluate(() => ({
      xss: window.__xss === 1,
      img: !!document.querySelector('#view img'),
      span: !!document.getElementById('injected'),
      script: !!document.querySelector('#view script'),
      back: !!document.querySelector('.pager a[href^="#/p/"]'),
      hrefs: [...document.querySelectorAll('#view a')].map((a) => a.getAttribute('href')).filter((h) => /[<>"']/.test(h)),
    }));
    ok(!injected.xss && !injected.img && !injected.span && !injected.script && !injected.back && injected.hrefs.length === 0, `[${tag}] 조작된 from/review 값은 무시되고 HTML로 해석되지 않는다 (${payload.slice(0, 18)}…)`);
  }
  await page.goto(BASE + '#/v/g-sym?s=123&from=u1-01');
  await page.waitForSelector('.banner.variant');
  ok((await page.getAttribute('.pager a:has-text("원래 문제로")', 'href')) === '#/p/u1-01', `[${tag}] 정상 from 값이면 원래 문제로 돌아가는 링크가 생긴다`);

  // ── 그림 문제가 그려진다
  await page.goto(BASE + '#/p/u2-24');
  await page.waitForSelector('figure.fig svg.plot path.pl-curve');
  ok(true, `[${tag}] 그림 문제에 그래프가 그려진다`);
  await shot('problem-figure');

  // ── 비슷한 문제(숫자 바꾸기)
  await page.goto(BASE + '#/p/u1-01');
  await page.waitForSelector('.q-text .katex');
  await page.click('.pager a:has-text("비슷한 문제 풀기")');
  await page.waitForSelector('.banner.variant');
  const vurl = new URL(page.url());
  const [vkey, vq] = vurl.hash.replace('#/v/', '').split('?');
  const vseed = Number(new URLSearchParams(vq).get('s'));
  const vp = makeVariant(vkey, vseed);
  ok(vkey === 'g-sym' && Number.isFinite(vseed), `[${tag}] 비슷한 문제 화면으로 이동 (${vkey})`);
  if (vp.type === 'mc') { await page.click(`[data-opt="${vp.answer}"]`); await page.click('[data-act="submit"]'); }
  else { await page.fill('.short-in', vp.answer); await page.click('.short-form button[type="submit"]'); }
  await page.waitForSelector('.fb-right');
  const prac = await page.evaluate(() => JSON.parse(localStorage.getItem('mathpulse:v2')).practice['g-sym']);
  ok(prac && prac.solved === 1, `[${tag}] 비슷한 문제 연습이 기록된다`);
  await shot('variant');

  // ── 숫자를 바꾼 문제로 오답 복습
  await page.goto(BASE + '#/p/u1-04');
  await page.waitForSelector('.opt');
  await page.click(`[data-opt="${(PROBLEM_BY_ID['u1-04'].answer + 1) % 5}"]`);
  await page.click('[data-act="submit"]');
  await page.waitForSelector('.fb-wrong');
  await page.evaluate(() => { const k = 'mathpulse:v2'; const s = JSON.parse(localStorage.getItem(k)); s.wrong['u1-04'].due = '2000-01-01'; localStorage.setItem(k, JSON.stringify(s)); });
  await page.goto(BASE + '#/p/u1-04?review=1');
  await page.reload();
  await page.click('.banner a:has-text("숫자를 바꾼 문제로 복습")');
  await page.waitForSelector('.banner.variant');
  const rurl = new URL(page.url());
  const [rkey, rq] = rurl.hash.replace('#/v/', '').split('?');
  const rp = makeVariant(rkey, Number(new URLSearchParams(rq).get('s')));
  if (rp.type === 'mc') { await page.click(`[data-opt="${rp.answer}"]`); await page.click('[data-act="submit"]'); }
  else { await page.fill('.short-in', rp.answer); await page.click('.short-form button[type="submit"]'); }
  await page.waitForSelector('text=복습 통과');
  const st2 = await page.evaluate(() => JSON.parse(localStorage.getItem('mathpulse:v2')).wrong['u1-04'].stage);
  ok(st2 === 1, `[${tag}] 숫자를 바꾼 문제로 복습해도 복습 단계가 오른다 (stage=${st2})`);

  // ── 이미 푼 문제를 다시 열면 지난 답과 채점 표시가 남아 있다
  await page.goto(BASE + '#/p/u1-05');
  await page.waitForSelector('.mark.static');
  ok((await page.inputValue('.short-in')) === PROBLEM_BY_ID['u1-05'].answer, `[${tag}] 푼 문제를 다시 열면 지난 답이 보인다`);

  // ── 리포트
  await page.goto(BASE + '#/report');
  await page.waitForSelector('.stats');
  ok(await page.locator('svg.radar polygon.rd-area').count() === 2, `[${tag}] 리포트에 진단과 현재 역량이 함께 그려진다`);
  await shot('report');

  // ── 단원, 홈
  await page.goto(BASE + '#/u/u2');
  await page.waitForSelector('.concept .katex');
  await shot('unit');
  await page.goto(BASE + '#/');
  await page.waitForSelector('.next-problem');
  await shot('home');

  // ── 백업 내보내기
  await page.goto(BASE + '#/settings');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="export"]')]);
  ok(/mathpulse-backup-\d{4}-\d\d-\d\d\.json/.test(dl.suggestedFilename()), `[${tag}] 백업 파일을 내려받는다`);

  // ── #2 회귀: 잘못된 백업은 거절하고 기존 기록을 그대로 둔다, 정상 백업은 다시 불러온다
  const savedBefore = await page.evaluate(() => localStorage.getItem('mathpulse:v2'));
  await page.setInputFiles('input[data-act="import"]', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, diagnoses: [{ track: 'invalid' }] } })) });
  await page.waitForFunction(() => /기존 기록은 그대로/.test(document.getElementById('toast').textContent));
  ok((await page.evaluate(() => localStorage.getItem('mathpulse:v2'))) === savedBefore, `[${tag}] 잘못된 백업을 가져오면 거절하고 기존 기록을 그대로 둔다`);
  const goodPath = await dl.path();
  await page.setInputFiles('input[data-act="import"]', goodPath);
  await page.waitForFunction(() => /백업을 불러왔어요/.test(document.getElementById('toast').textContent));
  ok(await page.locator('h1:has-text("설정")').count() === 1, `[${tag}] 내려받은 백업을 다시 불러온다`);

  // ── 좁은 화면: 연습장 전체 화면
  if (viewport.width < 1100) {
    await page.goto(BASE + '#/p/u1-05');
    await page.click('[data-act="pad-open"]');
    await page.waitForSelector('.study-pad.is-full canvas');
    const box = await page.locator('.study-pad.is-full canvas').boundingBox();
    ok(box && box.height > viewport.height * 0.6, `[${tag}] 연습장을 전체 화면으로 연다`);
    await page.mouse.move(box.x + 40, box.y + 40); await page.mouse.down(); await page.mouse.move(box.x + 160, box.y + 120); await page.mouse.up();
    await shot('pad-full');
    await page.click('[data-act="pad-close"]');
    ok(!(await page.locator('.study-pad.is-full').count()), `[${tag}] 연습장을 닫는다`);
  }

  // ── 다크 모드
  await page.goto(BASE + '#/settings');
  await page.click('[data-theme="dark"]');
  await page.goto(BASE + '#/p/u2-10');
  await page.waitForSelector('.q-text .katex');
  await shot('problem-dark');

  ok(errors.length === 0, `[${tag}] 스크립트 오류 없음${errors.length ? ': ' + errors.join(' | ') : ''}`);
  await ctx.close();
}

await run({ width: 1366, height: 900 }, 'desktop');
await run({ width: 390, height: 844 }, 'mobile');
await browser.close();
console.log(failures ? `\n실패 ${failures}건` : '\n모든 테스트 통과');
process.exit(failures ? 1 : 0);
