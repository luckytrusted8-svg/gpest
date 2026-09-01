<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_name',
        'service_type',
        'status',
    ];

    public function fields()
    {
        return $this->hasMany(InspectionFormField::class)->orderBy('order', 'asc');
    }
}
