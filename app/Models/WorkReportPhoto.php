<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkReportPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_report_id',
        'jenis_foto',
        'path_foto',
        'keterangan',
    ];

    public function workReport(): BelongsTo
    {
        return $this->belongsTo(WorkReport::class);
    }
}
