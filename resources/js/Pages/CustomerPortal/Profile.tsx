import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { Building2, User, Mail, Phone, MapPin, FileText, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
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
        npwp: customer?.npwp || '',
        password: '',
        password_confirmation: '',
    });

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
            <Head title="Profil Perusahaan - Portal Pelanggan" />

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
                                Perbarui informasi kontak, alamat penagihan, dan kredensial akses portal Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {savedSuccessfully && (
                    <div className="p-4 rounded-xl bg-success-soft border border-success/20 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Data profil berhasil diperbarui dan tersinkronisasi ke sistem admin.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information Card */}
                    <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-xs space-y-4">
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
                                rows={3}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-canvas border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                            />
                            {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
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
                            {processing ? 'Menyimpan Perubahan...' : 'Simpan Profil'}
                        </Button>
                    </div>
                </form>
            </div>
        </CustomerPortalLayout>
    );
}
