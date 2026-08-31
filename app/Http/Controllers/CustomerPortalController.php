<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Schedule;
use App\Models\WorkReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerPortalController extends Controller
{
    public function loginForm()
    {
        if (Auth::guard('customer')->check()) {
            return redirect()->route('portal.dashboard');
        }

        return Inertia::render('CustomerPortal/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('customer')->attempt($credentials, $request->boolean('remember'))) {
            $customerUser = Auth::guard('customer')->user();

            if ($customerUser->status !== 'aktif') {
                Auth::guard('customer')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors([
                    'email' => 'Akun portal Anda sedang tidak aktif. Silakan hubungi admin.',
                ]);
            }

            $request->session()->regenerate();

            return redirect()->intended(route('portal.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Kredensial yang Anda masukkan salah.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('customer')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('portal.login');
    }

    public function dashboard()
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');
        $customerId = $customerUser->customer_id;

        $stats = [
            'activeContracts' => Contract::where('customer_id', $customerId)->where('status', 'active')->count(),
            'upcomingSchedules' => Schedule::where('customer_id', $customerId)->whereIn('status', ['dijadwalkan', 'ditugaskan', 'dalam_perjalanan', 'tiba', 'sedang_dikerjakan'])->count(),
            'completedServices' => Schedule::where('customer_id', $customerId)->where('status', 'selesai')->count(),
            'recentReports' => WorkReport::where('customer_id', $customerId)->count(),
        ];

        $upcomingSchedules = Schedule::with('technician')
            ->where('customer_id', $customerId)
            ->orderBy('tanggal', 'asc')
            ->take(5)
            ->get();

        $recentWorkReports = WorkReport::with('technician')
            ->where('customer_id', $customerId)
            ->whereIn('status', ['dikirim', 'disetujui', 'selesai'])
            ->orderBy('tanggal', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('CustomerPortal/Dashboard', [
            'customerUser' => $customerUser,
            'stats' => $stats,
            'upcomingSchedules' => $upcomingSchedules,
            'recentWorkReports' => $recentWorkReports,
        ]);
    }

    public function contracts()
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');
        $contracts = Contract::where('customer_id', $customerUser->customer_id)
            ->orderBy('start_date', 'desc')
            ->paginate(10);

        return Inertia::render('CustomerPortal/Contracts', [
            'customerUser' => $customerUser,
            'contracts' => $contracts,
        ]);
    }

    public function schedules()
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');
        $schedules = Schedule::with('technician')
            ->where('customer_id', $customerUser->customer_id)
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('CustomerPortal/Schedules', [
            'customerUser' => $customerUser,
            'schedules' => $schedules,
        ]);
    }

    public function workReports()
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');
        $workReports = WorkReport::with('technician')
            ->where('customer_id', $customerUser->customer_id)
            ->whereIn('status', ['dikirim', 'disetujui', 'selesai'])
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('CustomerPortal/WorkReports', [
            'customerUser' => $customerUser,
            'workReports' => $workReports,
        ]);
    }

    public function showWorkReport(WorkReport $workReport)
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');

        if ($workReport->customer_id !== $customerUser->customer_id) {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        $workReport->load(['customer', 'contract', 'schedule', 'technician', 'photos']);

        return Inertia::render('CustomerPortal/WorkReportShow', [
            'customerUser' => $customerUser,
            'workReport' => $workReport,
        ]);
    }
}
