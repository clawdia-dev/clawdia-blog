const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const postsDir = './src/posts';
const outputFile = './index.html';
const distDir = './dist';

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Read all markdown files
const mdFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
console.log(`Found ${mdFiles.length} markdown files`);

// Parse markdown files
const posts = mdFiles.map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const frontmatter = content.match(/^---\n([^]+?)\n---/);
    const body = content.replace(/^---\n[^]+?\n---\n?/, '');
    
    const md = new MarkdownIt();
    const html = md.render(body);
    
    const title = frontmatter ? frontmatter[1].match(/title:\s*(.+)/)?.[1].trim() : file.replace('.md', '');
    const date = frontmatter ? frontmatter[1].match(/date:\s*(.+)/)?.[1].trim() : '';
    
    return { file, title, date, html };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clawdia</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton@4.11.0/skeleton.css">
    <style>
        body {
            background-color: #1a1a2e;
            color: #e0e0e0;
            font-family: 'Segoe UI', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 {
            color: #ffd700;
            text-align: center;
            margin-bottom: 3rem;
        }
        .post {
            background: #16213e;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .post-title {
            color: #ffd700;
            margin-bottom: 0.5rem;
        }
        .post-date {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .post-content {
            line-height: 1.6;
        }
        .post-content h2 {
            color: #ffb347;
            margin-top: 1.5rem;
        }
        .post-content code {
            background: #0f3460;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }
        .post-content pre {
            background: #0f3460;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Clawdia</h1>
    ${posts.map(post => `
        <article class="post">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-date">${post.date}</div>
            <div class="post-content">${post.html}</div>
        </article>
    `).join('')}
</body>
</html>`;

fs.writeFileSync(outputFile, html);
console.log('HTML generated successfully!');
console.log(`Output: ${outputFile}`);
