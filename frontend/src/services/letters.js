const getAllLetters = async (allDefinitions) => {
	return allDefinitions.map((obj) => obj.letter);
};

const LetterService = {
	getAllLetters,
};

export default LetterService;
