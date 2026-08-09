


import { ComponentLibrary, Template, TypeScriptLevel, StylingChoice } from '../types';

export type ImpactType = 'install' | 'config' | 'scaffold';

export const baseSteps = [
  { name: 'Initial Setup', id: 0 },
  { name: 'Styling', id: 1 },
  { name: 'Components', id: 2 },
  { name: 'Theme & Colors', id: 3 },
  { name: 'Integrations', id: 4 },
  { name: 'Database & Auth', id: 5 },
  { name: 'Data Schema', id: 6 },
  { name: 'Summary', id: 8 },
];

export const impactMap = {
    template: {
        [Template.Minimal]: { tooltip: 'The most minimal Astro start, with no components or styles.', impacts: [] },
        [Template.React]: { tooltip: 'Adds @astrojs/react dependency and configures it in astro.config.mjs.', impacts: ['install', 'config'] },
        [Template.Vue]: { tooltip: 'Adds @astrojs/vue dependency and configures it in astro.config.mjs.', impacts: ['install', 'config'] },
        [Template.Svelte]: { tooltip: 'Adds @astrojs/svelte dependency and configures it in astro.config.mjs.', impacts: ['install', 'config'] },
        [Template.Basics]: { tooltip: 'A minimal, vanilla Astro project with sample files.', impacts: [] },
        [Template.Blog]: { tooltip: 'A pre-built, feature-rich blog template.', impacts: [] },
        [Template.Portfolio]: { tooltip: 'A stylish, media-focused portfolio template.', impacts: [] },
    },
    typescript: {
        [TypeScriptLevel.Strictest]: { tooltip: 'Enforces the most strict type-checking rules available.', impacts: ['config'] },
        [TypeScriptLevel.Strict]: { tooltip: 'Enforces strict type-checking rules.', impacts: ['config'] },
        [TypeScriptLevel.Relaxed]: { tooltip: 'Uses a more relaxed TypeScript configuration.', impacts: ['config'] },
        [TypeScriptLevel.None]: { tooltip: 'Does not use TypeScript.', impacts: [] },
    },
    styling: {
        [StylingChoice.Tailwind]: { tooltip: 'Adds TailwindCSS integration, dependencies, and creates config files.', impacts: ['install', 'config', 'scaffold'] },
        [StylingChoice.Custom]: { tooltip: 'Uses a standard CSS file for styling.', impacts: ['scaffold'] },
    },
    components: {
        [ComponentLibrary.Shadcn]: { tooltip: 'Uses CLI to init and add components. Adds dependencies, config, and component files.', impacts: ['install', 'config', 'scaffold'] },
        [ComponentLibrary.Starwind]: { tooltip: 'Uses CLI to init and add components. Adds config and component files.', impacts: ['config', 'scaffold'] },
        [ComponentLibrary.Daisy]: { tooltip: 'Adds daisyui dependency and configures it in tailwind.config.mjs.', impacts: ['install', 'config'] },
        [ComponentLibrary.Custom]: { tooltip: 'Generates starter .astro component files in your project.', impacts: ['scaffold'] },
        [ComponentLibrary.None]: { tooltip: 'No component library will be added.', impacts: [] },
    },
    integrations: {
        i18n: { tooltip: 'Adds and configures @astrojs/i18n for multi-language support.', impacts: ['install', 'config'] },
        astroFont: { tooltip: 'Adds and configures astro-font for font optimization.', impacts: ['install', 'config'] },
        astroIcon: { tooltip: 'Adds astro-icon and selected iconify libraries as dependencies.', impacts: ['install', 'config'] },
    },
};