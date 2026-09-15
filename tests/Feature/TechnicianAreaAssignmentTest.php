<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Schedule;
use App\Models\Technician;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TechnicianAreaAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_technician_index_can_filter_by_area(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        Technician::create([
            'employee_id' => 'TEK-001',
            'nama' => 'Teknisi Depok',
            'telepon' => '08123456781',
            'email' => 'depok@gpest.com',
            'jabatan' => 'Teknisi Field',
            'status' => 'aktif',
            'area_tugas' => 'Depok',
            'tanggal_bergabung' => '2026-01-01',
        ]);

        Technician::create([
            'employee_id' => 'TEK-002',
            'nama' => 'Teknisi Jakarta',
            'telepon' => '08123456782',
            'email' => 'jakarta@gpest.com',
            'jabatan' => 'Teknisi Senior',
            'status' => 'aktif',
            'area_tugas' => 'Jakarta Pusat',
            'tanggal_bergabung' => '2026-01-01',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('technicians.index', ['area' => 'Depok']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Technicians/Index')
            ->has('technicians.data', 1)
            ->where('technicians.data.0.nama', 'Teknisi Depok')
            ->has('areaStats')
        );
    }

    public function test_schedule_create_eager_loads_technician_area(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $karyawan = User::factory()->create(['name' => 'Bang Jek']);
        $karyawan->assignRole('karyawan');

        Technician::create([
            'user_id' => $karyawan->id,
            'employee_id' => 'TEK-003',
            'nama' => 'Bang Jek',
            'telepon' => '08123456783',
            'email' => $karyawan->email,
            'jabatan' => 'Teknisi Senior',
            'status' => 'aktif',
            'area_tugas' => 'Depok',
            'tanggal_bergabung' => '2026-01-01',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('schedules.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Schedules/Create')
            ->has('technicians')
            ->where('technicians.0.technician.area_tugas', 'Depok')
        );
    }

    public function test_schedule_edit_eager_loads_technician_area(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::create([
            'company_name' => 'PT Client Depok',
            'pic_name' => 'PIC Budi',
            'phone' => '08123456789',
            'email' => 'client@depok.com',
            'location' => 'Depok',
            'address' => 'Jl. Margonda Raya No. 10, Depok',
        ]);

        $karyawan = User::factory()->create(['name' => 'Bang Jek']);
        $karyawan->assignRole('karyawan');

        Technician::create([
            'user_id' => $karyawan->id,
            'employee_id' => 'TEK-004',
            'nama' => 'Bang Jek',
            'telepon' => '08123456784',
            'email' => $karyawan->email,
            'jabatan' => 'Teknisi Senior',
            'status' => 'aktif',
            'area_tugas' => 'Depok',
            'tanggal_bergabung' => '2026-01-01',
        ]);

        $schedule = Schedule::create([
            'schedule_code' => 'SCH-TEST-001',
            'customer_id' => $customer->id,
            'lokasi' => $customer->address,
            'jenis_layanan' => 'General Pest Control',
            'technician_id' => $karyawan->id,
            'tanggal' => date('Y-m-d'),
            'jam_mulai' => '08:00',
            'jam_selesai' => '17:00',
            'prioritas' => 'normal',
            'status' => 'dijadwalkan',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('schedules.edit', $schedule));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Schedules/Edit')
            ->has('technicians')
            ->where('technicians.0.technician.area_tugas', 'Depok')
        );
    }
}
