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
                ->orderByRaw("FIELD(status, 'sedang_dikerjakan', 'tiba', 'dalam_perjalanan', 'ditugaskan', 'dijadwalkan', 'selesai', 'dibatalkan') ASC")
                ->orderBy('created_at', 'desc')
                ->get()
                ->unique('id')
                ->values();
        } else {
            $todaySchedules = Schedule::with(['customer', 'technician'])
                ->whereDate('tanggal', $todayDate)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->unique('id')
                ->values();
        }

        $technicianCounts = [
            'online' => Technician::where('status', 'aktif')->count(),
            'working' => Schedule::whereDate('tanggal', $todayDate)->whereIn('status', ['sedang_dikerjakan', 'tiba', 'dalam_perjalanan'])->count(),
            'completedToday' => Schedule::whereDate('tanggal', $todayDate)->where('status', 'selesai')->count(),
            'offline' => Technician::where('status', '!=', 'aktif')->count(),
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
