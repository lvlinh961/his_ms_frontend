#!/bin/sh
set -e

cat <<EOF > /app/public/runtime-config.js
window.RUNTIME_CONFIG = {
  NEXT_PUBLIC_API_ENDPOINT: "${NEXT_PUBLIC_API_ENDPOINT}",
  NEXT_PUBLIC_URL: "${NEXT_PUBLIC_URL}",
  NEXT_PUBLIC_ENABLE_LOGGING: "${NEXT_PUBLIC_ENABLE_LOGGING}"
}
EOF

echo "✅ Injected runtime-config.js"
cat /app/public/runtime-config.js

# Also export them to a file Node can import
cat <<EOF > /app/runtime-config.json
{
  "NEXT_PUBLIC_API_ENDPOINT": "${NEXT_PUBLIC_API_ENDPOINT}",
  "NEXT_PUBLIC_URL": "${NEXT_PUBLIC_URL}",
  "NEXT_PUBLIC_ENABLE_LOGGING": "${NEXT_PUBLIC_ENABLE_LOGGING}"
}
EOF

exec "$@"
