<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerPortalDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_portal_dashboard_renders_successfully(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Test Customer',
            'pic_name' => 'Budi Santoso',
            'phone' => '08123456789',
            'email' => 'budi@example.com',
            'address' => 'Jl. Merdeka No. 1, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.dashboard'));

        $response->assertStatus(200);
    }
}
