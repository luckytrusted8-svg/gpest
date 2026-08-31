<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_quotation',
        'customer_id',
        'lead_id',
        'berlaku_hingga',
        'syarat_ketentuan',
        'catatan',
        'status',
        'dibuat_oleh',
    ];

    protected $casts = [
        'berlaku_hingga' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (Quotation $quotation) {
            if (empty($quotation->nomor_quotation)) {
                $last = static::withTrashed()->orderByDesc('id')->value('nomor_quotation');
                $nextNumber = 1;
                if ($last && preg_match('/QTN-(\d+)/', $last, $m)) {
                    $nextNumber = (int) $m[1] + 1;
                }
                $quotation->nomor_quotation = 'QTN-'.str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function getSubtotalSebelumDiskonAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->kuantitas * $item->harga_satuan;
        });
    }

    public function getTotalAttribute(): float
    {
        return $this->items->sum('subtotal');
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_quotation', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($cq) => $cq->where('company_name', 'like', "%{$search}%"));
            });
        }
    }

    public function scopeOfStatus($query, ?string $status): void
    {
        if ($status) {
            $query->where('status', $status);
        }
    }

    public function scopeOfCustomer($query, ?int $customerId): void
    {
        if ($customerId) {
            $query->where('customer_id', $customerId);
        }
    }

    public function scopeOfDateFrom($query, ?string $date): void
    {
        if ($date) {
            $query->where('created_at', '>=', $date);
        }
    }

    public function scopeOfDateTo($query, ?string $date): void
    {
        if ($date) {
            $query->where('created_at', '<=', $date.' 23:59:59');
        }
    }
}
