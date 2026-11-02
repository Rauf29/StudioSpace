'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="w-9 h-9 rounded-full cursor-pointer"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			title="Toggle theme"
		>
			<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
			<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
