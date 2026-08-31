<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisKontrak extends Model
{
    protected $table = 'jenis_kontrak';

    protected $fillable = ['nama', 'deskripsi', 'status'];
}
