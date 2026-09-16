#!/usr/bin/env bash
set -euo pipefail

# Gewitterradar source archive generator.
# Creates an immutable full-source ZIP and Git bundle from an exact Git commit.
# Usage:
#   scripts/create-source-archive.sh PRE_MERGE <git-ref> <version-label> [output-dir]
#   scripts/create-source-archive.sh GOLDEN_MASTER <git-ref> <version-label> [output-dir]

ARCHIVE_TYPE="${1:-}"
SOURCE_REF="${2:-}"
VERSION_LABEL="${3:-}"
OUTPUT_DIR="${4:-dist/source-archives}"

if [[ "$ARCHIVE_TYPE" != "PRE_MERGE" && "$ARCHIVE_TYPE" != "GOLDEN_MASTER" ]]; then
  echo "ERROR: archive type must be PRE_MERGE or GOLDEN_MASTER" >&2
  exit 2
fi
if [[ -z "$SOURCE_REF" || -z "$VERSION_LABEL" ]]; then
  echo "ERROR: source ref and version label are required" >&2
  exit 2
fi

for tool in git zip unzip sha256sum tar; do
  command -v "$tool" >/dev/null 2>&1 || {
    echo "ERROR: required tool not found: $tool" >&2
    exit 3
  }
done

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

TARGET_COMMIT="$(git rev-parse "${SOURCE_REF}^{commit}")"
SHORT_SHA="${TARGET_COMMIT:0:12}"
SNAPSHOT_DATE="${SNAPSHOT_DATE:-$(date -u +%F)}"
CREATED_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SAFE_LABEL="$(printf '%s' "$VERSION_LABEL" | tr -cs 'A-Za-z0-9._-' '_')"

mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"

if [[ "$ARCHIVE_TYPE" == "PRE_MERGE" ]]; then
  BASE_NAME="Gewitterradar_MAIN_PRE_${SAFE_LABEL}_${SNAPSHOT_DATE}_${SHORT_SHA}"
else
  BASE_NAME="Gewitterradar_${SAFE_LABEL}_GOLDEN_MASTER_${SNAPSHOT_DATE}_${SHORT_SHA}"
fi

ZIP_PATH="$OUTPUT_DIR/${BASE_NAME}.zip"
BUNDLE_PATH="$OUTPUT_DIR/${BASE_NAME}.bundle"
CHECKSUM_PATH="$OUTPUT_DIR/${BASE_NAME}_SHA256SUMS.txt"

if [[ -e "$ZIP_PATH" || -e "$BUNDLE_PATH" || -e "$CHECKSUM_PATH" ]]; then
  echo "ERROR: archive output already exists; immutable archives are never overwritten: $BASE_NAME" >&2
  exit 4
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  git update-ref -d "refs/archive-snapshot/${TARGET_COMMIT}" >/dev/null 2>&1 || true
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

ROOT_DIR="$TMP_DIR/$BASE_NAME"
META_DIR="$ROOT_DIR/_snapshot"
mkdir -p "$ROOT_DIR" "$META_DIR"

# Extract exactly the tracked tree of the resolved commit, not the working tree.
git archive "$TARGET_COMMIT" | tar -x -C "$ROOT_DIR"

TRACKED_ZLIST="$TMP_DIR/tracked-files.zlist"
git ls-tree -r -z --name-only "$TARGET_COMMIT" > "$TRACKED_ZLIST"
git -c core.quotePath=false ls-tree -r --name-only "$TARGET_COMMIT" > "$META_DIR/TRACKED_FILES.txt"
TRACKED_COUNT="$(wc -l < "$META_DIR/TRACKED_FILES.txt" | tr -d ' ')"

# Per-file SHA-256 values for every tracked file in the frozen tree.
(
  cd "$ROOT_DIR"
  while IFS= read -r -d '' path; do
    sha256sum -- "$path"
  done < "$TRACKED_ZLIST"
) > "$META_DIR/FILE_SHA256SUMS.txt"

cat > "$META_DIR/MANIFEST.txt" <<EOF
PROJECT=Gewitterradar
REPOSITORY=TheDaimos/gewitterradar
ARCHIVE_TYPE=$ARCHIVE_TYPE
VERSION_LABEL=$VERSION_LABEL
SOURCE_REF=$SOURCE_REF
COMMIT_SHA=$TARGET_COMMIT
COMMIT_SHA12=$SHORT_SHA
SNAPSHOT_DATE=$SNAPSHOT_DATE
CREATED_UTC=$CREATED_UTC
TRACKED_FILE_COUNT=$TRACKED_COUNT
SOURCE_OF_TRUTH=exact Git commit tree
POLICY=docs/GOLDEN_MASTER_POLICY.md
NOTE=HACS/install packages are separate artifacts and are not Golden Masters.
EOF

# Create complete source ZIP including generated snapshot metadata.
(
  cd "$TMP_DIR"
  zip -q -r "$ZIP_PATH" "$BASE_NAME"
)
unzip -tq "$ZIP_PATH" >/dev/null

# Create an offline Git-history backup up to the exact target commit.
BUNDLE_REF="refs/archive-snapshot/${TARGET_COMMIT}"
git update-ref "$BUNDLE_REF" "$TARGET_COMMIT"
git bundle create "$BUNDLE_PATH" "$BUNDLE_REF" >/dev/null
git bundle verify "$BUNDLE_PATH" >/dev/null

(
  cd "$OUTPUT_DIR"
  sha256sum "${BASE_NAME}.zip" "${BASE_NAME}.bundle" > "${BASE_NAME}_SHA256SUMS.txt"
)

ZIP_SHA256="$(sha256sum "$ZIP_PATH" | awk '{print $1}')"
BUNDLE_SHA256="$(sha256sum "$BUNDLE_PATH" | awk '{print $1}')"

printf 'Archive created successfully\n'
printf '  Type:       %s\n' "$ARCHIVE_TYPE"
printf '  Commit:     %s\n' "$TARGET_COMMIT"
printf '  ZIP:        %s\n' "$ZIP_PATH"
printf '  ZIP SHA256: %s\n' "$ZIP_SHA256"
printf '  Bundle:     %s\n' "$BUNDLE_PATH"
printf '  BDL SHA256: %s\n' "$BUNDLE_SHA256"
printf '  Checksums:  %s\n' "$CHECKSUM_PATH"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "archive_base_name=$BASE_NAME"
    echo "target_commit=$TARGET_COMMIT"
    echo "zip_path=$ZIP_PATH"
    echo "bundle_path=$BUNDLE_PATH"
    echo "checksum_path=$CHECKSUM_PATH"
    echo "zip_sha256=$ZIP_SHA256"
    echo "bundle_sha256=$BUNDLE_SHA256"
  } >> "$GITHUB_OUTPUT"
fi
