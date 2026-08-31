<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisHama extends Model
{
    protected $table = 'jenis_hama';

    protected $fillable = ['nama', 'deskripsi', 'status'];
}
