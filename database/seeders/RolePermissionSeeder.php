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

            'sites.view',
            'sites.create',
            'sites.edit',
            'sites.delete',

            'contracts.view',
            'contracts.create',
            'contracts.edit',
            'contracts.delete',

            'schedules.view',
            'schedules.create',
            'schedules.edit',
            'schedules.delete',

            'work-orders.view',
            'work-orders.create',
            'work-orders.edit',
            'work-orders.delete',
            'work-orders.approve',

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

        // 2. Management: Read-only Analytics (Dashboard, Revenue, Customer, Job Performance, CRM, Audit Logs)
        $managementRole = Role::firstOrCreate(['name' => 'management', 'guard_name' => 'web']);
        $managementRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'sites.view',
            'contracts.view',
            'schedules.view',
            'work-orders.view',
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

        // 3. Admin: CRUD Operasional Pelanggan, Sites, Kontrak, Quotation, Invoice, Work Orders, CRM, & Request
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions([
            'dashboard.view',
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'sites.view', 'sites.create', 'sites.edit', 'sites.delete',
            'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.delete',
            'schedules.view', 'schedules.create', 'schedules.edit', 'schedules.delete',
            'work-orders.view', 'work-orders.create', 'work-orders.edit', 'work-orders.delete',
            'technicians.view',
            'work-reports.view', 'work-reports.approve',
            'survey-reports.view',
            'crm.view', 'crm.manage',
            'quotations.view', 'quotations.manage',
            'invoices.view', 'invoices.manage',
            'customer-requests.view', 'customer-requests.manage',
            'leaves.view', 'leaves.manage',
            'attendance.view',
            'master-data.view', 'master-data.manage',
        ]);

        // 4. Supervisor: Monitoring Teknisi, Work Order Review/Approve, Inspection & Attendance Approval
        $supervisorRole = Role::firstOrCreate(['name' => 'supervisor', 'guard_name' => 'web']);
        $supervisorRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'sites.view',
            'contracts.view',
            'schedules.view', 'schedules.create', 'schedules.edit', 'schedules.delete',
            'work-orders.view', 'work-orders.create', 'work-orders.edit', 'work-orders.approve',
            'technicians.view', 'technicians.create', 'technicians.edit',
            'work-reports.view', 'work-reports.create', 'work-reports.edit', 'work-reports.delete', 'work-reports.approve',
            'survey-reports.view', 'survey-reports.create', 'survey-reports.edit',
            'customer-requests.view', 'customer-requests.manage',
            'leaves.view', 'leaves.manage',
            'attendance.view', 'attendance.manage',
        ]);

        // 5. Teknisi: Penugasan Lapangan, Work Order Saya, Check-In GPS, Form Inspeksi & Laporan Kerja
        $technicianRole = Role::firstOrCreate(['name' => 'technician', 'guard_name' => 'web']);
        $technicianRole->syncPermissions([
            'dashboard.view',
            'schedules.view',
            'work-orders.view',
            'work-reports.view', 'work-reports.create', 'work-reports.edit',
            'survey-reports.view', 'survey-reports.create',
            'attendance.view', 'attendance.manage',
            'leaves.view',
        ]);

        // 6. Customer: Customer Portal
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
    }
}
