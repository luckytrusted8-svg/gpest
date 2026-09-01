<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('technician');

        if ($request->filled('tanggal')) {
            $query->byDate($request->tanggal);
        }

        if ($request->filled('technician_id')) {
            $query->byTechnician($request->technician_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_masuk', 'desc')
            ->paginate(15)
            ->withQueryString();

        $technicians = User::select('id', 'name')
            ->whereHas('technician')
            ->orderBy('name')
            ->get();

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
            'technicians' => $technicians,
            'filters' => $request->only(['tanggal', 'technician_id', 'status']),
        ]);
    }

    public function checkInPage(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $todayAttendance = Attendance::where('technician_id', $user->id)
            ->byDate($today)
            ->first();

        $recentAttendances = Attendance::where('technician_id', $user->id)
            ->orderBy('tanggal', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Attendance/CheckIn', [
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    public function checkIn(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $existing = Attendance::where('technician_id', $user->id)
            ->byDate($today)
            ->first();

        if ($existing && $existing->jam_masuk) {
            return back()->with('error', 'Anda sudah melakukan check-in hari ini.');
        }

        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($existing) {
            $existing->update([
                'jam_masuk' => now()->format('H:i:s'),
                'latitude_masuk' => $validated['latitude'],
                'longitude_masuk' => $validated['longitude'],
                'status' => 'hadir',
            ]);

            app(NotificationService::class)->checkInTeknisi($existing);
        } else {
            $attendance = Attendance::create([
                'technician_id' => $user->id,
                'tanggal' => $today,
                'jam_masuk' => now()->format('H:i:s'),
                'latitude_masuk' => $validated['latitude'],
                'longitude_masuk' => $validated['longitude'],
                'status' => 'hadir',
            ]);

            app(NotificationService::class)->checkInTeknisi($attendance);
        }

        return back()->with('success', 'Check-in berhasil. Selamat bekerja!');
    }

    public function checkOut(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('technician_id', $user->id)
            ->byDate($today)
            ->whereNotNull('jam_masuk')
            ->whereNull('jam_keluar')
            ->first();

        if (! $attendance) {
            return back()->with('error', 'Anda belum check-in hari ini atau sudah check-out.');
        }

        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $attendance->update([
            'jam_keluar' => now()->format('H:i:s'),
            'latitude_keluar' => $validated['latitude'],
            'longitude_keluar' => $validated['longitude'],
        ]);

        return back()->with('success', 'Check-out berhasil. Selamat istirahat!');
    }

    public function show(Request $request, int $id)
    {
        $attendance = Attendance::with('technician')->findOrFail($id);

        $dailyRecords = Attendance::with('technician')
            ->where('technician_id', $attendance->technician_id)
            ->whereDate('tanggal', $attendance->tanggal)
            ->get();

        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance,
            'dailyRecords' => $dailyRecords,
        ]);
    }

    public function report(Request $request)
    {
        $month = $request->input('month', now()->format('m'));
        $year = $request->input('year', now()->format('Y'));

        $startDate = "{$year}-{$month}-01";
        $endDate = now()->setDate((int) $year, (int) $month, 1)->endOfMonth()->toDateString();

        $technicians = User::select('id', 'name')
            ->whereHas('technician')
            ->orderBy('name')
            ->get();

        $reportData = $technicians->map(function ($technician) use ($startDate, $endDate) {
            $attendances = Attendance::where('technician_id', $technician->id)
                ->whereBetween('tanggal', [$startDate, $endDate])
                ->get();

            $totalHadir = $attendances->where('status', 'hadir')->count();
            $totalTidakHadir = $attendances->where('status', 'tidak_hadir')->count();
            $totalIzin = $attendances->where('status', 'izin')->count();
            $totalSakit = $attendances->where('status', 'sakit')->count();

            $totalJamKerja = $attendances
                ->filter(fn ($a) => $a->jam_masuk && $a->jam_keluar)
                ->sum('durasi_jam');

            return [
                'technician_id' => $technician->id,
                'nama' => $technician->name,
                'total_hadir' => $totalHadir,
                'total_tidak_hadir' => $totalTidakHadir,
                'total_izin' => $totalIzin,
                'total_sakit' => $totalSakit,
                'total_jam_kerja' => round($totalJamKerja, 2),
            ];
        });

        return Inertia::render('Attendance/Report', [
            'reportData' => $reportData,
            'technicians' => $technicians,
            'month' => $month,
            'year' => $year,
        ]);
    }
}
