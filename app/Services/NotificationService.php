<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Contract;
use App\Models\Notification;
use App\Models\Schedule;
use App\Models\User;
use App\Models\WorkReport;

class NotificationService
{
    public function kirimKeUser(int $userId, string $judul, string $pesan, string $jenis = 'info', string $modul = 'dashboard', ?string $urlTujuan = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'judul' => $judul,
            'pesan' => $pesan,
            'jenis' => $jenis,
            'modul' => $modul,
            'url_tujuan' => $urlTujuan,
        ]);
    }

    public function jadwalBaruDibuat(Schedule $schedule): void
    {
        if (! $schedule->technician_id) {
            return;
        }

        $this->kirimKeUser(
            userId: $schedule->technician_id,
            judul: 'Jadwal Baru Ditugaskan',
            pesan: "Anda ditugaskan untuk jadwal {$schedule->schedule_code} di {$schedule->lokasi} pada {$schedule->tanggal->format('d/m/Y')}.",
            jenis: 'info',
            modul: 'schedules',
            urlTujuan: "/schedules/{$schedule->id}"
        );
    }

    public function laporanDikirim(WorkReport $workReport): void
    {
        $supervisors = User::role('supervisor')->pluck('id');

        foreach ($supervisors as $supervisorId) {
            $this->kirimKeUser(
                userId: $supervisorId,
                judul: 'Laporan Kerja Baru',
                pesan: "Laporan kerja {$workReport->nomor_laporan} telah dikirim oleh teknisi dan menunggu persetujuan Anda.",
                jenis: 'info',
                modul: 'work-reports',
                urlTujuan: "/work-reports/{$workReport->id}"
            );
        }
    }

    public function laporanDisetujui(WorkReport $workReport): void
    {
        $this->kirimKeUser(
            userId: $workReport->technician_id,
            judul: 'Laporan Kerja Disetujui',
            pesan: "Laporan kerja {$workReport->nomor_laporan} telah disetujui oleh supervisor.",
            jenis: 'sukses',
            modul: 'work-reports',
            urlTujuan: "/work-reports/{$workReport->id}"
        );
    }

    public function kontrakHampirHabis(Contract $contract): void
    {
        $admins = User::role('super_admin')->pluck('id');

        $sisaHari = $contract->end_date->diffInDays(now());

        foreach ($admins as $adminId) {
            $this->kirimKeUser(
                userId: $adminId,
                judul: 'Kontrak Hampir Berakhir',
                pesan: "Kontrak {$contract->contract_number} akan berakhir dalam {$sisaHari} hari lagi. Segera lakukan perpanjangan.",
                jenis: 'peringatan',
                modul: 'contracts',
                urlTujuan: "/contracts/{$contract->id}"
            );
        }
    }

    public function checkInTeknisi(Attendance $attendance): void
    {
        $schedule = Schedule::where('technician_id', $attendance->technician_id)
            ->whereDate('tanggal', $attendance->tanggal)
            ->first();

        if (! $schedule || ! $schedule->supervisor_id) {
            return;
        }

        $this->kirimKeUser(
            userId: $schedule->supervisor_id,
            judul: 'Teknisi Check-in',
            pesan: "Teknisi telah melakukan check-in pada {$attendance->jam_masuk} untuk jadwal {$schedule->schedule_code}.",
            jenis: 'info',
            modul: 'attendance',
            urlTujuan: "/attendance/{$attendance->id}"
        );
    }
}
