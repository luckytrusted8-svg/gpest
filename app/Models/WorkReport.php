<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_laporan',
        'customer_id',
        'contract_id',
        'schedule_id',
        'technician_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'jenis_layanan',
        'jenis_hama',
        'metode_treatment',
        'bahan_kimia',
        'jumlah_bahan',
        'area_treatment',
        'peralatan',
        'temuan',
        'aktivitas_hama',
        'tingkat_keparahan',
        'rekomendasi',
        'status',
        'catatan_supervisor',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(WorkReportPhoto::class);
    }

    public function photosBefore(): HasMany
    {
        return $this->hasMany(WorkReportPhoto::class)->where('jenis_foto', 'sebelum');
    }

    public function photosDuring(): HasMany
    {
        return $this->hasMany(WorkReportPhoto::class)->where('jenis_foto', 'selama');
    }

    public function photosAfter(): HasMany
    {
        return $this->hasMany(WorkReportPhoto::class)->where('jenis_foto', 'sesudah');
    }
}
