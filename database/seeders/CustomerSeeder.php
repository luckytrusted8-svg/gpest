<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Customer Demo 1 (PT Maju Jaya Pest)
        $customer1 = Customer::firstOrCreate(
            ['email' => 'contact@majujaya.com'],
            [
                'customer_id' => 'CUST-202609-0001',
                'company_name' => 'PT Maju Jaya Sejahtera',
                'pic_name' => 'Budi Santoso',
                'phone' => '081234567890',
                'address' => 'Jl. Jendral Sudirman No. 45, Jakarta Selatan',
                'location' => 'Jakarta Selatan',
                'status' => 'active',
                'sales_pic' => 'Admin G-PEST',
            ]
        );

        // Akun Login Customer 1
        CustomerUser::updateOrCreate(
            ['email' => 'klien@gpest.id'],
            [
                'customer_id' => $customer1->id,
                'nama' => 'Budi Santoso (PIC PT Maju Jaya)',
                'password' => Hash::make('password'),
                'status' => 'aktif',
            ]
        );

        // 2. Buat Customer Demo 2 (Restoran Lezatos)
        $customer2 = Customer::firstOrCreate(
            ['email' => 'manager@lezatos.com'],
            [
                'customer_id' => 'CUST-202609-0002',
                'company_name' => 'Restoran Lezatos Indonesia',
                'pic_name' => 'Siti Rahma',
                'phone' => '089876543210',
                'address' => 'Jl. Boulevard Barat No. 12, Kelapa Gading, Jakarta Utara',
                'location' => 'Jakarta Utara',
                'status' => 'active',
                'sales_pic' => 'Admin G-PEST',
            ]
        );

        // Akun Login Customer 2
        CustomerUser::updateOrCreate(
            ['email' => 'lezatos@gpest.id'],
            [
                'customer_id' => $customer2->id,
                'nama' => 'Siti Rahma (Manager Restoran)',
                'password' => Hash::make('password'),
                'status' => 'aktif',
            ]
        );
    }
}
