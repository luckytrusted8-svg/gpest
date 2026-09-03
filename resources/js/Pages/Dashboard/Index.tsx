import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Users, FileText, CalendarCheck, ClipboardList, UserCheck, UserPlus, 
    UserMinus, UserX, ArrowRight, Calendar, Clock, DollarSign, MessageSquare, 
    CreditCard, ShieldCheck, MapPin, User, CheckCircle2, PlusCircle, Navigation, Play, Compass
} from 'lucide-react';
import LeafletLocationPicker from '@/Components/LeafletLocationPicker';

interface ScheduleItem {
    id: number;
    schedule_code?: string;
    lokasi?: string;
    jenis_layanan?: string;
    customer?: { id: number; company_name: string; address?: string; latitude?: number | string; longitude?: number | string } | null;
    technician?: { id: number; nama: string; name?: string } | null;
    jam_mulai?: string;
    jam_selesai?: string;
    waktu_mulai?: string;
    waktu_selesai?: string;
    prioritas?: string;
    status: string;
    catatan?: string | null;
    created_at?: string;
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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 shadow-2xs transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">{title}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{typeof value === 'number' ? value.toLocaleString('id-ID') : value}</div>
                    {subtitle && <div className="text-[11px] text-slate-500 mt-1">{subtitle}</div>}
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block">{card}</Link>;
    }
    return card;
};

const getScheduleStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
        dijadwalkan: { label: 'Dijadwalkan', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
        ditugaskan: { label: 'Ditugaskan', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
        dalam_perjalanan: { label: 'Dalam Perjalanan (OTW)', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
        tiba: { label: 'Tiba di Lokasi', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
        sedang_dikerjakan: { label: 'Proses Pengerjaan', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        selesai: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        dibatalkan: { label: 'Batal', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{label}</span>;
};

export default function Dashboard({ kpiData, todaySchedules = [], technicianCounts, recentRequests = [], unpaidInvoices = [], recentAuditLogs = [] }: Props) {
    const page = usePage();
    const auth = page.props.auth as any;
    const userRoles: string[] = auth?.user?.roles || [];
    const isTechnician = userRoles.includes('technician');
    const userName = auth?.user?.name || 'Teknisi';

    const handleUpdateStatus = (scheduleId: number, nextStatus: string) => {
        router.put(`/schedules/${scheduleId}/status`, { status: nextStatus }, { preserveScroll: true });
    };

    const kpis = [
        { title: 'Total Pelanggan', value: kpiData?.totalCustomers ?? 0, icon: Users, href: '/customers', subtitle: 'Pelanggan aktif terdaftar' },
        { title: 'Kontrak Layanan', value: kpiData?.activeContracts ?? 0, icon: FileText, href: '/contracts', subtitle: 'Kontrak berjalan' },
        { title: 'Omset Bulan Ini', value: fmtRp(kpiData?.monthlyRevenue), icon: DollarSign, href: '/invoices', subtitle: 'Penerbitan invoice' },
        { title: 'Permintaan Klien', value: kpiData?.pendingRequests ?? 0, icon: MessageSquare, href: '/customer-requests', subtitle: 'Tiket request masuk' },
    ];

    const techStatus = [
        { label: 'Aktif / Online', count: technicianCounts?.online ?? 0, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { label: 'Sedang Bekerja', count: technicianCounts?.working ?? 0, icon: UserPlus, color: 'text-amber-600 bg-amber-50 border-amber-200' },
        { label: 'Selesai Hari Ini', count: technicianCounts?.completedToday ?? 0, icon: UserMinus, color: 'text-purple-600 bg-purple-50 border-purple-200' },
        { label: 'Offline / Absen', count: technicianCounts?.offline ?? 0, icon: UserX, color: 'text-slate-500 bg-slate-50 border-slate-200' },
    ];

    // VIEW KHUSUS ROLE TEKNISI LAPANGAN
    if (isTechnician) {
        const completedSchedulesCount = todaySchedules.filter((s) => s.status === 'selesai').length;
        const pendingSchedulesCount = todaySchedules.length - completedSchedulesCount;

        return (
            <AppLayout>
                <Head title="Workspace Teknisi Lapangan - G-PEST" />

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Banner Teknisi */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                                    Teknisi Lapangan
                                </span>
                                <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
                                    Halo, {userName}
                                </h1>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0">
                                <Link href="/attendance/check-in" className="flex-1 sm:flex-none">
                                    <button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                                        <MapPin className="w-4 h-4" />
                                        <span>Presensi Masuk</span>
                                    </button>
                                </Link>
                                <Link href="/work-reports/create" className="flex-1 sm:flex-none">
                                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Buat Laporan</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Tugas Hari Ini</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{todaySchedules.length}</div>
                        </div>
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Perlu Dikerjakan</div>
                            <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">{pendingSchedulesCount}</div>
                        </div>
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Tuntas</div>
                            <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{completedSchedulesCount}</div>
                        </div>
                    </div>

                    {/* Schedule List Today */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                Jadwal Kunjungan & Work Order
                            </h2>
                            <Link href="/schedules" className="text-xs text-slate-900 font-medium hover:underline flex items-center gap-1">
                                Semua Jadwal <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {todaySchedules.map((sch) => {
                                const lat = sch.customer?.latitude ? Number(sch.customer.latitude) : -6.2088;
                                const lng = sch.customer?.longitude ? Number(sch.customer.longitude) : 106.8456;
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                                return (
                                    <div key={sch.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono font-bold text-xs text-slate-900">{sch.schedule_code || `#SCH-${sch.id}`}</span>
                                                    {getScheduleStatusBadge(sch.status)}
                                                </div>
                                                <h3 className="text-base font-semibold text-slate-900 mt-1">
                                                    {sch.customer?.company_name || 'Pelanggan'}
                                                </h3>
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{(sch.jam_mulai || sch.waktu_mulai || '08:00').slice(0, 5)} - {(sch.jam_selesai || sch.waktu_selesai || '17:00').slice(0, 5)} WIB</span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-600 space-y-1">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-800 font-medium">{sch.lokasi || sch.customer?.address || 'Lokasi Kunjungan'}</span>
                                            </div>
                                            {sch.jenis_layanan && (
                                                <div className="flex items-center gap-1.5 pl-5 text-slate-500">
                                                    <span>Layanan:</span>
                                                    <span className="font-semibold text-slate-900">{sch.jenis_layanan}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Map Location Card */}
                                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                    <Compass className="w-4 h-4 text-slate-600" />
                                                    Peta Titik Lokasi Klien
                                                </span>
                                                <a
                                                    href={mapsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    <Navigation className="w-3 h-3 text-white" />
                                                    <span>Navigasi GPS →</span>
                                                </a>
                                            </div>
                                            <LeafletLocationPicker
                                                lat={lat}
                                                lng={lng}
                                                radius={100}
                                                onLocationSelect={() => {}}
                                                height="180px"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-2 flex flex-wrap gap-2">
                                            {(sch.status === 'dijadwalkan' || sch.status === 'ditugaskan') && (
                                                <button
                                                    onClick={() => handleUpdateStatus(sch.id, 'dalam_perjalanan')}
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                    1. Berangkat (OTW)
                                                </button>
                                            )}

                                            {sch.status === 'dalam_perjalanan' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(sch.id, 'tiba')}
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    2. Tiba di Lokasi
                                                </button>
                                            )}

                                            {sch.status === 'tiba' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(sch.id, 'sedang_dikerjakan')}
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    3. Mulai Pengerjaan
                                                </button>
                                            )}

                                            {sch.status === 'sedang_dikerjakan' && (
                                                <Link href={`/work-reports/create?schedule_id=${sch.id}`} className="flex-1">
                                                    <button className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5">
                                                        <ClipboardList className="w-4 h-4" />
                                                        4. Buat Laporan & Selesaikan
                                                    </button>
                                                </Link>
                                            )}

                                            {sch.status === 'selesai' && (
                                                <Link href={`/schedules/${sch.id}`} className="flex-1">
                                                    <button className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                        Lihat Detail Selesai
                                                    </button>
                                                </Link>
                                            )}

                                            <Link href={`/schedules/${sch.id}`}>
                                                <button className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                    Detail
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            {todaySchedules.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-semibold text-slate-700">Tidak Ada Tugas Hari Ini</p>
                                    <p className="text-xs text-slate-400 mt-1">Anda tidak memiliki penugasan jadwal untuk saat ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // VIEW DASHBOARD ADMIN / MANAGEMENT
    return (
        <AppLayout>
            <Head title="Dashboard Manajemen Operasional - G-PEST" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Dashboard Operasional</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Statistik pekerjaan teknisi, ringkasan armada, dan tagihan invoice.</p>
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
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
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    Jadwal Pekerjaan Hari Ini ({todaySchedules.length})
                                </h2>
                                <Link href="/schedules" className="text-xs text-slate-900 hover:underline flex items-center gap-1 font-medium">
                                    Kelola Jadwal <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {todaySchedules.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-mono text-xs shrink-0">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {item.customer?.company_name ?? 'Pelanggan'}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                                                    <span className="font-mono">
                                                        {(item.jam_mulai || item.waktu_mulai || '00:00').slice(0, 5)} - {(item.jam_selesai || item.waktu_selesai || '00:00').slice(0, 5)} WIB
                                                    </span>
                                                    {item.technician && (
                                                        <span>
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
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Belum ada jadwal pekerjaan untuk hari ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Customer Requests */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-500" />
                                    Permintaan Klien Terkini
                                </h2>
                                <Link href="/customer-requests" className="text-xs text-slate-900 hover:underline flex items-center gap-1 font-medium">
                                    Semua Request <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-slate-900">{req.request_number}</span>
                                                <span className="text-xs font-medium text-slate-800">{req.customer?.company_name ?? 'Pelanggan'}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Layanan: {req.jenis_layanan} • Prioritas: <span className="uppercase font-medium text-slate-700">{req.prioritas}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-amber-50 text-amber-700 border border-amber-200">
                                                {req.status}
                                            </span>
                                            <Link href={`/customer-requests/${req.id}`} className="text-xs text-slate-900 hover:underline font-medium">
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {recentRequests.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Tidak ada permintaan baru dari pelanggan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Span) */}
                    <div className="space-y-6">
                        {/* Technician Status */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5 space-y-4">
                            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-slate-500" />
                                Status Teknisi Lapangan
                            </h2>
                            <div className="space-y-2">
                                {techStatus.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${item.color}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-700">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 font-mono">{item.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <Link href="/tracking" className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium text-center text-slate-800 block transition-colors shadow-2xs">
                                Buka Peta Pemantauan →
                            </Link>
                        </div>

                        {/* Unpaid / Due Invoices */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                    Tagihan Belum Lunas
                                </h2>
                                <Link href="/invoices" className="text-xs text-slate-900 hover:underline font-medium">Semua</Link>
                            </div>
                            <div className="space-y-2">
                                {unpaidInvoices.map((inv) => (
                                    <div key={inv.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-mono font-bold text-slate-900">{inv.nomor_invoice}</span>
                                            <span className="font-bold text-slate-900 font-mono">{fmtRp(inv.total)}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex justify-between">
                                            <span>{inv.customer?.company_name ?? 'Pelanggan'}</span>
                                            <span className="text-rose-600 font-mono font-medium">Tempo: {new Date(inv.jatuh_tempo).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                                {unpaidInvoices.length === 0 && (
                                    <div className="text-center text-slate-400 text-xs py-4">
                                        Semua invoice berstatus lunas.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Audit Trail */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                                    Aktivitas Sistem Terkini
                                </h2>
                                <Link href="/audit-logs" className="text-xs text-slate-900 hover:underline font-medium">Log</Link>
                            </div>
                            <div className="space-y-2">
                                {recentAuditLogs.map((log) => (
                                    <div key={log.id} className="text-[11px] border-b border-slate-100 pb-2 last:border-b-0 space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-900">{log.user?.name ?? 'System'}</span>
                                            <span className="text-slate-400 font-mono text-[10px]">{new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-slate-500 truncate">{log.action} - {log.description}</p>
                                    </div>
                                ))}
                                {recentAuditLogs.length === 0 && (
                                    <div className="text-center text-slate-400 text-xs py-2">
                                        Belum ada catatan aktivitas.
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
