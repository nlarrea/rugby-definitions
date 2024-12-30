export const languages = {
	es: 'Español',
	en: 'English',
};

export const defaultLang = 'es';

export const ui = {
	es: {
		'nav.search': 'Buscador',
		'nav.quiz': 'Prueba',
		'nav.about': 'Más sobre Rugby',
	},
	en: {
		'nav.search': 'Search',
		'nav.quiz': 'Quiz',
		'nav.about': 'More about Rugby',
	},
} as const;

export const showDefaultLang = false;

export const routes = {
	es: {
		'quiz': 'examen',
		'about': 'mas-rugby',
	},
	en: {
		'quiz': 'quiz',
		'about': 'more-rugby',
	},
};
