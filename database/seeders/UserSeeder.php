<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerUser;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // 1. Admin Utama
        $admin = User::updateOrCreate(
            ['email' => 'admin@gpest.id'],
            [
                'name' => 'Administrator G-PEST',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $admin->syncRoles(['admin']);

        // 2. Admin Operasional / CS
        $adminCs = User::updateOrCreate(
            ['email' => 'cs@gpest.id'],
            [
                'name' => 'Admin Operasional G-PEST',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $adminCs->syncRoles(['admin']);

        // 3. Karyawan 1 (Supervisor/Koordinator)
        $karyawan1 = User::updateOrCreate(
            ['email' => 'karyawan1@gpest.id'],
            [
                'name' => 'Budi Karyawan',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $karyawan1->syncRoles(['karyawan']);

        // 4. Karyawan 2 (Petugas Lapangan)
        $karyawan2 = User::updateOrCreate(
            ['email' => 'karyawan2@gpest.id'],
            [
                'name' => 'Andi Karyawan',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $karyawan2->syncRoles(['karyawan']);

        // 7. Customer Portal User (terhubung ke customer pertama jika ada)
        $customer = Customer::first();
        if ($customer) {
            CustomerUser::updateOrCreate(
                ['email' => 'portal@gpest.id'],
                [
                    'customer_id' => $customer->id,
                    'nama' => 'Customer Portal Demo',
                    'password' => $password,
                    'status' => 'aktif',
                ]
            );
        }
    }
}
