<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_id',
        'tanggal',
        'jam_masuk',
        'jam_keluar',
        'latitude_masuk',
        'longitude_masuk',
        'latitude_keluar',
        'longitude_keluar',
        'status',
        'catatan',
    ];

    protected $appends = [
        'durasi_kerja',
        'durasi_jam',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'jam_masuk' => 'datetime:H:i',
        'jam_keluar' => 'datetime:H:i',
        'latitude_masuk' => 'float',
        'longitude_masuk' => 'float',
        'latitude_keluar' => 'float',
        'longitude_keluar' => 'float',
    ];

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function getDurasiKerjaAttribute(): ?string
    {
        $masukRaw = $this->getRawOriginal('jam_masuk');
        if (! $masukRaw) {
            return null;
        }

        $dateStr = is_string($this->tanggal) ? $this->tanggal : ($this->tanggal ? $this->tanggal->format('Y-m-d') : date('Y-m-d'));
        $masuk = Carbon::parse("{$dateStr} {$masukRaw}");
        $keluarRaw = $this->getRawOriginal('jam_keluar');

        if ($keluarRaw) {
            $keluar = Carbon::parse("{$dateStr} {$keluarRaw}");
            if ($keluar->lt($masuk)) {
                $keluar->addDay();
            }
            $diff = $masuk->diff($keluar);
            $hours = $diff->h + ($diff->days * 24);
            $minutes = $diff->i;

            return sprintf('%d jam %d menit', $hours, $minutes);
        }

        $now = now();
        if ($now->lt($masuk)) {
            return '0 jam 0 menit (Berjalan)';
        }

        $diff = $masuk->diff($now);
        $hours = $diff->h + ($diff->days * 24);
        $minutes = $diff->i;

        return sprintf('%d jam %d menit (Berjalan)', $hours, $minutes);
    }

    public function getDurasiJamAttribute(): ?float
    {
        $masukRaw = $this->getRawOriginal('jam_masuk');
        if (! $masukRaw) {
            return null;
        }

        $dateStr = is_string($this->tanggal) ? $this->tanggal : ($this->tanggal ? $this->tanggal->format('Y-m-d') : date('Y-m-d'));
        $masuk = Carbon::parse("{$dateStr} {$masukRaw}");
        $keluarRaw = $this->getRawOriginal('jam_keluar');

        if ($keluarRaw) {
            $keluar = Carbon::parse("{$dateStr} {$keluarRaw}");
            if ($keluar->lt($masuk)) {
                $keluar->addDay();
            }

            return round($masuk->diffInMinutes($keluar) / 60, 2);
        }

        $now = now();
        if ($now->lt($masuk)) {
            return 0.0;
        }

        return round($masuk->diffInMinutes($now) / 60, 2);
    }

    public function scopeByDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('tanggal', $date);
    }

    public function scopeByTechnician(Builder $query, int $technicianId): Builder
    {
        return $query->where('technician_id', $technicianId);
    }
}
