#!/usr/bin/env bash
# PR 검토 요청: Codex와 agy에게 같은 지침(review-prompt.md)으로 PR 검토를 맡긴다. 둘 다 PR에 댓글 하나씩 남긴다.
# 사용: bash tools/review/request-review.sh <PR 번호>
# 필요: gh(로그인), codex, agy가 PATH에 있어야 한다. 로그는 ${REVIEW_LOG_DIR:-$TMPDIR/mathpulse-review}에 남는다.
# 두 리뷰어는 이 저장소 폴더에서 실행되지만 지침에 따라 파일을 고치지 않고, 검사는 별도 사본에서 한다.
# 여러 PR을 한꺼번에 돌리면 사용량 한도에 걸리기 쉬우니 하나가 끝난 뒤 다음 것을 돌린다.
set -u
pr="${1:?PR 번호를 주세요}"
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
LOG="${REVIEW_LOG_DIR:-${TMPDIR:-/tmp}/mathpulse-review}"; mkdir -p "$LOG"
for who in Codex agy; do
  sed -e "s/{{PR}}/$pr/g" -e "s/{{WHO}}/$who/g" "$HERE/review-prompt.md" > "$LOG/review-$pr-$who.md"
done
( cd "$REPO" && codex exec -s danger-full-access -c approval_policy='"never"' --skip-git-repo-check - < "$LOG/review-$pr-Codex.md" > "$LOG/review-$pr-Codex.log" 2>&1; echo "codex exit $?" >> "$LOG/review-$pr-Codex.log" ) &
( cd "$REPO" && agy -p "$(cat "$LOG/review-$pr-agy.md")" --dangerously-skip-permissions --print-timeout 0 > "$LOG/review-$pr-agy.log" 2>&1; echo "agy exit $?" >> "$LOG/review-$pr-agy.log" ) &
wait
echo "검토 요청 종료: PR #$pr (로그: $LOG)"