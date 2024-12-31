export const Languages: Record<string, { code: string; name: string }> = {
	es: {
		code: 'es',
		name: 'Español',
	},
	en: {
		code: 'en',
		name: 'English',
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
