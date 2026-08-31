<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_report_id',
        'path_foto',
        'keterangan',
    ];

    public function surveyReport(): BelongsTo
    {
        return $this->belongsTo(SurveyReport::class);
    }
}
