import '@/styles/defDisplay.css';
import DefSearcher from './DefSearcher.jsx';
import DefinitionService from '@/services/definitions';
import TagsService from '@/services/tags.js';
import { Tag } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

const DefDisplay = ({ lang, i18n, loader }) => {
	const isRendered = useRef(false);
	const [allData, setAllData] = useState([]); // All the definitions
	const [data, setData] = useState([]); // Definitions to be displayed
	const [allTags, setAllTags] = useState([]);
	const [activeTag, setActiveTag] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState('name');
	const [inputValue, setInputValue] = useState('');

	const getAllDefinitions = async () => {
		const response = await DefinitionService.getDefinitions(lang);
		const foundData = await response.json();

		setAllData(foundData);
		setData(foundData);
		setAllTags(await TagsService.getAllTags(foundData));

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
		if (isRendered.current) {
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
					inputValue.length > 1 ? inputValue[0] : inputValue,
				]);
			} else if (selectedFilter === 'tag') {
				getDefinitionsData(DefinitionService.getDefinitionsByTag, [
					allData,
					activeTag,
				]);
			}
		}

		isRendered.current = true;
	}, [selectedFilter, inputValue, activeTag]);

	const handleChangeFilter = (event) => {
		event.preventDefault();

		/* Reset input value when switching to tag-filter and reset active tag
		when using input-like-filter */
		if (
			['name', 'definition', 'letter'].includes(selectedFilter) &&
			event.target.value === 'tag'
		) {
			setInputValue('');
		} else if (
			selectedFilter === 'tag' &&
			['name', 'definition', 'letter'].includes(event.target.value)
		) {
			setActiveTag('');
		}

		// Update selected filter
		setSelectedFilter(event.target.value);
	};

	const handleChangeTag = (event) => {
		const selectedTag = event.target.innerText;

		if (activeTag === selectedTag) {
			setActiveTag('');
		} else {
			setActiveTag(selectedTag);
		}
	};

	return (
		<article id='definitions-display-container'>
			<DefSearcher
				i18n={i18n}
				input={{ inputValue, setInputValue }}
				filter={{ selectedFilter, handleChangeFilter }}
				tags={{ tags: allTags, activeTag, handleChangeTag }}
			/>

			<main id='found-definitions-display'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1440 320'
					className='transition-image'
				>
					<path
						fill='currentColor'
						fillOpacity='1'
						d='M0,96L48,80C96,64,192,32,288,26.7C384,21,480,43,576,48C672,53,768,43,864,58.7C960,75,1056,117,1152,154.7C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
						data-darkreader-inline-fill=''
					></path>
				</svg>

				{isLoading ? (
					<span className='data-loader'>
						{loader} {i18n.SEARCH.DISPLAY.LOADING}
					</span>
				) : (
					<div id='definitions-wrapper'>
						{inputValue === '' && activeTag === '' ? (
							allData.map((defGroup) => (
								<DefinitionGroup
									key={defGroup.letter}
									defGroup={defGroup}
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
									/>
								))
							) : (
								// Definition[]
								data.map((def, index) => (
									<Definition
										key={`${def.name}-${index}`}
										def={def}
									/>
								))
							)
						) : (
							// If no data is found
							<p>{i18n.SEARCH.DISPLAY.NOT_FOUND}</p>
						)}
					</div>
				)}
			</main>
		</article>
	);
};

const Definition = ({ def }) => {
	return (
		<article className='definition'>
			<header>
				<h3>{def?.name}</h3>
				<div>
					{def?.tags?.map((tag, index) => (
						<span
							key={`${tag}-${index}`}
							className='definition-tag'
						>
							<Tag />
							{tag}
						</span>
					))}
				</div>
			</header>
			<p>{def.definition}</p>
		</article>
	);
};

const DefinitionGroup = ({ defGroup }) => {
	return (
		<section className='definition-group'>
			<h2 id={defGroup.letter}>{defGroup.letter}</h2>
			{defGroup.definitions.map((def, index) => (
				<Definition
					key={`${def.name}-${index}`}
					def={def}
				/>
			))}
		</section>
	);
};

export default DefDisplay;
