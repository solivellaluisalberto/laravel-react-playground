<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        // Crear el rol "user"
        Role::create(['name' => 'user', 'guard_name' => 'web']);

        /** @var User $user */
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user);

        $this->get(route('dashboard'))->assertOk();
    }
}
