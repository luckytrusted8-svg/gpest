import { Head, Link, usePoll } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import {
    FileText,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    User,
    ChevronRight,
    MessageSquarePlus,
    MapPin,
    ArrowUpRight,
    CreditCard,
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
        requests_count?: number;
        invoices_count?: number;
    };
    upcomingSchedules: Schedule[];
    recentWorkReports: WorkReport[];
    sites?: Site[];
}

export default function Dashboard({ customerUser, stats, upcomingSchedules, recentWorkReports, sites = [] }: Props) {
    // Auto-poll dashboard stats and active schedules every 2 seconds
    usePoll(2000, { only: ['upcomingSchedules', 'stats', 'recentWorkReports'] });

    const activeContractsCount = stats?.active_contracts ?? 0;
    const upcomingSchedulesCount = stats?.upcoming_schedules ?? 0;
    const completedSchedulesCount = stats?.completed_schedules ?? 0;
    const workReportsCount = stats?.work_reports_count ?? 0;
    const sitesCount = stats?.sites_count ?? sites.length;
    const requestsCount = stats?.requests_count ?? 0;
    const companyName = customerUser?.customer?.company_name || customerUser?.nama || 'Pelanggan';

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Dashboard Bisnis — GPEST" />

            <div className="space-y-4 sm:space-y-6">
                {/* Compact Hero Section — Sederhana & Ramah Sentuhan Mobile */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
                    <div className="space-y-0.5 sm:space-y-1 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-[#0f2444] border border-slate-200 uppercase tracking-wider">
                                Dashboard Bisnis
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">•</span>
                            <span className="text-[11px] text-slate-500 font-medium">Monitoring Mandiri</span>
                        </div>
                        <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                            Selamat Datang, <span className="text-[#0f2444]">{companyName}</span>
                        </h1>
                        <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                            Pantau titik lokasi, jadwal kunjungan teknisi, laporan pest control, dan request layanan secara real-time.
                        </p>
                        <p className="text-[11px] text-slate-500 sm:hidden">
                            Ringkasan layanan & monitoring properti aktif Anda
                        </p>
                    </div>

                    {/* Tombol Aksi Cepat — Full Width Stacked di Mobile, Inline di Layar Lebih Lebar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0 pt-1 sm:pt-0">
                        <Link href="/portal/requests" prefetch className="w-full sm:w-auto">
                            <button className="w-full h-10 sm:h-9 px-4 rounded-xl text-xs font-semibold bg-[#0f2444] hover:bg-[#162f56] text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
                                <MessageSquarePlus className="w-3.5 h-3.5" />
                                <span>Request Layanan</span>
                            </button>
                        </Link>
                        <Link href="/portal/sites" prefetch className="w-full sm:w-auto">
                            <button className="w-full h-10 sm:h-9 px-3.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <span>Titik Lokasi</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Optimasi Card Grid & Height — Konsisten 2 Kolom di Mobile, 6 Kolom di Layar Lebar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                    {/* Kartu 1: Titik Lokasi */}
                    <Link href="/portal/sites" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Titik Lokasi
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {sitesCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Properti terdaftar
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Kartu 2: Kontrak Aktif */}
                    <Link href="/portal/contracts" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Kontrak Aktif
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {activeContractsCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Perjanjian berlaku
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Kartu 3: Jadwal Datang */}
                    <Link href="/portal/schedules" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Jadwal Datang
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {upcomingSchedulesCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Kunjungan teknisi
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Kartu 4: Selesai */}
                    <Link href="/portal/schedules" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Selesai
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {completedSchedulesCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Treatment tuntas
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Kartu 5: Laporan Kerja */}
                    <Link href="/portal/work-reports" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Laporan Kerja
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {workReportsCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Laporan verifikasi
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Kartu 6: Request Layanan (Menjadikan Grid 2 Kolom Sempurna & Simetris) */}
                    <Link href="/portal/requests" prefetch className="block group">
                        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#0f2444]/40 hover:shadow-sm transition-all flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center group-hover:bg-[#0f2444] group-hover:text-white transition-colors">
                                    <MessageSquarePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f2444] transition-colors" />
                            </div>
                            <div className="mt-2.5 sm:mt-3">
                                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                    Request Layanan
                                </div>
                                <div className="text-xl sm:text-2xl font-extrabold text-[#0f2444] tracking-tight mt-0.5">
                                    {requestsCount}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                    Permintaan diajukan
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Grid Konten Detail: Jadwal Terdekat & Laporan Kerja Terbaru */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Kartu: Jadwal Kunjungan Terdekat */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Jadwal Kunjungan Terdekat
                                        </h3>
                                        <p className="text-[11px] text-slate-400">Kunjungan teknisi di lokasi Anda</p>
                                    </div>
                                </div>
                                <Link
                                    href="/portal/schedules"
                                    prefetch
                                    className="text-xs text-[#0f2444] font-semibold hover:underline flex items-center gap-1"
                                >
                                    <span>Lihat Semua</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((sch) => (
                                        <div
                                            key={sch.id}
                                            className="p-3.5 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3 sm:gap-4"
                                        >
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-xs text-[#0f2444] bg-slate-100 px-2 py-0.5 rounded">
                                                        {sch.schedule_code}
                                                    </span>
                                                    <PriorityBadge prioritas={sch.prioritas} />
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 truncate">{sch.jenis_layanan}</div>
                                                <div className="flex flex-wrap gap-2.5 text-xs text-slate-500 pt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {sch.tanggal}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {sch.jam_mulai} - {sch.jam_selesai}
                                                    </span>
                                                    {sch.technician && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3.5 h-3.5 text-slate-400" /> {sch.technician.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ScheduleStatusBadge status={sch.status} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 sm:p-10 text-center text-slate-400 text-xs font-medium">
                                        Belum ada jadwal kunjungan mendatang.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kartu: Laporan Kerja Terbaru */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center">
                                        <ClipboardList className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Laporan Kerja Terbaru
                                        </h3>
                                        <p className="text-[11px] text-slate-400">Hasil inspeksi & treatment resmi</p>
                                    </div>
                                </div>
                                <Link
                                    href="/portal/work-reports"
                                    prefetch
                                    className="text-xs text-[#0f2444] font-semibold hover:underline flex items-center gap-1"
                                >
                                    <span>Lihat Semua</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {recentWorkReports && recentWorkReports.length > 0 ? (
                                    recentWorkReports.map((wr) => (
                                        <div
                                            key={wr.id}
                                            className="p-3.5 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 sm:gap-4"
                                        >
                                            <div className="space-y-1 min-w-0">
                                                <Link
                                                    href={`/portal/work-reports/${wr.id}`}
                                                    prefetch
                                                    className="font-mono font-bold text-xs text-[#0f2444] hover:underline truncate block"
                                                >
                                                    {wr.nomor_laporan}
                                                </Link>
                                                <div className="text-sm font-bold text-slate-900 truncate">{wr.jenis_layanan}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-3">
                                                    <span>{wr.tanggal}</span>
                                                    {wr.technician && <span>Teknisi: {wr.technician.name}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <ReportStatusBadge status={wr.status} />
                                                <Link href={`/portal/work-reports/${wr.id}`} prefetch>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs font-semibold border-slate-200 hover:bg-slate-50"
                                                    >
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 sm:p-10 text-center text-slate-400 text-xs font-medium">
                                        Belum ada laporan kerja yang tersedia.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Titik Lokasi Quick Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0f2444] flex items-center justify-center">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Titik Lokasi (Site) Properti Anda
                                </h3>
                                <p className="text-[11px] text-slate-400">Daftar site aktif yang diproteksi</p>
                            </div>
                        </div>
                        <Link
                            href="/portal/sites"
                            prefetch
                            className="text-xs text-[#0f2444] font-semibold hover:underline flex items-center gap-1"
                        >
                            <span>Kelola Semua Lokasi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {sites && sites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                            {sites.map((site) => (
                                <div
                                    key={site.id}
                                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-[#0f2444] bg-white border border-slate-200 px-2 py-0.5 rounded">
                                            {site.site_code}
                                        </span>
                                        {site.latitude && site.longitude && (
                                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> GPS Aktif
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
                            Belum ada lokasi terdaftar.{' '}
                            <Link href="/portal/sites" className="text-[#0f2444] font-semibold hover:underline">
                                Tambah Titik Lokasi Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
