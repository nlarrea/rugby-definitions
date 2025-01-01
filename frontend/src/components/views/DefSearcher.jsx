import '@/styles/defDisplay.css';
import '@/styles/defSearcher.css';

const DefSearcher = ({ input, i18n, tags, filter }) => {
	return (
		<form
			name='definition-searcher'
			id='definition-searcher'
		>
			<p>{i18n.SEARCH.FORM.TITLE}</p>

			<select
				id='filters'
				name='filter'
				defaultValue='name'
				onChange={filter.handleChangeFilter}
			>
				<option value='name'>{i18n.SEARCH.FORM.FILTER_1}</option>
				<option value='definition'>{i18n.SEARCH.FORM.FILTER_2}</option>
				<option value='letter'>{i18n.SEARCH.FORM.FILTER_3}</option>
				<option value='tag'>{i18n.SEARCH.FORM.FILTER_4}</option>
			</select>

			{tags.tags && filter.selectedFilter === 'tag' ? (
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
							onClick={(e) =>
								tags.setActiveTag(e.target.innerText)
							}
						>
							<>{tags.tagsIcon}</>
							{tag}
						</button>
					))}
				</section>
			) : (
				<section id='input'>
					<input
						type='text'
						name='search-input'
						id='search-input'
						placeholder={
							filter.selectedFilter === 'letter'
								? i18n.SEARCH.FORM.INPUT_PLACEHOLDER_LETTER
								: i18n.SEARCH.FORM.INPUT_PLACEHOLDER
						}
						onChange={(e) => input.setInputValue(e.target.value)}
						value={input.inputValue}
					/>
				</section>
			)}
		</form>
	);
};

export default DefSearcher;
