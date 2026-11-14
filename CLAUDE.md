# MathPulse 작업 규칙

2022 개정 고1 공통수학1·2 개념 학습 웹앱. 빌드 단계가 없는 정적 사이트(순수 ES 모듈)이고, 기록은 브라우저 localStorage에만 저장한다. 제품 방향과 설계 원칙은 `docs/SERVICE_PLAN.md`, 기능 설명과 파일 구조는 `README.md`에 있다.

## 명령

```bash
npm run serve      # http://localhost:8080 에서 앱 실행
npm run gen        # docs/COVERAGE.md 와 sw.js 다시 만들기
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

## 콘텐츠를 고칠 때

- **문항을 추가하거나 정답을 바꾸면 독립 계산도 함께 고친다.** 문제 은행·진단은 `tests/verify_answers.py`(`verify_extra.py`, `verify_ladder.py`), 개념 학습은 `tests/verify_lessons.py`(`verify_plus.py`), 생성기는 `tests/gen-check.mjs`. 풀이와 다른 방법(전수 조사, 기호 계산)으로 계산해야 한다.
- **id는 바꾸거나 재사용하지 않는다.** 문제(`u1-05`), 소단원(`u2-l3`), 확인 문제(`u2-l3-c1`), 심화 확인(`-d1`), 개념 질문(`-q1`), 생성기(`g-sym`)의 id는 학습 기록의 키다. 앱에 없는 id의 기록은 불러올 때 버려지므로, id가 바뀌면 사용자 기록이 사라진다.
- 단답형 정답은 정수 또는 기약분수 문자열(`"-3"`, `"10/3"`), 객관식 정답은 0부터 시작하는 보기 번호.
- 콘텐츠 문자열은 `$...$` 수식과 허용된 태그만 쓴다(문항: `p br ul ol li strong em span`, 개념 본문은 `div table` 계열 추가). 그림에는 10자 넘는 `alt`가 필요하다.
- 개념 질문은 정답 보기와 정답 이유를 맨 앞(0번)에 두고 작성한다. 화면에 낼 때 `lessons/index.js`가 id 기준으로 섞는다. 틀린 이유마다 `misconceptions.js`의 오개념 키를 붙인다.
- 교육과정 범위를 지킨다: 외분점 제외, 행렬은 2×2 이하 연산까지(역행렬·행렬식 제외).

## 코드를 고칠 때

- 학습 판정 로직(채점, 숙련도, 간격 복습, 추천)은 `assets/js/model.js`에 두고 `tests/unit.mjs`에 회귀 검사를 추가한다. 화면 파일(`views/`)에만 있는 로직은 Node 검사로 잡히지 않는다.
- 사용자 입력과 URL 매개변수는 신뢰하지 않는다. 화면에 넣을 때 `esc()`/`texUser()`를 쓰고, URL에서 온 id는 실제 존재하는 값일 때만 받는다. `tex()`는 앱이 작성한 콘텐츠에만 쓴다.
- 저장 형식(`assets/js/backup.js`의 `blankState`, `checkState`)을 바꾸면 예전 기록·백업을 계속 읽을 수 있어야 하고, 내보내기→가져오기 왕복 검사(`tests/unit.mjs`)를 함께 고친다.
- 날짜는 현지 날짜 문자열(`today()`, `addDays()`, `localDay()`)로만 비교한다.
- 화면 문구는 한국어, 학생에게 말하는 해요체. 점수는 내신 등급이나 수능 성적으로 환산하거나 예측하지 않는다.
