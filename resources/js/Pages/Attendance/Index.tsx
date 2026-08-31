import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Eye, Search, User, Calendar, Clock, MapPin, Download } from 'lucide-react';
import { useState } from 'react';

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
    filters: { tanggal?: string; technician_id?: string; status?: string };
}

const StatusBadge = ({ status }: { status: Attendance['status'] }) => {
    const map: Record<string, { label: string; cls: string }> = {
        hadir:      { label: 'Hadir',      cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        tidak_hadir: { label: 'Tidak Hadir', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
        izin:       { label: 'Izin',       cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        sakit:      { label: 'Sakit',      cls: 'bg-[#7928ca]/15 text-[#7928ca]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
};

export default function Index({ attendances, technicians, filters }: IndexProps) {
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (overrides: object = {}) => {
        router.get('/attendance', { tanggal, technician_id: technicianId, status, ...overrides }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setTanggal(''); setTechnicianId(''); setStatus('');
        router.get('/attendance', {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Kehadiran" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Kehadiran (Attendance)</h1>
                        <p className="text-body-sm text-mute mt-1">Monitoring check-in dan check-out teknisi di lapangan.</p>
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
                        <Button variant="outline" className="text-body-sm-strong flex items-center gap-2" disabled>
                            <Download className="w-4 h-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }}
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={technicianId}
                            onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-44"
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-36"
                        >
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="tidak_hadir">Tidak Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong">
                            <Search className="w-4 h-4 mr-1.5" />
                            Filter
                        </Button>
                        <Button type="button" variant="ghost" onClick={resetFilters} className="text-body-sm text-mute hover:text-ink">Reset</Button>
                    </form>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                                    <th className="py-3 px-4 font-semibold">Jam Masuk</th>
                                    <th className="py-3 px-4 font-semibold">Jam Keluar</th>
                                    <th className="py-3 px-4 font-semibold">Durasi</th>
                                    <th className="py-3 px-4 font-semibold">Lokasi Masuk</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-mute" />
                                                    <span className="font-medium">{att.technician?.name ?? '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute" />
                                                    {att.tanggal}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                {att.jam_masuk ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-mute" />
                                                        {att.jam_masuk}
                                                    </div>
                                                ) : (
                                                    <span className="text-mute">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                {att.jam_keluar ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-mute" />
                                                        {att.jam_keluar}
                                                    </div>
                                                ) : (
                                                    <span className="text-mute">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-body-text font-mono text-xs">
                                                {att.durasi_kerja ?? '-'}
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                {att.latitude_masuk && att.longitude_masuk ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-mute">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{att.latitude_masuk.toFixed(5)}, {att.longitude_masuk.toFixed(5)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-mute">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4"><StatusBadge status={att.status} /></td>
                                            <td className="py-3 px-4 text-right">
                                                <Link href={`/attendance/${att.id}`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center text-mute text-body-sm">
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
        </AppLayout>
    );
}
