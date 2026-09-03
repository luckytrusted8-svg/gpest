import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Calendar, Clock, User, MapPin } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Contract {
    id: number;
    contract_number: string;
}

interface UserStaff {
    id: number;
    name: string;
    email: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
    customer_id: number;
    customer?: Customer;
    contract_id: number | null;
    contract?: Contract;
    lokasi: string;
    jenis_layanan: string;
    technician_id: number | null;
    technician?: UserStaff;
    supervisor_id: number | null;
    supervisor?: UserStaff;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
    catatan: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSchedules {
    data: Schedule[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    schedules: PaginatedSchedules;
    technicians: UserStaff[];
    filters: {
        search?: string;
        tanggal?: string;
        technician_id?: string;
        status?: string;
    };
}

export const PriorityBadge = ({ prioritas }: { prioritas: Schedule['prioritas'] }) => {
    switch (prioritas) {
        case 'urgent':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Urgent
                </span>
            );
        case 'tinggi':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Tinggi
                </span>
            );
        case 'normal':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">
                    Normal
                </span>
            );
        case 'rendah':
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft-2 text-body-text border border-hairline">
                    Rendah
                </span>
            );
    }
};

export const StatusBadge = ({ status }: { status: Schedule['status'] }) => {
    switch (status) {
        case 'selesai':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">
                    Selesai
                </span>
            );
        case 'sedang_dikerjakan':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Sedang Dikerjakan
                </span>
            );
        case 'dalam_perjalanan':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Dalam Perjalanan
                </span>
            );
        case 'tiba':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Tiba di Lokasi
                </span>
            );
        case 'dibatalkan':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Dibatalkan
                </span>
            );
        case 'dijadwal_ulang':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#7928ca]/15 text-[#4c2889]">
                    Dijadwal Ulang
                </span>
            );
        case 'ditugaskan':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft-2 text-ink border border-hairline font-medium">
                    Ditugaskan
                </span>
            );
        case 'dijadwalkan':
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft-2 text-body-text border border-hairline">
                    Dijadwalkan
                </span>
            );
    }
};

export default function Index({ schedules, technicians, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/schedules',
            { search, tanggal, technician_id: technicianId, status },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number, code: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jadwal "${code}"?`)) {
            router.delete(`/schedules/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Jadwal Pekerjaan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Jadwal Pekerjaan</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola dan pantau penugasan jadwal teknisi lapangan.</p>
                    </div>
                    <Link href="/schedules/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Buat Jadwal Baru
                        </Button>
                    </Link>
                </div>

                {/* Filter Controls */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari kode, customer, lokasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-body-sm"
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="text-body-sm"
                            />
                        </div>

                        <div>
                            <select
                                value={technicianId}
                                onChange={(e) => setTechnicianId(e.target.value)}
                                className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full"
                            >
                                <option value="">Semua Teknisi</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>
                                        {tech.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full"
                            >
                                <option value="">Semua Status</option>
                                <option value="dijadwalkan">Dijadwalkan</option>
                                <option value="ditugaskan">Ditugaskan</option>
                                <option value="dalam_perjalanan">Dalam Perjalanan</option>
                                <option value="tiba">Tiba di Lokasi</option>
                                <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                                <option value="dijadwal_ulang">Dijadwal Ulang</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="outline" className="text-body-sm-strong flex-1">
                                Filter
                            </Button>
                            {(search || tanggal || technicianId || status) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-body-sm text-mute"
                                    onClick={() => {
                                        setSearch('');
                                        setTanggal('');
                                        setTechnicianId('');
                                        setStatus('');
                                        router.get('/schedules');
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Kode</th>
                                    <th className="py-3 px-4 font-semibold">Customer & Layanan</th>
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                                    <th className="py-3 px-4 font-semibold">Prioritas</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {schedules.data && schedules.data.length > 0 ? (
                                    schedules.data.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-mono text-body-sm-strong">
                                                <Link href={`/schedules/${schedule.id}`} className="hover:underline text-link">
                                                    {schedule.schedule_code}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{schedule.customer?.company_name || '-'}</div>
                                                <div className="text-xs text-mute flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    <span className="truncate max-w-[200px]">{schedule.lokasi}</span>
                                                    <span>• {schedule.jenis_layanan}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                {schedule.technician ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-mute" />
                                                        <span>{schedule.technician.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-mute italic">Belum ditugaskan</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-mute" />
                                                    {schedule.tanggal}
                                                </div>
                                                <div className="text-xs text-mute flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {schedule.jam_mulai} - {schedule.jam_selesai}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <PriorityBadge prioritas={schedule.prioritas} />
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={schedule.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/schedules/${schedule.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/schedules/${schedule.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(schedule.id, schedule.schedule_code)}
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
                                            Tidak ada jadwal pekerjaan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {schedules.links && schedules.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">
                                Menampilkan {schedules.data.length} dari {schedules.total} jadwal
                            </div>
                            <div className="flex items-center gap-1">
                                {schedules.links.map((link, idx) => (
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
