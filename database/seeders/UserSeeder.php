<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@gpest.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'status' => 'aktif',
            ]
        );

        $superAdmin->syncRoles(['super_admin']);
    }
}
