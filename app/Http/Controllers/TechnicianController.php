<?php

namespace App\Http\Controllers;

use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TechnicianController extends Controller
{
    public function index(Request $request)
    {
        $query = Technician::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', '%'.$search.'%')
                    ->orWhere('nama', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('telepon', 'like', '%'.$search.'%')
                    ->orWhere('jabatan', 'like', '%'.$search.'%')
                    ->orWhere('area_tugas', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('area')) {
            $query->where('area_tugas', 'like', '%'.$request->area.'%');
        }

        $technicians = $query->orderBy('nama')->paginate(10)->withQueryString();

        // Count active technicians per key operational area
        $areaStats = [
            'Jakarta Pusat' => Technician::where('area_tugas', 'like', '%Jakarta Pusat%')->where('status', 'aktif')->count(),
            'Jakarta Selatan' => Technician::where('area_tugas', 'like', '%Jakarta Selatan%')->where('status', 'aktif')->count(),
            'Jakarta Barat' => Technician::where('area_tugas', 'like', '%Jakarta Barat%')->where('status', 'aktif')->count(),
            'Jakarta Timur' => Technician::where('area_tugas', 'like', '%Jakarta Timur%')->where('status', 'aktif')->count(),
            'Jakarta Utara' => Technician::where('area_tugas', 'like', '%Jakarta Utara%')->where('status', 'aktif')->count(),
            'Depok' => Technician::where('area_tugas', 'like', '%Depok%')->where('status', 'aktif')->count(),
            'Tangerang' => Technician::where('area_tugas', 'like', '%Tangerang%')->where('status', 'aktif')->count(),
            'Bekasi' => Technician::where('area_tugas', 'like', '%Bekasi%')->where('status', 'aktif')->count(),
            'Bogor' => Technician::where('area_tugas', 'like', '%Bogor%')->where('status', 'aktif')->count(),
        ];

        return Inertia::render('Technicians/Index', [
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'status', 'area']),
            'areaStats' => $areaStats,
        ]);
    }

    public function create()
    {
        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Technicians/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|unique:technicians,employee_id',
            'user_id' => 'nullable|exists:users,id',
            'nama' => 'required|string',
            'telepon' => 'required|string',
            'email' => 'required|email',
            'jabatan' => 'required|string',
            'status' => 'required|in:aktif,tidak_aktif,cuti',
            'area_tugas' => 'nullable|string',
            'keahlian' => 'nullable|array',
            'keahlian.*' => 'string',
            'tanggal_bergabung' => 'required|date',
            'foto_profil' => 'nullable|string',
        ]);

        Technician::create($validated);

        return redirect()->route('technicians.index')
            ->with('success', 'Data teknisi berhasil ditambahkan.');
    }

    public function show(Technician $technician)
    {
        $technician->load(['user', 'schedules.customer']);

        return Inertia::render('Technicians/Show', [
            'technician' => $technician,
        ]);
    }

    public function edit(Technician $technician)
    {
        $technician->load('user');

        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Technicians/Edit', [
            'technician' => $technician,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Technician $technician)
    {
        $validated = $request->validate([
            'employee_id' => 'required|unique:technicians,employee_id,'.$technician->id,
            'user_id' => 'nullable|exists:users,id',
            'nama' => 'required|string',
            'telepon' => 'required|string',
            'email' => 'required|email',
            'jabatan' => 'required|string',
            'status' => 'required|in:aktif,tidak_aktif,cuti',
            'area_tugas' => 'nullable|string',
            'keahlian' => 'nullable|array',
            'keahlian.*' => 'string',
            'tanggal_bergabung' => 'required|date',
            'foto_profil' => 'nullable|string',
        ]);

        $technician->update($validated);

        return redirect()->route('technicians.index')
            ->with('success', 'Data teknisi berhasil diperbarui.');
    }

    public function destroy(Technician $technician)
    {
        $technician->delete();

        return redirect()->route('technicians.index')
            ->with('success', 'Data teknisi berhasil dihapus.');
    }
}
