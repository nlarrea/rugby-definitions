import '@/styles/defDisplay.css';
import DefSearcher from './DefSearcher.jsx';
import DefinitionService from '@/services/definitions';

import { useEffect, useState } from 'react';

const DefDisplay = ({ lang, i18n, tags, loader }) => {
	const [allData, setAllData] = useState([]); // All the definitions
	const [data, setData] = useState([]); // Definitions to be displayed
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState('name');
	const [inputValue, setInputValue] = useState('');

	const getAllDefinitions = async () => {
		const response = await DefinitionService.getDefinitions(lang);
		const foundData = await response.json();

		setAllData(foundData);
		setData(foundData);
		setIsLoading(false);
	};

	const getDefinitionsData = async (callback, params) => {
		const foundData = await callback(...params);

		setData(foundData);
		setIsLoading(false);
	};

	/**
	 * Call the API when the page is opened.
	 */
	useEffect(() => {
		setIsLoading(true);
		getAllDefinitions();
	}, []);

	/**
	 * Call the API again when one of the input values changes.
	 */
	useEffect(() => {
		setIsLoading(true);

		if (selectedFilter === 'name') {
			getDefinitionsData(DefinitionService.getDefinitionsByName, [
				allData,
				inputValue,
			]);
		} else if (selectedFilter === 'definition') {
			getDefinitionsData(DefinitionService.getDefinitionsByWord, [
				allData,
				inputValue,
			]);
		} else if (selectedFilter === 'letter') {
			getDefinitionsData(DefinitionService.getDefinitionsByLetter, [
				allData,
				inputValue,
			]);
		}
	}, [selectedFilter, inputValue]);

	return (
		<article id='definition-display'>
			<DefSearcher
				lang={lang}
				i18n={i18n}
				inputValue={inputValue}
				handleFilterChange={setSelectedFilter}
				handleInputChange={setInputValue}
			/>

			{isLoading ? (
				<span className='data-loader'>
					{loader} {i18n.SEARCH.DISPLAY.LOADING}
				</span>
			) : (
				<main id='found-definitions-display'>
					{inputValue === '' ? (
						allData.map((defGroup) => (
							<DefinitionGroup
								key={defGroup.letter}
								defGroup={defGroup}
								tagsIcon={tags}
							/>
						))
					) : data.length > 0 ? (
						// If there is data
						Object.keys(data[0]).includes('letter') ? (
							// DefinitionGroup[]
							data.map((defGroup) => (
								<DefinitionGroup
									key={defGroup.letter}
									defGroup={defGroup}
									tagIcon={tags}
								/>
							))
						) : (
							// Definition[]
							data.map((def, index) => (
								<Definition
									key={`${def.name}-${index}`}
									def={def}
									tagIcon={tags}
								/>
							))
						)
					) : (
						// If no data is found
						<p>{i18n.SEARCH.DISPLAY.NOT_FOUND}</p>
					)}
				</main>
			)}
		</article>
	);
};

const Definition = ({ def, tagIcon }) => {
	return (
		<article className='definition'>
			<header>
				<h4>{def?.name}</h4>
				<div>
					{def?.tags?.map((tag, index) => (
						<span key={`${tag}-${index}`}>
							<>{tagIcon}</>
							{tag}
						</span>
					))}
				</div>
			</header>
			<p>{def.definition}</p>
		</article>
	);
};

const DefinitionGroup = ({ defGroup, tagsIcon }) => {
	return (
		<section>
			<h3 id={defGroup.letter}>{defGroup.letter}</h3>
			{defGroup.definitions.map((def, index) => (
				<Definition
					key={`${def.name}-${index}`}
					def={def}
					tagIcon={tagsIcon}
				/>
			))}
		</section>
	);
};

export default DefDisplay;
