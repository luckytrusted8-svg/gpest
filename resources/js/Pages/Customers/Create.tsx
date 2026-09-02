import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { MapPin, Save, ArrowLeft } from 'lucide-react';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';

interface FormData {
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location: string;
    latitude: string;
    longitude: string;
    npwp: string;
    status: 'active' | 'inactive';
    sales_pic: string;
}

interface Props {
    autoCustomerId?: string;
}

export default function Create({ autoCustomerId }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        customer_id: autoCustomerId || '',
        company_name: '',
        pic_name: '',
        phone: '',
        email: '',
        address: '',
        location: '',
        latitude: '-6.2088',
        longitude: '106.8456',
        npwp: '',
        status: 'active',
        sales_pic: '',
    });

    const handleMapLocationSelect = (lat: number, lng: number, addressSuggestion?: string) => {
        setData((prev) => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            address: addressSuggestion && !prev.address ? addressSuggestion : prev.address,
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customers');
    };

    return (
        <AppLayout>
            <Head title="Tambah Pelanggan Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/customers">
                            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200">
                                <ArrowLeft className="w-4 h-4 text-slate-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Tambah Pelanggan Baru</h1>
                            <p className="text-xs text-slate-500">Daftarkan profil pelanggan baru beserta titik lokasi peta Leaflet.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customer_id" className="text-xs font-bold text-slate-700">ID Customer</Label>
                                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Otomatis</span>
                                </div>
                                <Input
                                    id="customer_id"
                                    type="text"
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    placeholder="Contoh: CUST-202609-0001"
                                    className="mt-1.5 bg-slate-50 border-slate-300 font-mono text-xs"
                                />
                                {errors.customer_id && <div className="text-rose-600 text-xs mt-1">{errors.customer_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="company_name" className="text-xs font-bold text-slate-700">Nama Perusahaan / Klien *</Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    placeholder="Contoh: PT Maju Jaya Sejahtera"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.company_name && <div className="text-rose-600 text-xs mt-1">{errors.company_name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="pic_name" className="text-xs font-bold text-slate-700">Nama PIC Pelanggan *</Label>
                                <Input
                                    id="pic_name"
                                    type="text"
                                    value={data.pic_name}
                                    onChange={(e) => setData('pic_name', e.target.value)}
                                    placeholder="Contoh: Bapak Budi Santoso"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.pic_name && <div className="text-rose-600 text-xs mt-1">{errors.pic_name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Nomor Telepon / WA *</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.phone && <div className="text-rose-600 text-xs mt-1">{errors.phone}</div>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Pelanggan *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="klien@perusahaan.com"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.email && <div className="text-rose-600 text-xs mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="location" className="text-xs font-bold text-slate-700">Kota / Wilayah *</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Contoh: Ciledug / Jakarta Selatan"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.location && <div className="text-rose-600 text-xs mt-1">{errors.location}</div>}
                            </div>

                            <div>
                                <Label htmlFor="latitude" className="text-xs font-bold text-slate-700">Latitude GPS</Label>
                                <Input
                                    id="latitude"
                                    type="text"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    placeholder="-6.2088"
                                    className="mt-1.5 font-mono text-xs"
                                />
                            </div>

                            <div>
                                <Label htmlFor="longitude" className="text-xs font-bold text-slate-700">Longitude GPS</Label>
                                <Input
                                    id="longitude"
                                    type="text"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    placeholder="106.8456"
                                    className="mt-1.5 font-mono text-xs"
                                />
                            </div>

                            <div>
                                <Label htmlFor="npwp" className="text-xs font-bold text-slate-700">NPWP (Opsional)</Label>
                                <Input
                                    id="npwp"
                                    type="text"
                                    value={data.npwp}
                                    onChange={(e) => setData('npwp', e.target.value)}
                                    className="mt-1.5 text-xs"
                                />
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-xs font-bold text-slate-700">Status Akun</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-semibold mt-1.5"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Non-aktif</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address" className="text-xs font-bold text-slate-700">Alamat Lengkap Perusahaan *</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat jalan, nomor gedung, kelurahan, kecamatan..."
                                className="mt-1.5 min-h-[90px] text-xs"
                                required
                            />
                            {errors.address && <div className="text-rose-600 text-xs mt-1">{errors.address}</div>}
                        </div>

                        {/* Interactive Leaflet Map Picker */}
                        <div className="space-y-2 pt-3 border-t border-slate-100">
                            <Label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Penentuan Titik Lokasi Peta (Leaflet Map Picker)
                            </Label>
                            <LeafletLocationPicker
                                lat={data.latitude}
                                lng={data.longitude}
                                radius={100}
                                onLocationSelect={handleMapLocationSelect}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                            <Link href="/customers">
                                <Button type="button" variant="outline" className="text-xs">Batal</Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Simpan Pelanggan Baru
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
