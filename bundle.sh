#!/bin/bash

# Build the project
echo "Building project..."
bun run build > /dev/null 2>&1

# Read the generated index.html
echo "Reading index.html..."
cp build/index.html build/index-standalone.html

# Inline all CSS files
echo "Inlining CSS..."
CSS_FILES=$(find build/_app/immutable/assets -name "*.css" 2>/dev/null)
CSS_CONTENT=""

for file in $CSS_FILES; do
  CSS_CONTENT="$CSS_CONTENT$(cat "$file")"
done

# Remove CSS links and add inline styles
sed -i 's|<link[^>]*\.css[^>]*>||g' "build/index-standalone.html"
sed -i "/<head>/i <style>$CSS_CONTENT</style>" "build/index-standalone.html"

# Extract and inline JS files
echo "Inlining JS..."
# Get all JS files from imports
JS_MODULES=$(grep -o "import(\\.\\/[^\\)]+\\.js)" build/index-standalone.html | sort -u)

# Inline JS content and remove imports
for module in $JS_MODULES; do
  # Convert path to absolute
  if [[ "$module" == \./\_app* ]]; then
    MODULE_PATH="build/${module#./}"
  else
    MODULE_PATH="$module"
  fi
  
  if [ -f "$MODULE_PATH" ]; then
    JS_CONTENT=$(cat "$MODULE_PATH")
    # Replace import with the actual JS code
    sed -i "s|import(\"$module\")||g" "build/index-standalone.html"
    # Remove the import statement from the inlined code
    sed -i "s|\"use strict\";||g" "build/index-standalone.html"
  fi
done

# Remove importmap if exists
sed -i "/const __sveltekit_\w+ = /d" build/index-standalone.html

# Add closing script tag if missing
if ! grep -q "</script>" build/index-standalone.html; then
  sed -i "/<\/body>/i <\/script>" "build/index-standalone.html"
fi

# Get file size
SIZE=$(stat -f%s build/index-standalone.html)
SIZE_MB=$(echo "scale=2; $SIZE/1048576" | bc)

echo "✓ Created: build/index-standalone.html"
echo "  Size: $SIZE bytes (${SIZE_MB} MB)"
echo ""
echo "Done! Single HTML file ready."
echo "All CSS and JS are now inlined."
