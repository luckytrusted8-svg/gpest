<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocationTrack extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_id',
        'schedule_id',
        'latitude',
        'longitude',
        'akurasi',
        'kecepatan',
        'status_teknisi',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'akurasi' => 'float',
        'kecepatan' => 'float',
    ];

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }
}
