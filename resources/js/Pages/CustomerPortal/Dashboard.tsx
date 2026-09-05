import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { 
    FileText, Calendar, CheckCircle2, ClipboardList, Clock, User, 
    ChevronRight, MessageSquarePlus, MapPin, Building2, Plus, ExternalLink 
} from 'lucide-react';
import { StatusBadge as ScheduleStatusBadge, PriorityBadge } from '../Schedules/Index';
import { StatusBadge as ReportStatusBadge } from '../WorkReports/Index';

interface Site {
    id: number;
    site_code: string;
    site_name: string;
    address: string;
    latitude?: string | number | null;
    longitude?: string | number | null;
}

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    customer?: {
        id: number;
        customer_id: string;
        company_name: string;
        address?: string;
    };
}

interface Schedule {
    id: number;
    schedule_code: string;
    lokasi: string;
    jenis_layanan: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
    technician?: { name: string };
}

interface WorkReport {
    id: number;
    nomor_laporan: string;
    tanggal: string;
    jenis_layanan: string;
    status: 'draft' | 'dikirim' | 'disetujui' | 'revisi' | 'selesai';
    technician?: { name: string };
}

interface Props {
    customerUser: CustomerUser;
    stats: {
        active_contracts?: number;
        upcoming_schedules?: number;
        completed_schedules?: number;
        work_reports_count?: number;
        sites_count?: number;
    };
    upcomingSchedules: Schedule[];
    recentWorkReports: WorkReport[];
    sites?: Site[];
}

export default function Dashboard({ customerUser, stats, upcomingSchedules, recentWorkReports, sites = [] }: Props) {
    const activeContractsCount = stats?.active_contracts ?? 0;
    const upcomingSchedulesCount = stats?.upcoming_schedules ?? 0;
    const completedSchedulesCount = stats?.completed_schedules ?? 0;
    const workReportsCount = stats?.work_reports_count ?? 0;
    const sitesCount = stats?.sites_count ?? sites.length;

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Dashboard Portal Pelanggan" />

            <div className="space-y-6">
                {/* Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                                Portal Pelanggan Mandiri G-PEST
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Selamat Datang, {customerUser?.customer?.company_name || customerUser?.nama || 'Pelanggan'}
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                                Kelola titik lokasi properti, pantau jadwal kunjungan teknisi, laporan hasil kerja pest control, dan invoice Anda secara mandiri.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5 shrink-0">
                            <Link href="/portal/sites" prefetch>
                                <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
                                    <MapPin className="w-4 h-4" />
                                    Kelola Titik Lokasi (Site)
                                </button>
                            </Link>
                            <Link href="/portal/requests" prefetch>
                                <button className="bg-blue-800/80 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer border border-white/20">
                                    <MessageSquarePlus className="w-4 h-4" />
                                    Request Layanan
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <Link href="/portal/sites" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 group-hover:border-blue-500 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Titik Lokasi</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{sitesCount}</div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/portal/contracts" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 group-hover:border-blue-500 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Kontrak Aktif</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{activeContractsCount}</div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/portal/schedules" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 group-hover:border-blue-500 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Jadwal Datang</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{upcomingSchedulesCount}</div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/portal/schedules" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 group-hover:border-blue-500 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Selesai</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{completedSchedulesCount}</div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/portal/work-reports" prefetch className="block group col-span-2 sm:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 group-hover:border-blue-500 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Laporan Kerja</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{workReportsCount}</div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Table 1: Upcoming Schedules */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Jadwal Kunjungan Terdekat</h3>
                                </div>
                                <Link href="/portal/schedules" prefetch className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((sch) => (
                                        <div key={sch.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-xs text-blue-600">{sch.schedule_code}</span>
                                                    <PriorityBadge prioritas={sch.prioritas} />
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900">{sch.jenis_layanan}</div>
                                                <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-0.5">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {sch.tanggal}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {sch.jam_mulai} - {sch.jam_selesai}</span>
                                                    {sch.technician && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {sch.technician.name}</span>}
                                                </div>
                                            </div>
                                            <ScheduleStatusBadge status={sch.status} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-slate-400 text-xs font-medium">
                                        Belum ada jadwal kunjungan mendatang.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table 2: Recent Work Reports */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Laporan Kerja Terbaru</h3>
                                </div>
                                <Link href="/portal/work-reports" prefetch className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {recentWorkReports && recentWorkReports.length > 0 ? (
                                    recentWorkReports.map((wr) => (
                                        <div key={wr.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <Link href={`/portal/work-reports/${wr.id}`} prefetch className="font-mono font-bold text-xs text-blue-600 hover:underline">
                                                    {wr.nomor_laporan}
                                                </Link>
                                                <div className="text-sm font-semibold text-slate-900">{wr.jenis_layanan}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-3">
                                                    <span>{wr.tanggal}</span>
                                                    {wr.technician && <span>Teknisi: {wr.technician.name}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ReportStatusBadge status={wr.status} />
                                                <Link href={`/portal/work-reports/${wr.id}`} prefetch>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-slate-400 text-xs font-medium">
                                        Belum ada laporan kerja yang tersedia.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Titik Lokasi Quick Section */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900">Titik Lokasi (Site) Properti Anda</h3>
                        </div>
                        <Link href="/portal/sites" prefetch className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                            Kelola Semua Lokasi <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {sites && sites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {sites.map((site) => (
                                <div key={site.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                            {site.site_code}
                                        </span>
                                        {site.latitude && site.longitude && (
                                            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5">
                                                <CheckCircle2 className="w-3 h-3" /> GPS Aktif
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{site.site_name}</div>
                                    <div className="text-[11px] text-slate-500 line-clamp-2">{site.address}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-slate-400 text-xs">
                            Belum ada lokasi terdaftar. <Link href="/portal/sites" className="text-blue-600 font-semibold hover:underline">Tambah Titik Lokasi Sekarang</Link>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
