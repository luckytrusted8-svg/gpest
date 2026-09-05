<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Schedule;
use App\Models\User;
use App\Models\WorkReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

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
            $request->session()->regenerate();

            return redirect()->intended(route('portal.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Kredensial yang Anda masukkan tidak cocok dengan data kami.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('portal.login');
    }

    public function googleRedirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function googleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('portal.login')->withErrors([
                'email' => 'Gagal terhubung ke Google. Silakan coba lagi.',
            ]);
        }

        // Find existing customer user by google_id first, then by email
        $customerUser = CustomerUser::where('google_id', $googleUser->getId())->first()
            ?? CustomerUser::where('email', $googleUser->getEmail())->first();

        if (! $customerUser) {
            return redirect()->route('portal.login')->withErrors([
                'email' => 'Email Google Anda ('.$googleUser->getEmail().') tidak terdaftar sebagai pelanggan. Hubungi admin G-PEST.',
            ]);
        }

        if ($customerUser->status !== 'active') {
            return redirect()->route('portal.login')->withErrors([
                'email' => 'Akun pelanggan Anda tidak aktif. Hubungi admin G-PEST.',
            ]);
        }

        // Update google_id and avatar if not yet set
        $customerUser->update([
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
        ]);

        Auth::guard('customer')->login($customerUser, true);
        request()->session()->regenerate();

        return redirect()->intended(route('portal.dashboard'));
    }

    public function dashboard()
    {
        $customerUser = Auth::guard('customer')->user();
        $customerId = $customerUser->customer_id;

        $stats = [
            'active_contracts' => Contract::where('customer_id', $customerId)->where('status', 'active')->count(),
            'upcoming_schedules' => Schedule::where('customer_id', $customerId)
                ->whereIn('status', ['dijadwalkan', 'ditugaskan', 'dalam_perjalanan', 'tiba', 'sedang_dikerjakan'])
                ->count(),
            'completed_schedules' => Schedule::where('customer_id', $customerId)->where('status', 'selesai')->count(),
            'work_reports_count' => WorkReport::where('customer_id', $customerId)->count(),
        ];

        $upcomingSchedules = Schedule::with('technician')
            ->where('customer_id', $customerId)
            ->whereIn('status', ['dijadwalkan', 'ditugaskan', 'dalam_perjalanan', 'tiba', 'sedang_dikerjakan'])
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->take(5)
            ->get();

        $recentWorkReports = WorkReport::where('customer_id', $customerId)
            ->orderBy('tanggal', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('CustomerPortal/Dashboard', [
            'customerUser' => $customerUser->load('customer'),
            'stats' => $stats,
            'upcomingSchedules' => $upcomingSchedules,
            'recentWorkReports' => $recentWorkReports,
        ]);
    }

    public function contracts()
    {
        $customerUser = Auth::guard('customer')->user();
        $contracts = Contract::where('customer_id', $customerUser->customer_id)
            ->orderBy('start_date', 'desc')
            ->paginate(10);

        return Inertia::render('CustomerPortal/Contracts', [
            'customerUser' => $customerUser->load('customer'),
            'contracts' => $contracts,
        ]);
    }

    public function schedules()
    {
        $customerUser = Auth::guard('customer')->user();
        $schedules = Schedule::with('technician')
            ->where('customer_id', $customerUser->customer_id)
            ->orderBy('tanggal', 'desc')
            ->paginate(15);

        return Inertia::render('CustomerPortal/Schedules', [
            'customerUser' => $customerUser->load('customer'),
            'schedules' => $schedules,
        ]);
    }

    public function workReports()
    {
        $customerUser = Auth::guard('customer')->user();
        $workReports = WorkReport::where('customer_id', $customerUser->customer_id)
            ->orderBy('tanggal', 'desc')
            ->paginate(15);

        return Inertia::render('CustomerPortal/WorkReports', [
            'customerUser' => $customerUser->load('customer'),
            'workReports' => $workReports,
        ]);
    }

    public function showWorkReport(WorkReport $workReport)
    {
        $customerUser = Auth::guard('customer')->user();

        if ($workReport->customer_id !== $customerUser->customer_id) {
            abort(403);
        }

        $workReport->load(['customer', 'technician', 'photos']);

        return Inertia::render('CustomerPortal/WorkReportShow', [
            'customerUser' => $customerUser->load('customer'),
            'workReport' => $workReport,
        ]);
    }

    public function invoices()
    {
        $customerUser = Auth::guard('customer')->user();
        $invoices = Invoice::where('customer_id', $customerUser->customer_id)
            ->orderBy('tanggal_invoice', 'desc')
            ->paginate(15);

        return Inertia::render('CustomerPortal/Invoices', [
            'customerUser' => $customerUser->load('customer'),
            'invoices' => $invoices,
        ]);
    }

    public function requests()
    {
        $customerUser = Auth::guard('customer')->user();
        $requests = CustomerRequest::where('customer_id', $customerUser->customer_id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('CustomerPortal/Requests', [
            'customerUser' => $customerUser->load('customer'),
            'requests' => $requests,
        ]);
    }

    public function storeRequest(Request $request)
    {
        $customerUser = Auth::guard('customer')->user();
        $customer = $customerUser->customer;

        $validated = $request->validate([
            'jenis_layanan' => 'required|string|max:255',
            'prioritas' => 'required|in:rendah,sedang,tinggi,darurat',
            'deskripsi' => 'required|string',
            'tanggal_permintaan' => 'nullable|date',
        ]);

        $req = CustomerRequest::create([
            'request_number' => '',
            'customer_id' => $customerUser->customer_id,
            'jenis_layanan' => $validated['jenis_layanan'],
            'prioritas' => $validated['prioritas'],
            'deskripsi' => $validated['deskripsi'],
            'tanggal_permintaan' => $validated['tanggal_permintaan'] ?? null,
            'status' => 'baru',
        ]);

        $adminUserIds = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['super_admin', 'admin', 'supervisor']);
        })->pluck('id')->unique();

        if ($adminUserIds->isEmpty()) {
            $adminUserIds = User::pluck('id')->unique();
        }

        foreach ($adminUserIds as $adminId) {
            Notification::create([
                'user_id' => $adminId,
                'judul' => 'Permintaan Layanan Baru ('.$req->request_number.')',
                'pesan' => 'Pelanggan '.($customer->company_name ?? 'Klien').' mengirim request: '.$validated['jenis_layanan'],
                'jenis' => 'info',
                'modul' => 'customer-requests',
                'url_tujuan' => '/customer-requests/'.$req->id,
            ]);
        }

        return back()->with('success', 'Permintaan Anda berhasil dikirim ke tim kami.');
    }
}
