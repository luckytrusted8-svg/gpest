import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, FileText, User, Calendar, CheckCircle } from 'lucide-react';
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
    const map: Record<string, { label: string; cls: string }> = {
        draft:      { label: 'Draft',     cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        dikirim:    { label: 'Dikirim',   cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        disetujui:  { label: 'Disetujui', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        revisi:     { label: 'Revisi',    cls: 'bg-[#f5a623]/20 text-[#c05621]' },
        selesai:    { label: 'Selesai',   cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
};

export default function Index({ workReports, technicians, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (overrides: object = {}) => {
        router.get('/work-reports', { search, tanggal, technician_id: technicianId, status, ...overrides }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch(''); setTanggal(''); setTechnicianId(''); setStatus('');
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

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Laporan Kerja (Work Report)</h1>
                        <p className="text-body-sm text-mute mt-1">Dokumentasi pekerjaan lapangan teknisi pest control.</p>
                    </div>
                    <Link href="/work-reports/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Buat Laporan Baru
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari nomor laporan, layanan, customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Input
                            type="date"
                            value={tanggal}
                            onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }}
                            className="w-full sm:w-40"
                        />
                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-44"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-36"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="dikirim">Dikirim</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="revisi">Revisi</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong">Filter</Button>
                        <Button type="button" variant="ghost" onClick={resetFilters} className="text-body-sm text-mute hover:text-ink">Reset</Button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
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
