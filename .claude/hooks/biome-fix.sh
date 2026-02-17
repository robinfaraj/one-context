#!/bin/bash
# PostToolUse hook: runs biome check (lint + format + imports) on edited/written files to catch errors early.

FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only lint JS/TS files
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# Skip generated files
case "$FILE_PATH" in
  */generated/*) exit 0 ;;
esac

# Only lint if file exists
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Run biome check (lint + format + imports) on just this file
OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && pnpm exec biome check "$FILE_PATH" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Biome lint errors in $(basename "$FILE_PATH"):"
  echo "$OUTPUT"
  exit 1
fi

exit 0
