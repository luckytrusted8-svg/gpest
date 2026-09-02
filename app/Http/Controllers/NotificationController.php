<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::where('user_id', $request->user()->id)->orderBy('created_at', 'desc');

        if ($request->filled('filter')) {
            if ($request->filter === 'belum_dibaca') {
                $query->belumDibaca();
            } elseif ($request->filter === 'sudah_dibaca') {
                $query->sudahDibaca();
            }
        }

        $notifications = $query->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($notifications);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'filter' => $request->input('filter', 'semua'),
        ]);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->update(['dibaca_pada' => now()]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['message' => 'Notifikasi ditandai sudah dibaca.']);
        }

        if ($notification->url_tujuan) {
            return redirect($notification->url_tujuan);
        }

        return back()->with('success', 'Notifikasi ditandai sudah dibaca.');
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->belumDibaca()
            ->update(['dibaca_pada' => now()]);

        return back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }

    public function destroy(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'Notifikasi berhasil dihapus.');
    }
}
