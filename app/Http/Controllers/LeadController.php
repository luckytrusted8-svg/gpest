<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['sales', 'activities']);

        if ($request->search) {
            $query->search($request->search);
        }
        if ($request->status) {
            $query->ofStatus($request->status);
        }
        if ($request->sumber) {
            $query->ofSumber($request->sumber);
        }
        if ($request->sales_id) {
            $query->ofSales($request->sales_id);
        }

        $leads = $query->latest()->paginate(15)->withQueryString();

        // For kanban view: get all leads grouped by status (without pagination)
        $allLeads = Lead::with('sales')->latest()->get();
        $byStatus = $allLeads->groupBy('status')->map(fn ($items) => $items->values());

        return Inertia::render('CRM/Index', [
            'leads' => $leads,
            'leadsByStatus' => $byStatus,
            'salesUsers' => User::role(['admin', 'super_admin', 'management', 'supervisor'])->get(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'sumber', 'sales_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('CRM/Create', [
            'salesUsers' => User::role(['admin', 'super_admin', 'management', 'supervisor'])->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'nama_pic' => 'required|string|max:255',
            'telepon' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'sumber_lead' => 'required|in:telepon,website,referral,media_sosial,walk_in,lainnya',
            'kebutuhan' => 'nullable|string',
            'status' => 'required|in:baru,dihubungi,survey,quotation,negosiasi,menang,kalah',
            'assigned_sales' => 'nullable|exists:users,id',
            'catatan' => 'nullable|string',
        ]);

        $lead = Lead::create($validated);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => Auth::id(),
            'jenis_aktivitas' => 'catatan',
            'judul' => 'Lead dibuat',
            'deskripsi' => "Lead {$lead->lead_id} dibuat dengan status {$lead->status}.",
            'tanggal_aktivitas' => now()->toDateString(),
        ]);

        return redirect()->route('crm.show', $lead)->with('success', 'Lead berhasil dibuat.');
    }

    public function show(Lead $lead)
    {
        $lead->load(['sales', 'activities.user']);

        return Inertia::render('CRM/Show', [
            'lead' => $lead,
            'allStatuses' => ['baru', 'dihubungi', 'survey', 'quotation', 'negosiasi', 'menang', 'kalah'],
        ]);
    }

    public function edit(Lead $lead)
    {
        return Inertia::render('CRM/Edit', [
            'lead' => $lead,
            'salesUsers' => User::role(['admin', 'super_admin', 'management', 'supervisor'])->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'nama_pic' => 'required|string|max:255',
            'telepon' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'sumber_lead' => 'required|in:telepon,website,referral,media_sosial,walk_in,lainnya',
            'kebutuhan' => 'nullable|string',
            'status' => 'required|in:baru,dihubungi,survey,quotation,negosiasi,menang,kalah',
            'assigned_sales' => 'nullable|exists:users,id',
            'catatan' => 'nullable|string',
        ]);

        $oldStatus = $lead->status;
        $lead->update($validated);

        if ($oldStatus !== $lead->status) {
            LeadActivity::create([
                'lead_id' => $lead->id,
                'user_id' => Auth::id(),
                'jenis_aktivitas' => 'catatan',
                'judul' => "Status diubah: {$oldStatus} → {$lead->status}",
                'deskripsi' => null,
                'tanggal_aktivitas' => now()->toDateString(),
            ]);
        }

        return redirect()->route('crm.show', $lead)->with('success', 'Lead berhasil diperbarui.');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('crm.index')->with('success', 'Lead berhasil dihapus.');
    }

    public function convertToCustomer(Lead $lead)
    {
        if ($lead->status !== 'menang') {
            return back()->with('error', 'Hanya lead dengan status Menang yang dapat dikonversi.');
        }

        $lead->update(['status' => 'customer']);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => Auth::id(),
            'jenis_aktivitas' => 'catatan',
            'judul' => 'Dikonversi ke Customer',
            'deskripsi' => 'Lead berhasil dikonversi menjadi customer baru.',
            'tanggal_aktivitas' => now()->toDateString(),
        ]);

        return redirect()->route('customers.create', [
            'from_lead' => $lead->id,
            'company_name' => $lead->nama_perusahaan,
            'contact_person' => $lead->nama_pic,
            'phone' => $lead->telepon,
            'email' => $lead->email,
            'address' => $lead->alamat,
        ])->with('success', "Lead {$lead->lead_id} berhasil dikonversi ke customer. Silakan lengkapi data customer.");
    }

    public function addActivity(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'jenis_aktivitas' => 'required|in:telepon,email,meeting,survey,follow_up,catatan',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_aktivitas' => 'required|date',
        ]);

        $lead->activities()->create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        return back()->with('success', 'Aktivitas berhasil ditambahkan.');
    }
}
