import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { useState } from 'react';
import { MapPin, Plus, Building2, Phone, Search, Edit, Trash2, ExternalLink } from 'lucide-react';

interface Site {
    id: number;
    site_code: string;
    site_name: string;
    address: string;
    pic_name: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    geofence_radius: number;
    customer?: { id: number; company_name: string };
}

interface Customer {
    id: number;
    company_name: string;
}

interface Props {
    sites: {
        data: Site[];
    };
    customers: Customer[];
    filters: { search?: string; customer_id?: string };
}

export default function SitesIndex({ sites, customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [customerId, setCustomerId] = useState(filters.customer_id ?? '');

    const applyFilter = () => {
        router.get('/sites', { search, customer_id: customerId }, { preserveState: true });
    };

    const handleDelete = (site: Site) => {
        if (confirm(`Apakah Anda yakin ingin menghapus site "${site.site_name}"?`)) {
            router.delete(`/sites/${site.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Lokasi Sites Pelanggan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Lokasi Sites Pelanggan</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola lokasi titik layanan, koordinat GPS, dan radius geofence.</p>
                    </div>

                    <Link href="/sites/create">
                        <Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Tambah Site
                        </Button>
                    </Link>
                </div>

                {/* Filter Card */}
                <div className="bg-canvas border border-hairline rounded-md p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                placeholder="Cari nama site / kode..."
                                className="pl-8 text-xs"
                            />
                        </div>

                        <select
                            value={customerId}
                            onChange={(e) => { setCustomerId(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua Pelanggan</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.company_name}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <Button onClick={applyFilter} variant="outline" className="text-xs">Filter</Button>
                            <button onClick={() => { setSearch(''); setCustomerId(''); router.get('/sites'); }} className="text-xs text-mute hover:text-ink underline">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-xs overflow-x-auto">
                    <table className="w-full text-left text-body-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                <th className="py-3 px-4 font-semibold">Kode & Nama Site</th>
                                <th className="py-3 px-4 font-semibold">Pelanggan</th>
                                <th className="py-3 px-4 font-semibold">PIC & Telepon</th>
                                <th className="py-3 px-4 font-semibold">Geofence Radius</th>
                                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline text-ink">
                            {sites.data.length > 0 ? (
                                sites.data.map((site) => (
                                    <tr key={site.id} className="hover:bg-canvas-soft/50 transition">
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-ink flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                {site.site_name}
                                            </div>
                                            <div className="text-xs font-mono text-mute mt-0.5">{site.site_code} &middot; {site.address}</div>
                                        </td>
                                        <td className="py-3 px-4 text-xs font-medium text-gray-800">
                                            {site.customer?.company_name ?? '-'}
                                        </td>
                                        <td className="py-3 px-4 text-xs">
                                            <div>{site.pic_name || '-'}</div>
                                            <div className="text-mute">{site.phone || '-'}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200">
                                                {site.geofence_radius} Meter
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/sites/${site.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/sites/${site.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(site)}>
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-mute text-body-sm">
                                        Tidak ada lokasi site ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
