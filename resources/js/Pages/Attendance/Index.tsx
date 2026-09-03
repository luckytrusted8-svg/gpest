import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Eye, Search, User, Calendar, Clock, MapPin, Download, Activity, CheckCircle2, PlayCircle, Users, XCircle, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import AttendanceTrackingModal from '@/Components/AttendanceTrackingModal';

interface Technician {
    id: number;
    name: string;
}

interface Attendance {
    id: number;
    technician_id: number;
    technician?: Technician;
    tanggal: string;
    jam_masuk: string | null;
    jam_keluar: string | null;
    latitude_masuk: number | null;
    longitude_masuk: number | null;
    latitude_keluar: number | null;
    longitude_keluar: number | null;
    status: 'hadir' | 'tidak_hadir' | 'izin' | 'sakit';
    catatan: string | null;
    durasi_kerja: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAttendances {
    data: Attendance[];
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    attendances: PaginatedAttendances;
    technicians: Technician[];
    summaryStats?: {
        total_hadir: number;
        total_berjalan: number;
        total_selesai: number;
        total_tidak_hadir: number;
    };
    filters: { tanggal?: string; technician_id?: string; status?: string };
    workingHoursConfig?: {
        teknisi: string;
        staff: { senin_jumat: string; sabtu: string; minggu: string };
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'hadir') {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Hadir
            </span>
        );
    }
    if (status === 'izin') {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Izin
            </span>
        );
    }
    if (status === 'sakit') {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Sakit
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Belum Check-In
        </span>
    );
};

export default function Index({ attendances, technicians, summaryStats, filters }: IndexProps) {
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const applyFilters = (overrides: object = {}) => {
        router.get('/attendance', { tanggal, technician_id: technicianId, status, ...overrides }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setTanggal(''); setTechnicianId(''); setStatus('');
        router.get('/attendance', {}, { preserveState: true, replace: true });
    };

    const exportUrl = `/attendance/export-csv?tanggal=${encodeURIComponent(tanggal)}&technician_id=${encodeURIComponent(technicianId)}&status=${encodeURIComponent(status)}`;

    return (
        <AppLayout>
            <Head title="Kehadiran Teknisi - G-PEST" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Kehadiran (Attendance)</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono">Live GPS</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">Monitoring check-in, check-out, durasi kerja, dan rute tracking teknisi di lapangan.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/attendance/check-in">
                            <button
                                type="button"
                                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95"
                            >
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>Check-in</span>
                            </button>
                        </Link>
                        <Link href="/attendance/report">
                            <button
                                type="button"
                                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95"
                            >
                                <Calendar className="w-4 h-4 text-slate-600" />
                                <span>Rekap Bulanan</span>
                            </button>
                        </Link>
                        <a
                            href={exportUrl}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                            title="Export data absensi ke file Excel (.csv)"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Excel</span>
                        </a>
                    </div>
                </div>

                {/* Information Banner Shift Operational Hours */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Ketentuan Jam Kerja:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                        <span className="flex items-center gap-1">
                            <strong className="text-slate-900 font-bold">Teknisi Lapangan:</strong> Jam fleksibel / sesuai jadwal panggilan
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                            <strong className="text-slate-900 font-bold">Staff Kantoran:</strong> Sen-Jum (08:00 - 16:00 WIB), Sab (08:00 - 14:00 WIB)
                        </span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Teknisi Hadir</span>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                            {summaryStats?.total_hadir || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Catatan kehadiran hari ini</p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-700">Sedang Bekerja</span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <PlayCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">
                            {summaryStats?.total_berjalan || 0}
                        </div>
                        <p className="text-[11px] text-emerald-600/80 mt-0.5">Belum check-out (berjalan)</p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-purple-700">Check-Out Selesai</span>
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mt-2 font-mono">
                            {summaryStats?.total_selesai || 0}
                        </div>
                        <p className="text-[11px] text-purple-600/80 mt-0.5">Sudah menyelesaikan jam kerja</p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-rose-700">Belum Check-In</span>
                            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-rose-600 mt-2 font-mono">
                            {summaryStats?.total_tidak_hadir || 0}
                        </div>
                        <p className="text-[11px] text-rose-600/80 mt-0.5">Belum melakukan presensi</p>
                    </div>
                </div>

                {/* Filter Form Bar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] w-full">
                            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={tanggal}
                                onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }}
                                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                            />
                        </div>
                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full sm:w-48"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full sm:w-40"
                        >
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="tidak_hadir">Belum Check-in</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                        </select>
                        <button
                            type="submit"
                            className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs w-full sm:w-auto"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors w-full sm:w-auto"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </form>
                </div>

                {/* Table View */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-5 py-3.5">Teknisi</th>
                                    <th className="px-5 py-3.5">Tanggal</th>
                                    <th className="px-5 py-3.5">Jam Masuk</th>
                                    <th className="px-5 py-3.5">Jam Keluar</th>
                                    <th className="px-5 py-3.5">Durasi</th>
                                    <th className="px-5 py-3.5">Lokasi Masuk</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                                                        {att.technician?.name ? att.technician.name.charAt(0).toUpperCase() : 'T'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-xs">
                                                            {att.technician?.name ?? '-'}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-mono">
                                                            ID #{att.technician_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-700 font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{att.tanggal}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-700">
                                                {att.jam_masuk ? (
                                                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>{att.jam_masuk}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-slate-700">
                                                {att.jam_keluar ? (
                                                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{att.jam_keluar}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {att.durasi_kerja ? (
                                                    <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold ${
                                                        !att.jam_keluar ? 'text-emerald-600 font-bold' : 'text-slate-900'
                                                    }`}>
                                                        {!att.jam_keluar && (
                                                            <span className="relative flex h-2 w-2 shrink-0">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                            </span>
                                                        )}
                                                        <span>{att.durasi_kerja}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {att.latitude_masuk && att.longitude_masuk ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedAttendanceId(att.id); setIsModalOpen(true); }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 shadow-2xs transition-all group font-semibold text-slate-700"
                                                        title="Klik untuk cek peta tracking rute teknisi"
                                                    >
                                                        <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                                                        <span>{att.latitude_masuk.toFixed(5)}, {att.longitude_masuk.toFixed(5)}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge status={att.status} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {att.latitude_masuk && att.longitude_masuk && (
                                                        <button
                                                            type="button"
                                                            className="p-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
                                                            title="Cek Peta Rute Tracking"
                                                            onClick={() => { setSelectedAttendanceId(att.id); setIsModalOpen(true); }}
                                                        >
                                                            <MapPin className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link href={`/attendance/${att.id}`}>
                                                        <button
                                                            type="button"
                                                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                            title="Lihat Rincian Kehadiran"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                            <div className="font-bold text-slate-700 text-sm">Belum ada data kehadiran</div>
                                            <div className="text-xs text-slate-400 mt-0.5">Tidak ada catatan yang sesuai dengan filter yang dipilih.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {attendances.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                            <div className="text-slate-500 font-medium">Total {attendances.total} catatan</div>
                            <div className="flex items-center gap-1">
                                {attendances.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                                                link.active 
                                                    ? 'bg-slate-900 text-white border-slate-900' 
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span 
                                            key={idx} 
                                            className="px-3 py-1.5 rounded-xl border text-xs font-bold bg-slate-50 text-slate-400 border-slate-200 opacity-60" 
                                            dangerouslySetInnerHTML={{ __html: link.label }} 
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tracking Map Modal */}
            <AttendanceTrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                attendanceId={selectedAttendanceId}
            />
        </AppLayout>
    );
}
