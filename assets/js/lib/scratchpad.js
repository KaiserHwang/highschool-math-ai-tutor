// 디지털 연습장: 펜·손가락·마우스 필기, 지우개, 되돌리기, 그림 저장.
// 펜(스타일러스)을 한 번 쓰면 손가락 터치는 스크롤로 남겨 두어 손바닥이 닿아도 선이 그어지지 않는다.
const memory = new Map(); // 문제별 필기(세션 동안 유지)

export function mountScratchpad(root, key) {
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let strokes = memory.get(key) || [];
  let current = null;
  let tool = 'pen';
  let color = 'ink';
  let penSeen = false;
  const dpr = () => window.devicePixelRatio || 1;

  const css = getComputedStyle(document.documentElement);
  const colorOf = (c) => (c === 'red' ? css.getPropertyValue('--red-pen').trim() : c === 'blue' ? css.getPropertyValue('--blue-pen').trim() : css.getPropertyValue('--ink').trim());

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    canvas.width = Math.round(r.width * dpr());
    canvas.height = Math.round(r.height * dpr());
    redraw();
  }

  function drawStroke(s) {
    if (s.pts.length < 1) return;
    ctx.save();
    ctx.scale(dpr(), dpr());
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (s.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 22;
    } else {
      ctx.strokeStyle = colorOf(s.color);
      ctx.lineWidth = 2.2;
    }
    ctx.beginPath();
    const [x0, y0] = s.pts[0];
    ctx.moveTo(x0, y0);
    if (s.pts.length === 1) ctx.lineTo(x0 + 0.1, y0 + 0.1);
    for (let i = 1; i < s.pts.length - 1; i++) {
      const [x1, y1] = s.pts[i];
      const [x2, y2] = s.pts[i + 1];
      ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
    }
    if (s.pts.length > 1) ctx.lineTo(...s.pts[s.pts.length - 1]);
    ctx.stroke();
    ctx.restore();
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(drawStroke);
  }

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  function down(e) {
    if (e.pointerType === 'pen') penSeen = true;
    if (penSeen && e.pointerType === 'touch') return; // 손바닥 무시
    if (e.button > 0) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    current = { tool, color, pts: [pos(e)] };
    strokes.push(current);
    drawStroke(current);
  }
  function move(e) {
    if (!current) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) current.pts.push(pos(ev));
    redraw();
  }
  function up() {
    if (!current) return;
    current = null;
    memory.set(key, strokes);
  }

  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  // 펜을 쓰기 전에는 터치로도 그릴 수 있게, 펜을 쓴 뒤에는 터치 스크롤 허용
  canvas.style.touchAction = 'none';

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pad]');
    if (!b) return;
    const act = b.dataset.pad;
    if (act === 'pen' || act === 'eraser') {
      tool = act;
    } else if (act === 'ink' || act === 'red' || act === 'blue') {
      tool = 'pen';
      color = act;
    } else if (act === 'undo') {
      strokes.pop();
      memory.set(key, strokes);
      redraw();
    } else if (act === 'clear') {
      strokes = [];
      memory.set(key, strokes);
      redraw();
    } else if (act === 'save') {
      save();
    }
    root.querySelectorAll('[data-pad]').forEach((x) => {
      const on = (x.dataset.pad === 'eraser' && tool === 'eraser') || (tool === 'pen' && x.dataset.pad === color);
      if (['ink', 'red', 'blue', 'eraser'].includes(x.dataset.pad)) x.setAttribute('aria-pressed', String(on));
    });
  });

  function save() {
    // 배경을 흰 종이로 채워 PNG로 저장 (AI에게 사진으로 첨부할 때 사용)
    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    const o = out.getContext('2d');
    o.fillStyle = '#ffffff';
    o.fillRect(0, 0, out.width, out.height);
    o.drawImage(canvas, 0, 0);
    const a = document.createElement('a');
    a.download = `연습장-${key}.png`;
    a.href = out.toDataURL('image/png');
    a.click();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  return () => {
    ro.disconnect();
    memory.set(key, strokes);
  };
}

export function scratchpadHTML() {
  return `
  <div class="pad" data-pad-root>
    <div class="pad-tools" role="toolbar" aria-label="연습장 도구">
      <button type="button" class="pad-swatch sw-ink" data-pad="ink" aria-pressed="true" aria-label="검정 펜"></button>
      <button type="button" class="pad-swatch sw-blue" data-pad="blue" aria-pressed="false" aria-label="파랑 펜"></button>
      <button type="button" class="pad-swatch sw-red" data-pad="red" aria-pressed="false" aria-label="빨강 펜"></button>
      <button type="button" class="pad-btn" data-pad="eraser" aria-pressed="false">지우개</button>
      <span class="pad-gap"></span>
      <button type="button" class="pad-btn" data-pad="undo">되돌리기</button>
      <button type="button" class="pad-btn" data-pad="clear">모두 지우기</button>
      <button type="button" class="pad-btn" data-pad="save" title="AI에게 사진으로 보여줄 때 사용">그림 저장</button>
    </div>
    <canvas class="pad-canvas" aria-label="연습장. 펜이나 손가락으로 풀이를 쓰세요."></canvas>
  </div>`;
}
