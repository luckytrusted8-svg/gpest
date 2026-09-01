import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Lock, Mail, ShieldCheck, Phone } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('portal.login'));
    };

    return (
        <div className="min-h-screen bg-canvas-soft flex flex-col justify-center items-center p-4">
            <Head title="Customer Portal Login" />

            <div className="w-full max-w-md space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-block bg-white p-2.5 rounded-xl border border-hairline shadow-sm mb-1">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-10 w-auto max-w-[200px] object-contain" />
                    </div>
                    <h1 className="text-display-sm font-semibold text-ink">Customer Portal</h1>
                    <p className="text-body-sm text-mute">
                        Masuk untuk memantau kontrak, jadwal, dan laporan kerja pest control Anda.
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-canvas border border-hairline rounded-lg shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 sm:p-8 space-y-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-body-sm-strong text-ink">Email Pelanggan</Label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@perusahaan.com"
                                    className="pl-9"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.email && <div className="text-error text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-body-sm-strong text-ink">Kata Sandi</Label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-9"
                                    required
                                />
                            </div>
                            {errors.password && <div className="text-error text-xs mt-1">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-hairline text-primary focus:ring-primary h-4 w-4"
                                />
                                <span className="text-body-sm text-body-text">Ingat saya</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-primary text-on-primary hover:bg-ink text-body-sm-strong py-2.5"
                        >
                            Masuk ke Portal Pelanggan
                        </Button>

                        <div className="pt-4 border-t border-hairline text-center text-xs space-y-1.5">
                            <p className="text-mute">Belum berlangganan atau ingin pesan jasa baru?</p>
                            <a 
                                href="https://wa.me/6281234567890?text=Halo%20G-PEST,%20saya%20ingin%20mengajukan%20survey%20lokasi%20bebas%20hama" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                            >
                                <Phone className="w-3.5 h-3.5 text-primary" /> Hubungi Sales / Ajukan Survey Gratis →
                            </a>
                        </div>
                    </form>
                </div>

                <div className="text-center text-xs text-mute flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Keamanan data & privasi terpelihara oleh GPEST Control System</span>
                </div>
            </div>
        </div>
    );
}
