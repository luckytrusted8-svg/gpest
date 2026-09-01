<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'deskripsi',
        'kuantitas',
        'satuan',
        'harga_satuan',
        'diskon_persen',
        'subtotal',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $gross = $item->kuantitas * $item->harga_satuan;
            $item->subtotal = $gross - ($gross * ($item->diskon_persen / 100));
        });
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
