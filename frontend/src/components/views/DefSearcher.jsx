import '@/styles/defDisplay.css';
import '@/styles/defSearcher.css';

const DefSearcher = ({
	inputValue,
	i18n,
	tags,
	filter,
	handleInputChange,
	handleTagChange,
}) => {
	return (
		<form name='definition-searcher'>
			<p>{i18n.SEARCH.FORM.TITLE}</p>
			<select
				id='filters'
				name='filter'
				defaultValue='name'
				onChange={(e) => filter.setSelectedFilter(e.target.value)}
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
							onClick={(e) => handleTagChange(e)}
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
						value={inputValue}
						onChange={(e) => handleInputChange(e.target.value)}
					/>
				</section>
			)}
		</form>
	);
};

export default DefSearcher;
