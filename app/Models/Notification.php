<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'judul',
        'pesan',
        'jenis',
        'modul',
        'url_tujuan',
        'dibaca_pada',
    ];

    protected $casts = [
        'dibaca_pada' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getSudahDibacaAttribute(): bool
    {
        return $this->dibaca_pada !== null;
    }

    public function scopeBelumDibaca(Builder $query): Builder
    {
        return $query->whereNull('dibaca_pada');
    }

    public function scopeSudahDibaca(Builder $query): Builder
    {
        return $query->whereNotNull('dibaca_pada');
    }
}
