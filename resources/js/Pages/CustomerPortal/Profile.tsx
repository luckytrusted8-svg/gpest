import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';
import { Building2, Lock, CheckCircle2, MapPin, Sparkles, Save } from 'lucide-react';

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

    const [addressSynced, setAddressSynced] = useState(false);

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
            address: addressSuggestion || prev.address,
        }));

        if (addressSuggestion) {
            setAddressSynced(true);
            setTimeout(() => setAddressSynced(false), 5000);
        }
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

            <div className="max-w-4xl mx-auto space-y-5 pb-16 sm:pb-0">
                {/* Header Banner - Compact & Clean */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-2xl font-bold text-slate-900 leading-tight">
                                    Profil &amp; Informasi Pelanggan
                                </h1>
                                {customer?.customer_id && (
                                    <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md shrink-0">
                                        {customer.customer_id}
                                    </span>
                                )}
                            </div>
                            <p className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-1">
                                Kelola identitas perusahaan, titik koordinat GPS kantor pusat, dan peta lokasi yang otomatis tersinkronisasi ke sistem Admin.
                            </p>
                        </div>
                    </div>
                </div>

                {savedSuccessfully && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Data profil &amp; titik peta GPS berhasil diperbarui dan otomatis tercatat di dashboard Admin!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Company Information Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            Data Perusahaan / Identitas Pelanggan
                        </h2>

                        {/* Row 1: Nama Perusahaan & PIC */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nama Perusahaan / Gedung / Rumah <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium outline-hidden"
                                />
                                {errors.company_name && <p className="mt-1 text-xs text-rose-600">{errors.company_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nama Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.pic_name}
                                    onChange={(e) => setData('pic_name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium outline-hidden"
                                />
                                {errors.pic_name && <p className="mt-1 text-xs text-rose-600">{errors.pic_name}</p>}
                            </div>
                        </div>

                        {/* Row 2: No. WhatsApp & NPWP */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    No. WhatsApp / Telepon <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium outline-hidden"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    NPWP (Opsional untuk Penagihan)
                                </label>
                                <input
                                    type="text"
                                    value={data.npwp}
                                    onChange={(e) => setData('npwp', e.target.value)}
                                    placeholder="Contoh: 01.234.567.8-901.000"
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono outline-hidden"
                                />
                                {errors.npwp && <p className="mt-1 text-xs text-rose-600">{errors.npwp}</p>}
                            </div>
                        </div>

                        {/* Row 3: Alamat Utama */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Alamat Utama / Kantor Pusat <span className="text-rose-500">*</span>
                                </label>
                                {addressSynced && (
                                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 animate-in fade-in">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        Alamat Otomatis Terisi Presisi dari GPS / Peta!
                                    </span>
                                )}
                            </div>
                            <textarea
                                required
                                rows={2}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Alamat lengkap jalan, nomor, RT/RW, kelurahan, kecamatan, kota..."
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                            />
                            {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
                        </div>

                        {/* SECTION: Titik Koordinat GPS & Peta Interaktif */}
                        <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Titik Koordinat GPS &amp; Peta Lokasi Kantor Pusat
                                    </h3>
                                </div>

                                {data.location && (
                                    <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto">
                                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span>Wilayah Otomatis: <strong>{data.location}</strong></span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-normal">
                                Peta di bawah akan otomatis mendeteksi nama wilayah (misal: <em>Ciledug, Jakarta Selatan, Tangerang</em>) dan ditampilkan di menu Daftar Pelanggan Admin.
                            </p>

                            {/* Coordinates and Area Input Fields (2 Cols on mobile for Lat & Lng) */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                        Nama Wilayah / Kota (Otomatis dari Peta)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Contoh: Ciledug / Tangerang"
                                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                                    />
                                    {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="-6.2088"
                                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="106.8456"
                                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Leaflet Interactive Map Picker */}
                            <div className="pt-1">
                                <LeafletLocationPicker
                                    lat={data.latitude}
                                    lng={data.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security & Password Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Lock className="w-4 h-4 text-blue-600" />
                            Ganti Kata Sandi (Opsional)
                        </h2>
                        <p className="text-xs text-slate-500">
                            Kosongkan kolom kata sandi di bawah jika Anda tidak ingin mengubah kata sandi akun Anda.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                                />
                                {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button (Sticky on Mobile, Standard on Desktop) */}
                    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-0 sm:static sm:bg-transparent border-t sm:border-0 border-slate-200 shadow-lg sm:shadow-none -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Profil & Titik Lokasi Peta'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </CustomerPortalLayout>
    );
}
