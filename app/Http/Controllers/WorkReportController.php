<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Schedule;
use App\Models\User;
use App\Models\WorkReport;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkReportController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkReport::with(['customer', 'technician', 'contract']);

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
        $technicians = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('WorkReports/Index', [
            'workReports' => $workReports,
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'tanggal', 'technician_id', 'status']),
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'customer_id', 'company_name')->orderBy('company_name')->get();
        $technicians = User::select('id', 'name')->orderBy('name')->get();
        $contracts = Contract::with('customer')->select('id', 'contract_number', 'customer_id', 'contract_type')->get();
        $schedules = Schedule::with('customer')->select('id', 'schedule_code', 'customer_id', 'tanggal', 'jenis_layanan')->orderBy('tanggal', 'desc')->get();

        $nomorLaporan = 'WR-'.now()->format('Ymd').'-'.str_pad(WorkReport::withTrashed()->whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);

        return Inertia::render('WorkReports/Create', [
            'customers' => $customers,
            'technicians' => $technicians,
            'contracts' => $contracts,
            'schedules' => $schedules,
            'nomorLaporan' => $nomorLaporan,
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
            $workReport->photos()->create($photo);
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

        $workReport->update($validated);

        if ($photos !== null) {
            $workReport->photos()->delete();
            foreach ($photos as $photo) {
                $workReport->photos()->create($photo);
            }
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
        $request->validate([
            'catatan_supervisor' => 'required|string',
        ]);

        $workReport->update([
            'status' => 'revisi',
            'catatan_supervisor' => $request->catatan_supervisor,
        ]);

        return redirect()->route('work-reports.show', $workReport)
            ->with('success', 'Permintaan revisi berhasil dikirim ke teknisi.');
    }
}
