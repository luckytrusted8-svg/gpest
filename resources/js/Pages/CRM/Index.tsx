import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { useState } from 'react';
import { Plus, LayoutGrid, List, Phone, User, Calendar, Building2, MoreVertical, Search } from 'lucide-react';

interface Lead {
    id: number;
    lead_id: string;
    nama_perusahaan: string;
    nama_pic: string;
    telepon: string;
    sumber_lead: string;
    status: string;
    assigned_sales: { id: number; name: string } | null;
    created_at: string;
}

interface Props {
    leads: Lead[];
    leadsByStatus: Record<string, Lead[]>;
    salesUsers: { id: number; name: string }[];
    filters: { search?: string; status?: string; sumber?: string; sales_id?: string };
}

const STATUSES = [
    { key: 'baru', label: 'Baru', bg: 'bg-canvas-soft-2', text: 'text-body-text', border: 'border-hairline' },
    { key: 'dihubungi', label: 'Dihubungi', bg: 'bg-[#7928ca]/10', text: 'text-[#7928ca]', border: 'border-[#7928ca]/20' },
    { key: 'survey', label: 'Survey', bg: 'bg-[#7928ca]/10', text: 'text-[#7928ca]', border: 'border-[#7928ca]/20' },
    { key: 'quotation', label: 'Quotation', bg: 'bg-[#f5a623]/10', text: 'text-[#ab570a]', border: 'border-[#f5a623]/20' },
    { key: 'negosiasi', label: 'Negosiasi', bg: 'bg-[#f5a623]/10', text: 'text-[#ab570a]', border: 'border-[#f5a623]/20' },
    { key: 'menang', label: 'Menang', bg: 'bg-[#0070f3]/10', text: 'text-[#0070f3]', border: 'border-[#0070f3]/20' },
    { key: 'kalah', label: 'Kalah', bg: 'bg-[#ee0000]/10', text: 'text-[#ee0000]', border: 'border-[#ee0000]/20' },
];

const StatusBadge = ({ status }: { status: string }) => {
    const s = STATUSES.find((x) => x.key === status);
    if (!s) return <span className="px-2 py-0.5 text-xs rounded-full bg-canvas-soft-2 text-body-text border border-hairline">{status}</span>;
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.bg} ${s.text}`}>{s.label}</span>;
};

const SumberBadge = ({ sumber }: { sumber: string }) => {
    const map: Record<string, string> = {
        telepon: 'bg-[#7928ca]/10 text-[#7928ca]',
        website: 'bg-[#0070f3]/10 text-[#0070f3]',
        referral: 'bg-[#00b8a9]/10 text-[#00b8a9]',
        media_sosial: 'bg-[#f5a623]/10 text-[#ab570a]',
        walk_in: 'bg-canvas-soft-2 text-body-text border border-hairline',
        lainnya: 'bg-canvas-soft-2 text-body-text border border-hairline',
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${map[sumber] ?? map.lainnya}`}>{sumber.replace('_', ' ')}</span>;
};

const LeadCard = ({ lead }: { lead: Lead }) => (
    <Link href={`/crm/${lead.id}`} className="block bg-canvas border border-hairline rounded-lg p-3 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-mute" />
                <span className="text-body-sm font-semibold text-ink group-hover:text-link">{lead.nama_perusahaan}</span>
            </div>
            <span className="text-[10px] font-mono text-mute">{lead.lead_id}</span>
        </div>
        <div className="space-y-1.5 text-xs text-mute">
            <div className="flex items-center gap-1.5"><User className="w-3 h-3" />{lead.nama_pic}</div>
            <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{lead.telepon}</div>
        </div>
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-hairline">
            <SumberBadge sumber={lead.sumber_lead} />
            {lead.assigned_sales && <span className="text-[10px] text-mute">{lead.assigned_sales.name}</span>}
        </div>
    </Link>
);

