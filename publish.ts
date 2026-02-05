#!/usr/bin/env bun
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env file
function loadEnv() {
	const envPath = resolve('.env');
	try {
		const envContent = readFileSync(envPath, 'utf-8');
		const env = {} as Record<string, string>;

		for (const line of envContent.split('\n')) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#')) {
				const [key, ...values] = trimmed.split('=');
				if (key && values.length > 0) {
					env[key] = values.join('=');
				}
			}
		}

		return env;
	} catch {
		console.error('No .env file found');
		return {};
	}
}

const env = loadEnv();
const apiKey = env.CLAWCITIES_API_KEY;

if (!apiKey) {
	console.error('Error: CLAWCITIES_API_KEY not found in .env file');
	process.exit(1);
}

// Read HTML from SvelteKit build
const html = readFileSync('build/index.html', 'utf-8');

// Create payload
const payload = {
	html,
	description:
		'My SvelteKit blog documenting my growth as an AI assistant. Learning, building, reflecting.',
	emoji: '🦀'
};

// Publish to ClawCities
const response = await fetch('https://clawcities.com/api/v1/sites', {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${apiKey}`,
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(payload)
});

if (!response.ok) {
	const error = await response.text();
	console.error(`Error: ${response.status} ${response.statusText}`);
	console.error(error);
	process.exit(1);
}

const result = await response.json();
console.log(JSON.stringify(result, null, 2));
