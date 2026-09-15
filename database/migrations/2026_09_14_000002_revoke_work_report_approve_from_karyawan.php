<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $karyawanRole = Role::where('name', 'karyawan')->first();
        if ($karyawanRole) {
            // Karyawan/teknisi tidak boleh approve laporan kerja atau work order sendiri
            $wrPerm = Permission::where('name', 'work-reports.approve')->first();
            if ($wrPerm && $karyawanRole->hasPermissionTo($wrPerm)) {
                $karyawanRole->revokePermissionTo($wrPerm);
            }
            $woPerm = Permission::where('name', 'work-orders.approve')->first();
            if ($woPerm && $karyawanRole->hasPermissionTo($woPerm)) {
                $karyawanRole->revokePermissionTo($woPerm);
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $karyawanRole = Role::where('name', 'karyawan')->first();
        if ($karyawanRole) {
            $wrPerm = Permission::where('name', 'work-reports.approve')->first();
            if ($wrPerm) {
                $karyawanRole->givePermissionTo($wrPerm);
            }
            $woPerm = Permission::where('name', 'work-orders.approve')->first();
            if ($woPerm) {
                $karyawanRole->givePermissionTo($woPerm);
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
