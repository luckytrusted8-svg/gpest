<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_invoice',
        'customer_id',
        'contract_id',
        'work_report_id',
        'tanggal_invoice',
        'jatuh_tempo',
        'subtotal',
        'diskon',
        'pajak',
        'total',
        'status_pembayaran',
        'catatan',
        'dibuat_oleh',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->nomor_invoice)) {
                $invoice->nomor_invoice = static::generateNomorInvoice();
            }
        });
    }

    public static function generateNomorInvoice(): string
    {
        $prefix = 'INV/'.date('Ym').'/';
        $last = static::where('nomor_invoice', 'like', $prefix.'%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $last) {
            return $prefix.'0001';
        }

        $num = (int) substr($last->nomor_invoice, -4);

        return $prefix.str_pad($num + 1, 4, '0', STR_PAD_LEFT);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function workReport()
    {
        return $this->belongsTo(WorkReport::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
