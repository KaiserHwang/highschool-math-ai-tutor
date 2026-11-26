# MathPulse 작업 규칙

이 파일이 작업 규칙의 원본이다. 사람과 모든 코딩 에이전트(Claude Code, Codex, Gemini CLI 등)가 같은 규칙을 따른다. `CLAUDE.md`와 `GEMINI.md`는 이 파일을 불러오기만 하므로, 규칙은 여기에서만 고친다.

2022 개정 교육과정 공통수학1·2, 대수, 미적분Ⅰ, 확률과 통계의 개념 학습 웹앱. 빌드 단계가 없는 정적 사이트(순수 ES 모듈)이고, 기록은 브라우저 localStorage에만 저장한다. 제품 방향과 설계 원칙은 `docs/SERVICE_PLAN.md`, 기능 설명과 파일 구조는 `README.md`에 있다.

## 명령

```bash
npm run serve      # http://localhost:8080 에서 앱 실행
npm run gen        # tests/ids.json, docs/COVERAGE.md, sw.js 다시 만들기
npm run test:js    # 회귀 검사 + 생성기 검사 + 콘텐츠 검사 (Node만 필요)
npm run verify     # 정답 독립 검증 (Python 3 + sympy 필요)
npm test           # test:js + verify 전체
npm run test:e2e   # 브라우저 종단 테스트 (서버 실행 중, playwright 설치 필요)
```

Windows, macOS, Linux에서 같은 명령을 쓴다. 파이썬 실행 파일 이름 차이(`python`/`python3`)는 `tools/py.mjs`가 처리한다.

## 반드시 지킬 것

- **`index.html`, `manifest.webmanifest`, `assets/` 아래 파일을 고쳤으면 커밋 전에 `npm run gen`을 실행한다.** `sw.js`의 버전은 이 파일들의 내용 해시이고, `tests/content-check.mjs`가 `sw.js`와 `docs/COVERAGE.md`가 최신인지 검사한다. 두 파일은 자동 생성물이므로 직접 고치지 않는다.
- **커밋 전에 검사를 돌린다.** 앱 로직(`assets/js/`의 콘텐츠 밖 파일)만 고쳤으면 `npm run test:js`, 문항·정답·개념 학습 콘텐츠를 고쳤으면 `npm test`.
- **`main`에 직접 푸시하지 않는다.** `main` 루트가 GitHub Pages로 바로 배포된다. 브랜치에서 작업하고 PR의 검사가 통과한 뒤 병합한다.
- **줄바꿈은 LF**(`.gitattributes`로 고정). 해시와 파일 비교가 바이트 단위라 CRLF가 섞이면 콘텐츠 검사가 실패한다.

## 여러 사람·에이전트가 함께 작업할 때

- **시작하기 전에 `git pull`로 `main`을 최신으로 맞추고, 작업마다 새 브랜치를 만든다.** 브랜치 이름은 `종류/내용`(예: `fix/recheck-target`, `content/u3-problems`, `chore/ci`).
- **한 작업 폴더는 한 번에 한 작업자만 쓴다.** 동시에 작업하려면 폴더를 따로 클론하거나 `git worktree`로 나눈다. 다른 작업자가 만든 커밋되지 않은 변경은 되돌리거나 덮어쓰지 않는다.
- **요청받은 범위만 고친다.** 범위 밖에서 발견한 문제는 고치지 말고 GitHub 이슈로 남긴다. 이슈에는 재현 방법, 관련 파일, 기대 동작을 적는다.
- **인계는 저장소에 남긴다.** 무엇을 왜 바꿨고 어떻게 확인했는지 PR 본문에 적는다. 다음 작업자는 대화 기록을 볼 수 없으므로 이슈·PR·커밋 메시지만으로 이어받을 수 있어야 한다.
- **병합 기준은 누구에게나 같다.** PR의 GitHub Actions 검사가 통과해야 하고, 검사를 건너뛰거나 실패한 검사를 지우는 식으로 통과시키지 않는다.
- 커밋 메시지와 PR은 한국어로, 첫 줄에 무엇을 바꿨는지 쓴다.

