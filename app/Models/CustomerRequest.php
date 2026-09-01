<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_number',
        'customer_id',
        'jenis_layanan',
        'prioritas',
        'deskripsi',
        'tanggal_permintaan',
        'status',
        'catatan_admin',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($req) {
            if (empty($req->request_number)) {
                $req->request_number = static::generateRequestNumber();
            }
        });
    }

    public static function generateRequestNumber(): string
    {
        $prefix = 'REQ/'.date('Ym').'/';
        $last = static::where('request_number', 'like', $prefix.'%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $last) {
            return $prefix.'0001';
        }

        $num = (int) substr($last->request_number, -4);

        return $prefix.str_pad($num + 1, 4, '0', STR_PAD_LEFT);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
