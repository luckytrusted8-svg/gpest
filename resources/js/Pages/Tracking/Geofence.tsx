import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Plus, Trash2, Edit, X, Shield, MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import GeofenceModalMap from '@/Components/GeofenceModalMap';

interface GeofenceData {
    id: number;
    nama: string;
    customer_id: number | null;
    customer: { id: number; company_name: string } | null;
    latitude_pusat: number;
    longitude_pusat: number;
    radius_meter: number;
    aktif: boolean;
}

interface Customer {
    id: number;
    company_name: string;
}

interface Props {
    geofences?: GeofenceData[];
    customers?: Customer[];
}

export default function GeofencePage({ geofences = [], customers = [] }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<GeofenceData | null>(null);
    const [formLat, setFormLat] = useState<number>(-6.2088);
    const [formLng, setFormLng] = useState<number>(106.8456);

    const { data, setData, post, put, processing, reset } = useForm({
        nama: '',
        customer_id: '',
        latitude_pusat: -6.2088,
        longitude_pusat: 106.8456,
        radius_meter: 100,
        aktif: true,
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        const defaultLat = -6.2088;
        const defaultLng = 106.8456;
        setFormLat(defaultLat);
        setFormLng(defaultLng);
        setData({
            nama: '',
            customer_id: '',
            latitude_pusat: defaultLat,
            longitude_pusat: defaultLng,
            radius_meter: 100,
            aktif: true,
        });
        setShowModal(true);
    };

    const openEdit = (gf: GeofenceData) => {
        setEditing(gf);
        const lat = Number(gf.latitude_pusat) || -6.2088;
        const lng = Number(gf.longitude_pusat) || 106.8456;
        setFormLat(lat);
        setFormLng(lng);
        setData({
            nama: gf.nama,
            customer_id: gf.customer_id ? String(gf.customer_id) : '',
            latitude_pusat: lat,
            longitude_pusat: lng,
            radius_meter: gf.radius_meter || 100,
            aktif: gf.aktif ?? true,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        reset();
    };

    const handleMapClick = (lat: number, lng: number) => {
        setFormLat(lat);
        setFormLng(lng);
        setData((prev) => ({
            ...prev,
            latitude_pusat: lat,
            longitude_pusat: lng,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nama: data.nama,
            customer_id: data.customer_id ? Number(data.customer_id) : null,
            latitude_pusat: formLat,
            longitude_pusat: formLng,
            radius_meter: Number(data.radius_meter) || 100,
            aktif: editing ? (editing.aktif ?? true) : true,
        };

        if (editing) {
            router.put(`/geofences/${editing.id}`, payload, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/geofences', payload, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus area geofence "${nama}"?`)) {
            router.delete(`/geofences/${id}`);
        }
    };

    const handleToggle = (gf: GeofenceData) => {
        router.put(`/geofences/${gf.id}`, {
            nama: gf.nama,
            customer_id: gf.customer_id,
            latitude_pusat: gf.latitude_pusat,
            longitude_pusat: gf.longitude_pusat,
            radius_meter: gf.radius_meter,
            aktif: !gf.aktif,
        });
    };

    return (
        <AppLayout>
            <Head title="Kelola Batas Wilayah (Geofence)" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                Geofencing Management
                            </span>
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Kelola Batas Wilayah (Geofence)
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Atur zona radius presisi untuk absensi lokasi dan otomatisasi deteksi kedatangan teknisi di site klien.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Area Geofence Baru
                    </button>
                </div>

                {/* Geofence Data Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Daftar Area Geofence Terdaftar ({geofences.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Nama Geofence</th>
                                    <th className="py-3 px-4">Klien / Customer</th>
                                    <th className="py-3 px-4">Koordinat GPS Pusat</th>
                                    <th className="py-3 px-4">Radius Area</th>
                                    <th className="py-3 px-4">Status Geofence</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                                {geofences.length > 0 ? (
                                    geofences.map((gf) => (
                                        <tr key={gf.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                        <Shield className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>{gf.nama}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 font-medium">
                                                {gf.customer ? (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                                        {gf.customer.company_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Umum / Semua Site</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-mono text-blue-600 font-semibold">
                                                {Number(gf.latitude_pusat).toFixed(6)}, {Number(gf.longitude_pusat).toFixed(6)}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                                                {gf.radius_meter} Meter
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <button
                                                    onClick={() => handleToggle(gf)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                                        gf.aktif
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {gf.aktif ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                            <span>Aktif</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-3 h-3 text-slate-400" />
                                                            <span>Non-Aktif</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => openEdit(gf)}
                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                                                        title="Edit Geofence"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(gf.id, gf.nama)}
                                                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Hapus Geofence"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                                            Belum ada area geofence yang terdaftar. Klik tombol di atas untuk membuat geofence baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Form Tambah / Edit Geofence - Fixed Z-Index & Backdrop Seamless Fit */}
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
                        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl my-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="shrink-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        {editing ? 'Edit Area Geofence' : 'Tambah Area Geofence Baru'}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Tentukan nama, radius lingkaran geofence, dan tentukan titik koordinat pada peta Leaflet.
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="nama" className="text-xs font-bold text-slate-700">Nama Geofence *</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Contoh: Site Gedung Utama PT Maju Jaya"
                                        required
                                        className="text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="customer_id" className="text-xs font-bold text-slate-700">Klien / Customer (Opsional)</Label>
                                        <select
                                            id="customer_id"
                                            value={data.customer_id}
                                            onChange={(e) => setData('customer_id', e.target.value)}
                                            className="flex h-9 w-full rounded-xl border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Umum (Semua Klien)</option>
                                            {customers.map((c) => (
                                                <option key={c.id} value={c.id}>{c.company_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="radius_meter" className="text-xs font-bold text-slate-700">Radius Jangkauan (Meter) *</Label>
                                        <Input
                                            id="radius_meter"
                                            type="number"
                                            min={10}
                                            max={10000}
                                            value={data.radius_meter}
                                            onChange={(e) => setData('radius_meter', parseInt(e.target.value) || 100)}
                                            required
                                            className="text-xs font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="latitude_pusat" className="text-[11px] font-bold text-slate-600">Latitude GPS Pusat</Label>
                                        <Input
                                            id="latitude_pusat"
                                            type="number"
                                            step="any"
                                            value={formLat}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                setFormLat(val);
                                                setData('latitude_pusat', val);
                                            }}
                                            required
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="longitude_pusat" className="text-[11px] font-bold text-slate-600">Longitude GPS Pusat</Label>
                                        <Input
                                            id="longitude_pusat"
                                            type="number"
                                            step="any"
                                            value={formLng}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                setFormLng(val);
                                                setData('longitude_pusat', val);
                                            }}
                                            required
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Direct Vanilla Leaflet Map Picker Component */}
                                <div className="space-y-1.5 pt-1">
                                    <Label className="text-xs font-bold text-slate-800">
                                        Pilih Titik Lokasi Pusat Geofence Pada Peta Leaflet:
                                    </Label>
                                    <GeofenceModalMap
                                        lat={formLat}
                                        lng={formLng}
                                        radius={data.radius_meter}
                                        onMapClick={handleMapClick}
                                    />
                                </div>

                                {/* Modal Footer Buttons */}
                                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                                    >
                                        {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Geofence'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
