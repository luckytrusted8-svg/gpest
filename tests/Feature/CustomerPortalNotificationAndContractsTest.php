<?php

namespace Tests\Feature;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CustomerPortalNotificationAndContractsTest extends TestCase
{
    use RefreshDatabase;

    public function test_contracts_empty_state_renders_successfully(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Test Customer',
            'pic_name' => 'Budi Santoso',
            'phone' => '08123456789',
            'email' => 'budi@example.com',
            'address' => 'Jl. Sudirman, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.contracts'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerPortal/Contracts')
            ->has('contracts.data', 0)
        );
    }

    public function test_contracts_with_data_renders_successfully(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Mega Jaya',
            'pic_name' => 'Andi',
            'phone' => '08123456780',
            'email' => 'andi@megajaya.com',
            'address' => 'Jl. Gatot Subroto, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Andi',
            'email' => 'andi@megajaya.com',
            'password' => bcrypt('password'),
        ]);

        Contract::create([
            'contract_number' => 'CTR/2026/001',
            'customer_id' => $customer->id,
            'contract_type' => 'Commercial',
            'service_type' => 'General Pest Control',
            'service_frequency' => 'Bulanan',
            'location' => 'Kantor Pusat Mega Jaya',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'contract_value' => 15000000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.contracts'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CustomerPortal/Contracts')
            ->has('contracts.data', 1)
            ->where('contracts.data.0.contract_number', 'CTR/2026/001')
        );
    }

    public function test_customer_can_fetch_notifications(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Mitra Sejati',
            'pic_name' => 'Dewi',
            'phone' => '081333444555',
            'email' => 'dewi@mitra.com',
            'address' => 'Jl. Thamrin, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Dewi',
            'email' => 'dewi@mitra.com',
            'password' => bcrypt('password'),
        ]);

        Notification::create([
            'customer_user_id' => $customerUser->id,
            'judul' => 'Jadwal Baru Dikonfirmasi',
            'pesan' => 'Teknisi akan datang besok pukul 09:00 WIB.',
            'jenis' => 'info',
            'modul' => 'schedules',
            'url_tujuan' => '/portal/schedules',
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->get(route('portal.notifications'));

        $response->assertStatus(200);
        $response->assertJson([
            'unread_count' => 1,
        ]);
        $response->assertJsonCount(1, 'data');
    }

    public function test_customer_can_mark_notification_as_read(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Sentosa Abadi',
            'pic_name' => 'Rina',
            'phone' => '081444555666',
            'email' => 'rina@sentosa.com',
            'address' => 'Jl. Kuningan, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Rina',
            'email' => 'rina@sentosa.com',
            'password' => bcrypt('password'),
        ]);

        $notification = Notification::create([
            'customer_user_id' => $customerUser->id,
            'judul' => 'Laporan Selesai',
            'pesan' => 'Laporan kerja telah selesai.',
            'jenis' => 'sukses',
            'modul' => 'work-reports',
            'url_tujuan' => '/portal/work-reports/1',
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->post(route('portal.notifications.read', $notification->id));

        $response->assertRedirect();
        $this->assertNotNull($notification->fresh()->dibaca_pada);
    }

    public function test_customer_can_mark_all_notifications_as_read(): void
    {
        $customer = Customer::create([
            'company_name' => 'PT Harmoni Citra',
            'pic_name' => 'Maya',
            'phone' => '081555666777',
            'email' => 'maya@harmoni.com',
            'address' => 'Jl. Rasuna Said, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Maya',
            'email' => 'maya@harmoni.com',
            'password' => bcrypt('password'),
        ]);

        Notification::create([
            'customer_user_id' => $customerUser->id,
            'judul' => 'Notif 1',
            'pesan' => 'Pesan 1',
            'jenis' => 'info',
            'modul' => 'portal',
        ]);

        Notification::create([
            'customer_user_id' => $customerUser->id,
            'judul' => 'Notif 2',
            'pesan' => 'Pesan 2',
            'jenis' => 'info',
            'modul' => 'portal',
        ]);

        $response = $this->actingAs($customerUser, 'customer')
            ->post(route('portal.notifications.read-all'));

        $response->assertRedirect();
        $this->assertEquals(0, Notification::where('customer_user_id', $customerUser->id)->whereNull('dibaca_pada')->count());
    }

    public function test_admin_updating_request_notifies_customer(): void
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::create([
            'company_name' => 'PT Sukses Mandiri',
            'pic_name' => 'Hendra',
            'phone' => '081888999000',
            'email' => 'hendra@sukses.com',
            'address' => 'Jl. Gajah Mada, Jakarta',
        ]);

        $customerUser = CustomerUser::create([
            'customer_id' => $customer->id,
            'nama' => 'Hendra',
            'email' => 'hendra@sukses.com',
            'password' => bcrypt('password'),
        ]);

        $requestItem = CustomerRequest::create([
            'request_number' => 'REQ/202609/0123',
            'customer_id' => $customer->id,
            'lokasi' => 'Kantor Pusat',
            'jenis_layanan' => 'Termite Control',
            'prioritas' => 'sedang',
            'deskripsi' => 'Indikasi rayap di kusen pintu.',
            'status' => 'baru',
        ]);

        $response = $this->actingAs($admin)
            ->put(route('customer-requests.status', $requestItem->id), [
                'status' => 'dijadwalkan',
                'catatan_admin' => 'Teknisi akan hadir hari Rabu pukul 10:00.',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('notifications', [
            'customer_user_id' => $customerUser->id,
            'judul' => 'Status Permintaan Diperbarui (REQ/202609/0123)',
            'jenis' => 'sukses',
        ]);
    }
}
