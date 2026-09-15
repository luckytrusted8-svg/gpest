<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CustomerRequestLocationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_portal_requests_page_loads_with_sites(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Makmur Sentosa',
            'pic_name' => 'Budi Santoso',
            'phone' => '08123456789',
            'email' => 'budi@makmur.com',
            'address' => 'Jl. Sudirman No. 1, Jakarta Pusat',
        ]);

        $site = Site::create([
            'customer_id' => $customer->id,
            'site_name' => 'Cabang Kelapa Gading',
            'address' => 'Mall Kelapa Gading Lt. 2, Jakarta Utara',
            'location' => 'Jakarta Utara',
            'pic_name' => 'Hendro',
            'phone' => '08198765432',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Budi Santoso',
            'email' => 'budi@makmur.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.requests'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerPortal/Requests')
            ->has('sites', 1)
            ->where('sites.0.site_name', 'Cabang Kelapa Gading')
        );
    }

    public function test_customer_can_create_request_with_branch_and_location_details(): void
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::create([
            'company_name' => 'PT Berkah Pangan',
            'pic_name' => 'Siti Rahma',
            'phone' => '08122334455',
            'email' => 'siti@berkah.com',
            'address' => 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
        ]);

        $site = Site::create([
            'customer_id' => $customer->id,
            'site_name' => 'Gudang Cakung',
            'address' => 'Kawasan Industri Cakung Blok B3, Jakarta Timur',
            'location' => 'Jakarta Timur',
            'pic_name' => 'Pak Joko',
            'phone' => '08133445566',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Siti Rahma',
            'email' => 'siti@berkah.com',
            'password' => bcrypt('password'),
        ]);

        $payload = [
            'site_id' => $site->id,
            'lokasi' => 'Gudang Cakung (Area Logistik)',
            'alamat_detail' => 'Kawasan Industri Cakung Blok B3, Jakarta Timur',
            'pic_name' => 'Pak Joko',
            'pic_phone' => '08133445566',
            'jenis_layanan' => 'Rodent Control (Khusus Tikus / Rodensia)',
            'prioritas' => 'tinggi',
            'tanggal_permintaan' => now()->addDays(2)->format('Y-m-d'),
            'waktu_layanan' => 'Pagi (08:00 - 12:00)',
            'deskripsi' => 'Terlihat tanda-tanda kotoran tikus di rak penyimpanan bahan baku kering.',
        ];

        $response = $this->actingAs($customerUser, 'customer')
            ->post(route('portal.requests.store'), $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('customer_requests', [
            'customer_id' => $customer->id,
            'site_id' => $site->id,
            'lokasi' => 'Gudang Cakung (Area Logistik)',
            'alamat_detail' => 'Kawasan Industri Cakung Blok B3, Jakarta Timur',
            'pic_name' => 'Pak Joko',
            'pic_phone' => '08133445566',
            'jenis_layanan' => 'Rodent Control (Khusus Tikus / Rodensia)',
            'prioritas' => 'tinggi',
            'waktu_layanan' => 'Pagi (08:00 - 12:00)',
            'status' => 'baru',
        ]);
    }

    public function test_admin_can_view_customer_request_location_and_pic_details(): void
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::create([
            'company_name' => 'PT Sejahtera Sentosa',
            'pic_name' => 'Bambang',
            'phone' => '08111222333',
            'email' => 'bambang@sejahtera.com',
            'address' => 'Jl. TB Simatupang, Jakarta Selatan',
        ]);

        $req = CustomerRequest::create([
            'request_number' => 'REQ/202609/0099',
            'customer_id' => $customer->id,
            'lokasi' => 'Outlet Cilandak Town Square',
            'alamat_detail' => 'Citos Ground Floor Unit 12',
            'pic_name' => 'Rian',
            'pic_phone' => '08177889900',
            'jenis_layanan' => 'General Pest Control',
            'prioritas' => 'sedang',
            'deskripsi' => 'Penanganan rutin bulanan area kitchen dan dining.',
            'tanggal_permintaan' => now()->addDays(1)->format('Y-m-d'),
            'waktu_layanan' => 'Siang (13:00 - 17:00)',
            'status' => 'baru',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('customer-requests.show', $req->id));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerRequests/Show')
            ->where('requestItem.lokasi', 'Outlet Cilandak Town Square')
            ->where('requestItem.pic_name', 'Rian')
            ->where('requestItem.pic_phone', '08177889900')
            ->where('requestItem.waktu_layanan', 'Siang (13:00 - 17:00)')
        );
    }
}
