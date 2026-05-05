#!/bin/bash
# audit.sh — 交付客戶前最後檢查，一個指令跑完
# 用法: ./audit.sh [網域]    預設: https://une-liaison.netlify.app

DOMAIN="${1:-https://une-liaison.netlify.app}"
PASS=0
FAIL=0
TOTAL=5

echo "=== 1/${TOTAL} dead link 檢查 ==="
if command -v lychee &>/dev/null; then
  npm run build --silent 2>/dev/null || npm run build
  lychee dist/ --base "$DOMAIN" --no-progress --exclude "mailto:*" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ dead link 檢查通過"
    ((PASS++))
  else
    echo "❌ 發現斷裂連結"
    ((FAIL++))
  fi
else
  echo "⚠️  未安裝 lychee（brew install lychee），跳過 dead link 檢查"
  ((TOTAL--))
fi

echo ""
echo "=== 2/${TOTAL} Sitemap 網域檢查 ==="
if curl -sL "$DOMAIN/sitemap.xml" | grep -q "$DOMAIN" 2>/dev/null || \
   curl -sL "$DOMAIN/sitemap-index.xml" | grep -q "$DOMAIN" 2>/dev/null; then
  echo "✅ 網域正確"
  ((PASS++))
else
  echo "❌ Sitemap 網域錯誤或無法訪問"
  ((FAIL++))
fi

echo ""
echo "=== 3/${TOTAL} dist/ 無 localhost 殘留 ==="
npm run build --silent 2>/dev/null || npm run build
if grep -rn "localhost" dist/ 2>/dev/null | grep -v "dist/server/wrangler.json" | grep -q "localhost"; then
  echo "❌ 發現 localhost 殘留"
  ((FAIL++))
else
  echo "✅ 無 localhost 殘留"
  ((PASS++))
fi

echo ""
echo "=== 4/${TOTAL} dist/ 無舊 GitHub Pages 殘留 ==="
if grep -rn "github\.io\|githubpages" dist/ 2>/dev/null | grep -v "dist/server/wrangler.json" | grep -q "github"; then
  echo "❌ 發現舊 GitHub Pages 殘留"
  ((FAIL++))
else
  echo "✅ 無舊 GitHub Pages 殘留"
  ((PASS++))
fi

echo ""
echo "=== 5/${TOTAL} 全頁面 200 檢查 ==="
for f in $(find src/pages -name "*.astro" -not -path "*/admin/*" | sort); do
  path=$(echo "$f" | sed -E \
    -e 's|src/pages||' \
    -e 's|/index\.astro$|/|' \
    -e 's|\.astro$|/|' \
    -e 's|\[\.\.\.slug\]||' \
    -e 's|\[slug\]|test-slug|')
  # 清除連續的 //
  path="${path//\/\//\/}"
  [ "$path" = "/" ] && path="/"
  code=$(curl -sL -o /dev/null -w "%{http_code}" "${DOMAIN}${path}")
  if [ "$code" = "200" ]; then
    echo "✅ $code ${DOMAIN}${path}"
  else
    echo "❌ $code ${DOMAIN}${path}"
    ((FAIL++))
  fi
done

echo ""
echo "=== 結果 ==="
echo "通過: $PASS / $TOTAL"
echo "失敗: $FAIL"
if [ "$FAIL" -eq 0 ]; then
  echo "🎉 全部通過，可以交付客戶！"
  exit 0
else
  echo "⚠️  有 $FAIL 項檢查未通過，請先修復"
  exit 1
fi