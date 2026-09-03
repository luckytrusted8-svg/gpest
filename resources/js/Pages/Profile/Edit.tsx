import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Shield, Lock, Trash2 } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout>
            <Head title="Pengaturan Profil Akun - G-PEST" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Title */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-display-sm text-ink">
                        Pengaturan Profil
                    </h1>
                    <p className="text-xs text-mute mt-1">
                        Kelola informasi akun, kata sandi, dan keamanan sistem Anda.
                    </p>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white border border-slate-900/5 rounded-2xl p-6 sm:p-8 shadow-ambient">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-hairline mb-6">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-900/5 flex items-center justify-center text-ink">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-ink">Informasi Akun</h2>
                            <p className="text-[11px] text-mute">Perbarui nama pengguna dan alamat email terdaftar.</p>
                        </div>
                    </div>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Update Password Section */}
                <div className="bg-white border border-slate-900/5 rounded-2xl p-6 sm:p-8 shadow-ambient">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-hairline mb-6">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-900/5 flex items-center justify-center text-ink">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-ink">Keamanan & Kata Sandi</h2>
                            <p className="text-[11px] text-mute">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                        </div>
                    </div>
                    <UpdatePasswordForm />
                </div>

                {/* Delete Account Section */}
                <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-ambient">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-rose-100 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                            <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-rose-900">Hapus Akun</h2>
                            <p className="text-[11px] text-rose-500">Tindakan ini permanen dan akan menghapus seluruh data akun Anda.</p>
                        </div>
                    </div>
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}
