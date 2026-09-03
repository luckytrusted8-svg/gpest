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

        // 1. Super Admin
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@gpest.id'],
            [
                'name' => 'Super Admin G-PEST',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $superAdmin->syncRoles(['super_admin']);

        // 2. Management
        $management = User::updateOrCreate(
            ['email' => 'management@gpest.id'],
            [
                'name' => 'Manager G-PEST',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $management->syncRoles(['management']);

        // 3. Admin / Customer Service
        $admin = User::updateOrCreate(
            ['email' => 'cs@gpest.id'],
            [
                'name' => 'Admin CS G-PEST',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $admin->syncRoles(['admin']);

        // 4. Supervisor
        $supervisor = User::updateOrCreate(
            ['email' => 'supervisor@gpest.id'],
            [
                'name' => 'Supervisor Lapangan',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $supervisor->syncRoles(['supervisor']);

        // 5. Teknisi 1
        $teknisi1 = User::updateOrCreate(
            ['email' => 'teknisi1@gpest.id'],
            [
                'name' => 'Budi Teknisi',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $teknisi1->syncRoles(['technician']);

        // 6. Teknisi 2
        $teknisi2 = User::updateOrCreate(
            ['email' => 'teknisi2@gpest.id'],
            [
                'name' => 'Andi Teknisi',
                'password' => $password,
                'status' => 'aktif',
            ]
        );
        $teknisi2->syncRoles(['technician']);

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
