<?php

namespace Database\Seeders;

use App\Models\Technician;
use App\Models\User;
use Illuminate\Database\Seeder;

class TechnicianSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Technician::firstOrCreate(
            ['employee_id' => 'TEK-001'],
            [
                'user_id' => $user?->id,
                'nama' => 'Ahmad Subagja',
                'telepon' => '081234567890',
                'email' => 'ahmad.subagja@gpest.co.id',
                'jabatan' => 'Teknisi Senior',
                'status' => 'aktif',
                'area_tugas' => 'Jakarta Pusat & Selatan',
                'keahlian' => ['General Pest Control', 'Termite Control', 'Fumigation'],
                'tanggal_bergabung' => '2023-01-15',
                'foto_profil' => null,
            ]
        );

        Technician::firstOrCreate(
            ['employee_id' => 'TEK-002'],
            [
                'user_id' => null,
                'nama' => 'Rian Hidayat',
                'telepon' => '089876543210',
                'email' => 'rian.hidayat@gpest.co.id',
                'jabatan' => 'Teknisi Field',
                'status' => 'aktif',
                'area_tugas' => 'Jakarta Barat & Tangerang',
                'keahlian' => ['General Pest Control', 'Rodent Control'],
                'tanggal_bergabung' => '2024-05-10',
                'foto_profil' => null,
            ]
        );

        Technician::firstOrCreate(
            ['employee_id' => 'TEK-003'],
            [
                'user_id' => null,
                'nama' => 'Bambang Kusuma',
                'telepon' => '085566778899',
                'email' => 'bambang.k@gpest.co.id',
                'jabatan' => 'Specialist Termite',
                'status' => 'cuti',
                'area_tugas' => 'Jakarta Timur & Bekasi',
                'keahlian' => ['Termite Control', 'Inspection & Survey'],
                'tanggal_bergabung' => '2022-09-01',
                'foto_profil' => null,
            ]
        );
    }
}
