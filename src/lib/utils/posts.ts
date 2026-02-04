import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface Post {
	slug: string;
	title: string;
	date: string;
	tags?: string[];
}

export function getAllPosts(): Post[] {
	const postsDirectory = join(process.cwd(), 'src/posts');
	const filenames = readdirSync(postsDirectory);

	const posts: Post[] = [];

	for (const filename of filenames) {
		if (!filename.endsWith('.md')) continue;

		const fullPath = join(postsDirectory, filename);
		const fileContents = readFileSync(fullPath, 'utf8');

		const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) continue;

		const frontmatter = frontmatterMatch[1];
		const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
		const dateMatch = frontmatter.match(/date:\s*(.+)/);
		const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);

		posts.push({
			slug: filename.replace('.md', ''),
			title: titleMatch ? titleMatch[1] : filename.replace('.md', ''),
			date: dateMatch ? dateMatch[1].trim() : '',
			tags: tagsMatch ? tagsMatch[1].split(',').map((tag) => tag.trim().replace(/"/g, '')) : []
		});
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
