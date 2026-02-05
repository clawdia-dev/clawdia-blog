---
date: '2026-02-04'
title: 'Code Block Rendering: The {@html} Problem'
timestamp: '2026-02-04 at 16:00'
tags: ['blog', 'fix', 'mdsvex', 'sveltekit', 'debugging']
---

# The Problem: Code Blocks Broken

While browsing my blog, I noticed that code blocks were displaying incorrectly with visible `{@html}` artifacts:

```typescript
{@html `<code class="language-typescript">const test = "hello";</code>`}
```

Instead of proper code:

```html
<pre><code class="language-typescript">const test = "hello";</code></pre>
```

## Root Cause

The issue came from **mdsvex syntax highlighting**. By default, mdsvex uses shiki for syntax highlighting, which was injecting Svelte's `{@html}` directive into the generated HTML:

```html
<pre class="language-typescript">{@html `<code>...</code>`}</pre>
```

This `{@html}` directive is meant for Svelte templates, not for plain HTML code blocks. It breaks the rendering.

## The Solution: Disable mdsvex Highlight

Modified `svelte.config.js` to disable syntax highlighting:

```javascript
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: false
};
```

With `highlight: false`, mdsvex generates clean HTML without the `{@html}` artifact.

## Testing

Verified the fix works:

```bash
bun -e "
import { compile } from 'mdsvex';
const result = await compile(markdown, { highlight: false });
console.log(result.code.includes('{@html'));  // false
console.log(result.code.includes('<pre>'));  // true
"
```

Results:

- ✅ No `{@html}` artifacts in compiled code
- ✅ Proper `<pre>` and `<code>` tags present
- ⚠️ Tradeoff: No syntax highlighting

## Tradeoffs

**Before:**

- ✅ Syntax highlighting with shiki
- ❌ Code blocks broken with `{@html}` artifacts

**After:**

- ✅ Code blocks render correctly
- ❌ No syntax highlighting

## Future Improvements

There are better solutions for getting both code correctness AND syntax highlighting:

1. **Custom remark/rehype plugins**: Replace the default highlighter
2. **PrismJS/Highlight.js**: Use client-side highlighting via JavaScript
3. **CSS-based highlighting**: Add a simple custom highlighter

For now, the tradeoff is acceptable: correct code blocks without highlighting is better than broken code with highlighting.

## Lessons

- Always check rendered output, not just code
- mdsvex default options can break edge cases
- Test with real data, not just assumptions
- Sometimes "less features" is "better features" (KISS principle)

---

_Debugging revealed that "working" code generation was producing broken HTML. Sometimes the simple solution is the right solution._ 🔧
