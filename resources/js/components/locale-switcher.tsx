import { useLocale } from '@/hooks/use-locale';
import { useTranslation } from 'react-i18next';

const LOCALE_LABELS: Record<string, string> = {
    es: 'Español',
    en: 'English',
    ca: 'Català',
};

export function LocaleSwitcher() {
    const { locale, updateLocale, availableLocales } = useLocale();
    const { t } = useTranslation();

    return (
        <div className="relative inline-block">
            <select
                value={locale}
                onChange={(e) => updateLocale(e.target.value)}
                className="focus:ring-opacity-50 appearance-none rounded-sm border border-[#19140035] bg-white px-4 py-1.5 pr-8 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] focus:border-[#1915014a] focus:ring-2 focus:ring-[#f53003] focus:outline-none dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:focus:ring-[#FF4433]"
                aria-label={t('Seleccionar idioma') || 'Seleccionar idioma'}
            >
                {availableLocales.map((loc) => (
                    <option key={loc} value={loc}>
                        {LOCALE_LABELS[loc] || loc.toUpperCase()}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                    className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
}

export function LocaleSwitcherSimple() {
    const { locale, updateLocale, availableLocales } = useLocale();

    return (
        <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {availableLocales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => updateLocale(loc)}
                    className={`flex items-center rounded-md px-3.5 py-1.5 transition-colors ${
                        locale === loc
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
                    }`}
                    aria-label={LOCALE_LABELS[loc] || loc}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
