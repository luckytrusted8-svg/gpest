<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Leave;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $query = Leave::with(['user', 'approver']);

        $user = Auth::user();
        if ($user->hasRole('technician')) {
            $query->where('user_id', $user->id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $leaves = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Leaves/Index', [
            'leaves' => $leaves,
            'users' => User::get(['id', 'name']),
            'filters' => $request->only(['status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_izin' => 'required|in:cuti,sakit,izin',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'alasan' => 'required|string',
        ]);

        $leave = Leave::create([
            'user_id' => Auth::id(),
            'jenis_izin' => $validated['jenis_izin'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'alasan' => $validated['alasan'],
            'status' => 'menunggu',
        ]);

        AuditLog::log('Apply Leave', 'Leave Management', "Pengajuan {$leave->jenis_izin} oleh ".Auth::user()->name);

        return back()->with('success', 'Pengajuan cuti/izin berhasil dikirim.');
    }

    public function approve(Request $request, Leave $leave)
    {
        $validated = $request->validate([
            'status' => 'required|in:disetujui,ditolak',
            'catatan_approval' => 'nullable|string',
        ]);

        $leave->update([
            'status' => $validated['status'],
            'disetujui_oleh' => Auth::id(),
            'catatan_approval' => $validated['catatan_approval'] ?? null,
        ]);

        AuditLog::log('Approve Leave', 'Leave Management', "Mengubah status cuti #{$leave->id} menjadi {$validated['status']}");

        return back()->with('success', "Pengajuan cuti telah {$validated['status']}.");
    }
}
