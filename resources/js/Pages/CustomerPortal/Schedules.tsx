import { Head, Link, usePoll, router } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Calendar, Clock, MapPin, User, RefreshCw, CalendarCheck } from 'lucide-react';
import { useState } from 'react';

const ScheduleStatusBadge = ({ status }: { status: Schedule['status'] | string }) => {
    switch (status) {
        case 'selesai':
            return <span className="font-bold text-xs text-emerald-600">Selesai</span>;
        case 'sedang_dikerjakan':
            return <span className="font-bold text-xs text-blue-600">Sedang Dikerjakan</span>;
        case 'tiba':
            return <span className="font-bold text-xs text-teal-600">Tiba di Lokasi</span>;
        case 'dalam_perjalanan':
            return <span className="font-bold text-xs text-amber-600">Dalam Perjalanan</span>;
        case 'ditugaskan':
            return <span className="font-bold text-xs text-indigo-600">Ditugaskan</span>;
        case 'dijadwal_ulang':
            return <span className="font-bold text-xs text-orange-600">Dijadwal Ulang</span>;
        case 'dibatalkan':
            return <span className="font-bold text-xs text-rose-600">Dibatalkan</span>;
        case 'dijadwalkan':
        default:
            return <span className="font-medium text-xs text-slate-600">Dijadwalkan</span>;
    }
};

const PriorityBadge = ({ prioritas }: { prioritas: Schedule['prioritas'] | string }) => {
    switch (prioritas) {
        case 'urgent':
            return <span className="font-bold text-xs text-rose-600">Urgent</span>;
        case 'tinggi':
            return <span className="font-semibold text-xs text-amber-600">Tinggi</span>;
        case 'normal':
            return <span className="font-medium text-xs text-blue-600">Normal</span>;
        case 'rendah':
        default:
            return <span className="font-medium text-xs text-slate-500">Rendah</span>;
    }
};

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
    catatan: string | null;
    technician?: { name: string };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSchedules {
    data: Schedule[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    customerUser: CustomerUser;
    schedules: PaginatedSchedules;
}

export default function Schedules({ customerUser, schedules }: Props) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-poll every 1.5 seconds for instant real-time sync without page reload
    usePoll(1500, { only: ['schedules'] });

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['schedules'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    const hasSchedules = schedules.data && schedules.data.length > 0;

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Jadwal Layanan - Customer Portal" />

            <div className="space-y-5 sm:space-y-6">
                {/* 1. Header & Action Controls Optimization: Flex Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div>
                        <h1 className="text-xl sm:text-display-sm font-bold sm:font-semibold text-slate-900 flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-blue-600 sm:hidden" />
                            <span>Jadwal Kunjungan & Layanan</span>
                        </h1>
                        <p className="text-xs sm:text-body-sm text-slate-500 mt-1">
                            Pantau agenda kunjungan teknisi ke lokasi properti Anda secara langsung.
                        </p>
                    </div>

                    {/* Tombol Segarkan */}
                    <div className="flex items-center gap-2 pt-0.5 sm:pt-0">
                        <button
                            type="button"
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                            title="Segarkan data jadwal"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                            <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
                        </button>
                    </div>
                </div>

                {!hasSchedules ? (
                    /* Empty State Handling: Kotak terpusat saat belum ada jadwal */
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-14 text-center shadow-xs">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Belum Ada Jadwal Layanan</h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                            Agenda kunjungan teknisi G-PEST ke lokasi properti Anda akan ditampilkan di sini secara otomatis.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 2. Mobile UI Transformation: Card List vertikal (block sm:hidden) */}
                        <div className="block sm:hidden space-y-3">
                            {schedules.data.map((sch) => (
                                <div
                                    key={sch.id}
                                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3"
                                >
                                    {/* Baris 1: Kode Jadwal di kiri + Status & Prioritas di kanan */}
                                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <Calendar className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-mono font-bold text-xs text-slate-900 truncate">
                                                {sch.schedule_code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <PriorityBadge prioritas={sch.prioritas} />
                                            <span className="text-slate-300 text-xs">/</span>
                                            <ScheduleStatusBadge status={sch.status} />
                                        </div>
                                    </div>

                                    {/* Baris 2: Judul Jenis Layanan + Ikon Lokasi & Alamat Lengkap */}
                                    <div className="space-y-1 text-xs">
                                        <div className="font-bold text-slate-900 text-sm">
                                            {sch.jenis_layanan}
                                        </div>
                                        <div className="flex items-start gap-1.5 text-slate-600 mt-0.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{sch.lokasi}</span>
                                        </div>
                                    </div>

                                    {/* Baris 3: Tanggal & Waktu + Nama Teknisi */}
                                    <div className="grid grid-cols-1 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="font-semibold text-slate-900">{sch.tanggal}</span>
                                                <span className="text-slate-400">•</span>
                                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span className="text-slate-600 font-mono text-[11px]">{sch.jam_mulai} - {sch.jam_selesai}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-600 pt-0.5">
                                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>Teknisi: </span>
                                            {sch.technician ? (
                                                <span className="font-bold text-slate-900">{sch.technician.name}</span>
                                            ) : (
                                                <span className="text-slate-400 italic">Menunggu Penugasan</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. Desktop Table Enhancement: Hidden on Mobile (hidden sm:block) */}
                        <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden max-w-full">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                            <th className="py-3 px-4">Kode Jadwal</th>
                                            <th className="py-3 px-4">Jenis Layanan</th>
                                            <th className="py-3 px-4">Lokasi Kunjungan</th>
                                            <th className="py-3 px-4">Tanggal & Waktu</th>
                                            <th className="py-3 px-4">Teknisi</th>
                                            <th className="py-3 px-4 text-center">Prioritas</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                                        {schedules.data.map((sch) => (
                                            <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                                                    {sch.schedule_code}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                                    {sch.jenis_layanan}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 max-w-[240px] truncate">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate" title={sch.lokasi}>{sch.lokasi}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{sch.tanggal}</span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                        <span>{sch.jam_mulai} - {sch.jam_selesai}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    {sch.technician ? (
                                                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span>{sch.technician.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Belum ditugaskan</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="flex justify-center">
                                                        <PriorityBadge prioritas={sch.prioritas} />
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="flex justify-center">
                                                        <ScheduleStatusBadge status={sch.status} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Responsif */}
                        {schedules.links && schedules.links.length > 3 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                                <div className="text-slate-500 text-center sm:text-left">
                                    Total <strong>{schedules.total}</strong> jadwal kunjungan
                                </div>
                                <div className="flex items-center flex-wrap justify-center gap-1">
                                    {schedules.links.map((link, idx) => (
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-lg border text-xs font-medium bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomerPortalLayout>
    );
}
