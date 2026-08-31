import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useState } from 'react';
import { X, Plus, User, ShieldCheck } from 'lucide-react';

interface UserAccount {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users: UserAccount[];
}

interface FormData {
    employee_id: string;
    user_id: string;
    nama: string;
    telepon: string;
    email: string;
    jabatan: string;
    status: 'aktif' | 'tidak_aktif' | 'cuti';
    area_tugas: string;
    keahlian: string[];
    tanggal_bergabung: string;
    foto_profil: string;
}

const DEFAULT_SKILLS = [
    'General Pest Control',
    'Termite Control',
    'Rodent Control',
    'Insect Control',
    'Fumigation',
    'Disinfection',
    'Inspection & Survey',
];

export default function Create({ users }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const [newSkill, setNewSkill] = useState('');

    const { data, setData, post, processing, errors } = useForm<FormData>({
        employee_id: `TEK-${Math.floor(100 + Math.random() * 900)}`,
        user_id: '',
        nama: '',
        telepon: '',
        email: '',
        jabatan: 'Teknisi Field',
        status: 'aktif',
        area_tugas: 'Jakarta Pusat',
        keahlian: ['General Pest Control'],
        tanggal_bergabung: today,
        foto_profil: '',
    });

    const addSkill = (skillToAdd: string) => {
        const trimmed = skillToAdd.trim();
        if (trimmed && !data.keahlian.includes(trimmed)) {
            setData('keahlian', [...data.keahlian, trimmed]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setData('keahlian', data.keahlian.filter((s) => s !== skillToRemove));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('technicians.store'));
    };

    return (
        <AppLayout>
            <Head title="Tambah Teknisi Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Tambah Teknisi Baru</h1>
                        <p className="text-body-sm text-mute mt-1">Lengkapi profil dan data teknisi untuk alokasi penugasan.</p>
                    </div>
                    <Link href={route('technicians.index')}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="employee_id" className="text-body-sm-strong text-ink">ID Karyawan / NIK Teknisi</Label>
                                <Input
                                    id="employee_id"
                                    type="text"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="mt-1 font-mono"
                                />
                                {errors.employee_id && <div className="text-error text-sm mt-1">{errors.employee_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="user_id" className="text-body-sm-strong text-ink">Tautkan Akun Pengguna (Opsional)</Label>
                                <Select
                                    value={data.user_id}
                                    onValueChange={(val: string) => setData('user_id', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Akun User Login" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && <div className="text-error text-sm mt-1">{errors.user_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="nama" className="text-body-sm-strong text-ink">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Contoh: Ahmad Subagja"
                                    className="mt-1"
                                />
                                {errors.nama && <div className="text-error text-sm mt-1">{errors.nama}</div>}
                            </div>

                            <div>
                                <Label htmlFor="telepon" className="text-body-sm-strong text-ink">Nomor Telepon / WhatsApp</Label>
                                <Input
                                    id="telepon"
                                    type="text"
                                    value={data.telepon}
                                    onChange={(e) => setData('telepon', e.target.value)}
                                    placeholder="081234567890"
                                    className="mt-1"
                                />
                                {errors.telepon && <div className="text-error text-sm mt-1">{errors.telepon}</div>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-body-sm-strong text-ink">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="teknisi@gpest.co.id"
                                    className="mt-1"
                                />
                                {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="jabatan" className="text-body-sm-strong text-ink">Jabatan / Posisi</Label>
                                <Select
                                    value={data.jabatan}
                                    onValueChange={(val: string) => setData('jabatan', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Jabatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Teknisi Field">Teknisi Field</SelectItem>
                                        <SelectItem value="Teknisi Senior">Teknisi Senior</SelectItem>
                                        <SelectItem value="Specialist Termite">Specialist Termite</SelectItem>
                                        <SelectItem value="Specialist Fumigation">Specialist Fumigation</SelectItem>
                                        <SelectItem value="Supervisor Lapangan">Supervisor Lapangan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jabatan && <div className="text-error text-sm mt-1">{errors.jabatan}</div>}
                            </div>

                            <div>
                                <Label htmlFor="area_tugas" className="text-body-sm-strong text-ink">Area Tugas / Operasional</Label>
                                <Input
                                    id="area_tugas"
                                    type="text"
                                    value={data.area_tugas}
                                    onChange={(e) => setData('area_tugas', e.target.value)}
                                    placeholder="Contoh: Jakarta Pusat & Barat"
                                    className="mt-1"
                                />
                                {errors.area_tugas && <div className="text-error text-sm mt-1">{errors.area_tugas}</div>}
                            </div>

                            <div>
                                <Label htmlFor="tanggal_bergabung" className="text-body-sm-strong text-ink">Tanggal Bergabung</Label>
                                <Input
                                    id="tanggal_bergabung"
                                    type="date"
                                    value={data.tanggal_bergabung}
                                    onChange={(e) => setData('tanggal_bergabung', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.tanggal_bergabung && <div className="text-error text-sm mt-1">{errors.tanggal_bergabung}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-body-sm-strong text-ink">Status Karyawan</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: string) => setData('status', val as FormData['status'])}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                                        <SelectItem value="cuti">Cuti</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <div className="text-error text-sm mt-1">{errors.status}</div>}
                            </div>

                            <div>
                                <Label htmlFor="foto_profil" className="text-body-sm-strong text-ink">URL Foto Profil (Opsional)</Label>
                                <Input
                                    id="foto_profil"
                                    type="text"
                                    value={data.foto_profil}
                                    onChange={(e) => setData('foto_profil', e.target.value)}
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                                {errors.foto_profil && <div className="text-error text-sm mt-1">{errors.foto_profil}</div>}
                            </div>
                        </div>

                        {/* Keahlian Section */}
                        <div className="pt-4 border-t border-hairline space-y-3">
                            <Label className="text-body-sm-strong text-ink flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-mute" />
                                Keahlian / Kualifikasi (Sertifikasi & Layanan)
                            </Label>

                            {/* Applied Skill Tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {data.keahlian.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft border border-hairline rounded-full text-body-sm font-medium text-ink"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-mute hover:text-error transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Add Custom Skill */}
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Tambah keahlian lain..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill(newSkill);
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addSkill(newSkill)}
                                    className="text-body-sm-strong"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Tambah
                                </Button>
                            </div>

                            {/* Preset Suggestions */}
                            <div className="text-caption text-mute mt-2">
                                Rekomendasi cepat:
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {DEFAULT_SKILLS.filter((s) => !data.keahlian.includes(s)).map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => addSkill(preset)}
                                            className="text-xs bg-canvas text-body-text hover:bg-canvas-soft border border-hairline px-2 py-0.5 rounded transition-colors"
                                        >
                                            + {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-hairline">
                            <Link href={route('technicians.index')}>
                                <Button type="button" variant="outline" className="text-body-sm-strong">
                                    Batal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
                            >
                                Simpan Data Teknisi
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
