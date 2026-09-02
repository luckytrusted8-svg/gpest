<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Quotation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $query = Quotation::with(['customer', 'creator', 'items']);

        if ($request->search) {
            $query->search($request->search);
        }
        if ($request->status) {
            $query->ofStatus($request->status);
        }
        if ($request->customer_id) {
            $query->ofCustomer($request->customer_id);
        }
        if ($request->date_from) {
            $query->ofDateFrom($request->date_from);
        }
        if ($request->date_to) {
            $query->ofDateTo($request->date_to);
        }

        $quotations = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
            'customers' => Customer::get(['id', 'company_name']),
            'filters' => $request->only(['search', 'status', 'customer_id', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Quotations/Create', [
            'customers' => Customer::get(['id', 'company_name', 'address', 'pic_name as contact_person', 'phone', 'email']),
            'leads' => Lead::whereIn('status', ['survey', 'quotation', 'negosiasi', 'menang'])
                ->get(['id', 'lead_id', 'nama_perusahaan', 'nama_pic', 'telepon', 'email', 'alamat', 'kebutuhan']),
            'defaultSyarat' => "Pembayaran: DP 50% saat pengerjaan, 50% lunas setelah selesai.\nGaransi: 30 hari setelah pengerjaan selesai.\nHarga belum termasuk PPN 11%.",
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'lead_id' => 'nullable|exists:leads,id',
            'berlaku_hingga' => 'required|date|after:today',
            'syarat_ketentuan' => 'nullable|string',
            'catatan' => 'nullable|string',
            'status' => 'required|in:draft,dikirim',
            'items' => 'required|array|min:1',
            'items.*.jenis_layanan' => 'required|string|max:255',
            'items.*.deskripsi' => 'nullable|string',
            'items.*.kuantitas' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_persen' => 'required|numeric|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated) {
            $quotation = Quotation::create([
                'nomor_quotation' => '',
                'customer_id' => $validated['customer_id'],
                'lead_id' => $validated['lead_id'] ?? null,
                'berlaku_hingga' => $validated['berlaku_hingga'],
                'syarat_ketentuan' => $validated['syarat_ketentuan'] ?? null,
                'catatan' => $validated['catatan'] ?? null,
                'status' => $validated['status'],
                'dibuat_oleh' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $quotation->items()->create($item);
            }

            return redirect()->route('quotations.show', $quotation)
                ->with('success', 'Quotation berhasil dibuat.');
        });
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['customer', 'lead', 'creator', 'items']);

        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load(['items']);

        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'customers' => Customer::get(['id', 'company_name', 'address', 'pic_name as contact_person', 'phone', 'email']),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'lead_id' => 'nullable|exists:leads,id',
            'berlaku_hingga' => 'required|date',
            'syarat_ketentuan' => 'nullable|string',
            'catatan' => 'nullable|string',
            'status' => 'required|in:draft,dikirim',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:quotation_items,id',
            'items.*.jenis_layanan' => 'required|string|max:255',
            'items.*.deskripsi' => 'nullable|string',
            'items.*.kuantitas' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_persen' => 'required|numeric|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated, $quotation) {
            $quotation->update([
                'customer_id' => $validated['customer_id'],
                'lead_id' => $validated['lead_id'] ?? null,
                'berlaku_hingga' => $validated['berlaku_hingga'],
                'syarat_ketentuan' => $validated['syarat_ketentuan'] ?? null,
                'catatan' => $validated['catatan'] ?? null,
                'status' => $validated['status'],
            ]);

            $existingIds = collect($validated['items'])->pluck('id')->filter()->toArray();
            $quotation->items()->whereNotIn('id', $existingIds)->delete();

            foreach ($validated['items'] as $itemData) {
                if (! empty($itemData['id'])) {
                    $quotation->items()->where('id', $itemData['id'])->update($itemData);
                } else {
                    $quotation->items()->create($itemData);
                }
            }

            return redirect()->route('quotations.show', $quotation)
                ->with('success', 'Quotation berhasil diperbarui.');
        });
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return redirect()->route('quotations.index')->with('success', 'Quotation berhasil dihapus.');
    }

    public function kirim(Quotation $quotation)
    {
        $quotation->update(['status' => 'dikirim']);

        return back()->with('success', 'Quotation telah dikirim.');
    }

    public function terima(Quotation $quotation)
    {
        $quotation->update(['status' => 'diterima']);

        return back()->with('success', 'Quotation telah diterima.');
    }

    public function tolak(Quotation $quotation)
    {
        $quotation->update(['status' => 'ditolak']);

        return back()->with('success', 'Quotation telah ditolak.');
    }

    public function duplikat(Quotation $quotation)
    {
        $newQuotation = $quotation->replicate();
        $newQuotation->nomor_quotation = '';
        $newQuotation->status = 'draft';
        $newQuotation->dibuat_oleh = Auth::id();
        $newQuotation->berlaku_hingga = now()->addDays(30);
        $newQuotation->save();

        foreach ($quotation->items as $item) {
            $newItem = $item->replicate();
            $newItem->quotation_id = $newQuotation->id;
            $newItem->save();
        }

        return redirect()->route('quotations.show', $newQuotation)
            ->with('success', "Quotation baru {$newQuotation->nomor_quotation} berhasil dibuat dari salinan.");
    }

    public function cetakPdf(Quotation $quotation)
    {
        $quotation->load(['customer', 'creator', 'items']);

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("quotation-{$quotation->nomor_quotation}.pdf");
    }
}
