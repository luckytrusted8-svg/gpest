import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Users, FileText, CalendarCheck, ClipboardList, UserCheck, UserPlus, 
    UserMinus, UserX, ArrowRight, Calendar, Clock, DollarSign, MessageSquare, 
    CreditCard, ShieldCheck, AlertCircle, ExternalLink, User 
} from 'lucide-react';

interface ScheduleItem {
    id: number;
    customer?: { id: number; company_name: string } | null;
    technician?: { id: number; nama: string; name?: string } | null;
    jam_mulai?: string;
    jam_selesai?: string;
    waktu_mulai?: string;
    waktu_selesai?: string;
    status: string;
}

interface RequestItem {
    id: number;
    request_number: string;
    jenis_layanan: string;
    prioritas: string;
    status: string;
    created_at: string;
    customer?: { id: number; company_name: string } | null;
}

interface InvoiceItem {
    id: number;
    nomor_invoice: string;
    total: number;
    jatuh_tempo: string;
    status_pembayaran: string;
    customer?: { id: number; company_name: string } | null;
}

interface AuditLogItem {
    id: number;
    module: string;
    action: string;
    description: string;
    created_at: string;
    user?: { id: number; name: string } | null;
}

interface Props {
    kpiData?: {
        totalCustomers: number;
        activeContracts: number;
        monthlyRevenue: number;
        pendingRequests: number;
    };
    todaySchedules?: ScheduleItem[];
    technicianCounts?: {
        online: number;
        working: number;
        completedToday: number;
        offline: number;
    };
    recentRequests?: RequestItem[];
    unpaidInvoices?: InvoiceItem[];
    recentAuditLogs?: AuditLogItem[];
}

const fmtRp = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

