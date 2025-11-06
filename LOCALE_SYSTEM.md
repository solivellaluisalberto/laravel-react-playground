# Sistema de Gestión de Idioma

Este proyecto incluye un sistema completo de gestión de idiomas similar al sistema de apariencia (dark/light mode), utilizando `react-i18next` y `i18next`.

## Características

- ✅ Persistencia mediante cookies
- ✅ Middleware Laravel para establecer el locale en el servidor
- ✅ Hook personalizado `useLocale()` similar a `useAppearance()`
- ✅ Sincronización entre React e i18next
- ✅ Sincronización entre servidor (Laravel) y cliente (React)
- ✅ Componentes de selector de idioma listos para usar
- ✅ Soporte para 3 idiomas: Español (es), Inglés (en), Catalán (ca)

## Estructura de Archivos

### Backend (Laravel)

- **`app/Http/Middleware/SetLocale.php`**: Middleware que establece el idioma de Laravel basándose en la cookie `locale`
- **`bootstrap/app.php`**: Registra el middleware y excluye la cookie `locale` del cifrado
- **`resources/views/app.blade.php`**: Inyecta `window.__INITIAL_LOCALE__` en el `<head>`
- **`lang/es.json`**, **`lang/en.json`**, **`lang/ca.json`**: Archivos de traducción JSON

### Frontend (React)

- **`resources/js/i18n.js`**: Configuración e inicialización **síncrona** de i18next (importado primero)
- **`resources/js/hooks/use-locale.tsx`**: Hook personalizado para gestionar el idioma
- **`resources/js/components/locale-switcher.tsx`**: Componentes de selector de idioma
- **`resources/js/app.tsx`**: Importa `i18n` **antes** de React para prevenir flash

## Uso

### Hook `useLocale()`

El hook proporciona acceso al idioma actual y una función para actualizarlo. El idioma se obtiene automáticamente del servidor, sin flash:

```typescript
import { useLocale } from '@/hooks/use-locale';

function MyComponent() {
    const { locale, updateLocale, availableLocales } = useLocale();
    
    return (
        <div>
            <p>Idioma actual: {locale}</p>
            <button onClick={() => updateLocale('es')}>Español</button>
            <button onClick={() => updateLocale('en')}>English</button>
            <button onClick={() => updateLocale('ca')}>Català</button>
        </div>
    );
}
```

**Nota**: No necesitas llamar ninguna función de inicialización. El idioma se sincroniza automáticamente desde el servidor gracias a la importación temprana de i18next.

### Componentes de Selector de Idioma

#### `LocaleSwitcher` (Dropdown)

Selector de idioma con un select estilizado:

```typescript
import { LocaleSwitcher } from '@/components/locale-switcher';

function Header() {
    return (
        <header>
            <LocaleSwitcher />
        </header>
    );
}
```

#### `LocaleSwitcherSimple` (Botones)

Selector de idioma con botones para cada idioma:

```typescript
import { LocaleSwitcherSimple } from '@/components/locale-switcher';

function Header() {
    return (
        <header>
            <LocaleSwitcherSimple />
        </header>
    );
}
```

### Traducción de Textos

Usa el hook `useTranslation` de `react-i18next`:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation();
    
    return (
        <div>
            <h1>{t('Welcome')}</h1>
            <p>{t('This is a description')}</p>
        </div>
    );
}
```

## Agregar Nuevas Traducciones

1. Agrega las claves de traducción en los archivos JSON:

**`lang/es.json`**:
```json
{
    "Welcome": "Bienvenido",
    "This is a description": "Esta es una descripción"
}
```

**`lang/en.json`**:
```json
{
    "Welcome": "Welcome",
    "This is a description": "This is a description"
}
```

**`lang/ca.json`**:
```json
{
    "Welcome": "Benvingut",
    "This is a description": "Aquesta és una descripció"
}
```

2. Usa las claves en tus componentes con `t()`:

```typescript
const { t } = useTranslation();
<h1>{t('Welcome')}</h1>
```

## Agregar Nuevos Idiomas

Los idiomas disponibles se gestionan centralmente desde `config/app.php`. Solo necesitas:

1. **Agregar el locale en `config/app.php`**:
```php
'available_locales' => ['es', 'en', 'ca', 'fr'],  // ← Agregar 'fr'
```

2. **Crear el archivo de traducción JSON** en `lang/` (ej: `lang/fr.json`)

**¡Eso es todo!** El archivo `i18n.js` carga automáticamente todos los archivos JSON de la carpeta `lang/` usando `import.meta.glob`, por lo que no necesitas modificarlo manualmente.

3. **(Opcional)** Agrega etiquetas y banderas en `locale-switcher.tsx`:
Si quieres personalizar cómo se muestra el nuevo idioma en los selectores:
```typescript
const LOCALE_LABELS: Record<Locale, string> = {
    es: 'Español',
    en: 'English',
    ca: 'Català',
    fr: 'Français',  // Nuevo idioma
};

