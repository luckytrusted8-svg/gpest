import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Calendar, Clock, User, MapPin, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    Urgent
                </span>
            );
        case 'tinggi':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Tinggi
                </span>
            );
        case 'normal':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Normal
                </span>
            );
        case 'rendah':
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Rendah
                </span>
            );
    }
};

export const StatusBadge = ({ status }: { status: Schedule['status'] }) => {
    switch (status) {
        case 'selesai':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Selesai
                </span>
            );
        case 'sedang_dikerjakan':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Sedang Dikerjakan
                </span>
            );
        case 'tiba':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Tiba di Lokasi
                </span>
            );
        case 'dalam_perjalanan':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Dalam Perjalanan
                </span>
            );
        case 'ditugaskan':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Ditugaskan
                </span>
            );
        case 'dijadwal_ulang':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Dijadwal Ulang
                </span>
            );
        case 'dibatalkan':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Dibatalkan
                </span>
            );
        case 'dijadwalkan':
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Calculate active filters count (excluding search)
    const activeFilterCount = [tanggal, technicianId, status].filter(Boolean).length;

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/schedules',
            { search, tanggal, technician_id: technicianId, status },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setTanggal('');
        setTechnicianId('');
        setStatus('');
        router.get('/schedules', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, code: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jadwal "${code}"?`)) {
            router.delete(`/schedules/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Jadwal Pekerjaan" />

            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-display-sm font-bold text-ink truncate">Jadwal Pekerjaan</h1>
                        <p className="text-xs sm:text-body-sm text-mute mt-0.5 sm:mt-1 hidden sm:block">
                            Kelola dan pantau penugasan jadwal teknisi lapangan.
                        </p>
                    </div>
                    <Link href="/schedules/create" className="shrink-0">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 rounded-xl h-9 sm:h-10 px-3 sm:px-4 shadow-xs">
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Buat Jadwal<span className="hidden sm:inline"> Baru</span></span>
                        </Button>
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-3.5 sm:p-5">
                    {/* Mobile Inline Search + Filter Button Bar */}
                    <div className="block sm:hidden">
                        <form onSubmit={handleFilter} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                                <Input
                                    type="text"
                                    placeholder="Cari kode, customer, lokasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-10 text-xs rounded-xl bg-slate-50/70 border-slate-200 focus:bg-white"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-medium shrink-0 transition-colors ${
                                    isMobileFilterOpen || activeFilterCount > 0
                                        ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                        isMobileFilterOpen || activeFilterCount > 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-white'
                                    }`}>
                                        {activeFilterCount}
                                    </span>
                                )}
                                {isMobileFilterOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                )}
                            </Button>
                        </form>

                        {/* Collapsible Mobile Filter Details */}
                        {isMobileFilterOpen && (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tanggal</label>
                                        <Input
                                            type="date"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            className="text-xs h-9 rounded-xl bg-slate-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Teknisi</label>
                                        <select
                                            value={technicianId}
                                            onChange={(e) => setTechnicianId(e.target.value)}
                                            className="h-9 px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
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
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="h-9 px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
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
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            handleFilter();
                                            setIsMobileFilterOpen(false);
                                        }}
                                        className="h-9 flex-1 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl"
                                    >
                                        Terapkan Filter
                                    </Button>
                                    {(search || tanggal || technicianId || status) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-9 px-3 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
                                            onClick={() => {
                                                handleReset();
                                                setIsMobileFilterOpen(false);
                                            }}
                                        >
                                            <X className="w-3.5 h-3.5 mr-1" />
                                            Reset
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Filter Form */}
                    <form onSubmit={handleFilter} className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari kode, customer, lokasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-body-sm rounded-xl"
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="text-body-sm rounded-xl"
                            />
                        </div>

                        <div>
                            <select
                                value={technicianId}
                                onChange={(e) => setTechnicianId(e.target.value)}
                                className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
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
                                className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
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

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="outline" className="text-body-sm-strong w-full rounded-xl">
                                Filter
                            </Button>
                            {(search || tanggal || technicianId || status) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-body-sm text-mute rounded-xl"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Mobile Schedule Cards Layout (< 640px) */}
                <div className="block sm:hidden space-y-3">
                    {schedules.data && schedules.data.length > 0 ? (
                        schedules.data.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                            >
                                {/* Header Card: Kode Jadwal di kiri, Badge Status & Prioritas di kanan */}
                                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                    <Link
                                        href={`/schedules/${schedule.id}`}
                                        className="font-mono text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors"
                                    >
                                        {schedule.schedule_code}
                                    </Link>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <PriorityBadge prioritas={schedule.prioritas} />
                                        <StatusBadge status={schedule.status} />
                                    </div>
                                </div>

                                {/* Body Card: Nama Customer, Lokasi, dan Jenis Layanan */}
                                <div className="space-y-1.5">
                                    <div className="font-semibold text-sm text-slate-900">
                                        {schedule.customer?.company_name || '-'}
                                    </div>
                                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2 leading-relaxed">{schedule.lokasi}</span>
                                    </div>
                                    <div className="pt-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                                            {schedule.jenis_layanan}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Card: Tanggal & Waktu, Teknisi, dan Quick Actions */}
                                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{schedule.tanggal}</span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500 font-normal">{schedule.jam_mulai} - {schedule.jam_selesai}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 truncate">
                                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">
                                                {schedule.technician?.name || <span className="italic text-slate-400">Belum ditugaskan</span>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link href={`/schedules/${schedule.id}`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Link href={`/schedules/${schedule.id}/edit`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                                            onClick={() => handleDelete(schedule.id, schedule.schedule_code)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-slate-500 text-xs">
                            Tidak ada jadwal pekerjaan yang ditemukan.
                        </div>
                    )}

                    {/* Mobile Pagination */}
                    {schedules.links && schedules.links.length > 3 && (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center gap-3 text-xs shadow-2xs">
                            <div className="text-slate-500">
                                Menampilkan {schedules.data.length} dari {schedules.total} jadwal
                            </div>
                            <div className="flex items-center flex-wrap justify-center gap-1">
                                {schedules.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded-lg border text-xs font-medium bg-slate-50 text-slate-400 border-slate-200/60 opacity-60"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Table (>= 640px) */}
                <div className="hidden sm:block bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
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

