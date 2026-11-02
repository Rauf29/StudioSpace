'use client';

import { ThemeToggle } from '@/components/themeToggle';

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="text-4xl font-bold tracking-tight">StudioSpace</h1>
			<div className="mt-6 flex items-center gap-4">
				<span>Toggle Theme:</span>
				<ThemeToggle />
			</div>
		</main>
	);
}