const LOCALE_FLAGS: Record<Locale, string> = {
    es: '🇪🇸',
    en: '🇬🇧',
    ca: '🇪🇸',
    fr: '🇫🇷',  // Nuevo idioma
};
```

El nuevo idioma estará disponible **automáticamente** en:
- ✅ Middleware Laravel (`SetLocale`)
- ✅ Manejo de excepciones (`bootstrap/app.php`)
- ✅ Sistema de traducciones i18next (carga automática de JSON)
- ✅ Hook `useLocale()` 
- ✅ Componentes de selector de idioma
- ✅ Validación de locales en toda la aplicación

**Sin necesidad de editar múltiples archivos manualmente.**

### Configuración Centralizada

Todos los locales se definen en **un solo lugar**: `config/app.php`

```php
// config/app.php
'locale' => env('APP_LOCALE', 'es'),  // ← Idioma por defecto
'available_locales' => ['es', 'en', 'ca'],  // ← Idiomas disponibles
```

Estos valores se comparten automáticamente con:
- **Middleware Laravel** - Lee de `config('app.available_locales')` para validación
- **Frontend React** - Recibe los locales disponibles via Inertia shared data
- **i18next** - Carga dinámicamente todos los archivos JSON de `lang/` usando `import.meta.glob`
- **Componentes de selector** - Obtienen los locales desde Inertia (no hardcoded)
- **Sistema de validación** - Todos usan la misma fuente de configuración
- **Fallback de traducciones** - Usa inglés (`'en'`) cuando falta una clave

### Carga Dinámica de Traducciones

El archivo `i18n.js` usa `import.meta.glob` de Vite para cargar **automáticamente** todos los archivos JSON:

```javascript
const translationModules = import.meta.glob('../../lang/*.json', { eager: true })

// Construye el objeto resources dinámicamente
const resources = {}
Object.entries(translationModules).forEach(([path, module]) => {
    const locale = path.match(/\/([^/]+)\.json$/)?.[1]
    if (locale) {
        resources[locale] = { translation: module.default || module }
    }
})
```

**Beneficios**:
- ✅ Cuando agregas `lang/fr.json`, se importa automáticamente
- ✅ No necesitas modificar `i18n.js` al agregar idiomas
- ✅ Solo necesitas actualizar `config/app.php` y crear el archivo JSON

## Funcionamiento Interno

1. **Servidor**: El middleware `SetLocale` lee la cookie `locale` y establece `App::setLocale()`
2. **HTML**: El atributo `lang` del HTML se renderiza con el locale correcto desde el servidor
3. **Script inline**: Se inyecta `window.__INITIAL_LOCALE__` en el `<head>` **antes** de cualquier script de React
4. **i18next**: Se inicializa **síncronamente** al importarse, usando el locale del servidor
5. **React**: Se monta con el idioma ya configurado, sin necesidad de efectos o inicializaciones adicionales
6. **Cambio de idioma**: Al cambiar se actualiza la cookie, i18next y se recarga con `router.reload()`

### Prevención de Flash de Idioma (100% Eliminado)

El sistema evita **completamente** el "flash" de idioma mediante:

- ✅ **Script inline en `<head>`**: `window.__INITIAL_LOCALE__` disponible desde el servidor
- ✅ **Sincronización SSR**: El locale actual viene del servidor antes de React
- ✅ **i18next importado primero**: `import './i18n'` se ejecuta **antes** de crear la app React
- ✅ **Inicialización síncrona**: `initImmediate: false` fuerza inicialización síncrona
- ✅ **Carga dinámica de traducciones**: `import.meta.glob` carga todos los JSON automáticamente
- ✅ **Estado inicial lazy**: El hook usa el locale del servidor desde el primer render
- ✅ **Suspense desactivado**: `useSuspense: false` para renderizado inmediato
- ✅ **Fallback a inglés**: Si falta una traducción, usa automáticamente el inglés (`fallbackLng: 'en'`)

### Orden de Carga Crítico

```typescript
// app.tsx
import './i18n';  // ← 1. i18next se inicializa PRIMERO (síncrono)
import { createInertiaApp } from '@inertiajs/react';
// ... otros imports

initializeTheme();  // ← 2. Tema (también previene flash)

createInertiaApp({  // ← 3. React se monta CON idioma ya configurado
    // ...
});
```

**Resultado**: React renderiza directamente en el idioma correcto, sin flash ni transiciones.

## Ejemplo Completo

Ver `resources/js/pages/welcome.tsx` para un ejemplo completo de implementación.

