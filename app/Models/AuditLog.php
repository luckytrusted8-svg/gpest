<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'module',
        'description',
        'ip_address',
    ];

    public static function log(string $action, string $module, ?string $description = null)
    {
        $user = Auth::user();
        static::create([
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : 'System / Guest',
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => Request::ip(),
        ]);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
