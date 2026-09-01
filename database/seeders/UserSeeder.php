<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus user lain jika ada untuk menyisakan 1 akun Super Admin
        User::where('email', '!=', 'admin@gpest.id')->delete();

        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@gpest.id'],
            [
                'name' => 'Super Admin G-PEST',
                'password' => Hash::make('password'),
                'status' => 'aktif',
            ]
        );

        $superAdmin->syncRoles(['super_admin']);
    }
}
