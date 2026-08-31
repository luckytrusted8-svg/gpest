import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { FileText, Calendar, CheckCircle2, ClipboardList, ArrowRight, Clock, MapPin, User, ChevronRight } from 'lucide-react';
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
        activeContracts: number;
        upcomingSchedules: number;
        completedServices: number;
        recentReports: number;
    };
    upcomingSchedules: Schedule[];
    recentWorkReports: WorkReport[];
}

export default function Dashboard({ customerUser, stats, upcomingSchedules, recentWorkReports }: Props) {
    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Dashboard Customer Portal" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">
                                Selamat Datang, {customerUser.customer?.company_name || customerUser.nama}
                            </h1>
                            <p className="text-body-sm text-mute mt-1">
                                Pantau perkembangan layanan pest control, kontrak kerja, dan riwayat laporan secara real-time.
                            </p>
                        </div>
                        <Link href="/portal/schedules">
                            <Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Lihat Jadwal Layanan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-canvas border border-hairline rounded-md p-5 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#0070f3]/15 text-[#0070f3] flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-caption-mono uppercase text-mute">Kontrak Aktif</div>
                            <div className="text-display-sm font-bold text-ink mt-0.5">{stats.activeContracts}</div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-5 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#f5a623]/15 text-[#ab570a] flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-caption-mono uppercase text-mute">Jadwal Mendatang</div>
                            <div className="text-display-sm font-bold text-ink mt-0.5">{stats.upcomingSchedules}</div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-5 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#0070f3]/15 text-[#0070f3] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-caption-mono uppercase text-mute">Layanan Selesai</div>
                            <div className="text-display-sm font-bold text-ink mt-0.5">{stats.completedServices}</div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-5 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-canvas-soft-2 text-ink border border-hairline flex items-center justify-center shrink-0">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-caption-mono uppercase text-mute">Total Laporan Kerja</div>
                            <div className="text-display-sm font-bold text-ink mt-0.5">{stats.recentReports}</div>
                        </div>
                    </div>
                </div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Table 1: Upcoming Schedules */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex flex-col justify-between overflow-hidden">
                        <div>
                            <div className="p-4 border-b border-hairline bg-canvas-soft flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-mute" />
                                    <h3 className="text-body-sm-strong text-ink uppercase tracking-wide">Jadwal Kunjungan Terdekat</h3>
                                </div>
                                <Link href="/portal/schedules" className="text-xs text-link font-medium hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-hairline">
                                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((sch) => (
                                        <div key={sch.id} className="p-4 hover:bg-canvas-soft/40 transition-colors flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-semibold text-body-sm text-ink">{sch.schedule_code}</span>
                                                    <PriorityBadge prioritas={sch.prioritas} />
                                                </div>
                                                <div className="text-body-sm font-medium text-ink">{sch.jenis_layanan}</div>
                                                <div className="flex flex-wrap gap-3 text-xs text-mute pt-0.5">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sch.tanggal}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sch.jam_mulai} - {sch.jam_selesai}</span>
                                                    {sch.technician && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {sch.technician.name}</span>}
                                                </div>
                                            </div>
                                            <ScheduleStatusBadge status={sch.status} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-mute text-body-sm">
                                        Belum ada jadwal kunjungan mendatang.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table 2: Recent Work Reports */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] flex flex-col justify-between overflow-hidden">
                        <div>
                            <div className="p-4 border-b border-hairline bg-canvas-soft flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-mute" />
                                    <h3 className="text-body-sm-strong text-ink uppercase tracking-wide">Laporan Kerja Terbaru</h3>
                                </div>
                                <Link href="/portal/work-reports" className="text-xs text-link font-medium hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-hairline">
                                {recentWorkReports && recentWorkReports.length > 0 ? (
                                    recentWorkReports.map((wr) => (
                                        <div key={wr.id} className="p-4 hover:bg-canvas-soft/40 transition-colors flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <Link href={`/portal/work-reports/${wr.id}`} className="font-mono font-semibold text-body-sm text-link hover:underline">
                                                    {wr.nomor_laporan}
                                                </Link>
                                                <div className="text-body-sm text-body-text">{wr.jenis_layanan}</div>
                                                <div className="text-xs text-mute flex items-center gap-3">
                                                    <span>{wr.tanggal}</span>
                                                    {wr.technician && <span>Teknisi: {wr.technician.name}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ReportStatusBadge status={wr.status} />
                                                <Link href={`/portal/work-reports/${wr.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-mute text-body-sm">
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
