import { API_PATHS } from '@/models/paths';

const getDefinitions = async (lang = 'es') => {
	const definitions = await fetch(API_PATHS.getAllDefinitions(lang));
	return definitions;
};

const getDefinitionsByLetter = async (allDefinitions, letter) => {
	const definitions = allDefinitions.filter(
		(defGroup) => defGroup.letter === letter
	);
	return definitions;
};

const getDefinitionsByTag = async (allDefinitions, tag) => {
	const definitions = [];
	allDefinitions.forEach((defGroup) =>
		defGroup.definitions.forEach((def) => {
			if (def.tags.includes(tag)) {
				definitions.push(def);
			}
		})
	);
	return definitions;
};

const getDefinitionsByWord = async (allDefinitions, word) => {
	let definitions = [];
	allDefinitions.forEach((defGroup) => {
		defGroup.definitions.forEach((def) => {
			if (def.definition.toLowerCase().includes(word.toLowerCase())) {
				definitions.push(def);
			}
		});
	});
	return definitions;
};

const getDefinitionsByName = async (allDefinitions, name) => {
	let definitions = [];
	allDefinitions.forEach((defGroup) => {
		defGroup.definitions.forEach((def) => {
			if (def.name.toLowerCase().includes(name.toLowerCase())) {
				definitions.push(def);
			}
		});
	});
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
