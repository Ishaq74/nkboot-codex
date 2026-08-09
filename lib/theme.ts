
import { ThemeMode } from '../types';
import type { AstroConfig } from '../types';

const initialThemePalette = {
    light: [
        { name: '--background', value: 'oklch(0.98 0.01 240)' },
        { name: '--foreground', value: 'oklch(0.1 0.02 240)' },
        { name: '--card', value: 'oklch(1 0 0)' },
        { name: '--card-foreground', value: 'oklch(0.1 0.02 240)' },
        { name: '--primary', value: 'oklch(0.6 0.15 260)' },
        { name: '--primary-foreground', value: 'oklch(0.98 0.01 240)' },
        { name: '--secondary', value: 'oklch(0.9 0.02 240)' },
        { name: '--secondary-foreground', value: 'oklch(0.1 0.02 240)' },
        { name: '--destructive', value: 'oklch(0.6 0.2 20)' },
        { name: '--destructive-foreground', value: 'oklch(0.98 0.01 240)' },
        { name: '--border', value: 'oklch(0.9 0.02 240)' },
        { name: '--input', value: 'oklch(0.9 0.02 240)' },
        { name: '--ring', value: 'oklch(0.6 0.15 260)' },
    ],
    dark: [
        { name: '--background', value: 'oklch(0.1 0.02 240)' },
        { name: '--foreground', value: 'oklch(0.98 0.01 240)' },
        { name: '--card', value: 'oklch(0.15 0.02 240)' },
        { name: '--card-foreground', value: 'oklch(0.98 0.01 240)' },
        { name: '--primary', value: 'oklch(0.7 0.15 260)' },
        { name: '--primary-foreground', value: 'oklch(0.1 0.02 240)' },
        { name: '--secondary', value: 'oklch(0.2 0.02 240)' },
        { name: '--secondary-foreground', value: 'oklch(0.98 0.01 240)' },
        { name: '--destructive', value: 'oklch(0.7 0.2 20)' },
        { name: '--destructive-foreground', value: 'oklch(0.1 0.02 240)' },
        { name: '--border', value: 'oklch(0.2 0.02 240)' },
        { name: '--input', value: 'oklch(0.2 0.02 240)' },
        { name: '--ring', value: 'oklch(0.7 0.15 260)' },
    ],
};

const initialSyncLocks = initialThemePalette.light.reduce((acc, v) => {
    const key = v.name.replace('--', '');
    acc[key] = false;
    return acc;
}, {} as Record<string, boolean>);

export const initialTheme: AstroConfig['theme'] = {
    mode: ThemeMode.System,
    light: initialThemePalette.light,
    dark: initialThemePalette.dark,
    syncLocks: initialSyncLocks,
};
