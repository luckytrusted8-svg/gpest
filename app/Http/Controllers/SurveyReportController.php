<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\SurveyPhoto;
use App\Models\SurveyReport;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyReportController extends Controller
{
    public function index(Request $request)
    {
        $query = SurveyReport::with(['customer', 'technician']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_survey', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', fn ($cq) => $cq->where('company_name', 'like', '%'.$search.'%'));
            });
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal_survey', $request->tanggal);
        }

        if ($request->filled('technician_id')) {
            $query->where('technician_id', $request->technician_id);
        }

        if ($request->filled('tingkat_risiko')) {
            $query->where('tingkat_risiko', $request->tingkat_risiko);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $surveyReports = $query->orderBy('tanggal_survey', 'desc')
            ->paginate(10)
            ->withQueryString();

        $technicians = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('SurveyReports/Index', [
            'surveyReports' => $surveyReports,
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'tanggal', 'technician_id', 'tingkat_risiko', 'status']),
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'customer_id', 'company_name')->orderBy('company_name')->get();
        $technicians = User::select('id', 'name')->orderBy('name')->get();

        $nomorSurvey = 'SR-'.now()->format('Ymd').'-'.str_pad(SurveyReport::withTrashed()->whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);

        return Inertia::render('SurveyReports/Create', [
            'customers' => $customers,
            'technicians' => $technicians,
            'nomorSurvey' => $nomorSurvey,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_survey' => 'required|unique:survey_reports,nomor_survey',
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'technician_id' => 'required|exists:users,id',
            'tanggal_survey' => 'required|date',
            'lokasi' => 'required|string',
            'jenis_hama' => 'required|array|min:1',
            'area_survey' => 'required|string',
            'temuan' => 'required|string',
            'tingkat_risiko' => 'required|in:rendah,sedang,tinggi,kritis',
            'rekomendasi' => 'required|string',
            'catatan' => 'nullable|string',
            'status' => 'required|in:draft,dikirim',
            'photos' => 'nullable|array',
            'photos.*.path_foto' => 'required_with:photos|string',
            'photos.*.keterangan' => 'nullable|string',
        ]);

        $photos = $validated['photos'] ?? [];
        unset($validated['photos']);

        $surveyReport = SurveyReport::create($validated);

        foreach ($photos as $photo) {
            $surveyReport->photos()->create($photo);
        }

        return redirect()->route('survey-reports.show', $surveyReport)
            ->with('success', 'Laporan survey berhasil disimpan.');
    }

    public function show(SurveyReport $surveyReport)
    {
        $surveyReport->load(['customer', 'contract', 'technician', 'photos']);

        $previousSurveys = SurveyReport::where('customer_id', $surveyReport->customer_id)
            ->where('id', '!=', $surveyReport->id)
            ->orderBy('tanggal_survey', 'desc')
            ->limit(5)
            ->get(['id', 'nomor_survey', 'tanggal_survey', 'tingkat_risiko', 'status']);

        return Inertia::render('SurveyReports/Show', [
            'surveyReport' => $surveyReport,
            'previousSurveys' => $previousSurveys,
        ]);
    }

    public function edit(SurveyReport $surveyReport)
    {
        if ($surveyReport->status !== 'draft') {
            return redirect()->route('survey-reports.show', $surveyReport)
                ->with('error', 'Laporan ini tidak dapat diedit karena statusnya '.$surveyReport->status.'.');
        }

        $surveyReport->load(['customer', 'contract', 'technician', 'photos']);

        $customers = Customer::select('id', 'customer_id', 'company_name')->orderBy('company_name')->get();
        $technicians = User::select('id', 'name')->orderBy('name')->get();
        $contracts = Contract::where('customer_id', $surveyReport->customer_id)
            ->select('id', 'contract_number', 'contract_type')
            ->get();

        return Inertia::render('SurveyReports/Edit', [
            'surveyReport' => $surveyReport,
            'customers' => $customers,
            'technicians' => $technicians,
            'contracts' => $contracts,
        ]);
    }

    public function update(Request $request, SurveyReport $surveyReport)
    {
        if ($surveyReport->status !== 'draft') {
            return redirect()->route('survey-reports.show', $surveyReport)
                ->with('error', 'Laporan ini tidak dapat diedit.');
        }

        $validated = $request->validate([
            'nomor_survey' => 'required|unique:survey_reports,nomor_survey,'.$surveyReport->id,
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'technician_id' => 'required|exists:users,id',
            'tanggal_survey' => 'required|date',
            'lokasi' => 'required|string',
            'jenis_hama' => 'required|array|min:1',
            'area_survey' => 'required|string',
            'temuan' => 'required|string',
            'tingkat_risiko' => 'required|in:rendah,sedang,tinggi,kritis',
            'rekomendasi' => 'required|string',
            'catatan' => 'nullable|string',
            'status' => 'required|in:draft,dikirim',
            'photos' => 'nullable|array',
            'photos.*.path_foto' => 'required_with:photos|string',
            'photos.*.keterangan' => 'nullable|string',
        ]);

        $photos = $validated['photos'] ?? null;
        unset($validated['photos']);

        $surveyReport->update($validated);

        if ($photos !== null) {
            $surveyReport->photos()->delete();
            foreach ($photos as $photo) {
                $surveyReport->photos()->create($photo);
            }
        }

        return redirect()->route('survey-reports.show', $surveyReport)
            ->with('success', 'Laporan survey berhasil diperbarui.');
    }

    public function destroy(SurveyReport $surveyReport)
    {
        $surveyReport->delete();

        return redirect()->route('survey-reports.index')
            ->with('success', 'Laporan survey berhasil dihapus.');
    }

    public function approve(Request $request, SurveyReport $surveyReport)
    {
        $surveyReport->update(['status' => 'disetujui']);

        return redirect()->route('survey-reports.show', $surveyReport)
            ->with('success', 'Laporan survey berhasil disetujui.');
    }
}
