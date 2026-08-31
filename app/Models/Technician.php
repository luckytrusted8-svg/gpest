<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Technician extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_id',
        'nama',
        'telepon',
        'email',
        'jabatan',
        'status',
        'area_tugas',
        'keahlian',
        'tanggal_bergabung',
        'foto_profil',
    ];

    protected $casts = [
        'keahlian' => 'array',
        'tanggal_bergabung' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'technician_id', 'user_id');
    }
}
