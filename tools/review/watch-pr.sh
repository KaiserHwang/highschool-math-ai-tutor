#!/usr/bin/env bash
# PR 감시: Codex·agy 댓글 도착과 CI 결과를 한 줄씩 알리고, 두 리뷰가 모두 오면 끝난다.
# 사용: bash tools/review/watch-pr.sh <PR 번호>
# 다시 켤 때 이미 알린 것은 SEEN="Codex" CI_DONE=1 처럼 넘겨 같은 알림을 막는다. 필요: gh(로그인)
set -u
pr="${1:?PR 번호를 주세요}"; seen="${SEEN:-}"; ci="${CI_DONE:-}"
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 1
while true; do
  bodies=$(gh pr view "$pr" --json comments,reviews --jq '[.comments[].body, .reviews[].body] | map(ltrimstr("\ufeff") | .[0:6]) | .[]' 2>/dev/null || true)
  for who in Codex agy; do
    if ! grep -q "$who" <<<"$seen" && grep -q "^$who" <<<"$bodies"; then echo "PR #$pr 리뷰 도착: $who"; seen="$seen $who"; fi
  done
  if [ -z "$ci" ]; then
    st=$(gh pr checks "$pr" --json bucket --jq '.[].bucket' 2>/dev/null | sort -u | tr '\n' ' ')
    case "$st" in *fail*|*cancel*) echo "PR #$pr CI 실패: $st"; ci=1;; *pending*|"") ;; *) echo "PR #$pr CI 통과: $st"; ci=1;; esac
  fi
  if grep -q Codex <<<"$seen" && grep -q agy <<<"$seen"; then echo "PR #$pr 두 리뷰 모두 도착"; exit 0; fi
  sleep 60
done