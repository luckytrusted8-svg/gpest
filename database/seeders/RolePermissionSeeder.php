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

        // 1. Admin: Akses 100% Seluruh Fitur Sistem
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // 2. Karyawan: Penugasan Lapangan, Jadwal, Work Order, Laporan Kerja, Survei, Presensi, Cuti
        $karyawanRole = Role::firstOrCreate(['name' => 'karyawan', 'guard_name' => 'web']);
        $karyawanRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'sites.view',
            'contracts.view',
            'schedules.view', 'schedules.create', 'schedules.edit',
            'work-orders.view', 'work-orders.create', 'work-orders.edit', 'work-orders.approve',
            'technicians.view', 'technicians.create', 'technicians.edit',
            'work-reports.view', 'work-reports.create', 'work-reports.edit', 'work-reports.approve',
            'survey-reports.view', 'survey-reports.create', 'survey-reports.edit',
            'attendance.view', 'attendance.manage',
            'leaves.view', 'leaves.manage',
            'customer-requests.view',
        ]);

        // 3. Customer: Customer Portal
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
    }
}
