<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Treatment;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MobileApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Kredensial tidak valid'], 401);
        }

        $token = $user->createToken('gpest_mobile_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first() ?? 'technician',
            ],
        ]);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $todayTasks = WorkOrder::where('technician_id', $user->id)
            ->whereDate('created_at', $today)
            ->count();

        $completed = WorkOrder::where('technician_id', $user->id)
            ->where('status', 'APPROVED')
            ->count();

        $pending = WorkOrder::where('technician_id', $user->id)
            ->whereIn('status', ['ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW'])
            ->count();

        $upcomingJobs = WorkOrder::with(['customer', 'site'])
            ->where('technician_id', $user->id)
            ->whereIn('status', ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'technician_name' => $user->name,
            'stats' => [
                'today_tasks' => $todayTasks,
                'completed' => $completed,
                'pending' => $pending,
            ],
            'upcoming_jobs' => $upcomingJobs,
        ]);
    }

    public function tasks(Request $request)
    {
        $tasks = WorkOrder::with(['customer', 'site'])
            ->where('technician_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['tasks' => $tasks]);
    }

    public function taskDetail(Request $request, $id)
    {
        $task = WorkOrder::with(['customer', 'site', 'inspectionAnswers.field', 'treatments.chemical'])
            ->where('technician_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json(['task' => $task]);
    }

    public function checkIn(Request $request, $id)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $task = WorkOrder::where('technician_id', $request->user()->id)->findOrFail($id);

        $task->update([
            'status' => 'IN_PROGRESS',
            'check_in_latitude' => $request->latitude,
            'check_in_longitude' => $request->longitude,
            'check_in_time' => now(),
        ]);

        return response()->json(['message' => 'Check-in berhasil', 'task' => $task]);
    }

    public function addTreatment(Request $request, $id)
    {
        $request->validate([
            'treatment_type' => 'required|string',
            'chemical_id' => 'nullable|exists:bahan_kimia,id',
            'quantity' => 'required|numeric',
            'unit' => 'required|string',
            'area' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $task = WorkOrder::where('technician_id', $request->user()->id)->findOrFail($id);

        $treatment = Treatment::create([
            'work_order_id' => $task->id,
            'treatment_type' => $request->treatment_type,
            'chemical_id' => $request->chemical_id,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'area' => $request->area,
            'notes' => $request->notes,
        ]);

        return response()->json(['message' => 'Treatment berhasil dicatat', 'treatment' => $treatment]);
    }

    public function checkOut(Request $request, $id)
    {
        $task = WorkOrder::where('technician_id', $request->user()->id)->findOrFail($id);

        $task->update([
            'status' => 'PENDING_REVIEW',
            'check_out_time' => now(),
        ]);

        return response()->json(['message' => 'Check-out & submit laporan berhasil', 'task' => $task]);
    }

    public function notifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
