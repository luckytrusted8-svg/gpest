import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Plus, Trash2, Edit, MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
    geofences: GeofenceData[];
    customers: Customer[];
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function GeofencePage({ geofences, customers }: Props) {
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
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setFormLat(-6.2088);
        setFormLng(106.8456);
        setData('nama', '');
        setData('customer_id', '');
        setData('latitude_pusat', -6.2088);
        setData('longitude_pusat', 106.8456);
        setData('radius_meter', 100);
        setShowModal(true);
    };

    const openEdit = (gf: GeofenceData) => {
        setEditing(gf);
        setFormLat(gf.latitude_pusat);
        setFormLng(gf.longitude_pusat);
        setData({
            nama: gf.nama,
            customer_id: gf.customer_id ? String(gf.customer_id) : '',
            latitude_pusat: gf.latitude_pusat,
            longitude_pusat: gf.longitude_pusat,
            radius_meter: gf.radius_meter,
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
        setData('latitude_pusat', lat);
        setData('longitude_pusat', lng);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            latitude_pusat: formLat,
            longitude_pusat: formLng,
            customer_id: data.customer_id || null,
        };

        if (editing) {
            put(`/geofences/${editing.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/geofences', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus geofence "${nama}"?`)) {
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
            <Head title="Geofence" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Geofence</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola area geofence untuk monitoring lokasi teknisi.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Geofence
                    </Button>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Nama</th>
                                    <th className="py-3 px-4 font-semibold">Customer</th>
                                    <th className="py-3 px-4 font-semibold">Pusat</th>
                                    <th className="py-3 px-4 font-semibold">Radius</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {geofences.length > 0 ? (
                                    geofences.map((gf) => (
                                        <tr key={gf.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-medium">{gf.nama}</td>
                                            <td className="py-3 px-4 text-body-text">{gf.customer?.company_name ?? '-'}</td>
                                            <td className="py-3 px-4 text-xs font-mono text-body-text">
                                                {gf.latitude_pusat.toFixed(5)}, {gf.longitude_pusat.toFixed(5)}
                                            </td>
                                            <td className="py-3 px-4 text-body-text">{gf.radius_meter}m</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleToggle(gf)}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                        gf.aktif
                                                            ? 'bg-[#16a34a]/15 text-[#16a34a]'
                                                            : 'bg-canvas-soft-2 text-mute border border-hairline'
                                                    }`}
                                                >
                                                    {gf.aktif ? 'Aktif' : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink" onClick={() => openEdit(gf)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => handleDelete(gf.id, gf.nama)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada geofence yang dibuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
                        <div className="relative bg-canvas border border-hairline rounded-lg shadow-[0px_1px_1px_#00000005,0px_8px_16px_-4px_#0000000a] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-4 border-b border-hairline">
                                <h2 className="text-body-lg font-semibold text-ink">
                                    {editing ? 'Edit' : 'Tambah'} Geofence
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeModal}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Geofence</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Contoh: Kantor Pusat"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id">Customer (Opsional)</Label>
                                    <select
                                        id="customer_id"
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">Tanpa Customer</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.company_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Radius (meter)</Label>
                                    <Input
                                        type="number"
                                        min={10}
                                        max={10000}
                                        value={data.radius_meter}
                                        onChange={(e) => setData('radius_meter', parseInt(e.target.value) || 100)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Klik peta untuk set pusat geofence</Label>
                                    <div className="h-[300px] rounded-md overflow-hidden border border-hairline">
                                        <MapContainer
                                            center={[formLat, formLng]}
                                            zoom={14}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <MapClickHandler onClick={handleMapClick} />
                                            <CircleMarker
                                                center={[formLat, formLng]}
                                                radius={Math.min(data.radius_meter / 10, 150)}
                                                pathOptions={{
                                                    color: '#0070f3',
                                                    fillColor: '#0070f3',
                                                    fillOpacity: 0.15,
                                                    weight: 2,
                                                }}
                                            />
                                        </MapContainer>
                                    </div>
                                    <div className="text-xs text-mute mt-1">
                                        Pusat: {formLat.toFixed(6)}, {formLng.toFixed(6)}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-hairline">
                                    <Button type="button" variant="outline" onClick={closeModal} className="text-body-sm-strong">
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong">
                                        {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
