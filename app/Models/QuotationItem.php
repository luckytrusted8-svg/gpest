<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'jenis_layanan',
        'deskripsi',
        'kuantitas',
        'satuan',
        'harga_satuan',
        'diskon_persen',
        'subtotal',
    ];

    protected $casts = [
        'kuantitas' => 'decimal:2',
        'harga_satuan' => 'decimal:2',
        'diskon_persen' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (QuotationItem $item) {
            $gross = $item->kuantitas * $item->harga_satuan;
            $diskon = $gross * ($item->diskon_persen / 100);
            $item->subtotal = $gross - $diskon;
        });
    }

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }
}
