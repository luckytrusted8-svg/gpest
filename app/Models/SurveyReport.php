<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_survey',
        'customer_id',
        'contract_id',
        'technician_id',
        'tanggal_survey',
        'lokasi',
        'jenis_hama',
        'area_survey',
        'temuan',
        'tingkat_risiko',
        'rekomendasi',
        'catatan',
        'status',
    ];

    protected $casts = [
        'tanggal_survey' => 'date:Y-m-d',
        'jenis_hama' => 'array',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(SurveyPhoto::class);
    }
}
