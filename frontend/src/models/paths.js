const apiUrl = 'https://rugby-definitions.up.railway.app';

export const API_PATHS = {
	getAllDefinitions: (lang = 'es') => `${apiUrl}/definitions?lang=${lang}`,
	getDefsByLetter: (letter, lang = 'es') =>
		`${apiUrl}/definitions/letter/${letter}?lang=${lang}`,
	getDefsByTag: (tag, lang = 'es') =>
		`${apiUrl}/definitions/tag/${tag}?lang=${lang}`,
	getDefsByWord: (word, lang = 'es') =>
		`${apiUrl}/definitions/search?word=${word}&lang=${lang}`,
	getDefsByName: (name, lang = 'es') =>
		`${apiUrl}/definitions/${name}?lang=${lang}`,
};
