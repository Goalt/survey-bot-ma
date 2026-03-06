#!/bin/sh
set -eu

case "${VITE_VCONSOLE:-}" in
  true|false)
    VITE_VCONSOLE_VALUE="${VITE_VCONSOLE}"
    ;;
  *)
    VITE_VCONSOLE_VALUE=''
    ;;
esac

if [ -n "${VITE_VCONSOLE_VALUE}" ]; then
  cat <<EOF > /usr/share/nginx/html/env-config.js
window.__APP_CONFIG__ = {
  VITE_VCONSOLE: "${VITE_VCONSOLE_VALUE}"
};
EOF
else
  cat <<EOF > /usr/share/nginx/html/env-config.js
window.__APP_CONFIG__ = {};
EOF
fi
