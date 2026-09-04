import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Eye, Search, User, Calendar, Clock, MapPin, Download, Activity, CheckCircle, PlayCircle, Camera, Building2, Globe, X, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
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
    work_type?: string | null;
    lokasi_nama?: string | null;
    selfie_masuk?: string | null;
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
    const map: Record<string, { label: string; cls: string }> = {
        hadir:       { label: 'Hadir',                      cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        tidak_hadir: { label: 'Tidak Hadir / Belum Check-in', cls: 'bg-slate-500/15 text-slate-600 dark:text-slate-400' },
        izin:        { label: 'Izin',                       cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        sakit:       { label: 'Sakit',                      cls: 'bg-[#7928ca]/15 text-[#7928ca]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
};

export default function Index({ attendances, technicians, summaryStats, filters }: IndexProps) {
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<{ url: string; title: string; subtitle: string } | null>(null);

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
            <Head title="Kehadiran" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Kehadiran (Attendance)</h1>
                        <p className="text-body-sm text-mute mt-1">Monitoring check-in, check-out, dan rute lokasi teknisi di lapangan.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/attendance/check-in">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Check-in
                            </Button>
                        </Link>
                        <Link href="/attendance/report">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Rekap Bulanan
                            </Button>
                        </Link>
                        <a href={exportUrl}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Excel
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Information Banner Shift Operational Hours */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>Ketentuan Jam Kerja:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                        <span className="flex items-center gap-1">
                            <strong className="text-slate-800 font-semibold">Teknisi Lapangan:</strong> Jam fleksibel / sesuai jadwal panggilan
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <strong className="text-slate-800 font-semibold">Staff Kantoran:</strong> Sen-Jum (08:00 - 16:00 WIB), Sab (08:00 - 14:00 WIB)
                        </span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Teknisi Hadir</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{summaryStats?.total_hadir || 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Catatan kehadiran hari ini</div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Sedang Bekerja</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{summaryStats?.total_berjalan || 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Belum check-out (berjalan)</div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <PlayCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Check-Out Selesai</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{summaryStats?.total_selesai || 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Sudah menyelesaikan jam kerja</div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-purple-600 shrink-0">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Belum Check-In / Tidak Hadir</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{summaryStats?.total_tidak_hadir || 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Belum melakukan presensi</div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-rose-600 shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] w-full">
                            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }}
                                className="pl-9 rounded-xl"
                            />
                        </div>
                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-44"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-xl border border-slate-200 bg-white text-body-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-36"
                        >
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="tidak_hadir">Tidak Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong rounded-xl">
                            <Search className="w-4 h-4 mr-1.5" />
                            Filter
                        </Button>
                        <Button type="button" variant="ghost" onClick={resetFilters} className="text-body-sm text-mute hover:text-ink rounded-xl">Reset</Button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold text-center">Foto Kehadiran</th>
                                    <th className="py-3 px-4 font-semibold">Tipe</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                                    <th className="py-3 px-4 font-semibold">Jam Masuk</th>
                                    <th className="py-3 px-4 font-semibold">Jam Keluar</th>
                                    <th className="py-3 px-4 font-semibold">Durasi</th>
                                    <th className="py-3 px-4 font-semibold">Lokasi Presensi</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => {
                                        const isWfa = att.work_type === 'WFA' || (!att.work_type && att.lokasi_nama?.includes('WFA'));
                                        return (
                                            <tr key={att.id} className="hover:bg-canvas-soft/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                                                            {att.technician?.name ? att.technician.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-mute" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 leading-tight">{att.technician?.name ?? '-'}</div>
                                                            <div className="text-[11px] text-slate-400 font-mono">ID: #{att.technician_id}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Foto Selfie Column */}
                                                <td className="py-3 px-4 text-center">
                                                    {att.selfie_masuk ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPhotoPreview({
                                                                url: att.selfie_masuk!,
                                                                title: `Foto Presensi - ${att.technician?.name || 'Teknisi'}`,
                                                                subtitle: `${att.tanggal} • ${att.jam_masuk || ''} WIB • ${isWfa ? 'WFA (Work From Anywhere)' : 'WFO (Kantor Central)'}`
                                                            })}
                                                            className="relative group inline-block focus:outline-none"
                                                            title="Klik untuk memperbesar foto wajah presensi"
                                                        >
                                                            <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-blue-500/40 shadow-2xs group-hover:scale-105 group-hover:border-blue-600 transition-all">
                                                                <img
                                                                    src={att.selfie_masuk}
                                                                    alt={`Foto ${att.technician?.name}`}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-sm group-hover:bg-blue-700 transition-colors">
                                                                <Camera className="w-2.5 h-2.5" />
                                                            </span>
                                                        </button>
                                                    ) : att.jam_masuk ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                            <ImageIcon className="w-3 h-3 text-slate-300" />
                                                            Tanpa Foto
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs">-</span>
                                                    )}
                                                </td>

                                                {/* Tipe Presensi (WFA / WFO) */}
                                                <td className="py-3 px-4">
                                                    {att.jam_masuk ? (
                                                        isWfa ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                                <Globe className="w-3 h-3 text-blue-600" />
                                                                WFA
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <Building2 className="w-3 h-3 text-emerald-600" />
                                                                WFO
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-mute">-</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 text-body-text whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-mute" />
                                                        {att.tanggal}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-body-text whitespace-nowrap">
                                                    {att.jam_masuk ? (
                                                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                                                            <Clock className="w-3.5 h-3.5 text-mute" />
                                                            {att.jam_masuk}
                                                        </div>
                                                    ) : (
                                                        <span className="text-mute">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-body-text whitespace-nowrap">
                                                    {att.jam_keluar ? (
                                                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-800">
                                                            <Clock className="w-3.5 h-3.5 text-mute" />
                                                            {att.jam_keluar}
                                                        </div>
                                                    ) : (
                                                        <span className="text-mute">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-body-text whitespace-nowrap">
                                                    {att.durasi_kerja ? (
                                                        <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium ${
                                                            !att.jam_keluar ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink'
                                                        }`}>
                                                            {!att.jam_keluar && (
                                                                <span className="relative flex h-2 w-2 shrink-0">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                                </span>
                                                            )}
                                                            {att.durasi_kerja}
                                                        </span>
                                                    ) : (
                                                        <span className="text-mute">-</span>
                                                    )}
                                                </td>

                                                {/* Lokasi Presensi Column */}
                                                <td className="py-3 px-4 text-body-text">
                                                    {att.latitude_masuk && att.longitude_masuk ? (
                                                        <div className="space-y-1">
                                                            {att.lokasi_nama && (
                                                                <div className="text-xs text-slate-700 font-medium truncate max-w-[200px]" title={att.lokasi_nama}>
                                                                    {att.lokasi_nama}
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => { setSelectedAttendanceId(att.id); setIsModalOpen(true); }}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas-soft border border-hairline hover:border-primary hover:text-primary hover:shadow-2xs transition-all group"
                                                                title="Klik untuk cek peta tracking rute teknisi"
                                                            >
                                                                <MapPin className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                                                                <span>{att.latitude_masuk.toFixed(5)}, {att.longitude_masuk.toFixed(5)}</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-mute">-</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap"><StatusBadge status={att.status} /></td>

                                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Selfie Quick View Button */}
                                                        {att.selfie_masuk && (
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                title="Lihat Foto Wajah Presensi"
                                                                onClick={() => setPhotoPreview({
                                                                    url: att.selfie_masuk!,
                                                                    title: `Foto Presensi - ${att.technician?.name || 'Teknisi'}`,
                                                                    subtitle: `${att.tanggal} • ${att.jam_masuk || ''} WIB • ${isWfa ? 'WFA' : 'WFO'}`
                                                                })}
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                            </Button>
                                                        )}

                                                        {att.latitude_masuk && att.longitude_masuk && att.id > 0 ? (
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-primary border-primary/30 hover:bg-primary/10"
                                                                title="Cek Peta Rute Tracking"
                                                                onClick={() => { setSelectedAttendanceId(att.id); setIsModalOpen(true); }}
                                                            >
                                                                <MapPin className="w-4 h-4" />
                                                            </Button>
                                                        ) : null}

                                                        {att.id && att.id > 0 && att.jam_masuk ? (
                                                            <Link href={`/attendance/${att.id}`}>
                                                                <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink" title="Lihat Detail Absensi">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-300 border-slate-200 cursor-not-allowed opacity-50"
                                                                disabled
                                                                title="Teknisi Belum Check-In"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada data kehadiran yang tersimpan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {attendances.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {attendances.total} catatan</div>
                            <div className="flex items-center gap-1">
                                {attendances.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${link.active ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Preview Modal for Admins */}
            {photoPreview && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setPhotoPreview(null)}
                >
                    <div 
                        className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h3 className="text-sm font-bold">{photoPreview.title}</h3>
                                    <p className="text-[11px] text-slate-300 font-mono">{photoPreview.subtitle}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPhotoPreview(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
                            <img
                                src={photoPreview.url}
                                alt="Selfie Presensi"
                                className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-slate-800 shadow-lg"
                            />
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                <Sparkles className="w-4 h-4" />
                                Foto Terverifikasi Sistem Presensi Lapangan
                            </span>
                            <a
                                href={photoPreview.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Buka Tab Baru
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Map Modal */}
            <AttendanceTrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                attendanceId={selectedAttendanceId}
            />
        </AppLayout>
    );
}
