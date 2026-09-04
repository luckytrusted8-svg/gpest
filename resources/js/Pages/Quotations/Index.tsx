import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { Plus, Search, Eye, Edit, Copy } from 'lucide-react';

interface Quotation {
    id: number;
    nomor_quotation: string;
    customer: { id: number; company_name: string } | null;
    berlaku_hingga: string;
    total: number;
    status: string;
    creator: { id: number; name: string } | null;
    items: { id: number }[];
    created_at: string;
}

interface Customer {
    id: number;
    company_name: string;
}

interface Props {
    quotations?: { data: Quotation[]; current_page: number; last_page: number; per_page: number; total: number };
    customers?: Customer[];
    filters?: Record<string, string>;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft: { label: 'Draft', cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        dikirim: { label: 'Dikirim', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        dilihat: { label: 'Dilihat', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        diterima: { label: 'Diterima', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        ditolak: { label: 'Ditolak', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
        kadaluarsa: { label: 'Kadaluarsa', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const fmt = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

export default function Index({ quotations, customers = [], filters = {} }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [customerId, setCustomerId] = useState(filters.customer_id ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    const applyFilter = () => {
        router.get('/quotations', { search, status, customer_id: customerId, date_from: dateFrom, date_to: dateTo }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setStatus(''); setCustomerId(''); setDateFrom(''); setDateTo('');
        router.get('/quotations', {}, { preserveState: true });
    };

    const handleDuplikat = (id: number) => {
        if (!confirm('Buat salinan quotation ini?')) return;
        router.post(`/quotations/${id}/duplikat`);
    };

    const dataList = quotations?.data ?? [];
    const totalCount = quotations?.total ?? 0;
    const lastPage = quotations?.last_page ?? 1;
    const currentPage = quotations?.current_page ?? 1;

    return (
        <AppLayout>
            <Head title="Penawaran (Quotation)" />
            <div className="space-y-4">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm">{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm">{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Penawaran (Quotation)</h1>
                        <p className="text-body-sm text-mute mt-0.5">{totalCount} quotation.</p>
                    </div>
                    <Link href="/quotations/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 rounded-xl">
                            <Plus className="w-4 h-4" />Buat Quotation
                        </Button>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                placeholder="Cari nomor / customer..."
                                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Status</option>
                            {['draft', 'dikirim', 'dilihat', 'diterima', 'ditolak', 'kadaluarsa'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                            value={customerId}
                            onChange={(e) => { setCustomerId(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Customer</option>
                            {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                        </select>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            placeholder="Dari tanggal"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            placeholder="Sampai tanggal"
                        />
                        <button onClick={clearFilters} className="text-xs text-mute hover:text-ink underline">Reset</button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-x-auto">
                    <table className="w-full text-body-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-canvas-soft">
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Nomor</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Customer</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Berlaku Hingga</th>
                                <th className="text-center py-3 px-4 text-body-sm-strong text-ink font-medium">Item</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Total</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Status</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Dibuat Oleh</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((q) => (
                                <tr key={q.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                    <td className="py-3 px-4">
                                        <Link href={`/quotations/${q.id}`} className="text-link font-medium hover:underline font-mono text-xs">
                                            {q.nomor_quotation || '-'}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{q.customer?.company_name ?? '-'}</td>
                                    <td className="py-3 px-4 text-xs text-mute">
                                        {q.berlaku_hingga ? new Date(q.berlaku_hingga).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-mute text-center">{q.items?.length ?? 0}</td>
                                    <td className="py-3 px-4 text-sm font-medium">{fmt(q.total)}</td>
                                    <td className="py-3 px-4"><StatusBadge status={q.status} /></td>
                                    <td className="py-3 px-4 text-xs text-mute">{q.creator?.name ?? '-'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/quotations/${q.id}`} className="p-1 rounded hover:bg-canvas-soft">
                                                <Eye className="w-3.5 h-3.5 text-mute" />
                                            </Link>
                                            {q.status === 'draft' && (
                                                <Link href={`/quotations/${q.id}/edit`} className="p-1 rounded hover:bg-canvas-soft">
                                                    <Edit className="w-3.5 h-3.5 text-mute" />
                                                </Link>
                                            )}
                                            <button onClick={() => handleDuplikat(q.id)} className="p-1 rounded hover:bg-canvas-soft">
                                                <Copy className="w-3.5 h-3.5 text-mute" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-mute text-body-sm">
                                        Tidak ada quotation.
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
                                href={`/quotations?page=${i + 1}&search=${search}&status=${status}&customer_id=${customerId}&date_from=${dateFrom}&date_to=${dateTo}`}
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
