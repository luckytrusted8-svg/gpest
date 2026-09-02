<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\LocationTrack;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_attendance_duration_and_running_duration_calculation()
    {
        $user = User::factory()->create();

        // Completed attendance
        $completed = Attendance::create([
            'technician_id' => $user->id,
            'tanggal' => '2026-09-02',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:30:00',
            'latitude_masuk' => -6.2088,
            'longitude_masuk' => 106.8456,
            'latitude_keluar' => -6.2100,
            'longitude_keluar' => 106.8500,
            'status' => 'hadir',
        ]);

        $this->assertEquals('8 jam 30 menit', $completed->durasi_kerja);
        $this->assertEquals(8.5, $completed->durasi_jam);

        // Active running attendance
        $running = Attendance::create([
            'technician_id' => $user->id,
            'tanggal' => now()->toDateString(),
            'jam_masuk' => now()->subHours(2)->subMinutes(15)->format('H:i:s'),
            'jam_keluar' => null,
            'latitude_masuk' => -6.2088,
            'longitude_masuk' => 106.8456,
            'status' => 'hadir',
        ]);

        $this->assertStringContainsString('2 jam 15 menit', $running->durasi_kerja);
        $this->assertStringContainsString('(Berjalan)', $running->durasi_kerja);
    }

    public function test_attendance_tracks_json_endpoint()
    {
        $user = User::factory()->create();

        $attendance = Attendance::create([
            'technician_id' => $user->id,
            'tanggal' => '2026-09-02',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '17:00:00',
            'latitude_masuk' => -6.2088,
            'longitude_masuk' => 106.8456,
            'latitude_keluar' => -6.2100,
            'longitude_keluar' => 106.8500,
            'status' => 'hadir',
        ]);

        LocationTrack::create([
            'technician_id' => $user->id,
            'latitude' => -6.2090,
            'longitude' => 106.8470,
            'status_teknisi' => 'dalam_perjalanan',
            'created_at' => '2026-09-02 10:00:00',
        ]);

        $response = $this->actingAs($user)->get(route('attendance.tracks', $attendance->id));

        $response->assertStatus(200);
        $response->assertJsonPath('attendance.id', $attendance->id);
        $response->assertJsonCount(1, 'tracks');
    }
}
