import React, { useState, useEffect, Suspense } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const GeofenceModalMap = React.lazy(() => import('@/Components/GeofenceModalMap'));

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

interface ModalMapErrorBoundaryState {
    hasError: boolean;
}

class ModalMapErrorBoundary extends React.Component<{ children: React.ReactNode }, ModalMapErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        console.error('GeofenceModalMap render error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-[300px] w-full flex flex-col items-center justify-center bg-canvas-soft border border-hairline rounded-md p-4 text-center">
                    <p className="text-body-sm font-medium text-ink mb-1">Gagal memuat peta lokasi.</p>
                    <p className="text-xs text-mute">Anda tetap dapat mengisi koordinat Latitude & Longitude secara manual di bawah ini.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function GeofencePage({ geofences = [], customers = [] }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<GeofenceData | null>(null);
    const [formLat, setFormLat] = useState<number>(-6.2088);
    const [formLng, setFormLng] = useState<number>(106.8456);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
                                                {Number(gf.latitude_pusat).toFixed(5)}, {Number(gf.longitude_pusat).toFixed(5)}
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="latitude_pusat" className="text-xs">Latitude Pusat</Label>
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
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="longitude_pusat" className="text-xs">Longitude Pusat</Label>
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
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Atau Klik Peta untuk Set Koordinat</Label>
                                    <ModalMapErrorBoundary>
                                        {isClient ? (
                                            <Suspense fallback={<div className="h-[300px] w-full flex items-center justify-center bg-canvas-soft text-mute text-body-sm">Memuat peta...</div>}>
                                                <GeofenceModalMap
                                                    lat={formLat}
                                                    lng={formLng}
                                                    radius={data.radius_meter}
                                                    onMapClick={handleMapClick}
                                                />
                                            </Suspense>
                                        ) : (
                                            <div className="h-[300px] w-full flex items-center justify-center bg-canvas-soft text-mute text-body-sm">Memuat peta...</div>
                                        )}
                                    </ModalMapErrorBoundary>
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
