import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Download, FileSpreadsheet } from 'lucide-react';

interface Invoice {
    id: number;
    nomor_invoice: string;
    customer: { id: number; company_name: string } | null;
    tanggal_invoice: string;
    jatuh_tempo: string;
    total: number;
    status_pembayaran: string;
    creator: { id: number; name: string } | null;
    items: { id: number }[];
}

interface Customer {
    id: number;
    company_name: string;
}

interface Props {
    invoices?: { data: Invoice[]; current_page: number; last_page: number; per_page: number; total: number };
    customers?: Customer[];
    filters?: Record<string, string>;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft: { label: 'Draft', cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        terbit: { label: 'Terbit', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        dikirim: { label: 'Dikirim', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        dibayar_sebagian: { label: 'Dibayar Sebagian', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        lunas: { label: 'Lunas', cls: 'bg-[#16a34a]/15 text-[#16a34a]' },
        jatuh_tempo: { label: 'Jatuh Tempo', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
        batal: { label: 'Batal', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const fmt = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

export default function Index({ invoices, customers = [], filters = {} }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [customerId, setCustomerId] = useState(filters.customer_id ?? '');

    const applyFilter = () => {
        router.get('/invoices', { search, status, customer_id: customerId }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setStatus(''); setCustomerId('');
        router.get('/invoices', {}, { preserveState: true });
    };

    const handleDelete = (id: number, nomor: string) => {
        if (!confirm(`Hapus invoice ${nomor}?`)) return;
        router.delete(`/invoices/${id}`);
    };

    const dataList = invoices?.data ?? [];
    const totalCount = invoices?.total ?? 0;
    const lastPage = invoices?.last_page ?? 1;
    const currentPage = invoices?.current_page ?? 1;

    return (
        <AppLayout>
            <Head title="Invoice & Penagihan" />
            <div className="space-y-4">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm">{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm">{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Invoice & Penagihan</h1>
                        <p className="text-body-sm text-mute mt-0.5">{totalCount} invoice terdaftar.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="/invoices/export-csv" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2 rounded-xl">
                                <FileSpreadsheet className="w-4 h-4" />Ekspor CSV
                            </Button>
                        </a>
                        <Link href="/invoices/create">
                            <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 rounded-xl">
                                <Plus className="w-4 h-4" />Buat Invoice
                            </Button>
                        </Link>
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
                                placeholder="Cari nomor invoice / customer..."
                                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Status Pembayaran</option>
                            {['draft', 'terbit', 'dikirim', 'dibayar_sebagian', 'lunas', 'jatuh_tempo', 'batal'].map((s) => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <select
                            value={customerId}
                            onChange={(e) => { setCustomerId(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Customer</option>
                            {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
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
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Tanggal</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Jatuh Tempo</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Total</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Status</th>
                                <th className="text-right py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((inv) => (
                                <tr key={inv.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                    <td className="py-3 px-4">
                                        <Link href={`/invoices/${inv.id}`} className="text-link font-medium hover:underline font-mono text-xs">
                                            {inv.nomor_invoice}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">{inv.customer?.company_name ?? '-'}</td>
                                    <td className="py-3 px-4 text-xs text-mute">
                                        {inv.tanggal_invoice ? new Date(inv.tanggal_invoice).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-mute">
                                        {inv.jatuh_tempo ? new Date(inv.jatuh_tempo).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-ink">{fmt(inv.total)}</td>
                                    <td className="py-3 px-4"><StatusBadge status={inv.status_pembayaran} /></td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/invoices/${inv.id}`} className="p-1 rounded hover:bg-canvas-soft">
                                                <Eye className="w-3.5 h-3.5 text-mute" />
                                            </Link>
                                            <Link href={`/invoices/${inv.id}/edit`} className="p-1 rounded hover:bg-canvas-soft">
                                                <Edit className="w-3.5 h-3.5 text-mute" />
                                            </Link>
                                            <button onClick={() => handleDelete(inv.id, inv.nomor_invoice)} className="p-1 rounded hover:bg-canvas-soft text-error">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-mute text-body-sm">
                                        Belum ada invoice.
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
                                href={`/invoices?page=${i + 1}&search=${search}&status=${status}&customer_id=${customerId}`}
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
