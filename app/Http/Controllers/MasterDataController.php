<?php

namespace App\Http\Controllers;

use App\Models\BahanKimia;
use App\Models\JenisHama;
use App\Models\JenisKontrak;
use App\Models\JenisLayanan;
use App\Models\JenisLokasi;
use App\Models\MetodeTreatment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDataController extends Controller
{
    private array $typeMap = [
        'jenis-layanan' => JenisLayanan::class,
        'jenis-hama' => JenisHama::class,
        'metode-treatment' => MetodeTreatment::class,
        'bahan-kimia' => BahanKimia::class,
        'jenis-kontrak' => JenisKontrak::class,
        'jenis-lokasi' => JenisLokasi::class,
    ];

    public function index()
    {
        return Inertia::render('MasterData/Index', [
            'jenisLayanan' => JenisLayanan::all(),
            'jenisHama' => JenisHama::all(),
            'metodeTreatment' => MetodeTreatment::all(),
            'bahanKimia' => BahanKimia::all(),
            'jenisKontrak' => JenisKontrak::all(),
            'jenisLokasi' => JenisLokasi::all(),
        ]);
    }

    public function store(Request $request, string $type)
    {
        $modelClass = $this->typeMap[$type] ?? null;

        if (! $modelClass) {
            return response()->json(['message' => 'Tipe master data tidak valid'], 400);
        }

        $rules = [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:aktif,tidak_aktif',
        ];

        if ($type === 'bahan-kimia') {
            $rules['satuan'] = 'required|string|max:255';
        }

        $validated = $request->validate($rules);

        $modelClass::create($validated);

        return response()->json(['message' => 'Data berhasil ditambahkan']);
    }

    public function update(Request $request, string $type, string $id)
    {
        $modelClass = $this->typeMap[$type] ?? null;

        if (! $modelClass) {
            return response()->json(['message' => 'Tipe master data tidak valid'], 400);
        }

        $model = $modelClass::findOrFail($id);

        $rules = [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:aktif,tidak_aktif',
        ];

        if ($type === 'bahan-kimia') {
            $rules['satuan'] = 'required|string|max:255';
        }

        $validated = $request->validate($rules);

        $model->update($validated);

        return response()->json(['message' => 'Data berhasil diperbarui']);
    }

    public function destroy(string $type, string $id)
    {
        $modelClass = $this->typeMap[$type] ?? null;

        if (! $modelClass) {
            return response()->json(['message' => 'Tipe master data tidak valid'], 400);
        }

        $model = $modelClass::findOrFail($id);
        $model->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
