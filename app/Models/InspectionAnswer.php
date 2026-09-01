<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id',
        'inspection_form_field_id',
        'answer_value',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function field()
    {
        return $this->belongsTo(InspectionFormField::class, 'inspection_form_field_id');
    }
}
