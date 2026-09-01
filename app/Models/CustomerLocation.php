<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'nama_lokasi',
        'alamat',
        'pic_name',
        'pic_phone',
        'latitude',
        'longitude',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
