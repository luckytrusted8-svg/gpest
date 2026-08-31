<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::firstOrCreate(
            ['customer_id' => 'CUST-001'],
            [
                'company_name' => 'PT ABC Indonesia',
                'pic_name' => 'Budi Santoso',
                'phone' => '08123456789',
                'email' => 'budi@abc.co.id',
                'address' => 'Jl. Jend. Sudirman No. 10, Jakarta Pusat',
                'location' => 'Jakarta Pusat',
                'status' => 'active',
            ]
        );

        $customer2 = Customer::firstOrCreate(
            ['customer_id' => 'CUST-002'],
            [
                'company_name' => 'PT Nusantara Logistics',
                'pic_name' => 'Siti Rahma',
                'phone' => '08987654321',
                'email' => 'siti@nusantara.co.id',
                'address' => 'Kawasan Industri Pulogadung, Jakarta Timur',
                'location' => 'Jakarta Timur',
                'status' => 'active',
            ]
        );

        Contract::firstOrCreate(
            ['contract_number' => 'CTR-2026-001'],
            [
                'customer_id' => $customer->id,
                'location' => 'HQ Sudirman',
                'contract_type' => 'General Pest Control',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'service_frequency' => 'Monthly',
                'service_type' => 'Pest & Rodent Control',
                'contract_value' => 24000000.00,
                'status' => 'active',
                'pic' => 'Andi Wijaya',
                'attachment' => 'https://example.com/contracts/CTR-2026-001.pdf',
            ]
        );

        Contract::firstOrCreate(
            ['contract_number' => 'CTR-2026-002'],
            [
                'customer_id' => $customer2->id,
                'location' => 'Warehouse Pulogadung',
                'contract_type' => 'Termite Control',
                'start_date' => '2026-03-01',
                'end_date' => '2026-09-30',
                'service_frequency' => 'Bi-Weekly',
                'service_type' => 'Termite Baiting & Inspection',
                'contract_value' => 18500000.00,
                'status' => 'expiring_soon',
                'pic' => 'Dewi Lestari',
                'attachment' => null,
            ]
        );

        Contract::firstOrCreate(
            ['contract_number' => 'CTR-2026-003'],
            [
                'customer_id' => $customer->id,
                'location' => 'Branch Tangerang',
                'contract_type' => 'Fumigation',
                'start_date' => '2026-06-01',
                'end_date' => '2027-05-31',
                'service_frequency' => 'Quarterly',
                'service_type' => 'Container Fumigation',
                'contract_value' => 35000000.00,
                'status' => 'draft',
                'pic' => 'Rian Hidayat',
                'attachment' => null,
            ]
        );
    }
}
