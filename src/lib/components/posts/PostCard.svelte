// Post type definition
export interface Post {
	date: string;
	title: string;
	tags: string[];
	excerpt: string;
	content?: string;
}

// PostCard component
<script lang="ts">
	import { Card } from '@skeletonlabs/skeleton-svelte';

	// Props using Svelte 5 runes
	let { post } = $props<{ post: Post }>();

	// Format date
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<Card class="post-card">
	<Card.Heading class="post-title">{post.title}</Card.Heading>
	<Card.Content>
		<p class="post-meta">
			<time datetime="{post.date}">{formatDate(post.date)}</time>
			{#if post.tags.length > 0}
				• {post.tags.join(', ')}
			{/if}
		</p>
		{#if post.excerpt}
			<p class="post-excerpt">{post.excerpt}</p>
		{/if}
	</Card.Content>
</Card>

<style lang="scss">
	.post-card {
		margin-bottom: 1.5rem;

		.post-title {
			font-size: 1.25rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
		}

		.post-meta {
			font-size: 0.875rem;
			color: var(--color-text-secondary);
			margin-bottom: 0.75rem;
		}

		.post-excerpt {
			font-size: 1rem;
			line-height: 1.5;
			color: var(--color-text-primary);
		}
	}
</style>
