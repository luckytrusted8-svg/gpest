<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GeofenceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\LocationTrackingController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SurveyReportController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('permission:dashboard.view');
    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    Route::resource('customers', CustomerController::class)->middleware('permission:customers.view');
    Route::resource('contracts', ContractController::class)->middleware('permission:contracts.view');
    Route::resource('schedules', ScheduleController::class)->middleware('permission:schedules.view');
    Route::resource('technicians', TechnicianController::class)->middleware('permission:technicians.view');
    Route::resource('work-reports', WorkReportController::class)->middleware('permission:work-reports.view');
    Route::post('work-reports/{workReport}/approve', [WorkReportController::class, 'approve'])->name('work-reports.approve')->middleware('permission:work-reports.approve');
    Route::post('work-reports/{workReport}/revision', [WorkReportController::class, 'requestRevision'])->name('work-reports.revision')->middleware('permission:work-reports.approve');
    Route::get('work-reports/{workReport}/pdf', [PdfController::class, 'workReport'])->name('work-reports.pdf');

    Route::resource('survey-reports', SurveyReportController::class);
    Route::post('survey-reports/{surveyReport}/approve', [SurveyReportController::class, 'approve'])->name('survey-reports.approve');
    Route::get('survey-reports/{surveyReport}/pdf', [PdfController::class, 'surveyReport'])->name('survey-reports.pdf');

    Route::resource('crm', LeadController::class)->names('crm');
    Route::post('crm/{lead}/convert', [LeadController::class, 'convertToCustomer'])->name('crm.convert');
    Route::post('crm/{lead}/activity', [LeadController::class, 'addActivity'])->name('crm.activity');

    Route::resource('quotations', QuotationController::class)->names('quotations');
    Route::post('quotations/{quotation}/kirim', [QuotationController::class, 'kirim'])->name('quotations.kirim');
    Route::post('quotations/{quotation}/terima', [QuotationController::class, 'terima'])->name('quotations.terima');
    Route::post('quotations/{quotation}/tolak', [QuotationController::class, 'tolak'])->name('quotations.tolak');
    Route::post('quotations/{quotation}/duplikat', [QuotationController::class, 'duplikat'])->name('quotations.duplikat');
    Route::get('quotations/{quotation}/pdf', [QuotationController::class, 'cetakPdf'])->name('quotations.pdf');

    Route::resource('users', UserController::class)->middleware('role:super_admin');

    Route::get('master-data', [MasterDataController::class, 'index'])->name('master-data.index')->middleware('role:super_admin|admin');
    Route::post('master-data/{type}', [MasterDataController::class, 'store'])->name('master-data.store');
    Route::put('master-data/{type}/{id}', [MasterDataController::class, 'update'])->name('master-data.update');
    Route::delete('master-data/{type}/{id}', [MasterDataController::class, 'destroy'])->name('master-data.destroy');

    Route::resource('attendance', AttendanceController::class)->only(['index', 'show']);
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::post('attendance/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.check-out');
    Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::get('tracking', [LocationTrackingController::class, 'index'])->name('tracking.index');
    Route::get('tracking/history', [LocationTrackingController::class, 'riwayat'])->name('tracking.history');
    Route::get('tracking/status', [LocationTrackingController::class, 'statusTeknisi'])->name('tracking.status');
    Route::resource('geofences', GeofenceController::class)->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware('auth')->post('api/tracking/update', [LocationTrackingController::class, 'updateLokasi'])->name('tracking.update');

require __DIR__.'/auth.php';
require __DIR__.'/customer.php';