## PR 검토와 로컬 확인

- **PR 검토는 Codex와 agy 두 리뷰어에게 같은 지침으로 맡긴다.** `bash tools/review/request-review.sh <PR 번호>`가 `tools/review/review-prompt.md`의 지침으로 두 리뷰어를 실행한다. 각 리뷰어는 PR에 댓글 하나를 남기고, 첫 줄은 `Codex` 또는 `agy`다. 진행 상황은 `bash tools/review/watch-pr.sh <PR 번호>`로 본다(두 리뷰와 CI 결과를 한 줄씩 알림). `gh`, `codex`, `agy`가 PATH에 있어야 한다. 여러 PR을 한꺼번에 맡기면 사용량 한도에 걸리기 쉬우니 하나가 끝난 뒤 다음 것을 맡긴다.
- **검토 의견에는 PR 댓글로 답한다.** 반영한 것, 반영하지 않은 것과 이유, 범위 밖이라 이슈로 나눈 것을 적고, 의견을 반영한 커밋을 올린 뒤 CI가 통과하면 병합한다.
- **PR 본문에는 "검토 부탁" 항목을 적는다.** 리뷰어 지침이 이 항목에 하나씩 답하게 되어 있다.
- **로컬 브라우저 테스트**: `npm run serve`(또는 `python -m http.server 8080`)로 앱을 띄우고 `npm run test:e2e`를 실행한다. 다른 주소면 `BASE_URL`, Playwright 브라우저를 따로 받지 않았으면 설치된 브라우저를 `E2E_CHANNEL=msedge`(또는 `chrome`)로 지정한다. Windows의 Edge로 돌리면 "Claude 버튼이 질문을 채운 주소로 연다" 2건(데스크톱·모바일)이 실패하지만 CI에서는 통과한다. 원인은 확인하지 못했고, 이 2건만 실패하면 정상으로 본다.

## 콘텐츠를 고칠 때

