<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Comprehensive Permissions List
        $permissions = [
            'dashboard.view',

            'customers.view',
            'customers.create',
            'customers.edit',
            'customers.delete',

            'contracts.view',
            'contracts.create',
            'contracts.edit',
            'contracts.delete',

            'schedules.view',
            'schedules.create',
            'schedules.edit',
            'schedules.delete',

            'technicians.view',
            'technicians.create',
            'technicians.edit',
            'technicians.delete',

            'work-reports.view',
            'work-reports.create',
            'work-reports.edit',
            'work-reports.delete',
            'work-reports.approve',

            'survey-reports.view',
            'survey-reports.create',
            'survey-reports.edit',

            'crm.view',
            'crm.manage',

            'quotations.view',
            'quotations.manage',

            'invoices.view',
            'invoices.manage',

            'customer-requests.view',
            'customer-requests.manage',

            'leaves.view',
            'leaves.manage',

            'attendance.view',
            'attendance.manage',

            'audit-logs.view',

            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            'master-data.view',
            'master-data.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // 1. Super Admin: Akses 100% Seluruh Fitur Sistem
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdminRole->syncPermissions(Permission::all());

        // 2. Management: Read-only Dashboard, Reports, Analytics, Financials
        $managementRole = Role::firstOrCreate(['name' => 'management', 'guard_name' => 'web']);
        $managementRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'contracts.view',
            'schedules.view',
            'technicians.view',
            'work-reports.view',
            'survey-reports.view',
            'crm.view',
            'quotations.view',
            'invoices.view',
            'customer-requests.view',
            'attendance.view',
            'audit-logs.view',
        ]);

        // 3. Admin: CRUD Operasional Pelanggan, Kontrak, Quotation, Invoice, CRM, & Request Klien
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions([
            'dashboard.view',
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.delete',
            'schedules.view', 'schedules.create', 'schedules.edit', 'schedules.delete',
            'technicians.view',
            'work-reports.view', 'work-reports.approve',
            'survey-reports.view',
            'crm.view', 'crm.manage',
            'quotations.view', 'quotations.manage',
            'invoices.view', 'invoices.manage',
            'customer-requests.view', 'customer-requests.manage',
            'leaves.view', 'leaves.manage',
            'attendance.view',
        ]);

        // 4. Supervisor: Manajerial Penjadwalan, Laporan Pengerjaan, Absensi & Tracking Teknisi
        $supervisorRole = Role::firstOrCreate(['name' => 'supervisor', 'guard_name' => 'web']);
        $supervisorRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'contracts.view',
            'schedules.view', 'schedules.create', 'schedules.edit', 'schedules.delete',
            'technicians.view', 'technicians.create', 'technicians.edit',
            'work-reports.view', 'work-reports.create', 'work-reports.edit', 'work-reports.delete', 'work-reports.approve',
            'survey-reports.view', 'survey-reports.create', 'survey-reports.edit',
            'customer-requests.view', 'customer-requests.manage',
            'leaves.view', 'leaves.manage',
            'attendance.view', 'attendance.manage',
        ]);

        // 5. Technician: Penugasan Pribadi, Absensi Check-In, Laporan Kerja, Cuti
        $technicianRole = Role::firstOrCreate(['name' => 'technician', 'guard_name' => 'web']);
        $technicianRole->syncPermissions([
            'dashboard.view',
            'schedules.view',
            'work-reports.view', 'work-reports.create', 'work-reports.edit',
            'survey-reports.view', 'survey-reports.create',
            'attendance.view', 'attendance.manage',
            'leaves.view',
        ]);

        // 6. Customer: Menggunakan Customer Portal khusus (Guard customer)
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
    }
}
