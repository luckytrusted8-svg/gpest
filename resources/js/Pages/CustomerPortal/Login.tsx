import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FormData {
    email: string;
    password: string;
    remember: boolean;
}

interface Props {
    errors: {
        email?: string;
        password?: string;
    };
    flash?: {
        error?: string;
    };
}

// Google Icon SVG
function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export default function CustomerLogin({ errors: pageErrors, flash }: Props) {
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
        post(route('portal.login'));
    };

    const combinedErrors = { ...pageErrors, ...errors };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 antialiased">
            <Head title="Masuk Portal Pelanggan - G-PEST" />

            {/* LEFT PANEL - Desktop Only Branding */}
            <div className="hidden lg:flex lg:w-5/12 bg-slate-900 text-white p-12 lg:p-16 flex-col justify-between relative shrink-0">
                <div>
                    <Link href="/" prefetch className="inline-block">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                </div>

                <div className="py-10 my-auto max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-blue-400 text-xs font-semibold mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Customer Portal System</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight min-h-[5.5rem]">
                        Portal Transparansi Layanan Pelanggan.
                    </h1>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed min-h-[3rem]">
                        Pantau jadwal penanganan teknisi, laporan kerja digital, berita acara, dan tagihan proyek Anda secara real-time.
                    </p>

                    <div className="mt-8 space-y-3.5">
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Jadwal Penanganan &amp; Kunjungan Berkala</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Laporan Kerja Lengkap &amp; Foto Dokumentasi</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Kontrak Layanan &amp; Arsip Invoice Transparan</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>G-PEST CONTROL</span>
                    <span>ENTERPRISE SYSTEM</span>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-7/12 min-h-screen bg-slate-50/50 sm:bg-white p-5 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative flex-1">
                <div className="max-w-md w-full bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/80 sm:border-0 shadow-xl sm:shadow-none space-y-6 sm:space-y-8 my-auto">

                    {/* Header */}
                    <div>
                        <Link href="/" className="inline-block mb-5">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 w-auto object-contain" />
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Masuk Portal Pelanggan
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                            Gunakan akun Google atau email yang terdaftar sebagai pelanggan.
                        </p>
                    </div>

                    {/* Flash error */}
                    {flash?.error && (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-700 font-medium">
                            {flash.error}
                        </div>
                    )}

                    {/* Global email error (from Google callback) */}
                    {combinedErrors.email && !data.email && (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-700 font-medium">
                            {combinedErrors.email}
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <a
                        href="/portal/auth/google"
                        id="btn-google-signin"
                        className="group w-full h-12 flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-2xl transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                    >
                        <GoogleIcon className="w-5 h-5 shrink-0" />
                        <span>Masuk dengan Google</span>
                    </a>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-200 w-full" />
                        <span className="bg-white sm:bg-transparent px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
                            Atau dengan email
                        </span>
                    </div>

                    {/* Email/Password Form */}
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
                                    className="w-full h-12 bg-slate-50/60 sm:bg-white border border-slate-300 rounded-2xl pl-10 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors shadow-2xs font-medium"
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {data.email && combinedErrors.email && (
                                <div className="text-rose-600 text-xs mt-1 font-medium">{combinedErrors.email}</div>
                            )}
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
                            {combinedErrors.password && (
                                <div className="text-rose-600 text-xs mt-1 font-medium">{combinedErrors.password}</div>
                            )}
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
                            <Link href="/login" prefetch className="text-blue-600 font-bold hover:underline">
                                Login Staff / Admin →
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            id="btn-email-login"
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    <span>Masuk ke Portal Pelanggan</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Staff/Teknisi alternative */}
                        <div className="relative my-2 flex items-center justify-center">
                            <div className="border-t border-slate-200 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Link href="/portal/register" prefetch className="block w-full">
                                <button
                                    type="button"
                                    className="w-full h-11 border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] cursor-pointer"
                                >
                                    <span>Belum Punya Akun? Daftar Pelanggan & Lokasi</span>
                                </button>
                            </Link>

                            <Link href="/login" prefetch className="block w-full">
                                <button
                                    type="button"
                                    className="w-full h-11 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] cursor-pointer"
                                >
                                    <span>Masuk sebagai Staff / Teknisi</span>
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
