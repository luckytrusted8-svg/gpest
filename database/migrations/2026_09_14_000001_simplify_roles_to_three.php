<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Pastikan role 3 utama ada
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $karyawanRole = Role::firstOrCreate(['name' => 'karyawan', 'guard_name' => 'web']);
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // 2. Assign permissions
        // Admin: Full Access
        $allPermissions = Permission::all();
        $adminRole->syncPermissions($allPermissions);

        // Karyawan: Lapangan, Operasional, Laporan, Absensi, Cuti, dsb.
        $karyawanPermissions = [
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
        ];
        $existingKaryawanPerms = Permission::whereIn('name', $karyawanPermissions)->get();
        $karyawanRole->syncPermissions($existingKaryawanPerms);

        // 3. Migrasikan user yang memiliki role lama
        // super_admin dan management -> admin
        $superAdminsAndManagement = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['super_admin', 'management']);
        })->get();
        foreach ($superAdminsAndManagement as $user) {
            $user->assignRole($adminRole);
        }

        // technician dan supervisor -> karyawan
        $fieldUsers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['technician', 'supervisor']);
        })->get();
        foreach ($fieldUsers as $user) {
            $user->assignRole($karyawanRole);
        }

        // 4. Hapus role lama dari database
        $oldRoles = Role::whereIn('name', ['super_admin', 'management', 'supervisor', 'technician'])->get();
        foreach ($oldRoles as $oldRole) {
            $oldRole->delete();
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        // Revert is not strictly needed for role consolidation, but we recreate roles if needed
    }
};
