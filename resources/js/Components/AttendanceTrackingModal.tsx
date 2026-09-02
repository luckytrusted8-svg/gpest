import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { X, Clock, MapPin, ExternalLink, Activity, User, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';

const HistoryMap = React.lazy(() => import('@/Components/HistoryMap'));

interface Track {
    id: number;
    latitude: number;
    longitude: number;
    akurasi: number | null;
    kecepatan: number | null;
    status_teknisi: string;
    created_at: string;
}

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
    status: string;
    catatan: string | null;
    durasi_kerja: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    attendanceId: number | null;
}

export default function AttendanceTrackingModal({ isOpen, onClose, attendanceId }: Props) {
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [combinedTracks, setCombinedTracks] = useState<Track[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isOpen || !attendanceId) {
            setAttendance(null);
            setTracks([]);
            setCombinedTracks([]);
            return;
        }

        setLoading(true);
        fetch(`/attendance/${attendanceId}/tracks`)
            .then((res) => res.json())
            .then((data) => {
                setAttendance(data.attendance);
                setTracks(data.tracks || []);

                // Build unified track list including check-in, tracking logs, and check-out
                const list: Track[] = [];
                const att = data.attendance as Attendance;

                if (att.latitude_masuk && att.longitude_masuk) {
                    list.push({
                        id: 999991,
                        latitude: att.latitude_masuk,
                        longitude: att.longitude_masuk,
                        akurasi: 5,
                        kecepatan: 0,
                        status_teknisi: 'aktif',
                        created_at: `${att.tanggal}T${att.jam_masuk || '00:00:00'}`,
                    });
                }

                (data.tracks || []).forEach((t: Track) => {
                    list.push(t);
                });

                if (att.latitude_keluar && att.longitude_keluar) {
                    list.push({
                        id: 999999,
                        latitude: att.latitude_keluar,
                        longitude: att.longitude_keluar,
                        akurasi: 5,
                        kecepatan: 0,
                        status_teknisi: 'offline',
                        created_at: `${att.tanggal}T${att.jam_keluar || '23:59:59'}`,
                    });
                }

                // Sort chronologically
                list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                setCombinedTracks(list);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [isOpen, attendanceId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-canvas border border-hairline rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-canvas-soft/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-display-xs font-semibold text-ink flex items-center gap-2">
                                Riwayat Tracking & Lokasi Absensi
                                {attendance?.technician?.name && (
                                    <span className="text-body-sm text-mute font-normal">({attendance.technician.name})</span>
                                )}
                            </h2>
                            <p className="text-body-xs text-mute flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {attendance?.tanggal || '-'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {attendance?.jam_masuk || '-'} s/d {attendance?.jam_keluar || 'Belum Check-Out'}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-primary">
                                    Durasi: {attendance?.durasi_kerja || '-'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-mute hover:text-ink">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden p-6">
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-3 text-mute">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-body-sm">Memuat data lokasi rute teknisi...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[420px]">
                            {/* Map Box */}
                            <div className="lg:col-span-2 rounded-lg overflow-hidden border border-hairline relative h-[420px]">
                                {isClient && (
                                    <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-canvas text-mute">Memuat peta Leaflet...</div>}>
                                        <HistoryMap tracks={combinedTracks} />
                                    </Suspense>
                                )}
                            </div>

                            {/* Timeline Timeline Panel */}
                            <div className="flex flex-col border border-hairline rounded-lg bg-canvas-soft/30 overflow-hidden h-[420px]">
                                <div className="p-3 bg-canvas border-b border-hairline flex items-center justify-between">
                                    <span className="text-caption-mono font-semibold uppercase text-ink flex items-center gap-1.5">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Timeline Pergerakan ({combinedTracks.length} Titik)
                                    </span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {combinedTracks.length > 0 ? (
                                        combinedTracks.map((t, idx) => {
                                            const timeStr = new Date(t.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            });

                                            const isCheckIn = idx === 0 && attendance?.jam_masuk;
                                            const isCheckOut = idx === combinedTracks.length - 1 && attendance?.jam_keluar;

                                            return (
                                                <div key={t.id || idx} className="relative pl-6 pb-2 border-l-2 border-hairline last:border-l-transparent group">
                                                    <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-canvas flex items-center justify-center text-[10px] font-bold ${
                                                        isCheckIn ? 'bg-emerald-500 text-white' : isCheckOut ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                                    }`} />

                                                    <div className="bg-canvas border border-hairline rounded-md p-2.5 shadow-2xs group-hover:border-primary/40 transition-colors">
                                                        <div className="flex items-center justify-between text-body-xs font-semibold text-ink">
                                                            <span>
                                                                {isCheckIn ? '📍 Check-In Masuk' : isCheckOut ? '🏁 Check-Out Keluar' : `Titik Rute #${idx + 1}`}
                                                            </span>
                                                            <span className="text-mute font-mono">{timeStr} WIB</span>
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-1 text-xs text-mute font-mono">
                                                            <MapPin className="w-3 h-3 shrink-0" />
                                                            <span>{Number(t.latitude).toFixed(6)}, {Number(t.longitude).toFixed(6)}</span>
                                                        </div>
                                                        {t.kecepatan !== null && t.kecepatan > 0 && (
                                                            <div className="mt-0.5 text-[11px] text-mute">
                                                                Kecepatan: {Number(t.kecepatan).toFixed(1)} km/h
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-12 text-center text-mute text-body-sm">
                                            Tidak ada riwayat kordinat terdeteksi.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-hairline bg-canvas-soft/40 flex items-center justify-between">
                    {attendance?.technician_id && attendance?.tanggal ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-body-xs font-medium"
                            onClick={() => {
                                onClose();
                                router.get(`/tracking/history?technician_id=${attendance.technician_id}&date=${attendance.tanggal}`);
                            }}
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Buka Tracking Lengkap
                        </Button>
                    ) : <div />}

                    <Button variant="outline" size="sm" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            </div>
        </div>
    );
}
