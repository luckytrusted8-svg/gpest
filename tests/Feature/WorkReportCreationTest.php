<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Schedule;
use App\Models\User;
use App\Models\WorkReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class WorkReportCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $karyawan = Role::firstOrCreate(['name' => 'karyawan', 'guard_name' => 'web']);
        $viewPerm = Permission::firstOrCreate(['name' => 'work-reports.view', 'guard_name' => 'web']);
        $approvePerm = Permission::firstOrCreate(['name' => 'work-reports.approve', 'guard_name' => 'web']);
        $admin->givePermissionTo([$viewPerm, $approvePerm]);
        $karyawan->givePermissionTo($viewPerm);
    }

    public function test_work_report_create_page_prefills_from_schedule()
    {
        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-001',
            'company_name' => 'PT Test Customer',
            'pic_name' => 'John Doe',
            'pic_phone' => '08123456789',
            'email' => 'test@cust.com',
            'phone' => '08123456789',
            'address' => 'Jl. Uji Coba No. 1',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $schedule = Schedule::create([
            'schedule_code' => 'SCH-TEST-001',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'lokasi' => 'Gedung Kantor Pusat',
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00:00',
            'jam_selesai' => '11:00:00',
            'jenis_layanan' => 'Termite Control',
            'status' => 'dijadwalkan',
            'prioritas' => 'normal',
        ]);

        $response = $this->actingAs($technician)
            ->get(route('work-reports.create', ['schedule_id' => $schedule->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('WorkReports/Create')
            ->where('prefilled.schedule_id', (string) $schedule->id)
            ->where('prefilled.customer_id', (string) $customer->id)
            ->where('prefilled.technician_id', (string) $technician->id)
            ->where('prefilled.jenis_layanan', 'Termite Control')
            ->where('prefilled.tanggal', '2026-09-15')
            ->where('prefilled.jam_mulai', '09:00')
            ->where('prefilled.jam_selesai', '11:00')
        );
    }

    public function test_work_report_stores_base64_photo_to_storage()
    {
        Storage::fake('public');

        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-002',
            'company_name' => 'PT Test Customer 2',
            'pic_name' => 'Jane Doe',
            'pic_phone' => '08123456788',
            'email' => 'test2@cust.com',
            'phone' => '08123456788',
            'address' => 'Jl. Uji Coba No. 2',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        // 1x1 transparent PNG base64
        $base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $reportData = [
            'nomor_laporan' => 'WR-TEST-001',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'dikirim',
            'temuan' => 'Ada kecoa di dapur',
            'aktivitas_hama' => 'Rendah',
            'tingkat_keparahan' => 'Rendah',
            'photos' => [
                [
                    'jenis_foto' => 'sebelum',
                    'path_foto' => $base64Image,
                    'keterangan' => 'Foto bukti sebelum',
                ],
            ],
        ];

        $response = $this->actingAs($technician)
            ->post(route('work-reports.store'), $reportData);

        $report = WorkReport::where('nomor_laporan', 'WR-TEST-001')->first();
        $this->assertNotNull($report);
        $response->assertRedirect(route('work-reports.show', $report));
        $this->assertCount(1, $report->photos);

        $photo = $report->photos->first();
        $this->assertStringStartsWith('/storage/work_reports/photos/', $photo->path_foto);
        $this->assertEquals('Foto bukti sebelum', $photo->keterangan);
    }

    public function test_karyawan_cannot_approve_work_report()
    {
        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-003',
            'company_name' => 'PT Test Customer 3',
            'pic_name' => 'Bob',
            'pic_phone' => '08123456787',
            'email' => 'test3@cust.com',
            'phone' => '08123456787',
            'address' => 'Jl. Uji Coba No. 3',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $report = WorkReport::create([
            'nomor_laporan' => 'WR-TEST-002',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'dikirim',
        ]);

        // Karyawan has no permission so gets redirected with unauthorized error
        $response = $this->actingAs($technician)
            ->post(route('work-reports.approve', $report->id));

        $response->assertRedirect(route('login'));
        $this->assertEquals('dikirim', $report->fresh()->status);
    }

    public function test_admin_can_approve_work_report()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-004',
            'company_name' => 'PT Test Customer 4',
            'pic_name' => 'Alice',
            'pic_phone' => '08123456786',
            'email' => 'test4@cust.com',
            'phone' => '08123456786',
            'address' => 'Jl. Uji Coba No. 4',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $report = WorkReport::create([
            'nomor_laporan' => 'WR-TEST-003',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'dikirim',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('work-reports.approve', $report->id), [
                'catatan_supervisor' => 'Pekerjaan sangat baik.',
            ]);

        $response->assertRedirect(route('work-reports.show', $report));
        $this->assertEquals('disetujui', $report->fresh()->status);
        $this->assertEquals('Pekerjaan sangat baik.', $report->fresh()->catatan_supervisor);
    }

    public function test_admin_cannot_edit_technician_work_report()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-005',
            'company_name' => 'PT Test Customer 5',
            'pic_name' => 'Charlie',
            'pic_phone' => '08123456785',
            'email' => 'test5@cust.com',
            'phone' => '08123456785',
            'address' => 'Jl. Uji Coba No. 5',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $report = WorkReport::create([
            'nomor_laporan' => 'WR-TEST-004',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'revisi',
            'catatan_supervisor' => 'Perbaiki format temuan',
        ]);

        // Admin cannot visit edit page
        $response = $this->actingAs($admin)->get(route('work-reports.edit', $report->id));
        $response->assertRedirect(route('work-reports.show', $report));

        // Admin cannot submit update
        $response = $this->actingAs($admin)->put(route('work-reports.update', $report->id), [
            'nomor_laporan' => 'WR-TEST-004',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'dikirim',
        ]);
        $response->assertForbidden();
    }

    public function test_technician_resubmitting_revised_report_changes_status_to_dikirim()
    {
        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-006',
            'company_name' => 'PT Test Customer 6',
            'pic_name' => 'David',
            'pic_phone' => '08123456784',
            'email' => 'test6@cust.com',
            'phone' => '08123456784',
            'address' => 'Jl. Uji Coba No. 6',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $report = WorkReport::create([
            'nomor_laporan' => 'WR-TEST-005',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'revisi',
            'catatan_supervisor' => 'Foto dokumentasi kurang jelas',
        ]);

        $response = $this->actingAs($technician)->put(route('work-reports.update', $report->id), [
            'nomor_laporan' => 'WR-TEST-005',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jenis_layanan' => 'General Pest Control',
            'temuan' => 'Temuan yang sudah diperbaiki',
            'status' => 'dikirim',
        ]);

        $response->assertRedirect(route('work-reports.show', $report));
        $this->assertEquals('dikirim', $report->fresh()->status);
    }

    public function test_work_report_pdf_download()
    {
        $technician = User::factory()->create();
        $technician->assignRole('karyawan');

        $customer = Customer::create([
            'customer_id' => 'CUST-007',
            'company_name' => 'PT Test Customer 7',
            'pic_name' => 'Eve',
            'pic_phone' => '08123456783',
            'email' => 'test7@cust.com',
            'phone' => '08123456783',
            'address' => 'Jl. Uji Coba No. 7',
            'city' => 'Jakarta',
            'status' => 'active',
        ]);

        $report = WorkReport::create([
            'nomor_laporan' => 'WR-TEST-006',
            'customer_id' => $customer->id,
            'technician_id' => $technician->id,
            'tanggal' => '2026-09-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '11:00',
            'jenis_layanan' => 'General Pest Control',
            'status' => 'disetujui',
        ]);

        $response = $this->actingAs($technician)->get(route('work-reports.pdf', $report->id));
        $response->assertOk();
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
    }
}
