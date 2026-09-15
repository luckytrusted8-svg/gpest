import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Lock, Trash2 } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout>
            <Head title="Pengaturan Profil Akun - G-PEST" />

            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-8">
                {/* Header Title */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                        Pengaturan Profil
                    </h1>
                    <p className="text-xs text-mute mt-0.5 sm:mt-1 hidden sm:block">
                        Kelola informasi akun, kata sandi, dan keamanan sistem Anda.
                    </p>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center gap-2.5 pb-3.5 sm:pb-4 border-b border-slate-100 mb-4 sm:mb-6">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Informasi Akun</h2>
                            <p className="text-[11px] text-slate-500 hidden sm:block">Perbarui nama pengguna dan alamat email terdaftar.</p>
                        </div>
                    </div>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Update Password Section */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center gap-2.5 pb-3.5 sm:pb-4 border-b border-slate-100 mb-4 sm:mb-6">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Keamanan & Kata Sandi</h2>
                            <p className="text-[11px] text-slate-500 hidden sm:block">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                        </div>
                    </div>
                    <UpdatePasswordForm />
                </div>

                {/* Delete Account Section (Danger Zone) */}
                <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center gap-2.5 pb-3.5 sm:pb-4 border-b border-rose-200/70 mb-4 sm:mb-6">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                            <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-rose-900">Hapus Akun</h2>
                            <p className="text-[11px] text-rose-600 hidden sm:block">Tindakan ini permanen dan akan menghapus seluruh data akun Anda.</p>
                        </div>
                    </div>
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}

