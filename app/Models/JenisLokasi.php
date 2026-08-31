<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisLokasi extends Model
{
    protected $table = 'jenis_lokasi';

    protected $fillable = ['nama', 'deskripsi', 'status'];
}
