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
