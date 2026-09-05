<?php

use App\Http\Controllers\CustomerPortalController;
use Illuminate\Support\Facades\Route;

Route::prefix('portal')->name('portal.')->group(function () {
    // Guest routes
    Route::get('/login', [CustomerPortalController::class, 'loginForm'])->name('login');
    Route::post('/login', [CustomerPortalController::class, 'login']);

    // Google OAuth routes
    Route::get('/auth/google', [CustomerPortalController::class, 'googleRedirect'])->name('auth.google');
    Route::get('/auth/google/callback', [CustomerPortalController::class, 'googleCallback'])->name('auth.google.callback');

    // Authenticated customer portal routes
    Route::middleware('auth:customer')->group(function () {
        Route::post('/logout', [CustomerPortalController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [CustomerPortalController::class, 'dashboard'])->name('dashboard');
        Route::get('/contracts', [CustomerPortalController::class, 'contracts'])->name('contracts');
        Route::get('/schedules', [CustomerPortalController::class, 'schedules'])->name('schedules');
        Route::get('/work-reports', [CustomerPortalController::class, 'workReports'])->name('work-reports');
        Route::get('/work-reports/{workReport}', [CustomerPortalController::class, 'showWorkReport'])->name('work-reports.show');
        Route::get('/invoices', [CustomerPortalController::class, 'invoices'])->name('invoices');
        Route::get('/requests', [CustomerPortalController::class, 'requests'])->name('requests');
        Route::post('/requests', [CustomerPortalController::class, 'storeRequest'])->name('requests.store');
    });
});
