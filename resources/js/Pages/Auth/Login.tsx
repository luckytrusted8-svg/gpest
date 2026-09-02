import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans overflow-x-hidden">
            <Head title="Masuk ke Sistem - G-PEST" />

            {/* LEFT PANEL - Blue Panel with Circular Logo & Wavy Edge */}
            <div className="lg:w-5/12 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#1d4ed8] text-white pt-8 pb-12 px-6 sm:p-10 lg:p-14 flex flex-col justify-between relative shrink-0 min-h-[300px] lg:min-h-screen">
                
                {/* Wavy Cloud SVG Divider on the Right Border (Visible on Laptop / Desktop screens) */}
                <div className="absolute top-0 bottom-0 -right-1 w-16 hidden lg:block pointer-events-none z-20">
                    <svg viewBox="0 0 100 800" preserveAspectRatio="none" className="h-full w-full text-white fill-current">
                        <path d="M0,0 C40,90 90,140 20,240 C-30,340 80,420 20,520 C-40,620 70,720 0,800 L100,800 L100,0 Z" />
                    </svg>
                </div>

                {/* Mobile Bottom Wavy Edge (Visible on Mobile screens) */}
                <div className="absolute left-0 right-0 -bottom-1 h-10 lg:hidden pointer-events-none z-20">
                    <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="h-full w-full text-white fill-current">
                        <path d="M0,0 C150,80 300,10 450,70 C600,100 700,20 800,50 L800,100 L0,100 Z" />
                    </svg>
                </div>

                {/* Decorative Soft Background Glows */}
                <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

                {/* Top Text Header - Clean Top Spacing */}
                <div className="relative z-10 text-center lg:text-left pt-2 lg:pt-0">
                    <p className="text-base sm:text-xl font-semibold text-blue-100/90 tracking-wide">Selamat Datang di</p>
                </div>

                {/* Center Content: Circular Badge with Logo */}
                <div className="relative z-10 text-center my-auto py-4">
                    {/* White Circular Badge */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-white shadow-2xl flex items-center justify-center p-3.5 sm:p-4 mx-auto mb-3 border-4 border-white/30 transform transition-transform hover:scale-105">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 sm:h-12 w-auto object-contain" />
                    </div>

                    <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
                        G-PEST CONTROL
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100/90 max-w-xs mx-auto mt-1.5 leading-relaxed font-normal">
                        Sistem Informasi Operasional & Monitoring Pengendalian Hama Terpadu Enterprise.
                    </p>
                </div>

                {/* Bottom Footer Links */}
                <div className="relative z-10 text-center lg:text-left pt-4 border-t border-white/20 hidden sm:flex items-center justify-between text-[11px] font-semibold tracking-wider text-blue-100 uppercase">
                    <span>G-PEST CONTROL</span>
                    <span>HYGIENE SERVICES</span>
                </div>
            </div>

            {/* RIGHT PANEL - Full Screen Form Area */}
            <div className="lg:w-7/12 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-center relative flex-1 min-h-[460px] lg:min-h-screen">
                <div className="max-w-md mx-auto w-full space-y-6 sm:space-y-8">
                    
                    {/* Header Title */}
                    <div>
                        <h1 className="text-display-xs font-black text-slate-900 text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                            Masuk ke Sistem G-PEST
                        </h1>
                        <p className="text-body-xs text-slate-500 mt-2 text-sm">
                            Silakan masukkan email dan kata sandi Anda untuk mengakses sistem.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email / Username</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full h-12 bg-[#f0f4f9] border-none rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#2563eb] transition-all outline-none"
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
                            <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full h-12 bg-[#f0f4f9] border-none rounded-xl pl-11 pr-16 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#2563eb] transition-all outline-none"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold tracking-wider text-[#2563eb] hover:text-[#1d4ed8] uppercase select-none transition-colors"
                                >
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                            {errors.password && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</div>}
                        </div>

                        {/* Checkbox & Options */}
                        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none font-medium">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb] h-4 w-4"
                                />
                                <span>Remember me</span>
                            </label>
                            <Link href="/portal/login" className="text-[#2563eb] font-semibold hover:underline">
                                Portal Pelanggan →
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] active:scale-[0.99] text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Or Divider */}
                        <div className="relative my-6 flex items-center justify-center">
                            <div className="border-t border-slate-200 w-full" />
                            <span className="bg-white px-3 text-xs text-slate-400 font-semibold uppercase absolute">
                                Atau Pilih Akses
                            </span>
                        </div>

                        {/* Portal Link */}
                        <Link href="/portal/login" className="block w-full">
                            <button
                                type="button"
                                className="w-full h-11 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span>Masuk ke Customer Portal</span>
                            </button>
                        </Link>

                        {/* Bottom Note */}
                        <div className="text-center text-xs text-slate-400 pt-2">
                            Butuh Bantuan? <span className="font-bold text-slate-700">Hubungi Tim IT / Admin G-PEST</span>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    );
}
