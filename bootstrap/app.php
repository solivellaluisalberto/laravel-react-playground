<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'locale']);

        $middleware->web(append: [
            HandleAppearance::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Establecer el locale antes de renderizar páginas de error
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            // Obtener el idioma de la cookie
            $locale = $request->cookie('locale', config('app.locale', 'es'));

            // Validar que el idioma es soportado
            $availableLocales = config('app.available_locales', ['es']);
            if (in_array($locale, $availableLocales)) {
                app()->setLocale($locale);
            }

            // Dejar que Laravel maneje el renderizado normal
            return null;
        });
    })->create();
