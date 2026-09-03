import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Phone, ShieldCheck, FileCheck, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function CustomerLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('portal.login'));
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
            <Head title="Masuk Portal Pelanggan - G-PEST" />

            {/* LEFT PANEL - Desktop Only Branding (Hidden on Mobile for fast & clean access) */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-12 lg:p-16 flex-col justify-between relative shrink-0 overflow-hidden">
                {/* Ambient Decorative Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

                {/* Top Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                </div>

                {/* Center Value Proposition */}
                <div className="relative z-10 py-10 my-auto max-w-md space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-bold tracking-wide uppercase">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>Client Transparency Portal</span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                        Portal Khusus Pelanggan & Mitra G-PEST.
                    </h1>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        Akses transparansi penuh untuk seluruh riwayat treatment, jadwal kunjungan berkala, berita acara digital, dan invoice dalam satu dashboard.
                    </p>

                    <div className="pt-2 space-y-3.5 text-xs text-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <span className="font-medium">Jadwal Penanganan & Kunjungan Teknisi Lapangan</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="font-medium">Laporan Kerja Lengkap & Foto Dokumentasi Treatment</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <span className="font-medium">Kontrak Layanan & Arsip Tagihan / Invoice Real-Time</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>G-PEST CLIENT ACCESS</span>
                    <span>256-BIT ENCRYPTION</span>
                </div>
            </div>

            {/* RIGHT PANEL - Clean Mobile & Web Form Area */}
            <div className="w-full lg:w-7/12 min-h-screen bg-slate-50/50 sm:bg-white p-5 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative flex-1">
                <div className="max-w-md w-full bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/80 sm:border-0 shadow-xl sm:shadow-none space-y-6 sm:space-y-8 my-auto">
                    
                    {/* Header */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <Link href="/" className="inline-block">
                                <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 w-auto object-contain" />
                            </Link>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                CUSTOMER PORTAL
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Masuk Portal Pelanggan
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                            Silakan masukkan email dan kata sandi Anda untuk memantau status proyek & layanan.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                                Email Pelanggan
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full h-12 bg-slate-50/60 sm:bg-white border border-slate-300 rounded-2xl pl-10 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-colors shadow-2xs font-medium"
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</div>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full h-12 bg-slate-50/60 sm:bg-white border border-slate-300 rounded-2xl pl-10 pr-16 text-slate-900 placeholder:text-slate-400 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-colors shadow-2xs font-medium"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg"
                                >
                                    {showPassword ? 'Tutup' : 'Lihat'}
                                </button>
                            </div>
                            {errors.password && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</div>}
                        </div>

                        {/* Checkbox & Staff Link */}
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600/20 h-4 w-4"
                                />
                                <span className="font-medium">Ingat saya</span>
                            </label>
                            <Link href="/login" className="text-slate-800 font-bold hover:text-blue-600 transition-colors">
                                Staff / Admin Login →
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    <span>Masuk ke Portal Pelanggan</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* WhatsApp / Sales Consultation Section */}
                        <div className="pt-5 text-center text-xs text-slate-500 border-t border-slate-100 space-y-1">
                            <p>Belum memiliki akun portal pelanggan?</p>
                            <a 
                                href="https://wa.me/6281234567890?text=Halo%20G-PEST,%20saya%20ingin%20mengajukan%20survey%20lokasi" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1.5 transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5 text-blue-600" />
                                <span>Hubungi Sales / Ajukan Survey Gratis →</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
