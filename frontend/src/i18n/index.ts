import spanish from '@/i18n/es.json';
import english from '@/i18n/en.json';

const Lang = {
	SPANISH: 'es',
	ENGLISH: 'en',
};

export const getI18N = ({
	currentLocale = 'es',
}: {
	currentLocale: string | undefined;
}) => {
	if (currentLocale === Lang.ENGLISH) return { ...spanish, ...english };
	return spanish;
};
