import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save, MapPin, Sparkles } from 'lucide-react';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';
import { useEffect } from 'react';

interface Customer {
    id: number;
    company_name: string;
    address?: string;
    pic_name?: string;
    phone?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
}

interface Props {
    customers: Customer[];
    autoSiteCode: string;
}

export default function SitesCreate({ customers, autoSiteCode }: Props) {
    const firstCust = customers[0];

    const { data, setData, post, processing, errors } = useForm({
        site_code: autoSiteCode,
        customer_id: firstCust?.id ? String(firstCust.id) : '',
        site_name: firstCust?.company_name ? `${firstCust.company_name} - Lokasi Utama` : '',
        address: firstCust?.address || '',
        pic_name: firstCust?.pic_name || '',
        phone: firstCust?.phone || '',
        latitude: firstCust?.latitude ? String(firstCust.latitude) : '-6.2088',
        longitude: firstCust?.longitude ? String(firstCust.longitude) : '106.8456',
        geofence_radius: '100',
        service_area: '',
        notes: '',
    });

    const handleCustomerSelect = (customerIdStr: string) => {
        const found = customers.find((c) => String(c.id) === customerIdStr);
        if (found) {
            setData((prev) => ({
                ...prev,
                customer_id: customerIdStr,
                site_name: `${found.company_name} - Lokasi Utama`,
                address: found.address || prev.address,
                pic_name: found.pic_name || prev.pic_name,
                phone: found.phone || prev.phone,
                latitude: found.latitude ? String(found.latitude) : prev.latitude,
                longitude: found.longitude ? String(found.longitude) : prev.longitude,
            }));
        } else {
            setData('customer_id', customerIdStr);
        }
    };

    const handleAutoFillFromCustomer = () => {
        const found = customers.find((c) => String(c.id) === data.customer_id);
        if (found) {
            setData((prev) => ({
                ...prev,
                site_name: `${found.company_name} - Lokasi Utama`,
                address: found.address || '',
                pic_name: found.pic_name || '',
                phone: found.phone || '',
                latitude: found.latitude ? String(found.latitude) : prev.latitude,
                longitude: found.longitude ? String(found.longitude) : prev.longitude,
            }));
        }
    };

    const handleMapLocationSelect = (lat: number, lng: number, addressSuggestion?: string) => {
        setData((prev) => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            address: addressSuggestion && !prev.address ? addressSuggestion : prev.address,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sites');
    };

    return (
        <AppLayout>
            <Head title="Tambah Titik Lokasi (Site) Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/sites">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Tambah Titik Lokasi (Site) Baru</h1>
                            <p className="text-xs text-slate-500">Daftarkan lokasi baru pelanggan beserta koordinat GPS & Peta Interactive Leaflet.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-bold text-slate-700">Kode Site (Otomatis)</Label>
                            <Input
                                value={data.site_code}
                                onChange={(e) => setData('site_code', e.target.value)}
                                className="font-mono text-xs mt-1.5 bg-slate-50 border-slate-300"
                            />
                            {errors.site_code && <p className="text-xs text-rose-600 mt-1">{errors.site_code}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-slate-700">Pilih Pelanggan *</Label>
                                {data.customer_id && (
                                    <button
                                        type="button"
                                        onClick={handleAutoFillFromCustomer}
                                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <Sparkles className="w-3 h-3" /> Auto-Fill Data
                                    </button>
                                )}
                            </div>
                            <select
                                value={data.customer_id}
                                onChange={(e) => handleCustomerSelect(e.target.value)}
                                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-semibold mt-1.5"
                                required
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                            {errors.customer_id && <p className="text-xs text-rose-600 mt-1">{errors.customer_id}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-bold text-slate-700">Nama Site / Gedung *</Label>
                            <Input
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                placeholder="Contoh: PT Maju Jaya Sejahtera - Lokasi Utama"
                                className="text-xs mt-1.5"
                                required
                            />
                            {errors.site_name && <p className="text-xs text-rose-600 mt-1">{errors.site_name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-bold text-slate-700">Alamat Lengkap Site *</Label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap lokasi pengerjaan..."
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 mt-1.5"
                                required
                            />
                            {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Nama PIC Lokasi</Label>
                            <Input
                                value={data.pic_name}
                                onChange={(e) => setData('pic_name', e.target.value)}
                                placeholder="Nama penanggung jawab di lokasi"
                                className="text-xs mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Nomor Telepon PIC</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="081234567890"
                                className="text-xs mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Latitude GPS</Label>
                            <Input
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                placeholder="-6.2088"
                                className="text-xs font-mono mt-1.5"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Longitude GPS</Label>
                            <Input
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                placeholder="106.8456"
                                className="text-xs font-mono mt-1.5"
                            />
                        </div>

                        {/* Interactive Leaflet Map Picker */}
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
                                placeholder="100"
                                className="text-xs mt-1.5"
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-0.5">Batas toleransi keberadaan teknisi saat GPS check-in (Default: 100 meter).</p>
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-700">Area Layanan (Service Area)</Label>
                            <Input
                                value={data.service_area}
                                onChange={(e) => setData('service_area', e.target.value)}
                                placeholder="Contoh: Lantai 1-3 & Area Parkir"
                                className="text-xs mt-1.5"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <Link href="/sites">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2">
                            <Save className="w-4 h-4" /> Simpan Site Lokasi
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
