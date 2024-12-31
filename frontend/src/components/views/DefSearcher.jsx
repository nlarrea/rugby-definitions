const DefSearcher = ({
	inputValue,
	handleFilterChange,
	handleInputChange,
}) => {
	return (
		<form name='definition-searcher'>
			<section id='filters'>
				<h4>Selecciona cómo quieres realizar la búsqueda</h4>
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
						<span>Por nombre</span>
					</label>
					<label htmlFor='definition'>
						<input
							type='radio'
							name='filter'
							id='definition'
							value='definition'
							onClick={(e) => handleFilterChange(e.target.value)}
						/>
						<span>Por definición</span>
					</label>
					<label htmlFor='letter'>
						<input
							type='radio'
							name='filter'
							id='letter'
							value='letter'
							onClick={(e) => handleFilterChange(e.target.value)}
						/>
						<span>Por letra</span>
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
