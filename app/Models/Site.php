<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($site) {
            if (empty($site->site_code)) {
                $site->site_code = static::generateSiteCode();
            }
        });
    }

    public static function generateSiteCode(): string
    {
        $prefix = 'SITE-'.date('Ym').'-';
        $latest = static::withTrashed()
            ->where('site_code', 'like', $prefix.'%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $latest) {
            return $prefix.'0001';
        }

        $sequence = (int) substr($latest->site_code, -4);
        $next = str_pad((string) ($sequence + 1), 4, '0', STR_PAD_LEFT);

        return $prefix.$next;
    }

    protected $fillable = [
        'site_code',
        'customer_id',
        'site_name',
        'address',
        'pic_name',
        'phone',
        'latitude',
        'longitude',
        'geofence_radius',
        'service_area',
        'notes',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }
}
