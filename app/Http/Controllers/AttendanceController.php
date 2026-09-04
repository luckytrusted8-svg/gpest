<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\LocationTrack;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->input('tanggal', now()->toDateString());
        $technicianIdFilter = $request->input('technician_id');
        $statusFilter = $request->input('status');

        // All active technicians and staff users
        $allTechnicianUsers = User::select('id', 'name', 'email')
            ->where(function ($q) {
                $q->whereHas('technician')
                    ->orWhereHas('attendances')
                    ->orWhereHas('roles', fn ($r) => $r->whereIn('name', ['technician', 'supervisor', 'staff']))
                    ->orWhere('email', 'like', '%teknisi%')
                    ->orWhere('email', 'like', '%staff%');
            })
            ->orderBy('name')
            ->get();

        // Get existing attendance records for the selected date
        $query = Attendance::with('technician');

        if ($request->filled('tanggal')) {
            $query->byDate($request->tanggal);
        } else {
            $query->byDate($tanggal);
        }

        if ($request->filled('technician_id')) {
            $query->byTechnician($request->technician_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $existingAttendances = $query->orderBy('jam_masuk', 'desc')->get();
        $existingUserIds = $existingAttendances->pluck('technician_id')->toArray();

        $attendanceList = collect();

        // 1. Existing attendance records
        foreach ($existingAttendances as $att) {
            $attendanceList->push($att);
        }

        // 2. Daily reset overview: Include technicians who haven't checked in yet today if no conflicting filter
        if (! $statusFilter || $statusFilter === 'tidak_hadir') {
            $unrecordedUsers = $allTechnicianUsers->reject(function ($user) use ($existingUserIds, $technicianIdFilter) {
                if ($technicianIdFilter && (int) $technicianIdFilter !== $user->id) {
                    return true;
                }

                return in_array($user->id, $existingUserIds);
            });

            foreach ($unrecordedUsers as $user) {
                $unrecordedAtt = new Attendance([
                    'id' => -1 * $user->id,
                    'technician_id' => $user->id,
                    'tanggal' => $request->filled('tanggal') ? $request->tanggal : $tanggal,
                    'jam_masuk' => null,
                    'jam_keluar' => null,
                    'latitude_masuk' => null,
                    'longitude_masuk' => null,
                    'status' => 'tidak_hadir',
                    'catatan' => 'Belum Check-In',
                ]);
                $unrecordedAtt->setRelation('technician', $user);
                $attendanceList->push($unrecordedAtt);
            }
        }

        $summaryStats = [
            'total_hadir' => $attendanceList->where('status', 'hadir')->count(),
            'total_berjalan' => $attendanceList->filter(fn ($a) => $a->jam_masuk && ! $a->jam_keluar)->count(),
            'total_selesai' => $attendanceList->filter(fn ($a) => $a->jam_masuk && $a->jam_keluar)->count(),
            'total_tidak_hadir' => $attendanceList->where('status', 'tidak_hadir')->count(),
        ];

        // Manual collection pagination
        $page = (int) $request->input('page', 1);
        $perPage = 15;
        $paginatedData = new LengthAwarePaginator(
            $attendanceList->slice(($page - 1) * $perPage, $perPage)->values(),
            $attendanceList->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Attendance/Index', [
            'attendances' => $paginatedData,
            'technicians' => $allTechnicianUsers,
            'summaryStats' => $summaryStats,
            'filters' => [
                'tanggal' => $request->filled('tanggal') ? $request->tanggal : $tanggal,
                'technician_id' => $technicianIdFilter ? (string) $technicianIdFilter : '',
                'status' => $statusFilter || '',
            ],
            'workingHoursConfig' => [
                'teknisi' => 'Jam Dimulai Tidak Tentu (Fleksibel Lapangan)',
                'staff' => [
                    'senin_jumat' => '08:00 - 16:00 WIB',
                    'sabtu' => '08:00 - 14:00 WIB',
                    'minggu' => 'Libur',
                ],
            ],
        ]);
    }

    public function checkInPage(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();
        $selectedMonth = $request->input('month', now()->format('Y-m'));

        if (! preg_match('/^\d{4}-\d{2}$/', $selectedMonth)) {
            $selectedMonth = now()->format('Y-m');
        }

        [$year, $month] = explode('-', $selectedMonth);

        $todayAttendance = Attendance::where('technician_id', $user->id)
            ->byDate($today)
            ->first();

        $monthlyAttendances = Attendance::where('technician_id', $user->id)
            ->whereYear('tanggal', (int) $year)
            ->whereMonth('tanggal', (int) $month)
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('Attendance/CheckIn', [
            'todayAttendance' => $todayAttendance,
            'monthlyAttendances' => $monthlyAttendances,
            'selectedMonth' => $selectedMonth,
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
            'work_type' => 'nullable|in:WFO,WFA',
            'lokasi_nama' => 'nullable|string',
            'selfie_masuk' => 'nullable|string',
        ]);

        $workType = $validated['work_type'] ?? 'WFA';
        $lokasiNama = $validated['lokasi_nama'] ?? ($workType === 'WFO' ? 'G-PEST Central Service • Head Office' : 'Titik Tugas Lapangan (WFA)');

        // Handle selfie photo upload (base64 image or url)
        $selfieUrl = null;
        if (! empty($validated['selfie_masuk'])) {
            $selfieData = $validated['selfie_masuk'];
            if (str_starts_with($selfieData, 'data:image')) {
                @[$type, $selfieData] = explode(';', $selfieData);
                @[, $selfieData] = explode(',', $selfieData);
                $decoded = base64_decode($selfieData);
                if ($decoded) {
                    $filename = 'selfies/selfie_'.$user->id.'_'.time().'_'.uniqid().'.jpg';
                    Storage::disk('public')->put($filename, $decoded);
                    $selfieUrl = '/storage/'.$filename;
                }
            } else {
                $selfieUrl = $validated['selfie_masuk'];
            }
        }

        if ($existing) {
            $updateData = [
                'jam_masuk' => now()->format('H:i:s'),
                'latitude_masuk' => $validated['latitude'],
                'longitude_masuk' => $validated['longitude'],
                'work_type' => $workType,
                'lokasi_nama' => $lokasiNama,
                'status' => 'hadir',
            ];
            if ($selfieUrl) {
                $updateData['selfie_masuk'] = $selfieUrl;
            }
            $existing->update($updateData);

            app(NotificationService::class)->checkInTeknisi($existing);
        } else {
            $attendance = Attendance::create([
                'technician_id' => $user->id,
                'tanggal' => $today,
                'jam_masuk' => now()->format('H:i:s'),
                'latitude_masuk' => $validated['latitude'],
                'longitude_masuk' => $validated['longitude'],
                'work_type' => $workType,
                'lokasi_nama' => $lokasiNama,
                'selfie_masuk' => $selfieUrl,
                'status' => 'hadir',
            ]);

            app(NotificationService::class)->checkInTeknisi($attendance);
        }

        LocationTrack::create([
            'technician_id' => $user->id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'status_teknisi' => 'aktif',
        ]);

        return back()->with('success', 'Presensi masuk (Check-In '.$workType.') berhasil dicatat beserta foto kehadiran.');
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

        LocationTrack::create([
            'technician_id' => $user->id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'status_teknisi' => 'offline',
        ]);

        return back()->with('success', 'Check-out berhasil. Selamat istirahat!');
    }

    public function tracks($id)
    {
        if (! is_numeric($id) || (int) $id <= 0) {
            return response()->json([
                'attendance' => null,
                'tracks' => [],
            ]);
        }

        $attendance = Attendance::with('technician')->find($id);

        if (! $attendance) {
            return response()->json([
                'attendance' => null,
                'tracks' => [],
            ]);
        }

        $tracks = LocationTrack::where('technician_id', $attendance->technician_id)
            ->whereDate('created_at', $attendance->tanggal)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'attendance' => $attendance,
            'tracks' => $tracks,
        ]);
    }

    public function show(Request $request, $id)
    {
        if (! is_numeric($id) || (int) $id <= 0) {
            return redirect()->route('attendance.index')
                ->with('error', 'Catatan absensi tidak ditemukan atau teknisi belum melakukan presensi masuk (Check-In).');
        }

        $attendance = Attendance::with('technician')->find($id);

        if (! $attendance) {
            return redirect()->route('attendance.index')
                ->with('error', 'Data absensi tidak ditemukan.');
        }

        $dailyRecords = Attendance::with('technician')
            ->where('technician_id', $attendance->technician_id)
            ->whereDate('tanggal', $attendance->tanggal)
            ->get();

        $tracks = LocationTrack::where('technician_id', $attendance->technician_id)
            ->whereDate('created_at', $attendance->tanggal)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance,
            'dailyRecords' => $dailyRecords,
            'tracks' => $tracks,
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

    public function exportCsv(Request $request)
    {
        $tanggal = $request->input('tanggal', now()->toDateString());

        $query = Attendance::with('technician');

        if ($request->filled('tanggal')) {
            $query->byDate($request->tanggal);
        } else {
            $query->byDate($tanggal);
        }

        if ($request->filled('technician_id')) {
            $query->byTechnician($request->technician_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('jam_masuk', 'desc')->get();

        $content = view('excel.attendance', [
            'attendances' => $attendances,
            'tanggal' => $tanggal,
        ])->render();

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="rekap-absensi-'.$tanggal.'.xls"',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        return response($content, 200, $headers);
    }

    public function exportReportCsv(Request $request)
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
                'nama' => $technician->name,
                'total_hadir' => $totalHadir,
                'total_tidak_hadir' => $totalTidakHadir,
                'total_izin' => $totalIzin,
                'total_sakit' => $totalSakit,
                'total_jam_kerja' => round($totalJamKerja, 2),
            ];
        });

        $content = view('excel.attendance_monthly', [
            'reportData' => $reportData,
            'month' => $month,
            'year' => $year,
        ])->render();

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="rekap-bulanan-'.$year.'-'.$month.'.xls"',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        return response($content, 200, $headers);
    }
}
