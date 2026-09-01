<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\Schedule;
use App\Models\Site;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkOrder::with(['customer', 'site', 'technician']);

        if ($request->filled('search')) {
            $query->where('wo_number', 'like', '%'.$request->search.'%')
                ->orWhereHas('customer', fn ($q) => $q->where('company_name', 'like', '%'.$request->search.'%'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('technician_id')) {
            $query->where('technician_id', $request->technician_id);
        }

        $workOrders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('WorkOrders/Index', [
            'workOrders' => $workOrders,
            'technicians' => User::role(['technician', 'supervisor'])->get(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'technician_id']),
            'statuses' => [
                'DRAFT', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED',
                'IN_PROGRESS', 'COMPLETED', 'PENDING_REVIEW',
                'APPROVED', 'REJECTED', 'CANCELLED',
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('WorkOrders/Create', [
            'autoWoNumber' => WorkOrder::generateWoNumber(),
            'customers' => Customer::all(['id', 'company_name']),
            'sites' => Site::all(['id', 'customer_id', 'site_name']),
            'contracts' => Contract::all(['id', 'contract_number']),
            'schedules' => Schedule::where('status', 'scheduled')->get(['id', 'schedule_code', 'tanggal']),
            'technicians' => User::role(['technician', 'supervisor'])->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->filled('wo_number')) {
            $request->validate([
                'wo_number' => 'required|unique:work_orders,wo_number',
            ]);
        } else {
            $request->merge([
                'wo_number' => WorkOrder::generateWoNumber(),
            ]);
        }

        $validated = $request->validate([
            'wo_number' => 'required|unique:work_orders,wo_number',
            'customer_id' => 'required|exists:customers,id',
            'site_id' => 'nullable|exists:sites,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'schedule_id' => 'nullable|exists:schedules,id',
            'technician_id' => 'nullable|exists:users,id',
            'service_type' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high,urgent',
            'instruction' => 'nullable|string',
            'status' => 'required|in:DRAFT,ASSIGNED,ON_THE_WAY,ARRIVED,IN_PROGRESS,COMPLETED,PENDING_REVIEW,APPROVED,REJECTED,CANCELLED',
        ]);

        WorkOrder::create($validated);

        return redirect()->route('work-orders.index')->with('success', 'Work Order berhasil dibuat.');
    }

    public function show(WorkOrder $workOrder)
    {
        $workOrder->load([
            'customer', 'site', 'contract', 'schedule',
            'technician', 'inspectionAnswers.field', 'treatments.chemical',
        ]);

        return Inertia::render('WorkOrders/Show', [
            'workOrder' => $workOrder,
        ]);
    }

    public function updateStatus(Request $request, WorkOrder $workOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:DRAFT,ASSIGNED,ON_THE_WAY,ARRIVED,IN_PROGRESS,COMPLETED,PENDING_REVIEW,APPROVED,REJECTED,CANCELLED',
            'rejection_reason' => 'nullable|string',
        ]);

        $workOrder->update($validated);

        return back()->with('success', "Status Work Order {$workOrder->wo_number} berhasil diperbarui.");
    }
}
