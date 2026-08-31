<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'company_name',
        'pic_name',
        'phone',
        'email',
        'address',
        'location',
        'npwp',
        'status',
        'sales_pic',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
