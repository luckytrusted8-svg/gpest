<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lead_id',
        'nama_perusahaan',
        'nama_pic',
        'telepon',
        'email',
        'alamat',
        'sumber_lead',
        'kebutuhan',
        'status',
        'assigned_sales',
        'catatan',
    ];

    protected static function booted(): void
    {
        static::creating(function (Lead $lead) {
            if (empty($lead->lead_id)) {
                $last = static::withTrashed()->orderByDesc('id')->value('lead_id');
                $nextNumber = 1;
                if ($last && preg_match('/LD-(\d+)/', $last, $m)) {
                    $nextNumber = (int) $m[1] + 1;
                }
                $lead->lead_id = 'LD-'.str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class);
    }

    public function sales(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_sales');
    }

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_perusahaan', 'like', "%{$search}%")
                    ->orWhere('nama_pic', 'like', "%{$search}%")
                    ->orWhere('lead_id', 'like', "%{$search}%");
            });
        }
    }

    public function scopeOfStatus($query, ?string $status): void
    {
        if ($status) {
            $query->where('status', $status);
        }
    }

    public function scopeOfSumber($query, ?string $sumber): void
    {
        if ($sumber) {
            $query->where('sumber_lead', $sumber);
        }
    }

    public function scopeOfSales($query, ?int $salesId): void
    {
        if ($salesId) {
            $query->where('assigned_sales', $salesId);
        }
    }
}
