<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AuditLog;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\CustomerRequest;
use App\Models\Invoice;
use App\Models\Schedule;
use App\Models\Technician;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $todayDate = now()->toDateString();

        $kpiData = [
            'totalCustomers' => Customer::count(),
            'activeContracts' => Contract::where('status', 'active')->count(),
            'monthlyRevenue' => Invoice::whereYear('tanggal_invoice', now()->year)
                ->whereMonth('tanggal_invoice', now()->month)
                ->sum('total'),
            'pendingRequests' => CustomerRequest::whereIn('status', ['baru', 'ditinjau'])->count(),
        ];

        $user = auth()->user();
        $isTechnician = $user && $user->roles->pluck('name')->contains('technician');
        $hasCheckedIn = false;
        $todayAttendance = null;

        if ($isTechnician) {
            $todayAttendance = Attendance::where('technician_id', $user->id)
                ->whereDate('tanggal', $todayDate)
                ->first();
            $hasCheckedIn = $todayAttendance && ! empty($todayAttendance->jam_masuk);

            $todaySchedules = Schedule::with(['customer', 'technician'])
                ->where('technician_id', $user->id)
                ->whereDate('tanggal', $todayDate)
                ->orderByRaw("FIELD(status, 'sedang_dikerjakan', 'tiba', 'dalam_perjalanan', 'ditugaskan', 'dijadwalkan', 'selesai', 'dibatalkan') ASC")
                ->orderBy('created_at', 'desc')
                ->get()
                ->unique('id')
                ->values();
        } else {
            $todaySchedules = Schedule::with(['customer', 'technician'])
                ->whereDate('tanggal', $todayDate)
                ->orderByRaw("FIELD(status, 'sedang_dikerjakan', 'tiba', 'dalam_perjalanan', 'ditugaskan', 'dijadwalkan', 'selesai', 'dibatalkan') ASC")
                ->orderBy('created_at', 'desc')
                ->take(15)
                ->get()
                ->unique('id')
                ->values();
        }

        // Distinct technician user IDs
        $techUserIds = User::whereHas('technician', function ($q) {
            $q->where('status', 'aktif');
        })->orWhereHas('roles', function ($q) {
            $q->where('name', 'technician');
        })->pluck('id')->unique();

        $totalTechsCount = $techUserIds->count();

        // Checked in today and has not checked out yet
        $checkedInTechIds = Attendance::whereIn('technician_id', $techUserIds)
            ->whereDate('tanggal', $todayDate)
            ->whereNotNull('jam_masuk')
            ->whereNull('jam_keluar')
            ->pluck('technician_id')
            ->unique()
            ->toArray();

        // Technicians currently on duty / working on a schedule today
        $workingTechIds = Schedule::whereDate('tanggal', $todayDate)
            ->whereIn('status', ['sedang_dikerjakan', 'tiba', 'dalam_perjalanan'])
            ->whereIn('technician_id', $techUserIds)
            ->pluck('technician_id')
            ->unique()
            ->toArray();

        // Technicians who completed schedules today and not currently working on another
        $completedTechIds = Schedule::whereDate('tanggal', $todayDate)
            ->where('status', 'selesai')
            ->whereIn('technician_id', $techUserIds)
            ->whereNotIn('technician_id', $workingTechIds)
            ->pluck('technician_id')
            ->unique()
            ->toArray();

        $workingCount = count($workingTechIds);
        $onlineStandbyCount = count(array_diff($checkedInTechIds, $workingTechIds));
        $completedTodayCount = count($completedTechIds);
        $offlineCount = max(0, $totalTechsCount - count($checkedInTechIds));

        $technicianCounts = [
            'online' => $onlineStandbyCount,
            'working' => $workingCount,
            'completedToday' => $completedTodayCount,
            'offline' => $offlineCount,
            'total' => $totalTechsCount,
        ];

        $recentRequests = CustomerRequest::with('customer')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $unpaidInvoices = Invoice::with('customer')
            ->whereIn('status_pembayaran', ['terbit', 'dikirim', 'jatuh_tempo', 'dibayar_sebagian'])
            ->orderBy('jatuh_tempo', 'asc')
            ->take(5)
            ->get();

        $recentAuditLogs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'kpiData' => $kpiData,
            'todaySchedules' => $todaySchedules,
            'technicianCounts' => $technicianCounts,
            'recentRequests' => $recentRequests,
            'unpaidInvoices' => $unpaidInvoices,
            'recentAuditLogs' => $recentAuditLogs,
            'hasCheckedIn' => $hasCheckedIn,
            'todayAttendance' => $todayAttendance,
        ]);
    }
}
