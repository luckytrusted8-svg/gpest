import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FormData {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
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
        post('/login');
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 antialiased">
            <Head title="Masuk ke Sistem - G-PEST" />

            {/* LEFT PANEL - Desktop Only Branding (Identical layout) */}
            <div className="hidden lg:flex lg:w-5/12 bg-slate-900 text-white p-12 lg:p-16 flex-col justify-between relative shrink-0">
                {/* Brand Title */}
                <div>
                    <Link href="/" className="inline-block">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                </div>

                {/* Center Pitch */}
                <div className="py-10 my-auto max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-blue-400 text-xs font-semibold mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Enterprise Control System</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight min-h-[5.5rem]">
                        Platform Operasional Pengendalian Hama Modern.
                    </h1>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed min-h-[3rem]">
                        Satu sistem terintegrasi untuk pemantauan teknisi, digital work order, absensi berbasis GPS, dan portal pelanggan.
                    </p>

                    <div className="mt-8 space-y-3.5">
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>GPS Dispatch & Live Attendance Real-Time</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Digital Work Order & Berita Acara Tanpa Kertas</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Portal Transparansi Klien 24/7</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>G-PEST CONTROL</span>
                    <span>ENTERPRISE SYSTEM</span>
                </div>
            </div>

            {/* RIGHT PANEL - Clean Mobile-Optimized Form Area */}
            <div className="w-full lg:w-7/12 min-h-screen bg-slate-50/50 sm:bg-white p-5 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative flex-1">
                <div className="max-w-md w-full bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/80 sm:border-0 shadow-xl sm:shadow-none space-y-6 sm:space-y-8 my-auto">
                    {/* Header with Logo */}
                    <div>
                        <Link href="/" className="inline-block mb-5">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 w-auto object-contain" />
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Masuk ke Akun
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                            Silakan masukkan email dan kata sandi untuk mengakses workspace.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                                Email / Username
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full h-12 bg-slate-50/60 sm:bg-white border border-slate-300 rounded-2xl pl-10 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors shadow-2xs font-medium"
                                    placeholder="nama@gpest.id"
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
                                    className="w-full h-12 bg-slate-50/60 sm:bg-white border border-slate-300 rounded-2xl pl-10 pr-16 text-slate-900 placeholder:text-slate-400 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors shadow-2xs font-medium"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg"
                                >
                                    {showPassword ? 'Tutup' : 'Lihat'}
                                </button>
                            </div>
                            {errors.password && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</div>}
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 h-4 w-4"
                                />
                                <span className="font-medium">Ingat saya</span>
                            </label>
                            <Link href="/portal/login" className="text-blue-600 font-bold hover:underline">
                                Portal Pelanggan →
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    <span>Masuk ke Sistem</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Alternative Portal Button */}
                        <div className="relative my-6 flex items-center justify-center">
                            <div className="border-t border-slate-200 w-full" />
                            <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
                                Atau
                            </span>
                        </div>

                        <Link href="/portal/login" className="block w-full">
                            <button
                                type="button"
                                className="w-full h-12 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99]"
                            >
                                <span>Masuk sebagai Klien (Customer Portal)</span>
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