export default function Index({ leads, leadsByStatus, salesUsers, filters }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const [view, setView] = useState<'kanban' | 'table'>('kanban');
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [sumberFilter, setSumberFilter] = useState(filters.sumber ?? '');
    const [salesFilter, setSalesFilter] = useState(filters.sales_id ?? '');

    const applyFilter = () => {
        router.get('/crm', { search, status: statusFilter, sumber: sumberFilter, sales_id: salesFilter }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setStatusFilter(''); setSumberFilter(''); setSalesFilter('');
        router.get('/crm', {}, { preserveState: true });
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    return (
        <AppLayout>
            <Head title="CRM - Leads" />
            <div className="space-y-4">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm">{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm">{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">CRM Leads</h1>
                        <p className="text-body-sm text-mute mt-0.5">{leads.length} total lead.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex border border-hairline rounded-md overflow-hidden">
                            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${view === 'kanban' ? 'bg-primary text-on-primary' : 'bg-canvas text-body-text hover:bg-canvas-soft'}`}><LayoutGrid className="w-3.5 h-3.5" />Kanban</button>
                            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${view === 'table' ? 'bg-primary text-on-primary' : 'bg-canvas text-body-text hover:bg-canvas-soft'}`}><List className="w-3.5 h-3.5" />Tabel</button>
                        </div>
                        <Link href="/crm/create"><Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2"><Plus className="w-4 h-4" />Tambah Lead</Button></Link>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFilter()} placeholder="Cari nama / PIC..." className="w-full h-9 pl-8 pr-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setTimeout(applyFilter, 0); }} className="h-9 rounded-md border border-hairline bg-canvas px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">Semua Status</option>
                            {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                        <select value={sumberFilter} onChange={(e) => { setSumberFilter(e.target.value); setTimeout(applyFilter, 0); }} className="h-9 rounded-md border border-hairline bg-canvas px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">Semua Sumber</option>
                            {['telepon', 'website', 'referral', 'media_sosial', 'walk_in', 'lainnya'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                        <select value={salesFilter} onChange={(e) => { setSalesFilter(e.target.value); setTimeout(applyFilter, 0); }} className="h-9 rounded-md border border-hairline bg-canvas px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">Semua Sales</option>
                            {salesUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <button onClick={clearFilters} className="text-xs text-mute hover:text-ink underline">Reset</button>
                    </div>
                </div>

                {view === 'kanban' ? (
                    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px]">
                        {STATUSES.map((s) => (
                            <div key={s.key} className="min-w-[260px] max-w-[260px] bg-canvas-soft/50 border border-hairline rounded-lg flex flex-col">
                                <div className="px-3 py-2.5 border-b border-hairline flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${s.bg}`} />
                                        <span className="text-body-sm-strong text-ink">{s.label}</span>
                                    </div>
                                    <span className="text-xs text-mute bg-canvas-soft-2 px-2 py-0.5 rounded-full">{(leadsByStatus[s.key] ?? []).length}</span>
                                </div>
                                <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[calc(500px-60px)]">
                                    {(leadsByStatus[s.key] ?? []).map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-x-auto">
                        <table className="w-full text-body-sm">
                            <thead><tr className="border-b border-hairline">
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Nama Perusahaan</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">PIC</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Telepon</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Sumber</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Status</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Sales</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Tanggal</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                            </tr></thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                        <td className="py-3 px-4"><Link href={`/crm/${lead.id}`} className="text-link font-medium hover:underline">{lead.nama_perusahaan}</Link><div className="text-xs text-mute font-mono">{lead.lead_id}</div></td>
                                        <td className="py-3 px-4">{lead.nama_pic}</td>
                                        <td className="py-3 px-4 text-xs">{lead.telepon}</td>
                                        <td className="py-3 px-4"><SumberBadge sumber={lead.sumber_lead} /></td>
                                        <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
                                        <td className="py-3 px-4 text-xs">{lead.assigned_sales?.name ?? '-'}</td>
                                        <td className="py-3 px-4 text-xs text-mute">{formatDate(lead.created_at)}</td>
                                        <td className="py-3 px-4"><Link href={`/crm/${lead.id}`} className="text-link text-xs hover:underline">Detail</Link></td>
                                    </tr>
                                ))}
                                {leads.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-mute text-body-sm">Tidak ada lead ditemukan.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
