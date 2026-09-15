import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, FileText, User, Calendar, Clock, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Technician {
    id: number;
    name: string;
}

interface WorkReport {
    id: number;
    nomor_laporan: string;
    customer?: Customer;
    technician?: Technician;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string | null;
    jenis_layanan: string;
    status: 'draft' | 'dikirim' | 'disetujui' | 'revisi' | 'selesai';
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReports {
    data: WorkReport[];
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    workReports: PaginatedReports;
    technicians: Technician[];
    filters: { search?: string; tanggal?: string; technician_id?: string; status?: string };
}

export const StatusBadge = ({ status }: { status: WorkReport['status'] }) => {
    switch (status) {
        case 'selesai':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Selesai
                </span>
            );
        case 'disetujui':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Disetujui
                </span>
            );
        case 'dikirim':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Dikirim
                </span>
            );
        case 'revisi':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Revisi
                </span>
            );
        case 'draft':
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    Draft
                </span>
            );
    }
};

export default function Index({ workReports, technicians, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const activeFilterCount = [tanggal, technicianId, status].filter(Boolean).length;

    const applyFilters = (overrides: object = {}) => {
        router.get('/work-reports', { search, tanggal, technician_id: technicianId, status, ...overrides }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setTanggal('');
        setTechnicianId('');
        setStatus('');
        router.get('/work-reports', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, nomor: string) => {
        if (confirm(`Hapus laporan kerja "${nomor}"?`)) {
            router.delete(`/work-reports/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Kerja" />

            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-display-sm font-bold text-ink truncate">Laporan Kerja</h1>
                        <p className="text-xs sm:text-body-sm text-mute mt-0.5 sm:mt-1 hidden sm:block">
                            Dokumentasi pekerjaan lapangan teknisi pest control.
                        </p>
                    </div>
                    <Link href="/work-reports/create" className="shrink-0">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 rounded-xl h-9 sm:h-10 px-3 sm:px-4 shadow-xs">
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Buat Laporan<span className="hidden sm:inline"> Baru</span></span>
                        </Button>
                    </Link>
                </div>

                {/* Filters Section */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-3.5 sm:p-5">
                    {/* Mobile Inline Search + Filter Button Bar */}
                    <div className="block sm:hidden">
                        <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                                <Input
                                    type="text"
                                    placeholder="Cari nomor laporan, layanan..."
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
                                            onChange={(e) => {
                                                setTanggal(e.target.value);
                                                applyFilters({ tanggal: e.target.value });
                                            }}
                                            className="text-xs h-9 rounded-xl bg-slate-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Teknisi</label>
                                        <select
                                            value={technicianId}
                                            onChange={(e) => {
                                                setTechnicianId(e.target.value);
                                                applyFilters({ technician_id: e.target.value });
                                            }}
                                            className="h-9 px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
                                        >
                                            <option value="">Semua Teknisi</option>
                                            {technicians.map((t) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                                applyFilters({ status: e.target.value });
                                            }}
                                            className="h-9 px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="draft">Draft</option>
                                            <option value="dikirim">Dikirim</option>
                                            <option value="disetujui">Disetujui</option>
                                            <option value="revisi">Revisi</option>
                                            <option value="selesai">Selesai</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            applyFilters();
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
                                                resetFilters();
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
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="hidden sm:flex flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari nomor laporan, layanan, customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 rounded-xl"
                            />
                        </div>
                        <Input
                            type="date"
                            value={tanggal}
                            onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }}
                            className="w-40 rounded-xl"
                        />
                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-44"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900 w-36"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="dikirim">Dikirim</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="revisi">Revisi</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong rounded-xl">Filter</Button>
                        <Button type="button" variant="ghost" onClick={resetFilters} className="text-body-sm text-mute hover:text-ink rounded-xl">Reset</Button>
                    </form>
                </div>

                {/* Mobile Work Report Cards Layout (< 640px) */}
                <div className="block sm:hidden space-y-3">
                    {workReports.data && workReports.data.length > 0 ? (
                        workReports.data.map((wr) => (
                            <div
                                key={wr.id}
                                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                            >
                                {/* Header Card: Nomor Laporan di kiri, Status di kanan */}
                                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                    <Link
                                        href={`/work-reports/${wr.id}`}
                                        className="font-mono text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{wr.nomor_laporan}</span>
                                    </Link>
                                    <StatusBadge status={wr.status} />
                                </div>

                                {/* Body Card: Customer & Jenis Layanan */}
                                <div className="space-y-1.5">
                                    <div className="font-semibold text-sm text-slate-900">
                                        {wr.customer?.company_name ?? '-'}
                                    </div>
                                    <div className="pt-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                                            {wr.jenis_layanan}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Card: Tanggal & Waktu, Teknisi, dan Quick Actions */}
                                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{wr.tanggal}</span>
                                            {wr.jam_mulai && (
                                                <>
                                                    <span className="text-slate-400">•</span>
                                                    <span className="text-slate-500 font-normal">{wr.jam_mulai}{wr.jam_selesai ? ` - ${wr.jam_selesai}` : ''}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 truncate">
                                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">
                                                {wr.technician?.name ?? <span className="italic text-slate-400">Belum ditugaskan</span>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link href={`/work-reports/${wr.id}`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        {(wr.status === 'draft' || wr.status === 'revisi') && (
                                            <Link href={`/work-reports/${wr.id}/edit`}>
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                                            onClick={() => handleDelete(wr.id, wr.nomor_laporan)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-slate-500 text-xs">
                            Belum ada laporan kerja yang tersimpan.
                        </div>
                    )}

                    {/* Mobile Pagination */}
                    {workReports.links && workReports.links.length > 3 && (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center gap-3 text-xs shadow-2xs">
                            <div className="text-slate-500">
                                Total {workReports.total} laporan
                            </div>
                            <div className="flex items-center flex-wrap justify-center gap-1">
                                {workReports.links.map((link, idx) => (
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
                                    <th className="py-3 px-4 font-semibold">Nomor Laporan</th>
                                    <th className="py-3 px-4 font-semibold">Customer</th>
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                                    <th className="py-3 px-4 font-semibold">Jenis Layanan</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {workReports.data.length > 0 ? (
                                    workReports.data.map((wr) => (
                                        <tr key={wr.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <Link href={`/work-reports/${wr.id}`} className="font-mono font-medium text-link hover:underline flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    {wr.nomor_laporan}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4 font-medium">{wr.customer?.company_name ?? '-'}</td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-mute" />
                                                    {wr.technician?.name ?? '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute" />
                                                    {wr.tanggal}
                                                </div>
                                                <div className="text-xs text-mute mt-0.5">{wr.jam_mulai}{wr.jam_selesai ? ` - ${wr.jam_selesai}` : ''}</div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">{wr.jenis_layanan}</td>
                                            <td className="py-3 px-4"><StatusBadge status={wr.status} /></td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/work-reports/${wr.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    {(wr.status === 'draft' || wr.status === 'revisi') && (
                                                        <Link href={`/work-reports/${wr.id}/edit`}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(wr.id, wr.nomor_laporan)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada laporan kerja yang tersimpan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {workReports.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {workReports.total} laporan</div>
                            <div className="flex items-center gap-1">
                                {workReports.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${link.active ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
