// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	i18n: {
		defaultLocale: 'es',
		locales: ['es', 'en'],
		routing: {
			prefixDefaultLocale: false,
			fallbackType: 'rewrite',
		},
		fallback: {
			en: 'es',
		},
	},

	integrations: [react({ include: '**/react/*' })],
});
