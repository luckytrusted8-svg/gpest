<?php

namespace App\Models;

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
        if (! $this->jam_masuk || ! $this->jam_keluar) {
            return null;
        }

        $masuk = \Carbon\Carbon::parse($this->jam_masuk);
        $keluar = \Carbon\Carbon::parse($this->jam_keluar);
        $diff = $masuk->diff($keluar);

        $hours = $diff->h + ($diff->days * 24);
        $minutes = $diff->i;

        return sprintf('%d jam %d menit', $hours, $minutes);
    }

    public function getDurasiJamAttribute(): ?float
    {
        if (! $this->jam_masuk || ! $this->jam_keluar) {
            return null;
        }

        $masuk = \Carbon\Carbon::parse($this->jam_masuk);
        $keluar = \Carbon\Carbon::parse($this->jam_keluar);

        return round($masuk->diffInMinutes($keluar) / 60, 2);
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
