<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Schedule;
use App\Models\User;
use App\Models\WorkReport;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorkReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isTechnician = $user && $user->hasRole('karyawan') && ! $user->hasAnyRole(['admin', 'superadmin', 'manager']);

        $query = WorkReport::with(['customer', 'technician', 'contract']);

        if ($isTechnician) {
            $query->where('technician_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_laporan', 'like', '%'.$search.'%')
                    ->orWhere('jenis_layanan', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', fn ($cq) => $cq->where('company_name', 'like', '%'.$search.'%'))
                    ->orWhereHas('technician', fn ($tq) => $tq->where('name', 'like', '%'.$search.'%'));
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

        $workReports = $query->orderBy('tanggal', 'desc')->orderBy('jam_mulai', 'desc')->paginate(10);
        $technicians = $isTechnician
            ? User::where('id', $user->id)->select('id', 'name')->get()
            : User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('WorkReports/Index', [
            'workReports' => $workReports,
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'tanggal', 'technician_id', 'status']),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $isTechnician = $user && $user->hasRole('karyawan') && ! $user->hasAnyRole(['admin', 'superadmin', 'manager']);

        $customers = Customer::select('id', 'customer_id', 'company_name')->orderBy('company_name')->get();
        $technicians = $isTechnician
            ? User::where('id', $user->id)->select('id', 'name')->get()
            : User::role('karyawan')->select('id', 'name')->orderBy('name')->get();
        if ($technicians->isEmpty()) {
            $technicians = User::select('id', 'name')->orderBy('name')->get();
        }
        $contracts = Contract::with('customer')->select('id', 'contract_number', 'customer_id', 'contract_type')->get();

        $schedulesQuery = Schedule::with(['customer', 'technician', 'contract'])
            ->select('id', 'schedule_code', 'customer_id', 'technician_id', 'contract_id', 'tanggal', 'jenis_layanan', 'jam_mulai', 'jam_selesai')
            ->orderBy('tanggal', 'desc');

        if ($isTechnician) {
            $schedulesQuery->where('technician_id', $user->id);
        }

        $schedules = $schedulesQuery->get();

        $selectedSchedule = null;
        if ($request->filled('schedule_id')) {
            $selectedSchedule = $schedules->firstWhere('id', (int) $request->schedule_id);
        }

        $nomorLaporan = 'WR-'.now()->format('Ymd').'-'.str_pad(WorkReport::withTrashed()->whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);

        return Inertia::render('WorkReports/Create', [
            'customers' => $customers,
            'technicians' => $technicians,
            'contracts' => $contracts,
            'schedules' => $schedules,
            'nomorLaporan' => $nomorLaporan,
            'prefilled' => [
                'schedule_id' => $selectedSchedule?->id ? (string) $selectedSchedule->id : ($request->schedule_id ? (string) $request->schedule_id : ''),
                'customer_id' => $selectedSchedule?->customer_id ? (string) $selectedSchedule->customer_id : '',
                'technician_id' => $selectedSchedule?->technician_id ? (string) $selectedSchedule->technician_id : (string) auth()->id(),
                'contract_id' => $selectedSchedule?->contract_id ? (string) $selectedSchedule->contract_id : '',
                'jenis_layanan' => $selectedSchedule?->jenis_layanan ?? 'General Pest Control',
                'tanggal' => $selectedSchedule?->tanggal ? Carbon::parse($selectedSchedule->tanggal)->toDateString() : now()->toDateString(),
                'jam_mulai' => $selectedSchedule?->jam_mulai ? substr($selectedSchedule->jam_mulai, 0, 5) : '08:00',
                'jam_selesai' => $selectedSchedule?->jam_selesai ? substr($selectedSchedule->jam_selesai, 0, 5) : '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_laporan' => 'required|unique:work_reports,nomor_laporan',
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'schedule_id' => 'nullable|exists:schedules,id',
            'technician_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'nullable',
            'jenis_layanan' => 'required|string',
            'jenis_hama' => 'nullable|string',
            'metode_treatment' => 'nullable|string',
            'bahan_kimia' => 'nullable|string',
            'jumlah_bahan' => 'nullable|string',
            'area_treatment' => 'nullable|string',
            'peralatan' => 'nullable|string',
            'temuan' => 'nullable|string',
            'aktivitas_hama' => 'nullable|string',
            'tingkat_keparahan' => 'nullable|string',
            'rekomendasi' => 'nullable|string',
            'status' => 'required|in:draft,dikirim,disetujui,revisi,selesai',
            'catatan_supervisor' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*.jenis_foto' => 'required_with:photos|in:sebelum,selama,sesudah',
            'photos.*.path_foto' => 'required_with:photos|string',
            'photos.*.keterangan' => 'nullable|string',
        ]);

        $photos = $validated['photos'] ?? [];
        unset($validated['photos']);

        $workReport = WorkReport::create($validated);

        foreach ($photos as $photo) {
            $path = $this->processPhotoPath($photo['path_foto']);

            $workReport->photos()->create([
                'jenis_foto' => $photo['jenis_foto'],
                'path_foto' => $path,
                'keterangan' => $photo['keterangan'] ?? null,
            ]);
        }

        if ($workReport->schedule_id) {
            Schedule::where('id', $workReport->schedule_id)->update(['status' => 'selesai']);
        }

        if ($workReport->status === 'dikirim') {
            app(NotificationService::class)->laporanDikirim($workReport);
        }

        return redirect()->route('work-reports.show', $workReport)
            ->with('success', 'Laporan kerja berhasil disimpan.');
    }

    public function show($id)
    {
        $workReport = WorkReport::with(['customer', 'contract', 'schedule', 'technician', 'photos'])->find($id);

        if (! $workReport) {
            return redirect()->route('work-reports.index')
                ->with('error', 'Laporan kerja tidak ditemukan atau telah diperbarui.');
        }

        return Inertia::render('WorkReports/Show', [
            'workReport' => $workReport,
        ]);
    }

    public function edit(WorkReport $workReport)
    {
        if (auth()->user()->hasRole('admin')) {
            return redirect()->route('work-reports.show', $workReport)
                ->with('error', 'Admin tidak dapat mengubah laporan kerja teknisi. Gunakan fitur Minta Revisi.');
        }

        if (! in_array($workReport->status, ['draft', 'revisi'])) {
            return redirect()->route('work-reports.show', $workReport)
                ->with('error', 'Laporan ini tidak dapat diedit karena statusnya '.$workReport->status.'.');
        }

        $workReport->load(['customer', 'contract', 'schedule', 'technician', 'photos']);

        $customers = Customer::select('id', 'customer_id', 'company_name')->orderBy('company_name')->get();
        $technicians = User::select('id', 'name')->orderBy('name')->get();
        $contracts = Contract::with('customer')->select('id', 'contract_number', 'customer_id', 'contract_type')->get();
        $schedules = Schedule::with('customer')->select('id', 'schedule_code', 'customer_id', 'tanggal', 'jenis_layanan')->orderBy('tanggal', 'desc')->get();

        return Inertia::render('WorkReports/Edit', [
            'workReport' => $workReport,
            'customers' => $customers,
            'technicians' => $technicians,
            'contracts' => $contracts,
            'schedules' => $schedules,
        ]);
    }

    public function update(Request $request, WorkReport $workReport)
    {
        if ($request->user()->hasRole('admin')) {
            abort(403, 'Admin tidak dapat mengubah laporan kerja teknisi. Gunakan fitur Minta Revisi.');
        }

        if (! in_array($workReport->status, ['draft', 'revisi'])) {
            return redirect()->route('work-reports.show', $workReport)
                ->with('error', 'Laporan ini tidak dapat diedit.');
        }

        $validated = $request->validate([
            'nomor_laporan' => 'required|unique:work_reports,nomor_laporan,'.$workReport->id,
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'schedule_id' => 'nullable|exists:schedules,id',
            'technician_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'nullable',
            'jenis_layanan' => 'required|string',
            'jenis_hama' => 'nullable|string',
            'metode_treatment' => 'nullable|string',
            'bahan_kimia' => 'nullable|string',
            'jumlah_bahan' => 'nullable|string',
            'area_treatment' => 'nullable|string',
            'peralatan' => 'nullable|string',
            'temuan' => 'nullable|string',
            'aktivitas_hama' => 'nullable|string',
            'tingkat_keparahan' => 'nullable|string',
            'rekomendasi' => 'nullable|string',
            'status' => 'required|in:draft,dikirim,disetujui,revisi,selesai',
            'catatan_supervisor' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*.jenis_foto' => 'required_with:photos|in:sebelum,selama,sesudah',
            'photos.*.path_foto' => 'required_with:photos|string',
            'photos.*.keterangan' => 'nullable|string',
        ]);

        $photos = $validated['photos'] ?? null;
        unset($validated['photos']);

        $wasRevisi = $workReport->status === 'revisi';

        $workReport->update($validated);

        if ($photos !== null) {
            $workReport->photos()->delete();
            foreach ($photos as $photo) {
                $path = $this->processPhotoPath($photo['path_foto']);
                $workReport->photos()->create([
                    'jenis_foto' => $photo['jenis_foto'],
                    'path_foto' => $path,
                    'keterangan' => $photo['keterangan'] ?? null,
                ]);
            }
        }

        if ($wasRevisi && $workReport->status === 'dikirim') {
            $adminUsers = User::whereHas('roles', function ($q) {
                $q->where('name', 'admin');
            })->get();

            foreach ($adminUsers as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'judul' => 'Laporan Hasil Revisi Dikirim',
                    'pesan' => 'Teknisi '.(auth()->user()->name ?? 'Teknisi').' telah memperbaiki laporan '.$workReport->nomor_laporan.' dan mengirimkannya untuk peninjauan.',
                    'jenis' => 'info',
                    'modul' => 'work-reports',
                    'url_tujuan' => '/work-reports/'.$workReport->id,
                ]);
            }

            return redirect()->route('work-reports.show', $workReport)
                ->with('success', 'Laporan berhasil diperbaiki dan dikirim ulang ke Admin untuk persetujuan.');
        }

        return redirect()->route('work-reports.show', $workReport)
            ->with('success', 'Laporan kerja berhasil diperbarui.');
    }

    public function destroy(WorkReport $workReport)
    {
        $workReport->delete();

        return redirect()->route('work-reports.index')
            ->with('success', 'Laporan kerja berhasil dihapus.');
    }

    public function approve(Request $request, WorkReport $workReport)
    {
        if (! $request->user()->hasRole('admin')) {
            abort(403, 'Hanya Admin yang berhak menyetujui laporan kerja.');
        }

        $request->validate([
            'catatan_supervisor' => 'nullable|string',
        ]);

        $workReport->update([
            'status' => 'disetujui',
            'catatan_supervisor' => $request->catatan_supervisor,
        ]);

        if ($workReport->schedule_id) {
            Schedule::where('id', $workReport->schedule_id)->update(['status' => 'selesai']);
        }

        app(NotificationService::class)->laporanDisetujui($workReport);

        return redirect()->route('work-reports.show', $workReport)
            ->with('success', 'Laporan kerja berhasil disetujui.');
    }

    public function requestRevision(Request $request, WorkReport $workReport)
    {
        $user = $request->user();
        if (! $user->hasRole('admin') && ! $user->hasAnyRole(['superadmin', 'manager', 'supervisor']) && ! $user->can('work-reports.approve')) {
            abort(403, 'Hanya Admin / Supervisor yang berhak meminta revisi laporan kerja.');
        }

        $request->validate([
            'catatan_supervisor' => 'required|string',
        ]);

        $workReport->update([
            'status' => 'revisi',
            'catatan_supervisor' => $request->catatan_supervisor,
        ]);

        app(NotificationService::class)->laporanPerluRevisi($workReport, $request->catatan_supervisor);

        return redirect()->route('work-reports.show', $workReport)
            ->with('success', 'Permintaan revisi berhasil dikirim ke teknisi.');
    }

    protected function processPhotoPath(string $path): string
    {
        if (str_starts_with($path, 'data:image/')) {
            try {
                preg_match('/^data:image\/(\w+);base64,/', $path, $typeMatches);
                $imageContent = substr($path, strpos($path, ',') + 1);
                $decodedImage = base64_decode($imageContent);
                $ext = strtolower($typeMatches[1] ?? 'jpg');
                if ($ext === 'jpeg') {
                    $ext = 'jpg';
                }
                $filename = 'wr_photo_'.uniqid().'.'.$ext;
                Storage::disk('public')->put('work_reports/photos/'.$filename, $decodedImage);

                return Storage::url('work_reports/photos/'.$filename);
            } catch (\Exception $e) {
                // fallback if decode fails
            }
        }

        return $path;
    }
}
