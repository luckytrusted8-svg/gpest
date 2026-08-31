<?php

namespace App\Providers;

use App\Models\Notification;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'notifikasi_belum_dibaca' => fn () => auth()->check()
                ? Notification::where('user_id', auth()->id())->whereNull('dibaca_pada')->count()
                : 0,
        ]);
    }
}
