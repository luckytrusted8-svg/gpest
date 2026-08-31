<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_number',
        'customer_id',
        'location',
        'contract_type',
        'start_date',
        'end_date',
        'service_frequency',
        'service_type',
        'contract_value',
        'status',
        'pic',
        'attachment',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'contract_value' => 'decimal:2',
    ];

    protected $appends = [
        'is_expiring_soon',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    protected function isExpiringSoon(): Attribute
    {
        return Attribute::make(
            get: function (): bool {
                if (! $this->end_date) {
                    return false;
                }

                $endDate = Carbon::parse($this->end_date);
                $now = Carbon::now();

                return $endDate->isAfter($now) && $endDate->diffInDays($now) <= 30;
            }
        );
    }
}
