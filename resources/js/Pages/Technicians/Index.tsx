import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { useState } from 'react';

interface UserAccount {
    id: number;
    name: string;
    email: string;
}

interface Technician {
    id: number;
    user_id: number | null;
    user?: UserAccount;
    employee_id: string;
    nama: string;
    telepon: string;
    email: string;
    jabatan: string;
    status: 'aktif' | 'tidak_aktif' | 'cuti';
    area_tugas: string | null;
    keahlian: string[] | null;
    tanggal_bergabung: string;
    foto_profil: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTechnicians {
    data: Technician[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    technicians: PaginatedTechnicians;
    filters: {
        search?: string;
        status?: string;
    };
}

export const StatusBadge = ({ status }: { status: Technician['status'] }) => {
    switch (status) {
        case 'aktif':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">
                    Aktif
                </span>
            );
        case 'tidak_aktif':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Tidak Aktif
                </span>
            );
        case 'cuti':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Cuti
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft-2 text-body-text border border-hairline">
                    {status}
                </span>
            );
    }
};

export default function Index({ technicians, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/technicians', { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        router.get('/technicians', { search, status: newStatus }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data teknisi "${nama}"?`)) {
            router.delete(`/technicians/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Teknisi" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Manajemen Teknisi</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola data teknisi lapangan, keahlian, dan area operasional.</p>
                    </div>
                    <Link href="/technicians/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 rounded-xl">
                            <Plus className="w-4 h-4" />
                            Tambah Teknisi Baru
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari ID karyawan, nama, telepon, area tugas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 rounded-xl"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-48"
                        >
                            <option value="">Semua Status</option>
                            <option value="aktif">Aktif</option>
                            <option value="tidak_aktif">Tidak Aktif</option>
                            <option value="cuti">Cuti</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong w-full sm:w-auto rounded-xl">
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">ID Karyawan</th>
                                    <th className="py-3 px-4 font-semibold">Nama Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Telepon / Email</th>
                                    <th className="py-3 px-4 font-semibold">Jabatan</th>
                                    <th className="py-3 px-4 font-semibold">Area Tugas</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {technicians.data && technicians.data.length > 0 ? (
                                    technicians.data.map((tech) => (
                                        <tr key={tech.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-mono text-body-sm-strong">{tech.employee_id}</td>
                                            <td className="py-3 px-4 font-medium">
                                                <div className="flex items-center gap-2.5">
                                                    {tech.foto_profil ? (
                                                        <img src={tech.foto_profil} alt={tech.nama} className="w-8 h-8 rounded-full object-cover border border-hairline shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-xs font-semibold text-ink shrink-0">
                                                            {tech.nama.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Link href={`/technicians/${tech.id}`} className="hover:underline text-link font-medium">
                                                            {tech.nama}
                                                        </Link>
                                                        {tech.keahlian && tech.keahlian.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                                {tech.keahlian.slice(0, 2).map((k, i) => (
                                                                    <span key={i} className="text-[10px] bg-canvas-soft text-mute px-1.5 py-0.2 rounded border border-hairline">
                                                                        {k}
                                                                    </span>
                                                                ))}
                                                                {tech.keahlian.length > 2 && (
                                                                    <span className="text-[10px] text-mute">+{tech.keahlian.length - 2}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3 text-mute" />
                                                    <span>{tech.telepon}</span>
                                                </div>
                                                <div className="text-xs text-mute flex items-center gap-1.5 mt-0.5">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{tech.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-mute" />
                                                    <span>{tech.jabatan}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                {tech.area_tugas ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-mute shrink-0" />
                                                        <span className="truncate max-w-[150px]">{tech.area_tugas}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-mute italic">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={tech.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/technicians/${tech.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/technicians/${tech.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(tech.id, tech.nama)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-mute text-body-sm">
                                            Tidak ada data teknisi yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {technicians.links && technicians.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">
                                Menampilkan {technicians.data.length} dari {technicians.total} teknisi
                            </div>
                            <div className="flex items-center gap-1">
                                {technicians.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
