import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, Building2, User, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Register() {
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsSuccess, setGpsSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        pic_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        address: '',
        site_name: '',
        latitude: '',
        longitude: '',
    });

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Browser Anda tidak mendukung geolokasi.');
            return;
        }

        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));
                setGpsLoading(false);
                setGpsSuccess(true);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Gagal mengambil koordinat GPS. Pastikan izin lokasi diizinkan di browser.');
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/portal/register');
    };

    return (
        <div className="min-h-screen bg-canvas-soft flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-ink">
            <Head title="Pendaftaran Pelanggan Baru - G-PEST Portal" />

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                    <img
                        src="/images/logo.png"
                        alt="G-PEST Logo"
                        className="h-10 w-auto object-contain mx-auto"
                    />
                </Link>
                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold rounded-full uppercase tracking-wider mb-2">
                    REGISTRASI PELANGGAN & TITIK LOKASI
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    Daftar Akun Klien G-PEST
                </h2>
                <p className="mt-2 text-sm text-mute max-w-md mx-auto">
                    Daftarkan perusahaan / tempat Anda untuk monitoring jadwal pengendalian hama, approval laporan kerja, dan titik lokasi mandiri.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
                <div className="bg-canvas py-8 px-6 sm:px-10 shadow-level-2 border border-hairline rounded-2xl">
                    {/* Google OAuth Quick Register */}
                    <div className="mb-6">
                        <a
                            href="/portal/auth/google"
                            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-hairline bg-canvas hover:bg-canvas-soft font-semibold text-sm text-ink shadow-xs transition-all duration-150 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span className="group-hover:text-primary transition-colors">Daftar / Masuk Instan dengan Google</span>
                        </a>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-hairline" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-canvas px-3 text-mute font-mono">Atau lengkapi formulir pendaftaran</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Section 1: Profil Perusahaan / Pelanggan */}
                        <div className="bg-canvas-soft/50 p-4 rounded-xl border border-hairline space-y-4">
                            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                1. Data Pelanggan / Perusahaan
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        Nama Perusahaan / Gedung / Rumah <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="PT Sukses Bersama / Rumah Bpk Budi"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                    {errors.company_name && <p className="mt-1 text-xs text-error">{errors.company_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        Nama Penanggung Jawab (PIC) <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={data.pic_name}
                                            onChange={(e) => setData('pic_name', e.target.value)}
                                            placeholder="Nama Lengkap Anda"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                    {errors.pic_name && <p className="mt-1 text-xs text-error">{errors.pic_name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        Email Akun <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@perusahaan.com"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        No. WhatsApp / Telepon <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="081234567890"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Alamat Lengkap <span className="text-error">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Jend. Sudirman No. 123, RT/RW, Kelurahan, Kecamatan, Kota"
                                    className="w-full px-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                />
                                {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        Kata Sandi <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="password"
                                            required
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1.5">
                                        Konfirmasi Kata Sandi <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-mute absolute left-3 top-3" />
                                        <input
                                            type="password"
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi kata sandi"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Titik Lokasi / Site Pertama */}
                        <div className="bg-canvas-soft/50 p-4 rounded-xl border border-hairline space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    2. Titik Lokasi (Site) Penanganan Pertama
                                </h3>
                                <span className="text-[11px] text-mute font-mono">(Bisa tambah lokasi lain nanti)</span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1.5">
                                    Nama Titik Lokasi / Cabang (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    placeholder="Contoh: Lokasi Utama / Kantor Pusat / Gudang Cikarang"
                                    className="w-full px-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                                />
                                <p className="mt-1 text-[11px] text-mute">Jika dikosongkan, otomatis menggunakan nama perusahaan Anda.</p>
                            </div>

                            {/* GPS Geolocation helper */}
                            <div className="pt-1">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                                        <Crosshair className="w-3.5 h-3.5 text-primary" />
                                        Koordinat GPS Lokasi (Opsional untuk Akurasi Teknisi)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={gpsLoading}
                                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        {gpsLoading ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Mengambil GPS...
                                            </>
                                        ) : gpsSuccess ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 text-success" />
                                                GPS Berhasil Diambil
                                            </>
                                        ) : (
                                            <>Ambil Lokasi Saat Ini (GPS)</>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="Latitude (cth: -6.2088)"
                                        className="w-full px-3 py-1.5 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden font-mono"
                                    />
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="Longitude (cth: 106.8456)"
                                        className="w-full px-3 py-1.5 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Memproses Pendaftaran...
                                    </>
                                ) : (
                                    <>
                                        <span>Daftarkan Akun & Lokasi Saya</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-mute">
                        Sudah memiliki akun portal?{' '}
                        <Link href="/portal/login" className="font-semibold text-primary hover:underline">
                            Masuk ke Portal di sini
                        </Link>
                    </div>
                </div>

                {/* Assurance badge */}
                <div className="mt-6 text-center text-xs text-mute flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Data Anda aman & langsung tersinkronisasi ke sistem jadwal operasional G-PEST.</span>
                </div>
            </div>
        </div>
    );
}
