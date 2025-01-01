const getAllTags = async (allDefinitions) => {
	const tags = [];
	allDefinitions.forEach((defGroup) => {
		defGroup.definitions.forEach((def) => {
			def.tags.forEach((tag) => {
				tags.push(tag);
			});
		});
	});

	return [...new Set(tags.sort())];
};

const TagsService = { getAllTags };

export default TagsService;
