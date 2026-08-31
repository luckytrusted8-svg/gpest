<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodeTreatment extends Model
{
    protected $table = 'metode_treatment';

    protected $fillable = ['nama', 'deskripsi', 'status'];
}
