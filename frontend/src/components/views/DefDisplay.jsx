import '../../styles/defDisplay.css';
import DefSearcher from './DefSearcher.jsx';
import DefinitionService from '@/services/definitions';

import { useEffect, useState } from 'react';

const DefDisplay = ({ lang, tags }) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState('name');
	const [inputValue, setInputValue] = useState('');

	const handleFilterChange = (event) => {
		setSelectedFilter(event.target.value);
	};

	const handleInputChange = async (event) => {
		setInputValue(event.target.value);
	};

	const getDefinitionsData = async (callback, params) => {
		const response = await callback(...params);
		const data = await response.json();
		// Ensure the data is always a list of "dictionaries"
		setData([].concat(data));

		setIsLoading(false);
	};

	useEffect(() => {
		console.log(data);
	}, [data]);

	/**
	 * Call the API when the page is opened.
	 */
	useEffect(() => {
		setIsLoading(true);

		getDefinitionsData(DefinitionService.getDefinitions, [lang]);
	}, []);

	/**
	 * Call the API again when one of the input values changes.
	 */
	useEffect(() => {
		setTimeout(() => {
			if (inputValue === '') {
				getDefinitionsData(DefinitionService.getDefinitions, [lang]);
			} else if (selectedFilter === 'name') {
				getDefinitionsData(DefinitionService.getDefinitionsByName, [
					inputValue,
					lang,
				]);
			} else if (selectedFilter === 'definition') {
				getDefinitionsData(DefinitionService.getDefinitionsByWord, [
					inputValue,
					lang,
				]);
			} else if (selectedFilter === 'letter') {
				getDefinitionsData(DefinitionService.getDefinitionsByLetter, [
					inputValue,
					lang,
				]);
			}
		}, 1000);
	}, [selectedFilter, inputValue]);

	return (
		<article id='definition-display'>
			<DefSearcher
				lang={lang}
				inputValue={inputValue}
				handleFilterChange={handleFilterChange}
				handleInputChange={handleInputChange}
			/>

			<main id='found-definitions-display'>
				{Object.keys(data).length > 0 ? (
					// If there is data
					Object.keys(data[0]).includes('letter') ? (
						// DefinitionGroup[]
						data.map((defGroup) => (
							<section key={defGroup.letter}>
								<h3 id={defGroup.letter}>{defGroup.letter}</h3>
								{defGroup.definitions.map((def, index) => (
									<Definition
										key={`${def.name}-${index}`}
										def={def}
										tagIcon={tags}
									/>
								))}
							</section>
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
					<p>No se han encontrado definiciones.</p>
				)}
			</main>
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

export default DefDisplay;
