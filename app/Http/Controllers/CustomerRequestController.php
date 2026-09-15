<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerRequest::with(['customer', 'site']);

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

    public function show($id)
    {
        $customerRequest = CustomerRequest::with(['customer', 'site'])->find($id);

        if (! $customerRequest) {
            return redirect()->route('customer-requests.index')
                ->with('error', 'Permintaan/Komplain Klien tidak ditemukan atau telah diperbarui.');
        }

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

        // Notify customer users associated with this customer
        $customerUsers = CustomerUser::where('customer_id', $customerRequest->customer_id)->get();
        foreach ($customerUsers as $cu) {
            Notification::create([
                'customer_user_id' => $cu->id,
                'user_id' => null,
                'judul' => 'Status Permintaan Diperbarui ('.$customerRequest->request_number.')',
                'pesan' => "Permintaan Anda ({$customerRequest->jenis_layanan}) kini berstatus: ".strtoupper($validated['status']).(! empty($validated['catatan_admin']) ? ' - Catatan Admin: '.$validated['catatan_admin'] : ''),
                'jenis' => in_array($validated['status'], ['selesai', 'dijadwalkan']) ? 'sukses' : ($validated['status'] === 'ditolak' ? 'error' : 'info'),
                'modul' => 'customer-requests',
                'url_tujuan' => '/portal/requests',
            ]);
        }

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
