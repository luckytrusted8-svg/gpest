import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';
import { Building2, Lock, CheckCircle2, MapPin, Crosshair, Sparkles } from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    npwp?: string | null;
}

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    avatar?: string;
    customer?: Customer;
}

interface Props {
    customerUser: CustomerUser;
    customer: Customer;
}

export default function Profile({ customerUser, customer }: Props) {
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        company_name: customer?.company_name || '',
        pic_name: customer?.pic_name || customerUser?.nama || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        location: customer?.location || '',
        latitude: customer?.latitude ? customer.latitude.toString() : '-6.2088',
        longitude: customer?.longitude ? customer.longitude.toString() : '106.8456',
        npwp: customer?.npwp || '',
        password: '',
        password_confirmation: '',
    });

    const handleLocationSelect = (
        lat: number,
        lng: number,
        addressSuggestion?: string,
        locationArea?: string
    ) => {
        setData((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
            location: locationArea || prev.location || '',
            address: addressSuggestion && (!prev.address || prev.address === 'Belum dilengkapi') 
                ? addressSuggestion 
                : prev.address,
        }));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/portal/profile', {
            onSuccess: () => {
                setSavedSuccessfully(true);
                setTimeout(() => setSavedSuccessfully(false), 4000);
            },
        });
    };

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Profil Perusahaan & Lokasi - Portal Pelanggan" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-canvas p-6 rounded-2xl border border-hairline shadow-xs">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-ink">Profil & Informasi Pelanggan</h1>
                                <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                    {customer?.customer_id}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-mute">
                                Kelola identitas perusahaan, titik koordinat GPS kantor pusat, dan peta lokasi yang otomatis tersinkronisasi ke sistem Admin.
                            </p>
                        </div>
                    </div>
                </div>

                {savedSuccessfully && (
                    <div className="p-4 rounded-xl bg-success-soft border border-success/20 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Data profil & titik peta GPS berhasil diperbarui dan otomatis tercatat di dashboard Admin!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information Card */}
                    <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-xs space-y-5">
                        <h2 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3">
                            <Building2 className="w-4 h-4 text-primary" />
                            Data Perusahaan / Identitas Pelanggan
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Nama Perusahaan / Gedung / Rumah <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.company_name && <p className="mt-1 text-xs text-error">{errors.company_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Nama Penanggung Jawab (PIC) <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.pic_name}
                                    onChange={(e) => setData('pic_name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.pic_name && <p className="mt-1 text-xs text-error">{errors.pic_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    No. WhatsApp / Telepon <span className="text-error">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    NPWP (Opsional untuk Penagihan)
                                </label>
                                <input
                                    type="text"
                                    value={data.npwp}
                                    onChange={(e) => setData('npwp', e.target.value)}
                                    placeholder="Contoh: 01.234.567.8-901.000"
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden font-mono"
                                />
                                {errors.npwp && <p className="mt-1 text-xs text-error">{errors.npwp}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-ink mb-1.5">
                                Alamat Utama / Kantor Pusat <span className="text-error">*</span>
                            </label>
                            <textarea
                                required
                                rows={2}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Alamat lengkap jalan, nomor, RT/RW, kelurahan, kecamatan, kota..."
                                className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                            />
                            {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                        </div>

                        {/* SECTION: Titik Koordinat GPS & Peta Interaktif */}
                        <div className="bg-canvas-soft/70 p-4 rounded-xl border border-hairline space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                                        Titik Koordinat GPS & Peta Lokasi Kantor Pusat
                                    </h3>
                                </div>

                                {data.location && (
                                    <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Wilayah Otomatis: <strong>{data.location}</strong></span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[11px] text-mute">
                                Peta di bawah akan otomatis mendeteksi nama wilayah (misal: <em>Ciledug, Jakarta Selatan, Jakarta Utara, Tangerang</em>) dan ditampilkan di menu Daftar Pelanggan Admin.
                            </p>

                            {/* Coordinates and Area Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-ink mb-1">
                                        Nama Wilayah / Kota (Otomatis dari Peta)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Contoh: Ciledug / Jakarta Selatan"
                                        className="w-full px-3 py-1.5 text-xs bg-canvas border border-hairline rounded-lg font-medium text-ink focus:border-primary outline-hidden"
                                    />
                                    {errors.location && <p className="mt-1 text-xs text-error">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-ink mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="-6.2088"
                                        className="w-full px-3 py-1.5 text-xs bg-canvas border border-hairline rounded-lg font-mono text-ink focus:border-primary outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-ink mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="106.8456"
                                        className="w-full px-3 py-1.5 text-xs bg-canvas border border-hairline rounded-lg font-mono text-ink focus:border-primary outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Leaflet Interactive Map Picker */}
                            <div className="pt-2">
                                <LeafletLocationPicker
                                    lat={data.latitude}
                                    lng={data.longitude}
                                    height="340px"
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security & Password Card */}
                    <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3">
                            <Lock className="w-4 h-4 text-primary" />
                            Ganti Kata Sandi (Opsional)
                        </h2>
                        <p className="text-xs text-mute">
                            Kosongkan kolom kata sandi di bawah jika Anda tidak ingin mengubah kata sandi akun Anda.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2 rounded-xl shadow-xs cursor-pointer"
                        >
                            {processing ? 'Menyimpan Perubahan...' : 'Simpan Profil & Titik Lokasi Peta'}
                        </Button>
                    </div>
                </form>
            </div>
        </CustomerPortalLayout>
    );
}
