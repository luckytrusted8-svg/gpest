import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';

interface Customer {
    id: number;
    company_name: string;
}

interface Site {
    id: number;
    site_code: string;
    customer_id: number;
    site_name: string;
    address: string;
    pic_name: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    geofence_radius: number;
    service_area: string | null;
    notes: string | null;
}

interface Props {
    site: Site;
    customers: Customer[];
}

export default function SitesEdit({ site, customers }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_code: site.site_code,
        customer_id: String(site.customer_id),
        site_name: site.site_name,
        address: site.address,
        pic_name: site.pic_name ?? '',
        phone: site.phone ?? '',
        latitude: site.latitude ? String(site.latitude) : '-6.2088',
        longitude: site.longitude ? String(site.longitude) : '106.8456',
        geofence_radius: String(site.geofence_radius),
        service_area: site.service_area ?? '',
        notes: site.notes ?? '',
    });

    const handleMapLocationSelect = (lat: number, lng: number) => {
        setData((prev) => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/sites/${site.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Site ${site.site_name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/sites">
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Edit Lokasi Site {site.site_name}</h1>
                        <p className="text-xs text-slate-500">Perbarui koordinat GPS, alamat, atau radius geofence lokasi ini.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-bold text-slate-700">Kode Site</Label>
                            <Input
                                value={data.site_code}
                                onChange={(e) => setData('site_code', e.target.value)}
                                className="font-mono text-xs mt-1.5 bg-slate-50 border-slate-300"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Pilih Pelanggan *</Label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-semibold mt-1.5"
                                required
                            >
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-bold text-slate-700">Nama Site / Gedung *</Label>
                            <Input
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="text-xs mt-1.5"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-bold text-slate-700">Alamat Lengkap Site *</Label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 mt-1.5"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Nama PIC Lokasi</Label>
                            <Input
                                value={data.pic_name}
                                onChange={(e) => setData('pic_name', e.target.value)}
                                className="text-xs mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Nomor Telepon PIC</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="text-xs mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Latitude GPS</Label>
                            <Input
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                className="text-xs font-mono mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Longitude GPS</Label>
                            <Input
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                className="text-xs font-mono mt-1.5"
                            />
                        </div>

                        {/* Interactive Leaflet Location Picker */}
                        <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                            <Label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Penentuan Titik Lokasi Peta (Leaflet Map Picker)
                            </Label>
                            <LeafletLocationPicker
                                lat={data.latitude}
                                lng={data.longitude}
                                radius={Number(data.geofence_radius) || 100}
                                onLocationSelect={handleMapLocationSelect}
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Radius Geofence (Meter) *</Label>
                            <Input
                                type="number"
                                value={data.geofence_radius}
                                onChange={(e) => setData('geofence_radius', e.target.value)}
                                className="text-xs mt-1.5"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Area Layanan (Service Area)</Label>
                            <Input
                                value={data.service_area}
                                onChange={(e) => setData('service_area', e.target.value)}
                                className="text-xs mt-1.5"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <Link href="/sites">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2">
                            <Save className="w-4 h-4" /> Perbarui Site Lokasi
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
