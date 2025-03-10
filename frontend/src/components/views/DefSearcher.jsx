import '@/styles/defSearcher.css';
import { Tag, TriangleAlert } from 'lucide-react';

const DefSearcher = ({ input, i18n, tags, filter }) => {
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
					<option value='name'>{i18n.SEARCH.FORM.FILTER_1}</option>
					<option value='definition'>
						{i18n.SEARCH.FORM.FILTER_2}
					</option>
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
								onClick={tags.handleChangeTag}
							>
								<Tag />
								{tag}
							</button>
						))}
					</section>
				) : (
					<label htmlFor='search-input'>
						<input
							type='text'
							name='search-input'
							id='search-input'
							className={
								filter.selectedFilter === 'letter' &&
								input.inputValue.length > 1
									? 'warning'
									: ''
							}
							spellCheck='false'
							placeholder={
								filter.selectedFilter === 'letter'
									? i18n.SEARCH.FORM.INPUT_PLACEHOLDER_LETTER
									: i18n.SEARCH.FORM.INPUT_PLACEHOLDER
							}
							onChange={(e) =>
								input.setInputValue(e.target.value)
							}
							value={input.inputValue}
						/>
						{filter.selectedFilter === 'letter' &&
							input.inputValue.length > 1 && (
								<span>
									<TriangleAlert />
									{i18n.SEARCH.FORM.WARNING_MSG}
								</span>
							)}
					</label>
				)}
			</main>
		</form>
	);
};

export default DefSearcher;
