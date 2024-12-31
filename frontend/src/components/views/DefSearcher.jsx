const DefSearcher = ({
	inputValue,
	i18n,
	handleFilterChange,
	handleInputChange,
}) => {
	return (
		<form name='definition-searcher'>
			<section id='filters'>
				<h4>{i18n.SEARCH.FORM.TITLE}</h4>
				<div>
					<label htmlFor='name'>
						<input
							type='radio'
							name='filter'
							id='name'
							value='name'
							defaultChecked
							onClick={(e) => handleFilterChange(e.target.value)}
						/>
						<span>{i18n.SEARCH.FORM.FILTER_1}</span>
					</label>
					<label htmlFor='definition'>
						<input
							type='radio'
							name='filter'
							id='definition'
							value='definition'
							onClick={(e) => handleFilterChange(e.target.value)}
						/>
						<span>{i18n.SEARCH.FORM.FILTER_2}</span>
					</label>
					<label htmlFor='letter'>
						<input
							type='radio'
							name='filter'
							id='letter'
							value='letter'
							onClick={(e) => handleFilterChange(e.target.value)}
						/>
						<span>{i18n.SEARCH.FORM.FILTER_3}</span>
					</label>
				</div>
			</section>

			<section id='input'>
				<input
					type='text'
					name='search-input'
					id='search-input'
					value={inputValue}
					onChange={(e) => handleInputChange(e.target.value)}
				/>
			</section>
		</form>
	);
};

export default DefSearcher;
