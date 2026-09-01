<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($workOrder) {
            if (empty($workOrder->wo_number)) {
                $workOrder->wo_number = static::generateWoNumber();
            }
        });
    }

    public static function generateWoNumber(): string
    {
        $prefix = 'WO/'.date('Ym').'/';
        $latest = static::withTrashed()
            ->where('wo_number', 'like', $prefix.'%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $latest) {
            return $prefix.'0001';
        }

        $sequence = (int) substr($latest->wo_number, -4);
        $next = str_pad((string) ($sequence + 1), 4, '0', STR_PAD_LEFT);

        return $prefix.$next;
    }

    protected $fillable = [
        'wo_number',
        'customer_id',
        'site_id',
        'contract_id',
        'schedule_id',
        'technician_id',
        'service_type',
        'priority',
        'instruction',
        'status',
        'check_in_latitude',
        'check_in_longitude',
        'check_in_time',
        'check_out_time',
        'rejection_reason',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function inspectionAnswers()
    {
        return $this->hasMany(InspectionAnswer::class);
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }
}
