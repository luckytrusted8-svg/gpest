<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $query = Contract::with('customer');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('contract_number', 'like', '%'.$search.'%')
                    ->orWhere('location', 'like', '%'.$search.'%')
                    ->orWhere('service_type', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('company_name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $contracts = $query->latest()->paginate(10);

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'company_name', 'customer_id')
            ->orderBy('company_name')
            ->get();

        return Inertia::render('Contracts/Create', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_number' => 'required|unique:contracts,contract_number',
            'customer_id' => 'required|exists:customers,id',
            'location' => 'required|string',
            'contract_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'service_frequency' => 'required|string',
            'service_type' => 'required|string',
            'contract_value' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,expiring_soon,expired,cancelled',
            'pic' => 'nullable|string',
            'attachment' => 'nullable|string',
        ]);

        Contract::create($validated);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract created successfully.');
    }

    public function show(Contract $contract)
    {
        $contract->load('customer');

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    public function edit(Contract $contract)
    {
        $contract->load('customer');
        $customers = Customer::select('id', 'company_name', 'customer_id')
            ->orderBy('company_name')
            ->get();

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract,
            'customers' => $customers,
        ]);
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'contract_number' => 'required|unique:contracts,contract_number,'.$contract->id,
            'customer_id' => 'required|exists:customers,id',
            'location' => 'required|string',
            'contract_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'service_frequency' => 'required|string',
            'service_type' => 'required|string',
            'contract_value' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,expiring_soon,expired,cancelled',
            'pic' => 'nullable|string',
            'attachment' => 'nullable|string',
        ]);

        $contract->update($validated);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();

        return redirect()->route('contracts.index')
            ->with('success', 'Contract deleted successfully.');
    }
}