const KpiCard = ({ title, value, icon: Icon, href, subtitle }: { title: string; value: number | string; icon: React.ComponentType<{ className?: string }>; href?: string; subtitle?: string }) => {
    const card = (
        <div className="bg-canvas border border-hairline rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-mute">{title}</div>
                    <div className="text-2xl font-bold text-ink mt-1.5">{typeof value === 'number' ? value.toLocaleString('id-ID') : value}</div>
                    {subtitle && <div className="text-[11px] text-mute mt-1">{subtitle}</div>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{card}</Link>;
    }
    return card;
};

const getScheduleStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
        dijadwalkan: { label: 'Dijadwalkan', cls: 'bg-slate-100 text-slate-700 border border-slate-200' },
        ditugaskan: { label: 'Ditugaskan', cls: 'bg-slate-100 text-slate-700 border border-slate-200' },
        dalam_perjalanan: { label: 'Otw Lokasi', cls: 'bg-blue-100 text-blue-700' },
        tiba: { label: 'Tiba', cls: 'bg-purple-100 text-purple-700' },
        sedang_dikerjakan: { label: 'Proses Pengerjaan', cls: 'bg-amber-100 text-amber-700' },
        selesai: { label: 'Selesai', cls: 'bg-green-100 text-green-700' },
        dibatalkan: { label: 'Batal', cls: 'bg-red-100 text-red-700' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>;
};

export default function Dashboard({ kpiData, todaySchedules = [], technicianCounts, recentRequests = [], unpaidInvoices = [], recentAuditLogs = [] }: Props) {
    const kpis = [
        { title: 'Total Pelanggan', value: kpiData?.totalCustomers ?? 0, icon: Users, href: '/customers', subtitle: 'Pelanggan terdaftar' },
        { title: 'Kontrak Layanan Aktif', value: kpiData?.activeContracts ?? 0, icon: FileText, href: '/contracts', subtitle: 'Kontrak aktif berjalan' },
        { title: 'Omset Tagihan Bulan Ini', value: fmtRp(kpiData?.monthlyRevenue), icon: DollarSign, href: '/invoices', subtitle: 'Total diterbitkan bulan ini' },
        { title: 'Request / Komplain Masuk', value: kpiData?.pendingRequests ?? 0, icon: MessageSquare, href: '/customer-requests', subtitle: 'Perlu penanganan admin' },
    ];

    const techStatus = [
        { label: 'Aktif / Online', count: technicianCounts?.online ?? 0, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Sedang Bekerja', count: technicianCounts?.working ?? 0, icon: UserPlus, color: 'text-amber-600 bg-amber-50' },
        { label: 'Selesai Hari Ini', count: technicianCounts?.completedToday ?? 0, icon: UserMinus, color: 'text-blue-600 bg-blue-50' },
        { label: 'Offline / Absen', count: technicianCounts?.offline ?? 0, icon: UserX, color: 'text-rose-600 bg-rose-50' },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Real-Time G-PEST" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-hairline">
                    <div>
                        <h1 className="text-xl font-bold text-ink">Dashboard Operasional G-PEST</h1>
                        <p className="text-xs text-mute mt-0.5">Ringkasan statistik real-time, aktivitas pekerjaan teknisi, dan transaksi hari ini.</p>
                    </div>
                    <div className="text-xs text-mute font-mono bg-canvas border border-hairline px-3 py-1.5 rounded-md">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((item) => (
                        <KpiCard key={item.title} {...item} />
                    ))}
                </div>

                {/* Main Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2 Span) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Schedules */}
                        <div className="bg-canvas border border-hairline rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 bg-canvas-soft border-b border-hairline flex items-center justify-between">
                                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Jadwal Pekerjaan Hari Ini ({todaySchedules.length})
                                </h2>
                                <Link href="/schedules" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                    Kelola Jadwal <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-hairline">
                                {todaySchedules.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-canvas-soft/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-mono text-xs shrink-0">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-ink">
                                                    {item.customer?.company_name ?? 'Pelanggan Umum'}
                                                </div>
                                                <div className="text-xs text-mute flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Clock className="w-3 h-3 text-mute" />
                                                        {(item.jam_mulai || item.waktu_mulai || '00:00').slice(0, 5)} - {(item.jam_selesai || item.waktu_selesai || '00:00').slice(0, 5)}
                                                    </span>
                                                    {item.technician && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3 text-mute" />
                                                            Teknisi: {item.technician.name || item.technician.nama || 'Teknisi'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>{getScheduleStatusBadge(item.status)}</div>
                                    </div>
                                ))}
                                {todaySchedules.length === 0 && (
                                    <div className="p-8 text-center text-mute text-xs">
                                        Belum ada penugasan pekerjaan untuk hari ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Customer Requests */}
                        <div className="bg-canvas border border-hairline rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 bg-canvas-soft border-b border-hairline flex items-center justify-between">
                                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-amber-600" />
                                    Permintaan & Komplain Klien Terkini
                                </h2>
                                <Link href="/customer-requests" className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-medium">
                                    Lihat Semua Request <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-hairline">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="p-4 flex items-center justify-between hover:bg-canvas-soft/40 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-blue-600">{req.request_number}</span>
                                                <span className="text-xs font-semibold text-ink">{req.customer?.company_name ?? 'Pelanggan'}</span>
                                            </div>
                                            <div className="text-xs text-mute mt-1">
                                                Layanan: <span className="text-ink font-medium">{req.jenis_layanan}</span> • Prioritas: <span className="uppercase font-semibold text-slate-700">{req.prioritas}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-amber-100 text-amber-700">
                                                {req.status}
                                            </span>
                                            <Link href={`/customer-requests/${req.id}`} className="text-xs text-blue-600 hover:underline font-medium">
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {recentRequests.length === 0 && (
                                    <div className="p-8 text-center text-mute text-xs">
                                        Tidak ada permintaan/komplain baru dari pelanggan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Span) */}
                    <div className="space-y-6">
                        {/* Technician Status */}
                        <div className="bg-canvas border border-hairline rounded-xl shadow-sm p-5 space-y-4">
                            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                Status Teknisi Lapangan
                            </h2>
                            <div className="space-y-3">
                                {techStatus.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center justify-between p-2.5 rounded-lg border border-hairline bg-canvas-soft/40">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${item.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-medium text-ink">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-ink font-mono">{item.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <Link href="/tracking" className="w-full py-2 bg-canvas-soft border border-hairline rounded-lg text-xs font-medium text-center text-blue-600 hover:bg-blue-50 block transition-colors">
                                Pantau Peta Lokasi Teknisi →
                            </Link>
                        </div>

                        {/* Unpaid / Due Invoices */}
                        <div className="bg-canvas border border-hairline rounded-xl shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-emerald-600" />
                                    Tagihan Belum Lunas
                                </h2>
                                <Link href="/invoices" className="text-xs text-blue-600 hover:underline font-medium">Semua</Link>
                            </div>
                            <div className="space-y-2.5">
                                {unpaidInvoices.map((inv) => (
                                    <div key={inv.id} className="p-3 rounded-lg border border-hairline bg-canvas-soft/30 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-mono font-semibold text-blue-600">{inv.nomor_invoice}</span>
                                            <span className="font-bold text-ink">{fmtRp(inv.total)}</span>
                                        </div>
                                        <div className="text-[11px] text-mute flex justify-between">
                                            <span>{inv.customer?.company_name ?? 'Pelanggan'}</span>
                                            <span className="text-rose-600 font-medium">Tempo: {new Date(inv.jatuh_tempo).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                                {unpaidInvoices.length === 0 && (
                                    <div className="text-center text-mute text-xs py-4">
                                        Tidak ada invoice outstanding / belum dibayar.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Audit Trail */}
                        <div className="bg-canvas border border-hairline rounded-xl shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                                    Aktivitas Sistem Terkini
                                </h2>
                                <Link href="/audit-logs" className="text-xs text-blue-600 hover:underline font-medium">Logs</Link>
                            </div>
                            <div className="space-y-2">
                                {recentAuditLogs.map((log) => (
                                    <div key={log.id} className="text-[11px] border-b border-hairline pb-2 last:border-b-0 space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-ink">{log.user?.name ?? 'System'}</span>
                                            <span className="text-mute font-mono text-[10px]">{new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-mute truncate">{log.action} - {log.description}</p>
                                    </div>
                                ))}
                                {recentAuditLogs.length === 0 && (
                                    <div className="text-center text-mute text-xs py-2">
                                        Belum ada catatan aktivitas sistem.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
