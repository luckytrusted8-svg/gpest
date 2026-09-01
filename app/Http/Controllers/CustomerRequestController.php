<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\CustomerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerRequest::with(['customer']);

        if ($request->search) {
            $query->where('request_number', 'like', '%'.$request->search.'%')
                ->orWhereHas('customer', function ($q) use ($request) {
                    $q->where('company_name', 'like', '%'.$request->search.'%');
                });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->prioritas) {
            $query->where('prioritas', $request->prioritas);
        }

        $requests = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('CustomerRequests/Index', [
            'requests' => $requests,
            'customers' => Customer::get(['id', 'company_name']),
            'filters' => $request->only(['search', 'status', 'prioritas']),
        ]);
    }

    public function show(CustomerRequest $customerRequest)
    {
        $customerRequest->load(['customer']);

        return Inertia::render('CustomerRequests/Show', [
            'requestItem' => $customerRequest,
        ]);
    }

    public function updateStatus(Request $request, CustomerRequest $customerRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:baru,ditinjau,dijadwalkan,diproses,selesai,ditolak',
            'catatan_admin' => 'nullable|string',
        ]);

        $customerRequest->update($validated);

        AuditLog::log('Update Status Request', 'Customer Request', "Mengubah status request {$customerRequest->request_number} menjadi {$validated['status']}");

        return back()->with('success', 'Status permintaan berhasil diperbarui.');
    }

    public function destroy(CustomerRequest $customerRequest)
    {
        AuditLog::log('Delete Customer Request', 'Customer Request', "Menghapus request {$customerRequest->request_number}");
        $customerRequest->delete();

        return redirect()->route('customer-requests.index')->with('success', 'Permintaan berhasil dihapus.');
    }
}
