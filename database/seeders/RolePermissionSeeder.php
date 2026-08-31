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

        // Permissions list
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

        // 1. super_admin: Semua permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdminRole->syncPermissions(Permission::all());

        // 2. management: view semua, tidak bisa delete dan manage users/master-data
        $managementRole = Role::firstOrCreate(['name' => 'management', 'guard_name' => 'web']);
        $managementRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'contracts.view',
            'schedules.view',
            'technicians.view',
            'work-reports.view',
        ]);

        // 3. admin: semua kecuali users dan master-data
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions([
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
        ]);

        // 4. supervisor: view customers/contracts, full schedules dan work-reports
        $supervisorRole = Role::firstOrCreate(['name' => 'supervisor', 'guard_name' => 'web']);
        $supervisorRole->syncPermissions([
            'dashboard.view',
            'customers.view',
            'contracts.view',

            'schedules.view',
            'schedules.create',
            'schedules.edit',
            'schedules.delete',

            'work-reports.view',
            'work-reports.create',
            'work-reports.edit',
            'work-reports.delete',
            'work-reports.approve',
        ]);

        // 5. technician: view schedules sendiri, create/edit work-reports
        $technicianRole = Role::firstOrCreate(['name' => 'technician', 'guard_name' => 'web']);
        $technicianRole->syncPermissions([
            'dashboard.view',
            'schedules.view',
            'work-reports.view',
            'work-reports.create',
            'work-reports.edit',
        ]);

        // 6. customer: tidak ada permission internal (menggunakan customer guard terpisah)
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
    }
}
