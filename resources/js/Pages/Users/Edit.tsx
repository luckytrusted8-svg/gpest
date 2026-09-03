import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    status: 'aktif' | 'tidak_aktif';
    roles?: Role[];
}

interface Props {
    user: User;
    roles: Role[];
}

export default function Edit({ user, roles }: Props) {
    const currentRole = user.roles && user.roles.length > 0 ? user.roles[0].name : (roles[0]?.name || 'technician');

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: currentRole,
        status: user.status || 'aktif',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Pengguna: ${user.name}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Edit Pengguna: {user.name}</h1>
                        <p className="text-body-sm text-mute mt-1">Perbarui data profil, peran access (role), dan status pengguna.</p>
                    </div>
                    <Link href={route('users.index')}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="name" className="text-body-sm-strong text-ink">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-body-sm-strong text-ink">Alamat Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-body-sm-strong text-ink">Ubah Kata Sandi (Opsional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Biarkan kosong jika tidak diubah"
                                    className="mt-1"
                                />
                                {errors.password && <div className="text-error text-sm mt-1">{errors.password}</div>}
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-body-sm-strong text-ink">Peran Access (Role) *</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(val: string) => setData('role', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.id} value={r.name}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <div className="text-error text-sm mt-1">{errors.role}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-body-sm-strong text-ink">Status Akun *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: string) => setData('status', val as 'aktif' | 'tidak_aktif')}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <div className="text-error text-sm mt-1">{errors.status}</div>}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-hairline">
                            <Link href={route('users.index')}>
                                <Button type="button" variant="outline" className="text-body-sm-strong">
                                    Batal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-900 text-white hover:bg-slate-800 font-semibold"
                            >
                                Perbarui User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
