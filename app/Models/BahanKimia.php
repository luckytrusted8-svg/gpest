<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BahanKimia extends Model
{
    protected $table = 'bahan_kimia';

    protected $fillable = ['nama', 'satuan', 'deskripsi', 'status'];
}
