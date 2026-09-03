import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi - G-PEST Enterprise" />

            <div className="mb-4 text-xs text-body leading-relaxed">
                Lupa kata sandi akun Anda? Masukkan alamat email terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi baru.
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-success bg-success/10 p-3 rounded-lg border border-success/20">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-ink mb-1">
                        Email Terdaftar
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        placeholder="nama@gpest.id"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route('login')}
                        className="text-xs text-primary font-medium hover:underline"
                    >
                        ← Kembali ke Login
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Kirim Link Reset
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
