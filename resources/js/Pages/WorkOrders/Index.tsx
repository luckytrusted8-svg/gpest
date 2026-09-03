import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { useState } from 'react';
import { ClipboardList, Plus, Search, Filter, CheckCircle2, Clock, AlertTriangle, UserCheck, Shield, Trash2, Edit } from 'lucide-react';

interface WorkOrder {
    id: number;
    wo_number: string;
    service_type: string;
    priority: string;
    status: string;
    created_at: string;
    customer?: { id: number; company_name: string };
    site?: { id: number; site_name: string };
    technician?: { id: number; name: string };
}

interface Props {
    workOrders: { data: WorkOrder[] };
    technicians: { id: number; name: string }[];
    statuses: string[];
    filters: { search?: string; status?: string; technician_id?: string };
}

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
    DRAFT: { label: 'DRAF', bg: 'bg-gray-100', text: 'text-gray-700' },
    ASSIGNED: { label: 'DITUGASKAN', bg: 'bg-blue-100', text: 'text-blue-800' },
    ON_THE_WAY: { label: 'DALAM PERJALANAN', bg: 'bg-purple-100', text: 'text-purple-800' },
    ARRIVED: { label: 'TIBA DI LOKASI', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    IN_PROGRESS: { label: 'SEDANG DIKERJAKAN', bg: 'bg-amber-100', text: 'text-amber-800' },
    COMPLETED: { label: 'SELESAI DIKERJAKAN', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    PENDING_REVIEW: { label: 'MENUNGGU REVIEW', bg: 'bg-orange-100', text: 'text-orange-800' },
    APPROVED: { label: 'DISETUJUI', bg: 'bg-emerald-600 text-white', text: 'text-white' },
    REJECTED: { label: 'DITOLAK (PERLU REVISI)', bg: 'bg-red-100', text: 'text-red-800' },
    CANCELLED: { label: 'DIBATALKAN', bg: 'bg-gray-200', text: 'text-gray-600' },
};

export default function WorkOrdersIndex({ workOrders, technicians, statuses, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id ?? '');

    const applyFilter = () => {
        router.get('/work-orders', { search, status, technician_id: technicianId }, { preserveState: true });
    };

    const handleDelete = (id: number, woNumber: string) => {
        if (confirm(`Hapus Work Order "${woNumber}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(`/work-orders/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Work Orders (Perintah Kerja)" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase">
                                Modul Work Order Enterprise
                            </span>
                        </div>
                        <h1 className="text-display-sm font-semibold text-ink mt-1">Work Orders (Perintah Kerja)</h1>
                        <p className="text-body-sm text-mute">Pusat instruksi pekerjaan teknisi, status eksekusi, & penugasan.</p>
                    </div>

                    <Link href="/work-orders/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Buat Work Order
                        </Button>
                    </Link>
                </div>

                {/* Filter */}
                <div className="bg-canvas border border-hairline rounded-md p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                placeholder="Cari WO / Pelanggan..."
                                className="pl-8 text-xs"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua Status WO</option>
                            {statuses.map((st) => (
                                <option key={st} value={st}>{st.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <Button onClick={applyFilter} variant="outline" className="text-xs">Filter</Button>
                            <button onClick={() => { setSearch(''); setStatus(''); setTechnicianId(''); router.get('/work-orders'); }} className="text-xs text-mute hover:text-ink underline">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* WO Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-xs overflow-x-auto">
                    <table className="w-full text-left text-body-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                <th className="py-3 px-4 font-semibold">No. WO & Layanan</th>
                                <th className="py-3 px-4 font-semibold">Pelanggan & Site</th>
                                <th className="py-3 px-4 font-semibold">Teknisi</th>
                                <th className="py-3 px-4 font-semibold">Prioritas</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline text-ink">
                            {workOrders.data.length > 0 ? (
                                workOrders.data.map((wo) => {
                                    const stBadge = STATUS_BADGES[wo.status] || { label: wo.status, bg: 'bg-gray-100', text: 'text-gray-700' };
                                    return (
                                        <tr key={wo.id} className="hover:bg-canvas-soft/50 transition">
                                            <td className="py-3 px-4">
                                                <Link href={`/work-orders/${wo.id}`} className="font-bold text-blue-600 hover:underline flex items-center gap-1.5">
                                                    <ClipboardList className="w-3.5 h-3.5" />
                                                    {wo.wo_number}
                                                </Link>
                                                <div className="text-xs text-mute mt-0.5">{wo.service_type}</div>
                                            </td>
                                            <td className="py-3 px-4 text-xs">
                                                <div className="font-semibold text-gray-900">{wo.customer?.company_name ?? '-'}</div>
                                                <div className="text-mute">{wo.site?.site_name ?? 'Site Utama'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-xs font-medium">
                                                {wo.technician ? (
                                                    <span className="flex items-center gap-1 text-gray-800">
                                                        <UserCheck className="w-3 h-3 text-emerald-600" />
                                                        {wo.technician.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 italic">Belum Ditugaskan</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                    wo.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                    wo.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {wo.priority}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${stBadge.bg} ${stBadge.text}`}>
                                                    {stBadge.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/work-orders/${wo.id}`}>
                                                        <Button variant="outline" size="sm" className="text-xs">
                                                            Detail WO
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/work-orders/${wo.id}/edit`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                                            title="Edit Work Order"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleDelete(wo.id, wo.wo_number)}
                                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Hapus Work Order"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-mute text-body-sm">
                                        Tidak ada Work Order ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
