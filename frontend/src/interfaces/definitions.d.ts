interface Definition {
	name: string;
	definition: string;
	tags: string[];
}

interface DefinitionGroup {
	id: string;
	letter: string;
	definitions: Definition[];
}

export type { DefinitionGroup };
