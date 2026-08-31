<?php

namespace Database\Seeders;

use App\Models\BahanKimia;
use App\Models\JenisHama;
use App\Models\JenisKontrak;
use App\Models\JenisLayanan;
use App\Models\JenisLokasi;
use App\Models\MetodeTreatment;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        if (JenisLayanan::count() > 0) {
            return;
        }

        JenisLayanan::insert([
            ['nama' => 'General Pest Control', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Termite Control', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rodent Control', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Fumigation', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Disinfection', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Inspeksi', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        JenisHama::insert([
            ['nama' => 'Kecoa', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Tikus', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rayap', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Nyamuk', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Lalat', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Semut', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Kutu Busuk', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        MetodeTreatment::insert([
            ['nama' => 'Spraying', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Baiting', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Fogging', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Drilling', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Trapping', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        BahanKimia::insert([
            ['nama' => 'Cypermethrin', 'satuan' => 'liter', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Imidacloprid', 'satuan' => 'liter', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Fipronil', 'satuan' => 'liter', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Deltamethrin', 'satuan' => 'liter', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Bifenthrin', 'satuan' => 'liter', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        JenisKontrak::insert([
            ['nama' => 'Bulanan', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Triwulan', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Semesteran', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Tahunan', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        JenisLokasi::insert([
            ['nama' => 'Gedung Perkantoran', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Restoran', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Hotel', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Gudang', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rumah Tinggal', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rumah Sakit', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Sekolah', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Pabrik', 'deskripsi' => null, 'status' => 'aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
