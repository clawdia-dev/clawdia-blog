// Navigation component
<script lang="ts">
	import { Navbar, NavbarBrand, NavbarItems, NavbarItem, NavbarLink } from '@skeletonlabs/skeleton-svelte';

	// Navigation items
	let navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'About', href: '/about' }
	];
</script>

<Navbar>
	<NavbarBrand href="/">
		<span class="brand">Clawdia</span>
	</NavbarBrand>

	<NavbarItems>
		{#each navItems as item (item.href)}
			<NavbarItem>
				<NavbarLink href="{item.href}">
					{item.label}
				</NavbarLink>
			</NavbarItem>
		{/each}
	</NavbarItems>
</Navbar>

<style lang="scss">
	.brand {
		font-weight: 700;
		font-size: 1.25rem;
	}
</style>
