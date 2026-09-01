<?php

use App\Http\Controllers\Api\MobileApiController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [MobileApiController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('mobile')->group(function () {
    Route::get('/dashboard', [MobileApiController::class, 'dashboard']);
    Route::get('/tasks', [MobileApiController::class, 'tasks']);
    Route::get('/tasks/{id}', [MobileApiController::class, 'taskDetail']);
    Route::post('/tasks/{id}/check-in', [MobileApiController::class, 'checkIn']);
    Route::post('/tasks/{id}/treatment', [MobileApiController::class, 'addTreatment']);
    Route::post('/tasks/{id}/check-out', [MobileApiController::class, 'checkOut']);
    Route::get('/notifications', [MobileApiController::class, 'notifications']);
    Route::get('/profile', [MobileApiController::class, 'profile']);
});
