#!/usr/bin/env bash
# lint-colors.sh — fail CI if legacy pre-rebrand palette hexes reappear in source.
#
# The 2026-04-21 theme refresh (PR A1, issue #72) migrated all legacy blues to
# the brand-guide tonal scale. This guard prevents regression.
#
# Allowed: docs/ (historical records), tests/ (Playwright snapshots), node_modules/.
# Forbidden everywhere else: #3B7BF2, #2D6AE0, #6B9AEA, #1B4FBA, #6366F1,
# #0EA5E9, and their rgba() equivalents.
#
# Exit 0 if clean, 1 if any legacy hex is found.

set -euo pipefail

PATTERN='#3B7BF2|#2D6AE0|#6B9AEA|#1B4FBA|#6366F1|#0EA5E9|#22D3EE|rgba\(59, ?123, ?242|rgba\(99, ?102, ?241|rgba\(14, ?165, ?233|rgba\(15, ?23, ?42|rgba\(34, ?211, ?238'

# Search app/ components/ lib/ data/ — the live source tree.
# Grep returns 0 if matches found (bad), 1 if none (good). Invert semantics.
if matches=$(grep -RniE "${PATTERN}" app/ components/ lib/ data/ 2>/dev/null); then
  echo "FAIL: Legacy pre-rebrand palette hexes detected in source."
  echo ""
  echo "${matches}"
  echo ""
  echo "Migration mapping (see docs/plans/2026-04-21-theme-refresh-and-phased-redesign.md):"
  echo "  #3B7BF2 → #3859a8 (--color-primary)"
  echo "  #2D6AE0 → #2a4688 (--color-primary-dark)"
  echo "  #6B9AEA → #8CA3CC (--color-primary-300)"
  echo "  #1B4FBA → #22396E (--color-primary-700)"
  echo "  #6366F1 → #3B82F6 (--color-accent, sapphire blue)"
  echo "  #0EA5E9 → #3B82F6 (--color-accent, sapphire blue)"
  echo "  #22D3EE → #3B82F6 (retired cyan accent → new sapphire)"
  echo "  rgba(59,123,242,X) → rgba(56,89,168,X)"
  echo "  rgba(99,102,241,X) → rgba(34,211,238,X)"
  echo "  rgba(14,165,233,X) → rgba(59,130,246,X)"
  echo "  rgba(15,23,42,X)   → rgba(15,17,41,X)"
  echo "  rgba(34,211,238,X) → rgba(59,130,246,X)"
  exit 1
fi

echo "OK: No legacy palette hexes found in app/ components/ lib/ data/."
exit 0
