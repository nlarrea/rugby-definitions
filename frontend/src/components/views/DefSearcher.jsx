import { searchType } from '@/constants/inputs';
import '@/styles/defSearcher.css';
import { Tag } from 'lucide-react';

const FilterInput = ({ filter, tags, i18n, input, letters }) => {
	if (tags.tags && filter.selectedFilter === searchType.tag) {
		return (
			<section id='definition-tags-wrapper'>
				{tags.tags.map((tag) => (
					<button
						key={tag}
						className={
							tags.activeTag === tag
								? 'definition-tag active-tag'
								: 'definition-tag'
						}
						type='button'
						onClick={tags.handleChangeTag}
					>
						<Tag />
						{tag}
					</button>
				))}
			</section>
		);
	} else if (
		letters?.length > 0 &&
		filter.selectedFilter === searchType.letter
	) {
		return (
			<label htmlFor='search-input'>
				<select
					name='search-input'
					id='search-input'
					onChange={(e) => input.setInputValue(e.target.value)}
				>
					{letters.map((letter) => (
						<option
							value={letter}
							key={letter}
						>
							{letter}
						</option>
					))}
				</select>
			</label>
		);
	} else {
		return (
			<label htmlFor='search-input'>
				<input
					type='text'
					name='search-input'
					id='search-input'
					spellCheck='false'
					placeholder={i18n.SEARCH.FORM.INPUT_PLACEHOLDER}
					onChange={(e) => input.setInputValue(e.target.value)}
					value={input.inputValue}
				/>
			</label>
		);
	}
};

const DefSearcher = ({ input, i18n, tags, filter, letters }) => {
	return (
		<form
			name='definition-searcher'
			id='definition-searcher'
		>
			<p>{i18n.SEARCH.FORM.TITLE}:</p>

			<main>
				<select
					id='filters'
					name='filter'
					defaultValue='definition'
					onChange={filter.handleChangeFilter}
					aria-label='filters'
				>
					<option value={searchType.name}>
						{i18n.SEARCH.FORM.FILTER_1}
					</option>
					<option value={searchType.word}>
						{i18n.SEARCH.FORM.FILTER_2}
					</option>
					<option value={searchType.letter}>
						{i18n.SEARCH.FORM.FILTER_3}
					</option>
					<option value={searchType.tag}>
						{i18n.SEARCH.FORM.FILTER_4}
					</option>
				</select>

				{FilterInput({ input, i18n, tags, filter, letters })}
			</main>
		</form>
	);
};

export default DefSearcher;
