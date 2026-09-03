import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

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

            {/* LEFT PANEL */}
            <div className="lg:w-5/12 bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative shrink-0">
                {/* Brand Title */}
                <div>
                    <Link href="/" className="inline-block">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                </div>

                {/* Center Pitch */}
                <div className="py-10 my-auto max-w-md">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
                        Platform Operasional Pengendalian Hama Modern.
                    </h1>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                        Satu sistem terintegrasi untuk pemantauan teknisi, digital work order, absensi berbasis GPS, dan portal pelanggan.
                    </p>

                    <div className="mt-8 space-y-3">
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

            {/* RIGHT PANEL - Clean Form Area */}
            <div className="lg:w-7/12 bg-white p-6 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative flex-1">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div>
                        <Link href="/" className="inline-block mb-6 lg:hidden">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain" />
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                            Masuk ke Akun
                        </h2>
                        <p className="text-xs text-slate-500 mt-1.5">
                            Silakan masukkan email dan kata sandi untuk mengakses workspace.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-medium text-slate-700">
                                Email / Username
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors shadow-2xs"
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
                            <label htmlFor="password" className="block text-xs font-medium text-slate-700">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-16 text-slate-900 placeholder:text-slate-400 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors shadow-2xs"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
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
                                <span>Ingat saya</span>
                            </label>
                            <Link href="/portal/login" className="text-slate-900 font-medium hover:underline">
                                Portal Pelanggan →
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
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
                            <span className="bg-white px-3 text-xs text-slate-400 font-mono uppercase absolute">
                                Atau
                            </span>
                        </div>

                        <Link href="/portal/login" className="block w-full">
                            <button
                                type="button"
                                className="w-full h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
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
