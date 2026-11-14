// 운영체제에 맞는 파이썬으로 스크립트를 실행한다(npm 스크립트용).
// Linux·macOS는 python3, Windows는 python(없으면 py)을 쓰고, 한글 출력이 깨지지 않게 UTF-8로 고정한다.
// 실행: node tools/py.mjs tests/verify_answers.py
import { spawnSync } from 'child_process';

const candidates = process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];
const env = { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };
const works = (cmd) => {
  const r = spawnSync(cmd, ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)'], { env, stdio: 'ignore' });
  return !r.error && r.status === 0;
};

const python = candidates.find(works);
if (!python) {
  console.error('파이썬 3.9 이상을 찾지 못했습니다. 설치한 뒤 터미널을 새로 열어 주세요.');
  process.exit(1);
}
const r = spawnSync(python, process.argv.slice(2), { env, stdio: 'inherit' });
process.exit(r.status ?? 1);
