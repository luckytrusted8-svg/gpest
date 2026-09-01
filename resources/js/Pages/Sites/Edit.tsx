import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

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
        latitude: site.latitude ? String(site.latitude) : '',
        longitude: site.longitude ? String(site.longitude) : '',
        geofence_radius: String(site.geofence_radius),
        service_area: site.service_area ?? '',
        notes: site.notes ?? '',
    });

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
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Edit Lokasi Site {site.site_name}</h1>
                        <p className="text-body-sm text-mute">Perbarui koordinat GPS, alamat, atau radius geofence lokasi ini.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-canvas border border-hairline rounded-md p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold">Kode Site</Label>
                            <Input
                                value={data.site_code}
                                onChange={(e) => setData('site_code', e.target.value)}
                                className="font-mono text-xs mt-1 bg-canvas-soft"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Pilih Pelanggan *</Label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-semibold">Nama Site / Gedung *</Label>
                            <Input
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="text-xs mt-1"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-semibold">Alamat Lengkap Site *</Label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Nama PIC Lokasi</Label>
                            <Input
                                value={data.pic_name}
                                onChange={(e) => setData('pic_name', e.target.value)}
                                className="text-xs mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Nomor Telepon PIC</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="text-xs mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Latitude GPS</Label>
                            <Input
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                className="text-xs font-mono mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Longitude GPS</Label>
                            <Input
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                className="text-xs font-mono mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Radius Geofence (Meter) *</Label>
                            <Input
                                type="number"
                                value={data.geofence_radius}
                                onChange={(e) => setData('geofence_radius', e.target.value)}
                                className="text-xs mt-1"
                                required
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Area Layanan (Service Area)</Label>
                            <Input
                                value={data.service_area}
                                onChange={(e) => setData('service_area', e.target.value)}
                                className="text-xs mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                        <Link href="/sites">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink text-xs flex items-center gap-2">
                            <Save className="w-4 h-4" /> Perbarui Site
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
