import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { Search, Eye, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface CustomerRequestItem {
    id: number;
    request_number: string;
    customer: { id: number; company_name: string } | null;
    jenis_layanan: string;
    prioritas: string;
    deskripsi: string;
    tanggal_permintaan: string | null;
    status: string;
    created_at: string;
}

interface Customer { id: number; company_name: string; }

interface Props {
    requests?: { data: CustomerRequestItem[]; current_page: number; last_page: number; per_page: number; total: number };
    customers?: Customer[];
    filters?: Record<string, string>;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        baru: { label: 'Baru', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        ditinjau: { label: 'Ditinjau', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        dijadwalkan: { label: 'Dijadwalkan', cls: 'bg-[#7928ca]/15 text-[#7928ca]' },
        diproses: { label: 'Diproses', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        selesai: { label: 'Selesai', cls: 'bg-[#16a34a]/15 text-[#16a34a]' },
        ditolak: { label: 'Ditolak', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const PriorityBadge = ({ prioritas }: { prioritas: string }) => {
    const map: Record<string, { label: string; cls: string; isAlert?: boolean }> = {
        rendah: { label: 'Rendah', cls: 'text-mute' },
        sedang: { label: 'Sedang', cls: 'text-ink font-medium' },
        tinggi: { label: 'Tinggi', cls: 'text-[#ab570a] font-semibold' },
        darurat: { label: 'Darurat', cls: 'text-[#ee0000] font-bold', isAlert: true },
    };
    const { label, cls, isAlert } = map[prioritas] ?? { label: prioritas, cls: 'text-ink' };
    return (
        <span className={`text-xs inline-flex items-center gap-1 ${cls}`}>
            {isAlert && <AlertTriangle className="w-3 h-3 text-[#ee0000] animate-pulse" />}
            {label}
        </span>
    );
};

export default function Index({ requests, filters = {} }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [prioritas, setPrioritas] = useState(filters.prioritas ?? '');

    const applyFilter = () => {
        router.get('/customer-requests', { search, status, prioritas }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setStatus(''); setPrioritas('');
        router.get('/customer-requests', {}, { preserveState: true });
    };

    const handleDelete = (id: number, nomor: string) => {
        if (!confirm(`Hapus permintaan ${nomor}?`)) return;
        router.delete(`/customer-requests/${id}`);
    };

    const dataList = requests?.data ?? [];
    const totalCount = requests?.total ?? 0;
    const lastPage = requests?.last_page ?? 1;
    const currentPage = requests?.current_page ?? 1;

    return (
        <AppLayout>
            <Head title="Permintaan & Komplain Klien" />
            <div className="space-y-4">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-2xl text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Permintaan & Komplain Klien</h1>
                        <p className="text-body-sm text-mute mt-0.5">{totalCount} permintaan terdaftar dari Customer Portal.</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                placeholder="Cari nomor request / customer..."
                                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Status</option>
                            {['baru', 'ditinjau', 'dijadwalkan', 'diproses', 'selesai', 'ditolak'].map((s) => (
                                <option key={s} value={s}>{s.toUpperCase()}</option>
                            ))}
                        </select>
                        <select
                            value={prioritas}
                            onChange={(e) => { setPrioritas(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Prioritas</option>
                            {['rendah', 'sedang', 'tinggi', 'darurat'].map((p) => (
                                <option key={p} value={p}>{p.toUpperCase()}</option>
                            ))}
                        </select>
                        <button onClick={clearFilters} className="text-xs text-mute hover:text-ink underline text-left sm:text-center self-center">
                            Reset Filter
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-x-auto shadow-2xs">
                    <table className="w-full text-body-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-canvas-soft">
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Nomor</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Customer</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Layanan Requested</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Prioritas</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Waktu Kirim</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Status</th>
                                <th className="text-right py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((req) => (
                                <tr key={req.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                    <td className="py-3 px-4">
                                        <Link href={`/customer-requests/${req.id}`} className="text-link font-medium hover:underline font-mono text-xs">
                                            {req.request_number}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">{req.customer?.company_name ?? '-'}</td>
                                    <td className="py-3 px-4 font-medium text-ink">{req.jenis_layanan}</td>
                                    <td className="py-3 px-4"><PriorityBadge prioritas={req.prioritas} /></td>
                                    <td className="py-3 px-4 text-xs text-mute">
                                        {new Date(req.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/customer-requests/${req.id}`} className="p-1 rounded hover:bg-canvas-soft">
                                                <Eye className="w-3.5 h-3.5 text-mute" />
                                            </Link>
                                            <button onClick={() => handleDelete(req.id, req.request_number)} className="p-1 rounded hover:bg-canvas-soft text-error">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-mute text-body-sm">
                                        Belum ada permintaan dari pelanggan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {lastPage > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: lastPage }, (_, i) => (
                            <Link
                                key={i + 1}
                                href={`/customer-requests?page=${i + 1}&search=${search}&status=${status}&prioritas=${prioritas}`}
                                className={`px-3 py-1 rounded-md text-xs font-medium border ${currentPage === i + 1 ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`}
                            >
                                {i + 1}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
