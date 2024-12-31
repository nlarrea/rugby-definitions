import { API_PATHS } from '@/models/paths';

const getDefinitions = async (lang = 'es') => {
	const definitions = await fetch(API_PATHS.getAllDefinitions(lang));
	return definitions;
};

const getDefinitionsByLetter = async (letter, lang = 'es') => {
	const definitions = await fetch(API_PATHS.getDefsByLetter(letter, lang));
	return definitions;
};

const getDefinitionsByTag = async (tag, lang = 'es') => {
	const definitions = await fetch(API_PATHS.getDefsByTag(tag, lang));
	return definitions;
};

const getDefinitionsByWord = async (word, lang = 'es') => {
	const definitions = await fetch(API_PATHS.getDefsByWord(word, lang));
	return definitions;
};

const getDefinitionsByName = async (name, lang = 'es') => {
	const definitions = await fetch(API_PATHS.getDefsByName(name, lang));
	return definitions;
};

const DefinitionService = {
	getDefinitions,
	getDefinitionsByLetter,
	getDefinitionsByTag,
	getDefinitionsByWord,
	getDefinitionsByName,
};

export default DefinitionService;
