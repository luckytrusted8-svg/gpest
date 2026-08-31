<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::first();
        $contract = Contract::first();
        $user = User::first();

        if (! $customer || ! $user) {
            return;
        }

        Schedule::firstOrCreate(
            ['schedule_code' => 'SCH-20260829-001'],
            [
                'customer_id' => $customer->id,
                'contract_id' => $contract?->id,
                'lokasi' => 'Jl. Sudirman No. 10, Jakarta Pusat (Lantai 5)',
                'jenis_layanan' => 'General Pest Control',
                'technician_id' => $user->id,
                'supervisor_id' => $user->id,
                'tanggal' => now()->toDateString(),
                'jam_mulai' => '08:00',
                'jam_selesai' => '10:00',
                'prioritas' => 'normal',
                'status' => 'selesai',
                'catatan' => 'Penyemprotan dan fogging di seluruh area lobby dan lantai 5.',
            ]
        );

        Schedule::firstOrCreate(
            ['schedule_code' => 'SCH-20260829-002'],
            [
                'customer_id' => $customer->id,
                'contract_id' => $contract?->id,
                'lokasi' => 'Kawasan Industri Pulogadung, Blok B',
                'jenis_layanan' => 'Termite Control',
                'technician_id' => $user->id,
                'supervisor_id' => $user->id,
                'tanggal' => now()->toDateString(),
                'jam_mulai' => '13:00',
                'jam_selesai' => '15:00',
                'prioritas' => 'urgent',
                'status' => 'sedang_dikerjakan',
                'catatan' => 'Inspeksi umpan rayap dan perlakuan khusus pada pondasi belakang.',
            ]
        );

        Schedule::firstOrCreate(
            ['schedule_code' => 'SCH-20260830-003'],
            [
                'customer_id' => $customer->id,
                'contract_id' => null,
                'lokasi' => 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
                'jenis_layanan' => 'Rodent Control',
                'technician_id' => $user->id,
                'supervisor_id' => null,
                'tanggal' => now()->addDay()->toDateString(),
                'jam_mulai' => '09:00',
                'jam_selesai' => '11:30',
                'prioritas' => 'tinggi',
                'status' => 'ditugaskan',
                'catatan' => 'Pemasangan jebakan tikus di area dapur & gudang penyimpanan.',
            ]
        );
    }
}
