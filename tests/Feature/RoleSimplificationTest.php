<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleSimplificationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_only_three_roles_are_seeded()
    {
        $roleNames = Role::pluck('name')->sort()->values()->all();

        $this->assertEquals(['admin', 'customer', 'karyawan'], $roleNames);
    }

    public function test_admin_can_access_users_management()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('users.index'));
        $response->assertStatus(200);
    }

    public function test_karyawan_cannot_access_users_management()
    {
        $karyawan = User::factory()->create();
        $karyawan->assignRole('karyawan');

        $response = $this->actingAs($karyawan)->get(route('users.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_create_user_with_karyawan_role()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->post(route('users.store'), [
            'name' => 'Staf Baru',
            'email' => 'stafbaru@gpest.id',
            'password' => 'password123',
            'role' => 'karyawan',
            'status' => 'aktif',
        ]);

        $response->assertRedirect(route('users.index'));
        $newUser = User::where('email', 'stafbaru@gpest.id')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue($newUser->hasRole('karyawan'));
    }
}
