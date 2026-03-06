#!/bin/sh
set -eu

escape_js_string() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

case "${VITE_VCONSOLE:-}" in
  true|false)
    VITE_VCONSOLE_VALUE="${VITE_VCONSOLE}"
    ;;
  *)
    VITE_VCONSOLE_VALUE=''
    ;;
esac

API_URL_VALUE="$(escape_js_string "${API_URL:-${VITE_API_URL:-}}")"
SENTRY_DSN_VALUE="$(escape_js_string "${SENTRY_DSN:-${VITE_SENTRY_DSN:-}}")"

if [ -n "${VITE_VCONSOLE_VALUE}" ]; then
  VITE_VCONSOLE_CONFIG_LINE="  VITE_VCONSOLE: \"${VITE_VCONSOLE_VALUE}\","
else
  VITE_VCONSOLE_CONFIG_LINE=""
fi

cat <<EOF > /usr/share/nginx/html/env-config.js
window.__APP_CONFIG__ = {
${VITE_VCONSOLE_CONFIG_LINE}
  API_URL: "${API_URL_VALUE}",
  SENTRY_DSN: "${SENTRY_DSN_VALUE}"
};
EOF
