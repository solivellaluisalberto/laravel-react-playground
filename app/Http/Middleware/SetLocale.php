<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = config('app.available_locales', ['es']);
        $defaultLocale = config('app.locale', 'es');

        // Intentar obtener el idioma de la cookie
        $locale = $request->cookie('locale');

        // Si no hay cookie, intentar obtener del header Accept-Language
        if (! $locale) {
            $locale = $request->getPreferredLanguage($availableLocales);
        }

        // Validar que el idioma sea válido
        if (! in_array($locale, $availableLocales)) {
            $locale = $defaultLocale;
        }

        // Establecer el idioma de la aplicación
        App::setLocale($locale);

        $response = $next($request);

        // Asegurarse de que la cookie persista en la respuesta
        if ($request->hasCookie('locale')) {
            return $response->cookie(
                'locale',
                $locale,
                60 * 24 * 365, // 1 año
                '/',
                null,
                false,
                false
            );
        }

        return $response;
    }
}
