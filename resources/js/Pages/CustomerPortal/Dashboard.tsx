import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { FileText, Calendar, CheckCircle2, ClipboardList, Clock, User, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { StatusBadge as ScheduleStatusBadge, PriorityBadge } from '../Schedules/Index';
import { StatusBadge as ReportStatusBadge } from '../WorkReports/Index';

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    customer?: {
        id: number;
        customer_id: string;
        company_name: string;
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
        activeContracts?: number;
        upcoming_schedules?: number;
        upcomingSchedules?: number;
        completed_schedules?: number;
        completedServices?: number;
        work_reports_count?: number;
        recentReports?: number;
    };
    upcomingSchedules: Schedule[];
    recentWorkReports: WorkReport[];
}

export default function Dashboard({ customerUser, stats, upcomingSchedules, recentWorkReports }: Props) {
    const activeContractsCount = stats?.active_contracts ?? stats?.activeContracts ?? 0;
    const upcomingSchedulesCount = stats?.upcoming_schedules ?? stats?.upcomingSchedules ?? 0;
    const completedSchedulesCount = stats?.completed_schedules ?? stats?.completedServices ?? 0;
    const workReportsCount = stats?.work_reports_count ?? stats?.recentReports ?? 0;

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Dashboard Portal Pelanggan" />

            <div className="space-y-6">
                {/* Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                                Portal Pelanggan G-PEST
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Selamat Datang, {customerUser?.customer?.company_name || customerUser?.nama || 'Pelanggan'}
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                                Memantau jadwal kunjungan teknisi, laporan hasil kerja pest control, kontrak kerja, dan invoice Anda secara terpusat.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5 shrink-0">
                            <Link href="/portal/requests">
                                <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors">
                                    <MessageSquarePlus className="w-4 h-4" />
                                    Kirim Request / Komplain
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kontrak Aktif</div>
                            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeContractsCount}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jadwal Mendatang</div>
                            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{upcomingSchedulesCount}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Layanan Selesai</div>
                            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{completedSchedulesCount}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Laporan Kerja</div>
                            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{workReportsCount}</div>
                        </div>
                    </div>
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Table 1: Upcoming Schedules */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Jadwal Kunjungan Terdekat</h3>
                                </div>
                                <Link href="/portal/schedules" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
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
                                <Link href="/portal/work-reports" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {recentWorkReports && recentWorkReports.length > 0 ? (
                                    recentWorkReports.map((wr) => (
                                        <div key={wr.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <Link href={`/portal/work-reports/${wr.id}`} className="font-mono font-bold text-xs text-blue-600 hover:underline">
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
                                                <Link href={`/portal/work-reports/${wr.id}`}>
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
            </div>
        </CustomerPortalLayout>
    );
}
