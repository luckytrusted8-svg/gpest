<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Leave;
use App\Models\User;
use App\Services\NotificationService;
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
            'foto_surat' => 'nullable|image|max:5120',
        ]);

        $fotoSuratPath = null;
        if ($request->hasFile('foto_surat')) {
            $path = $request->file('foto_surat')->store('leaves', 'public');
            $fotoSuratPath = '/storage/'.$path;
        }

        $leave = Leave::create([
            'user_id' => Auth::id(),
            'jenis_izin' => $validated['jenis_izin'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'alasan' => $validated['alasan'],
            'foto_surat' => $fotoSuratPath,
            'status' => 'menunggu',
        ]);

        AuditLog::log('Apply Leave', 'Leave Management', "Pengajuan {$leave->jenis_izin} oleh ".Auth::user()->name);

        // Send notification to Supervisors and Admins
        try {
            $approvers = User::role(['super_admin', 'admin', 'supervisor'])->pluck('id')->unique();
            $userName = Auth::user()->name;
            $notifService = app(NotificationService::class);
            foreach ($approvers as $adminId) {
                if ($adminId !== Auth::id()) {
                    $notifService->kirimKeUser(
                        userId: $adminId,
                        judul: "Pengajuan {$leave->jenis_izin} Baru",
                        pesan: "Teknisi {$userName} mengajukan permohonan {$leave->jenis_izin} ({$leave->tanggal_mulai} s/d {$leave->tanggal_selesai}) dan menunggu persetujuan.",
                        jenis: 'warning',
                        modul: 'leaves',
                        urlTujuan: '/leaves'
                    );
                }
            }
        } catch (\Exception $e) {
            // ignore notification failure
        }

        return back()->with('success', 'Pengajuan cuti/izin berhasil dikirim dan menunggu persetujuan atasan.');
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

        // Notify the Technician
        try {
            $statusText = $validated['status'] === 'disetujui' ? 'Disetujui' : 'Ditolak';
            $notifType = $validated['status'] === 'disetujui' ? 'success' : 'error';
            $approverName = Auth::user()->name;

            app(NotificationService::class)->kirimKeUser(
                userId: $leave->user_id,
                judul: "Pengajuan {$leave->jenis_izin} {$statusText}",
                pesan: "Pengajuan {$leave->jenis_izin} Anda ({$leave->tanggal_mulai} s/d {$leave->tanggal_selesai}) telah {$validated['status']} oleh {$approverName}.".($leave->catatan_approval ? " Catatan: {$leave->catatan_approval}" : ''),
                jenis: $notifType,
                modul: 'leaves',
                urlTujuan: '/leaves'
            );
        } catch (\Exception $e) {
            // ignore notification failure
        }

        return back()->with('success', "Pengajuan cuti telah {$validated['status']}.");
    }

    public function update(Request $request, Leave $leave)
    {
        $user = Auth::user();
        if ($user->hasRole('technician') && $leave->user_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        if ($user->hasRole('technician') && $leave->status !== 'menunggu') {
            return back()->with('error', 'Pengajuan yang sudah diproses oleh atasan tidak dapat diubah.');
        }

        $validated = $request->validate([
            'jenis_izin' => 'required|in:cuti,sakit,izin',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'alasan' => 'required|string',
            'foto_surat' => 'nullable|image|max:5120',
        ]);

        $fotoSuratPath = $leave->foto_surat;
        if ($request->hasFile('foto_surat')) {
            $path = $request->file('foto_surat')->store('leaves', 'public');
            $fotoSuratPath = '/storage/'.$path;
        }

        $leave->update([
            'jenis_izin' => $validated['jenis_izin'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'alasan' => $validated['alasan'],
            'foto_surat' => $fotoSuratPath,
        ]);

        AuditLog::log('Update Leave', 'Leave Management', "Memperbarui data pengajuan cuti #{$leave->id}");

        return back()->with('success', 'Pengajuan cuti/izin berhasil diperbarui.');
    }

    public function destroy(Leave $leave)
    {
        $user = Auth::user();
        $canDelete = $user->hasRole(['super_admin', 'admin', 'supervisor']) || $leave->user_id === $user->id;

        if (! $canDelete) {
            abort(403, 'Akses ditolak.');
        }

        $leave->delete();

        AuditLog::log('Delete Leave', 'Leave Management', "Menghapus pengajuan cuti #{$leave->id}");

        return back()->with('success', 'Pengajuan cuti/izin berhasil dihapus/dibatalkan.');
    }
}
