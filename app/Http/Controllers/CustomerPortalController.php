<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Schedule;
use App\Models\Site;
use App\Models\User;
use App\Models\WorkReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $customerUser = CustomerUser::where('email', $credentials['email'])->first();

        if (! $customerUser || ! $customerUser->password || ! Hash::check($credentials['password'], $customerUser->password)) {
            return back()->withErrors([
                'email' => 'Email atau kata sandi yang Anda masukkan salah.',
            ])->onlyInput('email');
        }

        if ($customerUser->status === 'tidak_aktif') {
            return back()->withErrors([
                'email' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi admin G-PEST.',
            ])->onlyInput('email');
        }

        Auth::guard('customer')->login($customerUser, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('portal.dashboard'));
    }

    public function registerForm()
    {
        if (Auth::guard('customer')->check()) {
            return redirect()->route('portal.dashboard');
        }

        return Inertia::render('CustomerPortal/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:customer_users,email',
            'phone' => 'required|string|max:30',
            'password' => 'required|string|min:6|confirmed',
            'address' => 'required|string|max:500',
            'site_name' => 'nullable|string|max:255',
            'site_address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // 1. Create Customer record
        $customer = Customer::create([
            'company_name' => $validated['company_name'],
            'pic_name' => $validated['pic_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'location' => $validated['address'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'status' => 'active',
        ]);

        // 2. Create Customer User Account
        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => $validated['pic_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => 'aktif',
        ]);

        // 3. Create First Titik Lokasi (Site)
        $siteName = ! empty($validated['site_name']) ? $validated['site_name'] : 'Lokasi Utama ('.$validated['company_name'].')';
        $siteAddress = ! empty($validated['site_address']) ? $validated['site_address'] : $validated['address'];

        Site::create([
            'customer_id' => $customer->id,
            'site_name' => $siteName,
            'address' => $siteAddress,
            'pic_name' => $validated['pic_name'],
            'phone' => $validated['phone'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ]);

        // 4. Send notification to admin users
        $adminUserIds = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['super_admin', 'admin', 'supervisor']);
        })->pluck('id')->unique();

        if ($adminUserIds->isEmpty()) {
            $adminUserIds = User::pluck('id')->unique();
        }

        foreach ($adminUserIds as $adminId) {
            Notification::create([
                'user_id' => $adminId,
                'judul' => 'Pelanggan Baru Mendaftar!',
                'pesan' => 'Pelanggan '.$validated['company_name'].' (PIC: '.$validated['pic_name'].') telah mendaftar mandiri beserta Titik Lokasi pertamanya.',
                'jenis' => 'info',
                'modul' => 'customers',
                'url_tujuan' => '/customers/'.$customer->id,
            ]);
        }

        // 5. Auto login
        Auth::guard('customer')->login($customerUser, true);
        $request->session()->regenerate();

        return redirect()->route('portal.dashboard')->with('success', 'Selamat datang! Akun & data lokasi Anda berhasil didaftarkan.');
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
            // Check if Customer already exists with this email
            $customer = Customer::where('email', $googleUser->getEmail())->first();

            if (! $customer) {
                // Auto create new Customer record
                $name = $googleUser->getName() ?: 'Pelanggan Google';
                $customer = Customer::create([
                    'company_name' => $name,
                    'pic_name' => $name,
                    'email' => $googleUser->getEmail(),
                    'phone' => '-',
                    'address' => 'Belum dilengkapi',
                    'status' => 'active',
                ]);

                // Create initial site
                Site::create([
                    'customer_id' => $customer->id,
                    'site_name' => 'Lokasi Utama ('.$name.')',
                    'address' => 'Belum dilengkapi',
                    'pic_name' => $name,
                    'phone' => '-',
                ]);
            }

            // Auto create CustomerUser
            $customerUser = CustomerUser::create([
                'customer_id' => $customer->id,
                'nama' => $googleUser->getName() ?: 'Pelanggan',
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'status' => 'aktif',
                'password' => null,
            ]);

            // Notify admin about new auto-registered customer
            $adminUserIds = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['super_admin', 'admin', 'supervisor']);
            })->pluck('id')->unique();

            if ($adminUserIds->isEmpty()) {
                $adminUserIds = User::pluck('id')->unique();
            }

            foreach ($adminUserIds as $adminId) {
                Notification::create([
                    'user_id' => $adminId,
                    'judul' => 'Pelanggan Baru Masuk (Google)',
                    'pesan' => 'Pelanggan baru '.$googleUser->getName().' ('.$googleUser->getEmail().') telah masuk via Google OAuth.',
                    'jenis' => 'info',
                    'modul' => 'customers',
                    'url_tujuan' => '/customers/'.$customer->id,
                ]);
            }
        } else {
            if ($customerUser->status === 'tidak_aktif') {
                return redirect()->route('portal.login')->withErrors([
                    'email' => 'Akun pelanggan Anda dinonaktifkan. Hubungi admin G-PEST.',
                ]);
            }

            // Update google_id and avatar
            $customerUser->update([
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
            ]);
        }

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
            'sites_count' => Site::where('customer_id', $customerId)->count(),
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

        $sites = Site::where('customer_id', $customerId)->latest()->take(5)->get();

        return Inertia::render('CustomerPortal/Dashboard', [
            'customerUser' => $customerUser->load('customer'),
            'stats' => $stats,
            'upcomingSchedules' => $upcomingSchedules,
            'recentWorkReports' => $recentWorkReports,
            'sites' => $sites,
        ]);
    }

    public function sites()
    {
        $customerUser = Auth::guard('customer')->user();
        $sites = Site::where('customer_id', $customerUser->customer_id)
            ->latest()
            ->paginate(15);

        return Inertia::render('CustomerPortal/Sites', [
            'customerUser' => $customerUser->load('customer'),
            'sites' => $sites,
        ]);
    }

    public function storeSite(Request $request): RedirectResponse
    {
        $customerUser = Auth::guard('customer')->user();

        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'pic_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'notes' => 'nullable|string|max:500',
        ]);

        $site = Site::create([
            'customer_id' => $customerUser->customer_id,
            'site_name' => $validated['site_name'],
            'address' => $validated['address'],
            'pic_name' => $validated['pic_name'] ?? $customerUser->nama,
            'phone' => $validated['phone'] ?? $customerUser->customer->phone,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Notify admins
        $adminUserIds = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['super_admin', 'admin', 'supervisor']);
        })->pluck('id')->unique();

        if ($adminUserIds->isEmpty()) {
            $adminUserIds = User::pluck('id')->unique();
        }

        foreach ($adminUserIds as $adminId) {
            Notification::create([
                'user_id' => $adminId,
                'judul' => 'Titik Lokasi Baru Ditambahkan',
                'pesan' => 'Pelanggan '.$customerUser->customer->company_name.' menambahkan titik lokasi baru: '.$site->site_name,
                'jenis' => 'info',
                'modul' => 'sites',
                'url_tujuan' => '/sites',
            ]);
        }

        return back()->with('success', 'Titik lokasi baru berhasil ditambahkan.');
    }

    public function updateSite(Request $request, Site $site): RedirectResponse
    {
        $customerUser = Auth::guard('customer')->user();

        if ($site->customer_id !== $customerUser->customer_id) {
            abort(403);
        }

        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'pic_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'notes' => 'nullable|string|max:500',
        ]);

        $site->update($validated);

        return back()->with('success', 'Data titik lokasi berhasil diperbarui.');
    }

    public function destroySite(Site $site): RedirectResponse
    {
        $customerUser = Auth::guard('customer')->user();

        if ($site->customer_id !== $customerUser->customer_id) {
            abort(403);
        }

        $site->delete();

        return back()->with('success', 'Titik lokasi berhasil dihapus.');
    }

    public function profile()
    {
        $customerUser = Auth::guard('customer')->user()->load('customer');

        return Inertia::render('CustomerPortal/Profile', [
            'customerUser' => $customerUser,
            'customer' => $customerUser->customer,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $customerUser = Auth::guard('customer')->user();
        $customer = $customerUser->customer;

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:500',
            'npwp' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $customer->update([
            'company_name' => $validated['company_name'],
            'pic_name' => $validated['pic_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'npwp' => $validated['npwp'] ?? null,
        ]);

        $userUpdate = [
            'nama' => $validated['pic_name'],
        ];

        if (! empty($validated['password'])) {
            $userUpdate['password'] = Hash::make($validated['password']);
        }

        $customerUser->update($userUpdate);

        return back()->with('success', 'Profil & data perusahaan Anda berhasil diperbarui.');
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
