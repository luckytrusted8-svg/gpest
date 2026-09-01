<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id',
        'treatment_type',
        'chemical_id',
        'quantity',
        'unit',
        'area',
        'method',
        'notes',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function chemical()
    {
        return $this->belongsTo(BahanKimia::class, 'chemical_id');
    }
}
