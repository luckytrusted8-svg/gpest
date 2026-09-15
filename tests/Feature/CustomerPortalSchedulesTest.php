<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerUser;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerPortalSchedulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_portal_schedules_empty_state_renders_successfully(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Pelanggan Baru',
            'pic_name' => 'Doni',
            'phone' => '08129990001',
            'email' => 'doni@pelanggan.com',
            'address' => 'Jl. Sudirman, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Doni',
            'email' => 'doni@pelanggan.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.schedules'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerPortal/Schedules')
            ->has('schedules.data', 0)
        );
    }

    public function test_customer_portal_schedules_with_data_renders_successfully(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Alpha Retail',
            'pic_name' => 'Farah',
            'phone' => '08129990002',
            'email' => 'farah@alpha.com',
            'address' => 'Jl. Thamrin, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Farah',
            'email' => 'farah@alpha.com',
            'password' => bcrypt('password'),
        ]);

        $techUser = User::factory()->create(['name' => 'Samsul Arifin']);

        Schedule::create([
            'schedule_code' => 'SCH-20260915-001',
            'customer_id' => $customer->id,
            'technician_id' => $techUser->id,
            'lokasi' => 'Outlet Grand Indonesia Lt. 3',
            'jenis_layanan' => 'General Pest Control',
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '12:00',
            'prioritas' => 'tinggi',
            'status' => 'selesai',
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.schedules'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerPortal/Schedules')
            ->has('schedules.data', 1)
            ->where('schedules.data.0.schedule_code', 'SCH-20260915-001')
            ->where('schedules.data.0.status', 'selesai')
            ->where('schedules.data.0.technician.name', 'Samsul Arifin')
        );
    }
}
