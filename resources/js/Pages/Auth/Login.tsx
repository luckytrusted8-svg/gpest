import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4">
            <Head title="Masuk ke Sistem G-PEST" />

            <div className="w-full max-w-md">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white p-3 rounded-2xl shadow-xl shadow-blue-500/20 mb-3 border border-slate-700/50">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-12 w-auto max-w-[220px] object-contain" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">System Management Operasional & Monitoring Terpadu</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-lg font-semibold text-white">Selamat Datang Kembali</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Silakan masuk menggunakan kredensial akun Anda.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-slate-300">Alamat Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10 text-sm"
                                    placeholder="nama@gpest.id"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <div className="text-red-400 text-xs mt-1 font-medium">{errors.email}</div>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-medium text-slate-300">Kata Sandi</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="pl-9 pr-10 bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10 text-sm"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <div className="text-red-400 text-xs mt-1 font-medium">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label htmlFor="remember" className="flex items-center cursor-pointer select-none">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-700 text-blue-600 bg-slate-950 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                                />
                                <span className="ml-2 text-xs text-slate-300">Ingat Sesi Saya</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-2"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    <span>Masuk ke System</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>© {new Date().getFullYear()} G-PEST Control System. Real Production System.</span>
                </div>
            </div>
        </div>
    );
}
