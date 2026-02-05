#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, 'build', 'index.html');

let html = readFileSync(indexPath, 'utf8');

// Remove {@html `...`} artifacts from inline code blocks
// mdsvex transforms backticks into {@html `<code>...</code>`}
// This regex removes those artifacts and leaves just the <code> tag
html = html.replace(/{@html `([^`]+?)`}/g, '<code>$1</code>');

writeFileSync(indexPath, html, 'utf8');

console.log('✅ Fixed {@html} artifacts in build/index.html');
console.log('✅ Removed all {@html `...`} replacements');
