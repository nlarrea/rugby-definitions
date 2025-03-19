import '@/styles/defDisplay.css';
import DefSearcher from '@/components/views/DefSearcher';
import DefinitionService from '@/services/definitions';
import TagsService from '@/services/tags.js';
import LetterService from '@/services/letters';
import { Tag } from 'lucide-react';
import { searchType } from '@/constants/inputs';

import { useEffect, useRef, useState } from 'react';

const DefDisplay = ({ lang, i18n, loader }) => {
	const isRendered = useRef(false);
	const [allData, setAllData] = useState([]); // All the definitions
	const [data, setData] = useState([]); // Definitions to be displayed
	const [allTags, setAllTags] = useState([]);
	const [allLetters, setAllLetters] = useState([]);
	const [filters, setFilters] = useState({
		inputValue: '',
		selectedFilter: searchType.word,
		activeTag: '',
	});
	const [isLoading, setIsLoading] = useState(true);

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
			result = await DefinitionService.getDefinitionsByLetter(
				allData,
				inputValue
			);
		} else if (selectedFilter === searchType.tag) {
			result = await DefinitionService.getDefinitionsByTag(
				allData,
				activeTag
			);
		}

		const grouped =
			selectedFilter === searchType.letter
				? result
				: await DefinitionService.groupData(result);

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

	const handleChangeFilter = (event) => {
		const value = event.target.value;

		setFilters((prev) => ({
			...prev,
			selectedFilter: value,
			inputValue: [
				searchType.name,
				searchType.word,
				searchType.letter,
			].includes(value)
				? ''
				: prev.inputValue,
			activeTag: value === searchType.tag ? prev.activeTag : '',
		}));
	};

	const handleChangeTag = (event) => {
		const selectedTag = event.target.innerText;
		setFilters((prev) => ({
			...prev,
			activeTag: prev.activeTag === selectedTag ? '' : selectedTag,
		}));
	};

	return (
		<article id='definitions-display-container'>
			<DefSearcher
				i18n={i18n}
				input={{
					inputValue,
					setInputValue: (val) =>
						setFilters((prev) => ({ ...prev, inputValue: val })),
				}}
				filter={{ selectedFilter, handleChangeFilter }}
				tags={{ tags: allTags, activeTag, handleChangeTag }}
				letters={allLetters}
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
					></path>
				</svg>

				{isLoading ? (
					<span className='data-loader'>
						{loader} {i18n.SEARCH.DISPLAY.LOADING}
					</span>
				) : (
					<div id='definitions-wrapper'>
						{data.length > 0 ? (
							data.map((defGroup) => (
								<DefinitionGroup
									key={defGroup.letter}
									defGroup={defGroup}
								/>
							))
						) : (
							<p>{i18n.SEARCH.DISPLAY.NOT_FOUND}</p>
						)}
					</div>
				)}
			</main>
		</article>
	);
};

const Definition = ({ def }) => (
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

const DefinitionGroup = ({ defGroup }) => (
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

export default DefDisplay;
