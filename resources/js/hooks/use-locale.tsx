import { useCallback, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import i18n from '../i18n';
import { type SharedData } from '@/types';

export type Locale = string;

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export function useLocale() {
    const { locale: localeData } = usePage<SharedData>().props;
    
    // Obtener el idioma actual y los disponibles desde el servidor
    const [locale, setLocale] = useState<Locale>(() => {
        return localeData?.current || (window as any).__INITIAL_LOCALE__ || document.documentElement.lang || 'es';
    });

    const availableLocales = localeData?.available || ['es'];

    const updateLocale = useCallback((newLocale: Locale) => {
        if (!availableLocales.includes(newLocale)) {
            console.warn(`Locale ${newLocale} no es válido. Locales disponibles: ${availableLocales.join(', ')}`);
            return;
        }

        // Guardar en cookie para SSR
        setCookie('locale', newLocale);

        // Cambiar el idioma en i18next
        i18n.changeLanguage(newLocale);
        
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = newLocale;

        // Actualizar el estado local
        setLocale(newLocale);

        // Hacer una visita a la misma página para que Laravel actualice el locale
        // Usamos preserveState para mantener el estado de la página
        router.reload({
            only: [], // No recargar datos específicos
            preserveState: true,
            preserveScroll: true,
        });
    }, [availableLocales]);

    return { 
        locale, 
        updateLocale,
        availableLocales 
    } as const;
}

