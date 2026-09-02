<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Schedule;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['customer', 'contract', 'technician', 'supervisor']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('schedule_code', 'like', '%'.$search.'%')
                    ->orWhere('lokasi', 'like', '%'.$search.'%')
                    ->orWhere('jenis_layanan', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('company_name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('technician_id')) {
            $query->where('technician_id', $request->technician_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $schedules = $query->orderBy('tanggal', 'desc')->orderBy('jam_mulai', 'asc')->paginate(10);
        $technicians = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'tanggal', 'technician_id', 'status']),
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'company_name', 'customer_id')
            ->orderBy('company_name')
            ->get();

        $contracts = Contract::select('id', 'contract_number', 'customer_id', 'service_type')
            ->orderBy('contract_number')
            ->get();

        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Schedules/Create', [
            'customers' => $customers,
            'contracts' => $contracts,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'schedule_code' => 'required|unique:schedules,schedule_code',
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'lokasi' => 'required|string',
            'jenis_layanan' => 'required|string',
            'technician_id' => 'nullable|exists:users,id',
            'supervisor_id' => 'nullable|exists:users,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
            'prioritas' => 'required|in:rendah,normal,tinggi,urgent',
            'status' => 'required|in:dijadwalkan,ditugaskan,dalam_perjalanan,tiba,sedang_dikerjakan,selesai,dibatalkan,dijadwal_ulang',
            'catatan' => 'nullable|string',
        ]);

        $schedule = Schedule::create($validated);

        app(NotificationService::class)->jadwalBaruDibuat($schedule);

        return redirect()->route('schedules.index')
            ->with('success', 'Jadwal pekerjaan berhasil dibuat.');
    }

    public function show($id)
    {
        $schedule = Schedule::with(['customer', 'contract', 'technician', 'supervisor'])->find($id);

        if (! $schedule) {
            return redirect()->route('schedules.index')
                ->with('error', 'Jadwal pekerjaan tidak ditemukan atau telah diperbarui.');
        }

        return Inertia::render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function edit(Schedule $schedule)
    {
        $schedule->load(['customer', 'contract', 'technician', 'supervisor']);

        $customers = Customer::select('id', 'company_name', 'customer_id')
            ->orderBy('company_name')
            ->get();

        $contracts = Contract::select('id', 'contract_number', 'customer_id', 'service_type')
            ->orderBy('contract_number')
            ->get();

        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Schedules/Edit', [
            'schedule' => $schedule,
            'customers' => $customers,
            'contracts' => $contracts,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'schedule_code' => 'required|unique:schedules,schedule_code,'.$schedule->id,
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'lokasi' => 'required|string',
            'jenis_layanan' => 'required|string',
            'technician_id' => 'nullable|exists:users,id',
            'supervisor_id' => 'nullable|exists:users,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
            'prioritas' => 'required|in:rendah,normal,tinggi,urgent',
            'status' => 'required|in:dijadwalkan,ditugaskan,dalam_perjalanan,tiba,sedang_dikerjakan,selesai,dibatalkan,dijadwal_ulang',
            'catatan' => 'nullable|string',
        ]);

        $schedule->update($validated);

        return redirect()->route('schedules.index')
            ->with('success', 'Jadwal pekerjaan berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Jadwal pekerjaan berhasil dihapus.');
    }

    public function updateStatus(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'status' => 'required|in:dijadwalkan,ditugaskan,dalam_perjalanan,tiba,sedang_dikerjakan,selesai,dibatalkan,dijadwal_ulang',
        ]);

        $schedule->update(['status' => $validated['status']]);

        $statusLabels = [
            'dalam_perjalanan' => 'Konfirmasi OTW (Dalam Perjalanan)',
            'tiba' => 'Konfirmasi Tiba di Lokasi Klien',
            'sedang_dikerjakan' => 'Mulai Pengerjaan Pest Control',
            'selesai' => 'Selesai Pengerjaan',
        ];

        $label = $statusLabels[$validated['status']] ?? 'Status jadwal';

        return back()->with('success', $label.' berhasil diperbarui.');
    }
}
