import SpainFlag from '@/components/flags/Spain.astro';
import UnitedStatesFlag from '@/components/flags/UnitedStates.astro';

export const Languages: Record<
	string,
	{ code: string; name: string; flag: typeof SpainFlag }
> = {
	es: {
		code: 'es',
		name: 'Español',
		flag: SpainFlag,
	},
	en: {
		code: 'en',
		name: 'English',
		flag: UnitedStatesFlag,
	},
};

export const ui = {
	es: {
		'nav.search': 'Buscador',
		'nav.quiz': 'Examen',
		'nav.about': 'Más sobre Rugby',
	},
	en: {
		'nav.search': 'Search',
		'nav.quiz': 'Quiz',
		'nav.about': 'More about Rugby',
	},
} as const;

export const defaultLang = 'es';
export const showDefaultLang = false;

export const routes = {
	es: {
		examen: 'examen',
		'mas-rugby': 'mas-rugby',
	},
	en: {
		examen: 'quiz',
		'mas-rugby': 'more-rugby',
	},
};
