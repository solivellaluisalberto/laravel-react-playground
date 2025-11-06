import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Importar dinámicamente todos los archivos JSON de traducciones usando Vite
// Esto carga automáticamente todos los idiomas disponibles en /lang/*.json
const translationModules = import.meta.glob('../../lang/*.json', { eager: true })

// Construir el objeto resources dinámicamente desde los archivos importados
const resources = {}
Object.entries(translationModules).forEach(([path, module]) => {
    // Extraer el código de idioma del path (ej: "../../lang/es.json" -> "es")
    const locale = path.match(/\/([^/]+)\.json$/)?.[1]
    if (locale) {
        resources[locale] = { translation: module.default || module }
    }
})

// Obtener el idioma inicial del servidor (establecido en el script inline)
// Esto previene el flash de idioma por defecto
const initialLanguage = window.__INITIAL_LOCALE__ || document.documentElement.lang || 'es';

// Inicializar i18next de forma SÍNCRONA antes de que React se monte
i18n
    .use(initReactI18next)
    .init({
        resources, // ← Ahora carga dinámicamente todos los idiomas disponibles
        lng: initialLanguage, // usa el locale del servidor para evitar flash
        // fallbackLng: 'es', // Idioma de respaldo por defecto si no se pone retorna la clave.
        
        // Configuración de fallback para claves específicas
        fallbackNS: false, // No usar namespace fallback (solo usamos 'translation')
        
        // Retornar la clave si no encuentra traducción en ningún idioma
        saveMissing: false,
        missingKeyHandler: false,
        
        // Opciones de interpolación
        interpolation: { escapeValue: false },
        
        // Configuración de React
        react: {
            useSuspense: false, // Desactivar suspense para renderizado inmediato
        },
        
        // Forzar inicialización síncrona (previene flash)
        initImmediate: false,
        
        // Habilitar el uso de fallbackLng cuando una clave no existe
        returnNull: false, // No retornar null si falta la traducción
        returnEmptyString: false, // No retornar string vacío
        returnObjects: false, // No retornar objetos
    })

// Asegurar que el idioma esté activo antes de continuar
if (i18n.language !== initialLanguage) {
    i18n.changeLanguage(initialLanguage);
}

export default i18n