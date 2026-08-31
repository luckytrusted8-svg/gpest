<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Geofence extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'customer_id',
        'latitude_pusat',
        'longitude_pusat',
        'radius_meter',
        'aktif',
    ];

    protected $casts = [
        'latitude_pusat' => 'float',
        'longitude_pusat' => 'float',
        'radius_meter' => 'integer',
        'aktif' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function isPointInside(float $lat, float $lng): bool
    {
        $earthRadius = 6371000;
        $dLat = deg2rad($lat - $this->latitude_pusat);
        $dLng = deg2rad($lng - $this->longitude_pusat);

        $a = sin($dLat / 2) * sin($dLat / 2)
            + cos(deg2rad($this->latitude_pusat)) * cos(deg2rad($lat))
            * sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return $distance <= $this->radius_meter;
    }
}