- **문항을 추가하거나 정답을 바꾸면 독립 계산도 함께 고친다.** 문제 은행·진단은 `tests/verify_answers.py`(`verify_extra.py`, `verify_ladder.py`), 개념 학습은 `tests/verify_lessons.py`(`verify_plus.py`), 생성기는 `tests/gen-check.mjs`. 풀이와 다른 방법(전수 조사, 기호 계산)으로 계산해야 한다.
- **id는 바꾸거나 재사용하지 않는다.** 문제(`u1-05`), 소단원(`u2-l3`), 확인 문제(`u2-l3-c1`), 심화 확인(`-d1`), 개념 질문(`-q1`), 생성기(`g-sym`)의 id는 학습 기록의 키다. 앱에 없는 id의 기록은 불러올 때 버려지므로, id가 바뀌면 사용자 기록이 사라진다. 한 번 내보낸 id는 `tests/ids.json`에 적혀 있고(`npm run gen`이 새 id를 더한다), 거기 있는 id가 사라지면 콘텐츠 검사가 실패한다.
- **id 형식은 `assets/js/lib/ids.js`에 있다.** 단원은 영문 소문자 한 글자 + 번호(`u1`, `a10`), 소단원은 `단원-l번호`, 문제는 `단원-두 자리 번호`, 생성기는 `g-이름`. `g`는 생성기 접두어라 단원에 쓰지 않는다. 항목의 `unit` 필드와 id의 앞부분은 같아야 한다.
- 단답형 정답은 정수 또는 기약분수 문자열(`"-3"`, `"10/3"`), 객관식 정답은 0부터 시작하는 보기 번호.
- 콘텐츠 문자열은 `$...$` 수식과 허용된 태그만 쓴다(문항: `p br ul ol li strong em span`, 개념 본문은 `div table` 계열 추가). 그림에는 10자 넘는 `alt`가 필요하다.
- 개념 질문은 정답 이유를 맨 앞(0번)에 두고 작성한다. 정답 보기는 `answer`로 표시하며 0번이 아니어도 된다. 화면에 낼 때 `lessons/index.js`가 id 기준으로 섞는다. 틀린 이유마다 `misconceptions.js`의 오개념 키를 붙인다.
- **이미 있는 개념 질문의 보기(`options`)와 이유(`reasons`)는 순서를 바꾸거나 중간에 끼워 넣거나 지우지 않는다.** 학습 기록은 고른 보기의 번호로 남으므로, 순서나 개수가 바뀌면 예전 기록이 다른 보기를 가리키게 된다. 문장을 고칠 때는 같은 자리에서 고친다.
- **이미 있는 소단원에 확인 문제를 더할 때는 맨 뒤에 두고 `added: 'YYYY-MM-DD'`(추가한 날)를 붙인다.** "혼자 확인"과 배운 날, 첫 복습 예정일은 확인 문제 목록으로 다시 계산한다. `added`가 없으면 이미 원래 문제를 다 맞힌 학생의 완료가 풀린다. `added`가 있으면, 그 날 전에 원래 문제를 다 맞힌 기록에서는 새 문제를 판정에서 뺀다(`model.js`의 `requiredChecks`).
- 교육과정 범위를 지킨다: 외분점 제외, 행렬의 계산(덧셈·실수배·곱셈)은 2×2 이하까지(역행렬·행렬식 제외). 행렬의 꼴이나 연산이 정의되는지를 묻는 문항은 기존 소단원과 같이 2×3 같은 꼴을 쓸 수 있다.

## 코드를 고칠 때

- **id를 잘라서 단원을 알아내지 않는다.** 어느 단원인지는 항목의 `unit` 필드나 `content/registry.js`의 `unitOf`로 찾는다. 특정 단원 id(`'u8'` 등)를 코드에서 직접 비교하지 않고 단원의 속성(`kind: 'fusion'`, `isFusion`, `REGULAR_UNITS`)을 쓴다.
- **"오늘 할 일"을 만드는 계산은 공부하는 과목 안에서만 한다.** 추천, 약한 단원, 복습 목록, 집계에는 `UNITS`·`LESSONS`·`PROBLEMS` 전체가 아니라 `activeUnits()`·`activeLessons()`·`activeProblems()`를 쓴다. 소단원·문제 화면, 개념 지도, 선수 개념 역추적은 과목을 가리지 않는다. 화면 문구에 과목 이름을 직접 쓰지 않고 `activeCourseTitles()`나 `courseTitle(unit)`에서 가져온다.
- 학습 판정 로직(채점, 숙련도, 간격 복습, 추천)은 `assets/js/model.js`에 두고 `tests/unit.mjs`에 회귀 검사를 추가한다. 화면 파일(`views/`)에만 있는 로직은 Node 검사로 잡히지 않는다.
- 사용자 입력과 URL 매개변수는 신뢰하지 않는다. 화면에 넣을 때 `esc()`/`texUser()`를 쓰고, URL에서 온 id는 실제 존재하는 값일 때만 받는다. `tex()`는 앱이 작성한 콘텐츠에만 쓴다.
- 저장 형식(`assets/js/backup.js`의 `blankState`, `checkState`)을 바꾸면 예전 기록·백업을 계속 읽을 수 있어야 하고, 내보내기→가져오기 왕복 검사(`tests/unit.mjs`)를 함께 고친다.
- 날짜는 현지 날짜 문자열(`today()`, `addDays()`, `localDay()`)로만 비교한다.
- 화면 문구는 한국어, 학생에게 말하는 해요체. 점수는 내신 등급이나 수능 성적으로 환산하거나 예측하지 않는다.
