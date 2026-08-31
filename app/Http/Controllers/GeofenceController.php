<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Geofence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeofenceController extends Controller
{
    public function index()
    {
        $geofences = Geofence::with('customer')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Tracking/Geofence', [
            'geofences' => $geofences,
            'customers' => Customer::select('id', 'company_name')->orderBy('company_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'latitude_pusat' => 'required|numeric|between:-90,90',
            'longitude_pusat' => 'required|numeric|between:-180,180',
            'radius_meter' => 'required|integer|min:10|max:10000',
        ]);

        $validated['aktif'] = true;

        Geofence::create($validated);

        return redirect()->route('geofences.index')
            ->with('success', 'Geofence berhasil ditambahkan.');
    }

    public function update(Request $request, Geofence $geofence)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'latitude_pusat' => 'required|numeric|between:-90,90',
            'longitude_pusat' => 'required|numeric|between:-180,180',
            'radius_meter' => 'required|integer|min:10|max:10000',
            'aktif' => 'required|boolean',
        ]);

        $geofence->update($validated);

        return redirect()->route('geofences.index')
            ->with('success', 'Geofence berhasil diperbarui.');
    }

    public function destroy(Geofence $geofence)
    {
        $geofence->delete();

        return redirect()->route('geofences.index')
            ->with('success', 'Geofence berhasil dihapus.');
    }
}
