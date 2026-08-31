<?php

namespace App\Http\Controllers;

use App\Models\Geofence;
use App\Models\LocationTrack;
use App\Models\Schedule;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationTrackingController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->input('date', now()->toDateString());

        $technicianIds = LocationTrack::whereDate('created_at', $tanggal)
            ->pluck('technician_id')
            ->unique();

        $latestTracks = LocationTrack::whereIn('id', function ($query) use ($tanggal) {
            $query->selectRaw('MAX(id)')
                ->from('location_tracks')
                ->whereDate('created_at', $tanggal)
                ->groupBy('technician_id');
        })->with('technician')->get();

        $allTechnicians = User::whereHas('technician')
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(function ($tech) use ($latestTracks) {
                $track = $latestTracks->firstWhere('technician_id', $tech->id);
                return [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'latitude' => $track?->latitude,
                    'longitude' => $track?->longitude,
                    'status_teknisi' => $track?->status_teknisi ?? 'offline',
                    'last_update' => $track?->created_at?->toIso8601String(),
                    'schedule' => $track?->schedule ? [
                        'id' => $track->schedule->id,
                        'schedule_code' => $track->schedule->schedule_code,
                        'lokasi' => $track->schedule->lokasi,
                    ] : null,
                ];
            });

        $geofences = Geofence::where('aktif', true)->get();

        return Inertia::render('Tracking/Index', [
            'technicians' => $allTechnicians,
            'geofences' => $geofences,
            'selectedDate' => $tanggal,
        ]);
    }

    public function updateLokasi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'akurasi' => 'nullable|numeric',
            'kecepatan' => 'nullable|numeric',
            'status_teknisi' => 'nullable|in:aktif,dalam_perjalanan,tiba,bekerja,offline',
            'schedule_id' => 'nullable|exists:schedules,id',
        ]);

        $user = $request->user();

        $track = LocationTrack::create([
            'technician_id' => $user->id,
            'schedule_id' => $validated['schedule_id'] ?? null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'akurasi' => $validated['akurasi'] ?? null,
            'kecepatan' => $validated['kecepatan'] ?? null,
            'status_teknisi' => $validated['status_teknisi'] ?? 'aktif',
        ]);

        $this->cekGeofence($user->id, $validated['latitude'], $validated['longitude']);

        return response()->json(['message' => 'Lokasi diperbarui.', 'track' => $track]);
    }

    public function riwayat(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $tracks = LocationTrack::where('technician_id', $request->technician_id)
            ->whereDate('created_at', $request->date)
            ->orderBy('created_at', 'asc')
            ->get();

        $technician = User::findOrFail($request->technician_id);

        return Inertia::render('Tracking/History', [
            'tracks' => $tracks,
            'technician' => $technician,
            'selectedDate' => $request->date,
            'allTechnicians' => User::whereHas('technician')->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function statusTeknisi(Request $request)
    {
        $tanggal = $request->input('date', now()->toDateString());

        $latestTracks = LocationTrack::whereIn('id', function ($query) use ($tanggal) {
            $query->selectRaw('MAX(id)')
                ->from('location_tracks')
                ->whereDate('created_at', $tanggal)
                ->groupBy('technician_id');
        })->with('technician')->get();

        return response()->json($latestTracks);
    }

    private function cekGeofence(int $userId, float $lat, float $lng): void
    {
        $activeSchedules = Schedule::where('technician_id', $userId)
            ->whereDate('tanggal', now()->toDateString())
            ->whereNotIn('status', ['selesai', 'dibatalkan'])
            ->get();

        if ($activeSchedules->isEmpty()) {
            return;
        }

        $geofences = Geofence::where('aktif', true)->get();

        foreach ($geofences as $geofence) {
            if (! $geofence->isPointInside($lat, $lng)) {
                $isInsideAny = false;
                foreach ($geofences as $other) {
                    if ($other->id !== $geofence->id && $other->isPointInside($lat, $lng)) {
                        $isInsideAny = true;
                        break;
                    }
                }

                if (! $isInsideAny) {
                    app(NotificationService::class)->kirimKeUser(
                        userId: $userId,
                        judul: 'Peringatan Geofence',
                        pesan: "Anda berada di luar area geofence \"{$geofence->nama}\". Radius: {$geofence->radius_meter}m.",
                        jenis: 'peringatan',
                        modul: 'tracking',
                        urlTujuan: '/tracking'
                    );
                    break;
                }
            }
        }
    }
}
