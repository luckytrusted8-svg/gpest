<?php

use App\Http\Controllers\CustomerPortalController;
use Illuminate\Support\Facades\Route;

Route::prefix('portal')->name('portal.')->group(function () {
    // Guest routes
    Route::get('/login', [CustomerPortalController::class, 'loginForm'])->name('login');
    Route::post('/login', [CustomerPortalController::class, 'login']);

    Route::get('/register', [CustomerPortalController::class, 'registerForm'])->name('register');
    Route::post('/register', [CustomerPortalController::class, 'register']);

    // Google OAuth routes
    Route::get('/auth/google', [CustomerPortalController::class, 'googleRedirect'])->name('auth.google');
    Route::get('/auth/google/callback', [CustomerPortalController::class, 'googleCallback'])->name('auth.google.callback');

    // Authenticated customer portal routes
    Route::middleware('auth:customer')->group(function () {
        Route::post('/logout', [CustomerPortalController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [CustomerPortalController::class, 'dashboard'])->name('dashboard');

        // Sites (Titik Lokasi) Management by Customer
        Route::get('/sites', [CustomerPortalController::class, 'sites'])->name('sites');
        Route::post('/sites', [CustomerPortalController::class, 'storeSite'])->name('sites.store');
        Route::put('/sites/{site}', [CustomerPortalController::class, 'updateSite'])->name('sites.update');
        Route::delete('/sites/{site}', [CustomerPortalController::class, 'destroySite'])->name('sites.destroy');

        // Customer Profile / Company Information
        Route::get('/profile', [CustomerPortalController::class, 'profile'])->name('profile');
        Route::put('/profile', [CustomerPortalController::class, 'updateProfile'])->name('profile.update');

        // Other Portal Features
        Route::get('/contracts', [CustomerPortalController::class, 'contracts'])->name('contracts');
        Route::get('/schedules', [CustomerPortalController::class, 'schedules'])->name('schedules');
        Route::get('/work-reports', [CustomerPortalController::class, 'workReports'])->name('work-reports');
        Route::get('/work-reports/{workReport}', [CustomerPortalController::class, 'showWorkReport'])->name('work-reports.show');
        Route::get('/invoices', [CustomerPortalController::class, 'invoices'])->name('invoices');
        Route::get('/requests', [CustomerPortalController::class, 'requests'])->name('requests');
        Route::post('/requests', [CustomerPortalController::class, 'storeRequest'])->name('requests.store');
    });
});
