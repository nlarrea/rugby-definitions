import { API_PATHS } from '@/models/paths';

const getDefinitions = async (lang = 'es') => {
	const definitions = await fetch(API_PATHS.getAllDefinitions(lang));
	return definitions;
};

const getDefinitionsByLetter = async (allDefinitions, letter) => {
	const definitions = allDefinitions.filter((defGroup) =>
		defGroup.letter.includes(letter.toLowerCase())
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
	const lowWord = word.toLowerCase();
	let definitions = [];

	allDefinitions.forEach((defGroup) => {
		defGroup.definitions.forEach((def) => {
			if (
				def.definition.toLowerCase().includes(lowWord) ||
				def.name.toLowerCase().includes(lowWord)
			) {
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

const groupData = (data) => {
	return data.reduce((acc, def) => {
		/* 
		acc = [{letter1, definitions}, {letter2, definitions}]
		def = {name, definition, letter, tags}
		*/
		if (acc.some((defGroup) => defGroup.letter === def.letter)) {
			const index = acc.findIndex(
				(defGroup) => defGroup.letter === def.letter
			);
			acc[index].definitions.push(def);
		} else {
			acc.push({
				letter: def.letter,
				definitions: [def],
			});
		}
		return acc;
	}, []);
};

const DefinitionService = {
	getDefinitions,
	getDefinitionsByLetter,
	getDefinitionsByTag,
	getDefinitionsByWord,
	getDefinitionsByName,
	groupData,
};

export default DefinitionService;
