<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query();

        if ($request->search) {
            $query->where('user_name', 'like', '%'.$request->search.'%')
                ->orWhere('action', 'like', '%'.$request->search.'%')
                ->orWhere('module', 'like', '%'.$request->search.'%')
                ->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if ($request->module) {
            $query->where('module', $request->module);
        }

        $logs = $query->latest()->paginate(25)->withQueryString();

        $modules = AuditLog::select('module')->distinct()->pluck('module');

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'modules' => $modules,
            'filters' => $request->only(['search', 'module']),
        ]);
    }
}
