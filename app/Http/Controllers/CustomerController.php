<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $query->where('company_name', 'like', '%'.$request->search.'%')
                ->orWhere('customer_id', 'like', '%'.$request->search.'%');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $customers = $query->latest()->paginate(10);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create', [
            'autoCustomerId' => Customer::generateCustomerId(),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->filled('customer_id')) {
            $request->validate([
                'customer_id' => 'required|unique:customers,customer_id',
            ]);
        } else {
            $request->merge([
                'customer_id' => Customer::generateCustomerId(),
            ]);
        }

        $validated = $request->validate([
            'customer_id' => 'required|unique:customers,customer_id',
            'company_name' => 'required',
            'pic_name' => 'required',
            'phone' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'location' => 'required',
            'npwp' => 'nullable',
            'status' => 'required|in:active,inactive',
            'sales_pic' => 'nullable',
        ]);

        Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'customer_id' => 'required|unique:customers,customer_id,'.$customer->id,
            'company_name' => 'required',
            'pic_name' => 'required',
            'phone' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'location' => 'required',
            'npwp' => 'nullable',
            'status' => 'required|in:active,inactive',
            'sales_pic' => 'nullable',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
