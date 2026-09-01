<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\WorkReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['customer', 'contract', 'creator', 'items']);

        if ($request->search) {
            $query->where('nomor_invoice', 'like', '%'.$request->search.'%')
                ->orWhereHas('customer', function ($q) use ($request) {
                    $q->where('company_name', 'like', '%'.$request->search.'%');
                });
        }

        if ($request->status) {
            $query->where('status_pembayaran', $request->status);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        $invoices = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'customers' => Customer::get(['id', 'company_name']),
            'filters' => $request->only(['search', 'status', 'customer_id']),
        ]);
    }

    public function create(Request $request)
    {
        $selectedContract = null;
        if ($request->contract_id) {
            $selectedContract = Contract::with(['customer'])->find($request->contract_id);
        }

        return Inertia::render('Invoices/Create', [
            'customers' => Customer::get(['id', 'company_name', 'address', 'phone', 'email']),
            'contracts' => Contract::get(['id', 'contract_number', 'customer_id', 'contract_value']),
            'workReports' => WorkReport::get(['id', 'nomor_laporan', 'customer_id']),
            'selectedContract' => $selectedContract,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'work_report_id' => 'nullable|exists:work_reports,id',
            'tanggal_invoice' => 'required|date',
            'jatuh_tempo' => 'required|date|after_or_equal:tanggal_invoice',
            'status_pembayaran' => 'required|in:draft,terbit,dikirim,dibayar_sebagian,lunas,jatuh_tempo,batal',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.deskripsi' => 'required|string|max:255',
            'items.*.kuantitas' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_persen' => 'required|numeric|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $gross = $item['kuantitas'] * $item['harga_satuan'];
                $subtotal += $gross - ($gross * ($item['diskon_persen'] / 100));
            }

            $total = $subtotal;

            $invoice = Invoice::create([
                'nomor_invoice' => '',
                'customer_id' => $validated['customer_id'],
                'contract_id' => $validated['contract_id'] ?? null,
                'work_report_id' => $validated['work_report_id'] ?? null,
                'tanggal_invoice' => $validated['tanggal_invoice'],
                'jatuh_tempo' => $validated['jatuh_tempo'],
                'subtotal' => $subtotal,
                'total' => $total,
                'status_pembayaran' => $validated['status_pembayaran'],
                'catatan' => $validated['catatan'] ?? null,
                'dibuat_oleh' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            AuditLog::log('Create Invoice', 'Invoicing', "Membuat Invoice {$invoice->nomor_invoice}");

            return redirect()->route('invoices.show', $invoice)
                ->with('success', 'Invoice berhasil dibuat.');
        });
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['customer', 'contract', 'workReport', 'creator', 'items']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load(['items']);

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'customers' => Customer::get(['id', 'company_name']),
            'contracts' => Contract::get(['id', 'contract_number', 'customer_id']),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'tanggal_invoice' => 'required|date',
            'jatuh_tempo' => 'required|date',
            'status_pembayaran' => 'required|in:draft,terbit,dikirim,dibayar_sebagian,lunas,jatuh_tempo,batal',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:invoice_items,id',
            'items.*.deskripsi' => 'required|string|max:255',
            'items.*.kuantitas' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_persen' => 'required|numeric|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated, $invoice) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $gross = $item['kuantitas'] * $item['harga_satuan'];
                $subtotal += $gross - ($gross * ($item['diskon_persen'] / 100));
            }

            $invoice->update([
                'customer_id' => $validated['customer_id'],
                'tanggal_invoice' => $validated['tanggal_invoice'],
                'jatuh_tempo' => $validated['jatuh_tempo'],
                'status_pembayaran' => $validated['status_pembayaran'],
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            $existingIds = collect($validated['items'])->pluck('id')->filter()->toArray();
            $invoice->items()->whereNotIn('id', $existingIds)->delete();

            foreach ($validated['items'] as $itemData) {
                if (! empty($itemData['id'])) {
                    $invoice->items()->where('id', $itemData['id'])->update($itemData);
                } else {
                    $invoice->items()->create($itemData);
                }
            }

            AuditLog::log('Update Invoice', 'Invoicing', "Memperbarui Invoice {$invoice->nomor_invoice}");

            return redirect()->route('invoices.show', $invoice)
                ->with('success', 'Invoice berhasil diperbarui.');
        });
    }

    public function destroy(Invoice $invoice)
    {
        AuditLog::log('Delete Invoice', 'Invoicing', "Menghapus Invoice {$invoice->nomor_invoice}");
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invoice berhasil dihapus.');
    }

    public function cetakPdf(Invoice $invoice)
    {
        $invoice->load(['customer', 'creator', 'items']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("invoice-{$invoice->nomor_invoice}.pdf");
    }

    public function exportCsv()
    {
        $invoices = Invoice::with(['customer'])->latest()->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="invoices-'.date('Y-m-d').'.csv"',
        ];

        $callback = function () use ($invoices) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Nomor Invoice', 'Customer', 'Tanggal Invoice', 'Jatuh Tempo', 'Total', 'Status Pembayaran']);

            foreach ($invoices as $inv) {
                fputcsv($file, [
                    $inv->nomor_invoice,
                    $inv->customer ? $inv->customer->company_name : '-',
                    $inv->tanggal_invoice,
                    $inv->jatuh_tempo,
                    $inv->total,
                    $inv->status_pembayaran,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
