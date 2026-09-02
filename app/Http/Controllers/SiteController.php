<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteController extends Controller
{
    public function index(Request $request)
    {
        $query = Site::with('customer');

        if ($request->filled('search')) {
            $query->where('site_name', 'like', '%'.$request->search.'%')
                ->orWhere('site_code', 'like', '%'.$request->search.'%')
                ->orWhere('address', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $sites = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Sites/Index', [
            'sites' => $sites,
            'customers' => Customer::all(['id', 'company_name']),
            'filters' => $request->only(['search', 'customer_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Sites/Create', [
            'customers' => Customer::all(['id', 'company_name', 'address', 'pic_name', 'phone', 'location', 'latitude', 'longitude']),
            'autoSiteCode' => Site::generateSiteCode(),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->filled('site_code')) {
            $request->validate([
                'site_code' => 'required|unique:sites,site_code',
            ]);
        } else {
            $request->merge([
                'site_code' => Site::generateSiteCode(),
            ]);
        }

        $validated = $request->validate([
            'site_code' => 'required|unique:sites,site_code',
            'customer_id' => 'required|exists:customers,id',
            'site_name' => 'required|string|max:255',
            'address' => 'required|string',
            'pic_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'geofence_radius' => 'required|integer|min:10|max:5000',
            'service_area' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Site::create($validated);

        return redirect()->route('sites.index')->with('success', 'Lokasi Site berhasil ditambahkan.');
    }

    public function show(Site $site)
    {
        $site->load(['customer', 'workOrders.technician']);

        return Inertia::render('Sites/Show', [
            'site' => $site,
        ]);
    }

    public function edit(Site $site)
    {
        return Inertia::render('Sites/Edit', [
            'site' => $site->load('customer'),
            'customers' => Customer::all(['id', 'company_name', 'address', 'pic_name', 'phone', 'location', 'latitude', 'longitude']),
        ]);
    }

    public function update(Request $request, Site $site)
    {
        $validated = $request->validate([
            'site_code' => 'required|unique:sites,site_code,'.$site->id,
            'customer_id' => 'required|exists:customers,id',
            'site_name' => 'required|string|max:255',
            'address' => 'required|string',
            'pic_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'geofence_radius' => 'required|integer|min:10|max:5000',
            'service_area' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $site->update($validated);

        return redirect()->route('sites.index')->with('success', 'Lokasi Site berhasil diperbarui.');
    }

    public function destroy(Site $site)
    {
        $site->delete();

        return redirect()->route('sites.index')->with('success', 'Lokasi Site berhasil dihapus.');
    }
}
