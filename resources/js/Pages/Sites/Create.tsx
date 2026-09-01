import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save, MapPin } from 'lucide-react';

interface Customer {
    id: number;
    company_name: string;
}

interface Props {
    customers: Customer[];
    autoSiteCode: string;
}

export default function SitesCreate({ customers, autoSiteCode }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_code: autoSiteCode,
        customer_id: customers[0]?.id ? String(customers[0].id) : '',
        site_name: '',
        address: '',
        pic_name: '',
        phone: '',
        latitude: '-6.2088',
        longitude: '106.8456',
        geofence_radius: '100',
        service_area: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sites');
    };

    return (
        <AppLayout>
            <Head title="Tambah Titik Lokasi (Site) Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/sites">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Tambah Titik Lokasi (Site) Baru</h1>
                        <p className="text-body-sm text-mute">Daftarkan lokasi baru pelanggan beserta koordinat GPS & radius geofence.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-canvas border border-hairline rounded-md p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold">Kode Site (Otomatis)</Label>
                            <Input
                                value={data.site_code}
                                onChange={(e) => setData('site_code', e.target.value)}
                                className="font-mono text-xs mt-1 bg-canvas-soft"
                            />
                            {errors.site_code && <p className="text-xs text-red-600 mt-1">{errors.site_code}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Pilih Pelanggan *</Label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                            {errors.customer_id && <p className="text-xs text-red-600 mt-1">{errors.customer_id}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-semibold">Nama Site / Gedung *</Label>
                            <Input
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                placeholder="Contoh: Gedung Ruko Utama - Cabang Kemang"
                                className="text-xs mt-1"
                                required
                            />
                            {errors.site_name && <p className="text-xs text-red-600 mt-1">{errors.site_name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-semibold">Alamat Lengkap Site *</Label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap lokasi pengerjaan..."
                                rows={3}
                                className="w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            />
                            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Nama PIC Lokasi</Label>
                            <Input
                                value={data.pic_name}
                                onChange={(e) => setData('pic_name', e.target.value)}
                                placeholder="Nama penanggung jawab di lokasi"
                                className="text-xs mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Nomor Telepon PIC</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="081234567890"
                                className="text-xs mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Latitude GPS</Label>
                            <Input
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                placeholder="-6.2088"
                                className="text-xs font-mono mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Longitude GPS</Label>
                            <Input
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                placeholder="106.8456"
                                className="text-xs font-mono mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Radius Geofence (Meter) *</Label>
                            <Input
                                type="number"
                                value={data.geofence_radius}
                                onChange={(e) => setData('geofence_radius', e.target.value)}
                                placeholder="100"
                                className="text-xs mt-1"
                                required
                            />
                            <p className="text-[11px] text-mute mt-0.5">Batas toleransi keberadaan teknisi saat GPS check-in.</p>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Area Layanan (Service Area)</Label>
                            <Input
                                value={data.service_area}
                                onChange={(e) => setData('service_area', e.target.value)}
                                placeholder="Contoh: Lantai 1-3 & Area Parkir"
                                className="text-xs mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                        <Link href="/sites">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink text-xs flex items-center gap-2">
                            <Save className="w-4 h-4" /> Simpan Site
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
