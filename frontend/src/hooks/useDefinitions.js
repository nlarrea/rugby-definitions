import { useEffect, useState, useRef } from 'react';

import DefinitionService from '@/services/definitions';
import TagsService from '@/services/tags';
import LetterService from '@/services/letters';
import { allOptions, searchType } from '@/constants/inputs';

export const useDefinitions = (lang, filters) => {
	const isRendered = useRef(false);
	const [allData, setAllData] = useState([]);
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [allTags, setAllTags] = useState([]);
	const [allLetters, setAllLetters] = useState([]);

	const { inputValue, selectedFilter, activeTag } = filters;

	const getAllDefinitions = async () => {
		const response = await DefinitionService.getDefinitions(lang);
		const foundData = await response.json();
		const grouped = await DefinitionService.groupData(foundData);

		setAllData(grouped);
		setData(grouped);
		setAllTags(await TagsService.getAllTags(grouped));
		setAllLetters(await LetterService.getAllLetters(grouped));
		setIsLoading(false);
	};

	const getFilteredDefinitions = async () => {
		let result = [];
		let groupResult = true;

		if (selectedFilter === searchType.name) {
			result = await DefinitionService.getDefinitionsByName(
				allData,
				inputValue
			);
		} else if (selectedFilter === searchType.word) {
			result = await DefinitionService.getDefinitionsByWord(
				allData,
				inputValue
			);
		} else if (selectedFilter === searchType.letter) {
			result =
				inputValue === allOptions
					? allData
					: await DefinitionService.getDefinitionsByLetter(
							allData,
							inputValue
					  );
			groupResult = false;
		} else if (selectedFilter === searchType.tag) {
			result =
				activeTag === ''
					? allData
					: await DefinitionService.getDefinitionsByTag(
							allData,
							activeTag
					  );
			groupResult = activeTag !== '';
		}

		const grouped = groupResult
			? await DefinitionService.groupData(result)
			: result;

		setData(grouped);
		setIsLoading(false);
	};

	useEffect(() => {
		getAllDefinitions();
	}, []);

	useEffect(() => {
		if (isRendered.current) {
			setIsLoading(true);
			getFilteredDefinitions();
		} else {
			isRendered.current = true;
		}
	}, [selectedFilter, inputValue, activeTag]);

	return {
		data,
		isLoading,
		allTags,
		allLetters,
	};
};
