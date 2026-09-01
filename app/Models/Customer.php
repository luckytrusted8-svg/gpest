<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (empty($customer->customer_id)) {
                $customer->customer_id = static::generateCustomerId();
            }
        });
    }

    public static function generateCustomerId(): string
    {
        $prefix = 'CUST-'.date('Ym').'-';
        $latest = static::withTrashed()
            ->where('customer_id', 'like', $prefix.'%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $latest) {
            return $prefix.'0001';
        }

        $sequence = (int) substr($latest->customer_id, -4);
        $next = str_pad((string) ($sequence + 1), 4, '0', STR_PAD_LEFT);

        return $prefix.$next;
    }

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

    public function locations()
    {
        return $this->hasMany(CustomerLocation::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function requests()
    {
        return $this->hasMany(CustomerRequest::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function workReports()
    {
        return $this->hasMany(WorkReport::class);
    }

    public function portalUsers()
    {
        return $this->hasMany(CustomerUser::class);
    }
}
