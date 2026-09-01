<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionFormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'inspection_form_id',
        'label',
        'field_key',
        'type',
        'required',
        'options',
        'placeholder',
        'order',
    ];

    protected $casts = [
        'required' => 'boolean',
        'options' => 'array',
    ];

    public function form()
    {
        return $this->belongsTo(InspectionForm::class, 'inspection_form_id');
    }
}
