<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Schedule;
use App\Models\SurveyReport;
use App\Models\Technician;
use App\Models\User;
use App\Models\WorkReport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        $roles = ['super_admin', 'admin', 'supervisor', 'technician', 'management', 'sales', 'customer_service', 'customer'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@gpest.com'],
            ['name' => 'Admin GPEST', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $admin->assignRole('admin');

        $supervisor = User::firstOrCreate(
            ['email' => 'supervisor@gpest.com'],
            ['name' => 'Supervisor Utama', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $supervisor->assignRole('supervisor');

        $teknisi1 = User::firstOrCreate(
            ['email' => 'teknisi1@gpest.com'],
            ['name' => 'Budi Santoso', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $teknisi1->assignRole('technician');

        $teknisi2 = User::firstOrCreate(
            ['email' => 'teknisi2@gpest.com'],
            ['name' => 'Andi Cahyono', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $teknisi2->assignRole('technician');

        $management = User::firstOrCreate(
            ['email' => 'management@gpest.com'],
            ['name' => 'Manajemen GPEST', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $management->assignRole('management');

        // Technicians (linked to users)
        Technician::firstOrCreate(
            ['user_id' => $teknisi1->id],
            [
                'employee_id' => 'EMP-001',
                'nama' => 'Budi Santoso',
                'telepon' => '081234567890',
                'email' => 'teknisi1@gpest.com',
                'jabatan' => 'Senior Technician',
                'status' => 'aktif',
                'area_tugas' => 'Jakarta Selatan, Jakarta Pusat',
                'keahlian' => ['General Pest Control', 'Termite Control', 'Fumigation'],
                'tanggal_bergabung' => '2022-01-15',
            ]
        );

        Technician::firstOrCreate(
            ['user_id' => $teknisi2->id],
            [
                'employee_id' => 'EMP-002',
                'nama' => 'Andi Cahyono',
                'telepon' => '081234567891',
                'email' => 'teknisi2@gpest.com',
                'jabatan' => 'Technician',
                'status' => 'aktif',
                'area_tugas' => 'Jakarta Barat, Tangerang',
                'keahlian' => ['Rodent Control', 'Insect Control', 'Disinfection'],
                'tanggal_bergabung' => '2023-06-01',
            ]
        );

        // Customers
        $customers = [
            Customer::firstOrCreate(
                ['customer_id' => 'CUST-001'],
                [
                    'company_name' => 'PT Maju Bersama Indonesia',
                    'pic_name' => 'Hendra Wijaya',
                    'phone' => '021-5551234',
                    'email' => 'hendra@majubersama.co.id',
                    'address' => 'Jl. Sudirman No. 100, Jakarta Selatan',
                    'location' => 'Jakarta Selatan',
                    'npwp' => '01.234.567.8-012.000',
                    'status' => 'active',
                    'sales_pic' => 'Sales Team A',
                ]
            ),
            Customer::firstOrCreate(
                ['customer_id' => 'CUST-002'],
                [
                    'company_name' => 'PT Sinar Harapan Jaya',
                    'pic_name' => 'Dewi Lestari',
                    'phone' => '021-5555678',
                    'email' => 'dewi@sinarharapan.co.id',
                    'address' => 'Jl. Gatot Subroto No. 50, Jakarta Pusat',
                    'location' => 'Jakarta Pusat',
                    'npwp' => null,
                    'status' => 'active',
                    'sales_pic' => 'Sales Team B',
                ]
            ),
            Customer::firstOrCreate(
                ['customer_id' => 'CUST-003'],
                [
                    'company_name' => 'Hotel Bintang Lima Jakarta',
                    'pic_name' => 'Rudi Hartono',
                    'phone' => '021-5559012',
                    'email' => 'rudi@bintanglima.co.id',
                    'address' => 'Jl. Thamrin No. 25, Jakarta Pusat',
                    'location' => 'Jakarta Pusat',
                    'npwp' => '02.345.678.9-012.000',
                    'status' => 'active',
                    'sales_pic' => 'Sales Team A',
                ]
            ),
            Customer::firstOrCreate(
                ['customer_id' => 'CUST-004'],
                [
                    'company_name' => 'RS Sehat Sejahtera',
                    'pic_name' => 'Dr. Siti Nurhaliza',
                    'phone' => '021-5553456',
                    'email' => 'siti@sehatsejahtera.co.id',
                    'address' => 'Jl. Kesehatan No. 10, Jakarta Barat',
                    'location' => 'Jakarta Barat',
                    'npwp' => '03.456.789.0-123.000',
                    'status' => 'active',
                    'sales_pic' => 'Sales Team B',
                ]
            ),
            Customer::firstOrCreate(
                ['customer_id' => 'CUST-005'],
                [
                    'company_name' => 'Gudang Logistik Nusantara',
                    'pic_name' => 'Firmansyah',
                    'phone' => '021-5557890',
                    'email' => 'firman@gudanglogistik.co.id',
                    'address' => 'Jl. Raya Cengkareng No. 200, Tangerang',
                    'location' => 'Tangerang',
                    'npwp' => null,
                    'status' => 'active',
                    'sales_pic' => 'Sales Team A',
                ]
            ),
        ];

        // Contracts
        $contracts = [
            Contract::firstOrCreate(
                ['contract_number' => 'CTR-2026-001'],
                [
                    'customer_id' => $customers[0]->id,
                    'location' => 'Jl. Sudirman No. 100, Jakarta Selatan',
                    'contract_type' => 'General Pest Control',
                    'start_date' => '2026-01-01',
                    'end_date' => '2026-12-31',
                    'service_frequency' => 'Bulanan',
                    'service_type' => 'General Pest Control',
                    'contract_value' => 120000000,
                    'status' => 'active',
                    'pic' => 'Hendra Wijaya',
                ]
            ),
            Contract::firstOrCreate(
                ['contract_number' => 'CTR-2026-002'],
                [
                    'customer_id' => $customers[2]->id,
                    'location' => 'Jl. Thamrin No. 25, Jakarta Pusat',
                    'contract_type' => 'Termite Control',
                    'start_date' => '2026-03-01',
                    'end_date' => '2027-02-28',
                    'service_frequency' => 'Triwulanan',
                    'service_type' => 'Termite Control',
                    'contract_value' => 180000000,
                    'status' => 'active',
                    'pic' => 'Rudi Hartono',
                ]
            ),
            Contract::firstOrCreate(
                ['contract_number' => 'CTR-2026-003'],
                [
                    'customer_id' => $customers[3]->id,
                    'location' => 'Jl. Kesehatan No. 10, Jakarta Barat',
                    'contract_type' => 'Disinfection',
                    'start_date' => '2026-02-01',
                    'end_date' => '2027-01-31',
                    'service_frequency' => 'Mingguan',
                    'service_type' => 'Disinfection',
                    'contract_value' => 240000000,
                    'status' => 'active',
                    'pic' => 'Dr. Siti Nurhaliza',
                ]
            ),
        ];

        // Schedules
        $schedules = [
            Schedule::firstOrCreate(
                ['schedule_code' => 'SCH-20260831-001'],
                [
                    'customer_id' => $customers[0]->id,
                    'contract_id' => $contracts[0]->id,
                    'lokasi' => 'Jl. Sudirman No. 100, Jakarta Selatan',
                    'jenis_layanan' => 'General Pest Control',
                    'technician_id' => $teknisi1->id,
                    'supervisor_id' => $supervisor->id,
                    'tanggal' => now()->toDateString(),
                    'jam_mulai' => '08:00',
                    'jam_selesai' => '10:00',
                    'prioritas' => 'normal',
                    'status' => 'sedang_dikerjakan',
                    'catatan' => 'Treatment rutin bulanan',
                ]
            ),
            Schedule::firstOrCreate(
                ['schedule_code' => 'SCH-20260831-002'],
                [
                    'customer_id' => $customers[2]->id,
                    'contract_id' => $contracts[1]->id,
                    'lokasi' => 'Jl. Thamrin No. 25, Jakarta Pusat',
                    'jenis_layanan' => 'Termite Control',
                    'technician_id' => $teknisi2->id,
                    'supervisor_id' => $supervisor->id,
                    'tanggal' => now()->toDateString(),
                    'jam_mulai' => '13:00',
                    'jam_selesai' => '15:00',
                    'prioritas' => 'tinggi',
                    'status' => 'dijadwalkan',
                    'catatan' => 'Inspeksi termite periodik',
                ]
            ),
            Schedule::firstOrCreate(
                ['schedule_code' => 'SCH-20260830-001'],
                [
                    'customer_id' => $customers[3]->id,
                    'contract_id' => $contracts[2]->id,
                    'lokasi' => 'Jl. Kesehatan No. 10, Jakarta Barat',
                    'jenis_layanan' => 'Disinfection',
                    'technician_id' => $teknisi1->id,
                    'supervisor_id' => $supervisor->id,
                    'tanggal' => now()->subDay()->toDateString(),
                    'jam_mulai' => '09:00',
                    'jam_selesai' => '11:00',
                    'prioritas' => 'normal',
                    'status' => 'selesai',
                    'catatan' => 'Disinfection area operasi',
                ]
            ),
            Schedule::firstOrCreate(
                ['schedule_code' => 'SCH-20260901-001'],
                [
                    'customer_id' => $customers[4]->id,
                    'contract_id' => null,
                    'lokasi' => 'Jl. Raya Cengkareng No. 200, Tangerang',
                    'jenis_layanan' => 'Rodent Control',
                    'technician_id' => $teknisi2->id,
                    'supervisor_id' => $supervisor->id,
                    'tanggal' => now()->addDay()->toDateString(),
                    'jam_mulai' => '08:00',
                    'jam_selesai' => '12:00',
                    'prioritas' => 'urgent',
                    'status' => 'dijadwalkan',
                    'catatan' => 'Inspeksi awal tikus di gudang',
                ]
            ),
            Schedule::firstOrCreate(
                ['schedule_code' => 'SCH-20260902-001'],
                [
                    'customer_id' => $customers[1]->id,
                    'contract_id' => null,
                    'lokasi' => 'Jl. Gatot Subroto No. 50, Jakarta Pusat',
                    'jenis_layanan' => 'General Pest Control',
                    'technician_id' => $teknisi1->id,
                    'supervisor_id' => $supervisor->id,
                    'tanggal' => now()->addDays(2)->toDateString(),
                    'jam_mulai' => '10:00',
                    'jam_selesai' => '12:00',
                    'prioritas' => 'normal',
                    'status' => 'dijadwalkan',
                    'catatan' => 'Treatment kecoa',
                ]
            ),
        ];

        // Work Reports
        $workReport1 = WorkReport::firstOrCreate(
            ['nomor_laporan' => 'WR-20260830-001'],
            [
                'customer_id' => $customers[3]->id,
                'contract_id' => $contracts[2]->id,
                'schedule_id' => $schedules[2]->id,
                'technician_id' => $teknisi1->id,
                'tanggal' => now()->subDay()->toDateString(),
                'jam_mulai' => '09:00',
                'jam_selesai' => '11:00',
                'jenis_layanan' => 'Disinfection',
                'jenis_hama' => null,
                'metode_treatment' => 'Spraying',
                'bahan_kimia' => 'Disinfectant Solution 5%',
                'jumlah_bahan' => '2 liter',
                'area_treatment' => 'Seluruh area operasi dan ruang rawat',
                'peralatan' => 'ULV Machine, Sprayer',
                'temuan' => 'Area steril setelah treatment sebelumnya. Tidak ditemukan kontaminasi.',
                'aktivitas_hama' => 'Tidak ada aktivitas hama',
                'tingkat_keparahan' => 'Rendah',
                'rekomendasi' => 'Lanjutkan jadwal disinfection mingguan',
                'status' => 'disetujui',
                'catatan_supervisor' => 'Laporan lengkap dan sesuai standar',
            ]
        );

        WorkReport::firstOrCreate(
            ['nomor_laporan' => 'WR-20260831-001'],
            [
                'customer_id' => $customers[0]->id,
                'contract_id' => $contracts[0]->id,
                'schedule_id' => $schedules[0]->id,
                'technician_id' => $teknisi1->id,
                'tanggal' => now()->toDateString(),
                'jam_mulai' => '08:00',
                'jam_selesai' => '10:00',
                'jenis_layanan' => 'General Pest Control',
                'jenis_hama' => 'Kecoa, Semut',
                'metode_treatment' => 'Spraying, Gel Baiting',
                'bahan_kimia' => 'Cypermethrin 100 EC, Gel Bait',
                'jumlah_bahan' => '500 ml, 200 gr',
                'area_treatment' => 'Area dapur, gudang, dan sekitar bangunan',
                'peralatan' => 'Sprayer, Bait Gun',
                'temuan' => 'Ditemukan aktivitas kecoa di area dapur. Jejak semut di gudang.',
                'aktivitas_hama' => 'Aktivitas kecoa sedang di area dapur',
                'tingkat_keparahan' => 'Sedang',
                'rekomendasi' => 'Treatment ulang dalam 2 minggu. Perhatikan sanitasi area dapur.',
                'status' => 'dikirim',
                'catatan_supervisor' => null,
            ]
        );

        WorkReport::firstOrCreate(
            ['nomor_laporan' => 'WR-20260831-002'],
            [
                'customer_id' => $customers[2]->id,
                'contract_id' => $contracts[1]->id,
                'schedule_id' => $schedules[1]->id,
                'technician_id' => $teknisi2->id,
                'tanggal' => now()->toDateString(),
                'jam_mulai' => '13:00',
                'jam_selesai' => null,
                'jenis_layanan' => 'Termite Control',
                'jenis_hama' => 'Rayap',
                'metode_treatment' => 'Soil Treatment',
                'bahan_kimia' => 'Imidacloprid 200 SL',
                'jumlah_bahan' => '1 liter',
                'area_treatment' => 'Area basement dan parkir',
                'peralatan' => 'Drill, Injection Tool',
                'temuan' => null,
                'aktivitas_hama' => null,
                'tingkat_keparahan' => null,
                'rekomendasi' => null,
                'status' => 'draft',
                'catatan_supervisor' => null,
            ]
        );

        // Survey Reports
        SurveyReport::firstOrCreate(
            ['nomor_survey' => 'SR-20260828-001'],
            [
                'customer_id' => $customers[4]->id,
                'contract_id' => null,
                'technician_id' => $teknisi2->id,
                'tanggal_survey' => now()->subDays(3)->toDateString(),
                'lokasi' => 'Jl. Raya Cengkareng No. 200, Tangerang',
                'jenis_hama' => ['Tikus', 'Kecoa'],
                'area_survey' => 'Seluruh area gudang dan kantor',
                'temuan' => 'Ditemukan jejak tikus di area gudang. Kecoa di area kantor.',
                'tingkat_risiko' => 'tinggi',
                'rekomendasi' => 'Lakukan treatment intensive untuk tikus. Pasang bait station di beberapa titik.',
                'catatan' => 'Customer meminta treatment segera',
                'status' => 'disetujui',
            ]
        );

        SurveyReport::firstOrCreate(
            ['nomor_survey' => 'SR-20260829-001'],
            [
                'customer_id' => $customers[1]->id,
                'contract_id' => null,
                'technician_id' => $teknisi1->id,
                'tanggal_survey' => now()->subDays(2)->toDateString(),
                'lokasi' => 'Jl. Gatot Subroto No. 50, Jakarta Pusat',
                'jenis_hama' => ['Kecoa'],
                'area_survey' => 'Area dapur dan ruang makan',
                'temuan' => 'Aktivitas kecoa ringan di area dapur',
                'tingkat_risiko' => 'sedang',
                'rekomendasi' => 'Treatment rutin bulanan sudah cukup',
                'catatan' => null,
                'status' => 'dikirim',
            ]
        );

        // Leads
        $leads = [
            Lead::firstOrCreate(
                ['lead_id' => 'LD-0001'],
                [
                    'nama_perusahaan' => 'PT Teknologi Maju',
                    'nama_pic' => 'Rizki Pratama',
                    'telepon' => '021-5551111',
                    'email' => 'rizki@teknologimaju.co.id',
                    'alamat' => 'Jl. TB Simatupang No. 88, Jakarta Selatan',
                    'sumber_lead' => 'website',
                    'kebutuhan' => 'General pest control untuk gedung kantor 5 lantai',
                    'status' => 'baru',
                    'assigned_sales' => $management->id,
                ]
            ),
            Lead::firstOrCreate(
                ['lead_id' => 'LD-0002'],
                [
                    'nama_perusahaan' => 'Restoran Nusantara',
                    'nama_pic' => 'Chef Anderson',
                    'telepon' => '021-5552222',
                    'email' => 'anderson@nusantara.co.id',
                    'alamat' => 'Jl. Kemang No. 15, Jakarta Selatan',
                    'sumber_lead' => 'referral',
                    'kebutuhan' => 'Termite control untuk area dapur dan storage',
                    'status' => 'dihubungi',
                    'assigned_sales' => $management->id,
                ]
            ),
            Lead::firstOrCreate(
                ['lead_id' => 'LD-0003'],
                [
                    'nama_perusahaan' => 'Apartment Green Living',
                    'nama_pic' => 'Property Manager',
                    'telepon' => '021-5553333',
                    'email' => 'manager@greenliving.co.id',
                    'alamat' => 'Jl. Green Living No. 1, BSD City',
                    'sumber_lead' => 'telepon',
                    'kebutuhan' => 'Fumigation untuk unit apartemen',
                    'status' => 'survey',
                    'assigned_sales' => $management->id,
                ]
            ),
            Lead::firstOrCreate(
                ['lead_id' => 'LD-0004'],
                [
                    'nama_perusahaan' => 'Pabrik Makanan Sehat',
                    'nama_pic' => 'Quality Manager',
                    'telepon' => '021-5554444',
                    'email' => 'quality@makanansehat.co.id',
                    'alamat' => 'Kawasan Industri Cikarang',
                    'sumber_lead' => 'media_sosial',
                    'kebutuhan' => 'Rodent control untuk area produksi',
                    'status' => 'negosiasi',
                    'assigned_sales' => $management->id,
                ]
            ),
        ];

        // Lead Activities
        LeadActivity::create([
            'lead_id' => $leads[0]->id,
            'user_id' => $management->id,
            'jenis_aktivitas' => 'catatan',
            'judul' => 'Lead baru dari website',
            'deskripsi' => 'Form inquiry dari website G-PEST',
            'tanggal_aktivitas' => now()->subDays(5)->toDateString(),
        ]);

        LeadActivity::create([
            'lead_id' => $leads[1]->id,
            'user_id' => $management->id,
            'jenis_aktivitas' => 'telepon',
            'judul' => 'Follow up via telepon',
            'deskripsi' => 'Berhasil menghubungi Chef Anderson. Tertarik dengan layanan kami.',
            'tanggal_aktivitas' => now()->subDays(3)->toDateString(),
        ]);

        // Quotations
        $quotation = Quotation::firstOrCreate(
            ['nomor_quotation' => 'QTN-0001'],
            [
                'customer_id' => $customers[0]->id,
                'lead_id' => $leads[3]->id,
                'berlaku_hingga' => now()->addDays(30)->toDateString(),
                'syarat_ketentuan' => "Pembayaran: DP 50% saat pengerjaan, 50% lunas setelah selesai.\nGaransi: 30 hari setelah pengerjaan selesai.\nHarga belum termasuk PPN 11%.",
                'catatan' => 'Harga spesial untuk project pertama',
                'status' => 'draft',
                'dibuat_oleh' => $management->id,
            ]
        );

        QuotationItem::create([
            'quotation_id' => $quotation->id,
            'jenis_layanan' => 'Rodent Control',
            'deskripsi' => 'Treatment tikus untuk area produksi',
            'kuantitas' => 1,
            'satuan' => 'servis',
            'harga_satuan' => 15000000,
            'diskon_persen' => 10,
            'subtotal' => 13500000,
        ]);

        QuotationItem::create([
            'quotation_id' => $quotation->id,
            'jenis_layanan' => 'Bait Station',
            'deskripsi' => 'Pemasangan 10 bait station',
            'kuantitas' => 10,
            'satuan' => 'pcs',
            'harga_satuan' => 500000,
            'diskon_persen' => 0,
            'subtotal' => 5000000,
        ]);

        $this->command->info('Demo seeder completed successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('  admin@gpest.com / password123');
        $this->command->info('  supervisor@gpest.com / password123');
        $this->command->info('  teknisi1@gpest.com / password123');
        $this->command->info('  teknisi2@gpest.com / password123');
        $this->command->info('  management@gpest.com / password123');
    }
}
