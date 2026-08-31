<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Database\Seeder;

class CustomerUserSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::first();

        if (! $customer) {
            return;
        }

        CustomerUser::firstOrCreate(
            ['email' => 'customer@gpest.co.id'],
            [
                'customer_id' => $customer->id,
                'nama' => 'Budi Santoso (PIC Customer)',
                'password' => bcrypt('password'),
                'status' => 'aktif',
            ]
        );
    }
}
