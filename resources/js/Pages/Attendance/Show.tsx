import React, { useState, useEffect, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, User, Activity, ExternalLink } from 'lucide-react';
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
    email?: string;
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

interface Props {
    attendance: Attendance;
    dailyRecords?: Attendance[];
    tracks?: Track[];
}

export default function Show({ attendance, dailyRecords = [], tracks = [] }: Props) {
    const [isClient, setIsClient] = useState(false);
    const [combinedTracks, setCombinedTracks] = useState<Track[]>([]);

    useEffect(() => {
        setIsClient(true);

        const list: Track[] = [];
        if (attendance.latitude_masuk && attendance.longitude_masuk) {
            list.push({
                id: 999991,
                latitude: attendance.latitude_masuk,
                longitude: attendance.longitude_masuk,
                akurasi: 5,
                kecepatan: 0,
                status_teknisi: 'aktif',
                created_at: `${attendance.tanggal}T${attendance.jam_masuk || '00:00:00'}`,
            });
        }

        tracks.forEach((t) => list.push(t));

        if (attendance.latitude_keluar && attendance.longitude_keluar) {
            list.push({
                id: 999999,
                latitude: attendance.latitude_keluar,
                longitude: attendance.longitude_keluar,
                akurasi: 5,
                kecepatan: 0,
                status_teknisi: 'offline',
                created_at: `${attendance.tanggal}T${attendance.jam_keluar || '23:59:59'}`,
            });
        }

        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setCombinedTracks(list);
    }, [attendance, tracks]);

    return (
        <AppLayout>
            <Head title={`Detail Kehadiran - ${attendance.technician?.name || 'Teknisi'}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.get('/attendance')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Detail Kehadiran</h1>
                        <p className="text-body-sm text-mute mt-0.5">Informasi jam kerja dan peta riwayat lokasi {attendance.technician?.name}</p>
                    </div>
                </div>

                {/* Header Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <User className="w-4 h-4 text-primary" />
                            Teknisi
                        </div>
                        <p className="mt-2 text-body-md font-semibold text-ink">{attendance.technician?.name || '-'}</p>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            Tanggal Absensi
                        </div>
                        <p className="mt-2 text-body-md font-semibold text-ink">{attendance.tanggal}</p>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Clock className="w-4 h-4 text-primary" />
                            Jam Masuk / Keluar
                        </div>
                        <p className="mt-2 text-body-md font-semibold font-mono text-ink">
                            {attendance.jam_masuk || '-'} s/d {attendance.jam_keluar || 'Belum Check-Out'}
                        </p>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            Total Durasi Kerjad
                        </div>
                        <p className="mt-2 text-body-md font-semibold font-mono text-primary">
                            {attendance.durasi_kerja || '-'}
                        </p>
                    </div>
                </div>

                {/* Map & Timeline Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-canvas border border-hairline rounded-lg overflow-hidden shadow-2xs p-4 flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-body-md font-semibold text-ink flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Peta Rute Tracking Teknisi
                            </h2>
                            <Link href={`/tracking/history?technician_id=${attendance.technician_id}&date=${attendance.tanggal}`}>
                                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Buka Tracking Full
                                </Button>
                            </Link>
                        </div>
                        <div className="h-[450px] rounded-lg overflow-hidden border border-hairline">
                            {isClient && (
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-mute">Memuat peta...</div>}>
                                    <HistoryMap tracks={combinedTracks} />
                                </Suspense>
                            )}
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="bg-canvas border border-hairline rounded-lg overflow-hidden shadow-2xs flex flex-col">
                        <div className="p-4 bg-canvas-soft/40 border-b border-hairline">
                            <h2 className="text-body-sm font-semibold text-ink flex items-center gap-2 uppercase tracking-wider text-xs">
                                <Activity className="w-4 h-4 text-primary" />
                                Riwayat Waktu & Lokasi ({combinedTracks.length} Titik)
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[450px]">
                            {combinedTracks.length > 0 ? (
                                combinedTracks.map((t, idx) => {
                                    const timeStr = new Date(t.created_at).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    });

                                    const isCheckIn = idx === 0 && attendance.jam_masuk;
                                    const isCheckOut = idx === combinedTracks.length - 1 && attendance.jam_keluar;

                                    return (
                                        <div key={t.id || idx} className="relative pl-6 pb-2 border-l-2 border-hairline last:border-l-transparent">
                                            <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-canvas flex items-center justify-center text-[10px] font-bold ${
                                                isCheckIn ? 'bg-emerald-500 text-white' : isCheckOut ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                            }`} />

                                            <div className="bg-canvas-soft/40 border border-hairline rounded-md p-3">
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
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center text-mute text-body-sm">
                                    Tidak ada data kordinat lokasi.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
