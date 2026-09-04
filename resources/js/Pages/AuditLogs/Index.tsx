import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';

interface AuditLogItem {
    id: number;
    user_name: string | null;
    action: string;
    module: string;
    description: string | null;
    ip_address: string | null;
    created_at: string;
}

interface Props {
    logs?: { data: AuditLogItem[]; current_page: number; last_page: number; per_page: number; total: number };
    modules?: string[];
    filters?: Record<string, string>;
}

export default function Index({ logs, modules = [], filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [moduleFilter, setModuleFilter] = useState(filters.module ?? '');

    const applyFilter = () => {
        router.get('/audit-logs', { search, module: moduleFilter }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setModuleFilter('');
        router.get('/audit-logs', {}, { preserveState: true });
    };

    const dataList = logs?.data ?? [];
    const totalCount = logs?.total ?? 0;
    const lastPage = logs?.last_page ?? 1;
    const currentPage = logs?.current_page ?? 1;

    return (
        <AppLayout>
            <Head title="Audit Log System" />
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-primary" /> Audit Log System
                        </h1>
                        <p className="text-body-sm text-mute mt-0.5">{totalCount} riwayat aktivitas pengguna tercatat.</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                placeholder="Cari user / aksi / deskripsi..."
                                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                        <select
                            value={moduleFilter}
                            onChange={(e) => { setModuleFilter(e.target.value); setTimeout(applyFilter, 0); }}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="">Semua Modul System</option>
                            {modules.map((m) => <option key={m} value={m}>{m}</option>)}
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
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Waktu</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Pengguna</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Modul</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Deskripsi</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((log) => (
                                <tr key={log.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                    <td className="py-3 px-4 text-xs font-mono text-mute">
                                        {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-ink">{log.user_name ?? 'System'}</td>
                                    <td className="py-3 px-4"><span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{log.module}</span></td>
                                    <td className="py-3 px-4 font-medium text-ink">{log.action}</td>
                                    <td className="py-3 px-4 text-xs text-mute">{log.description ?? '-'}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-mute">{log.ip_address ?? '-'}</td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-mute text-body-sm">
                                        Belum ada data audit log.
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
                                href={`/audit-logs?page=${i + 1}&search=${search}&module=${moduleFilter}`}
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
