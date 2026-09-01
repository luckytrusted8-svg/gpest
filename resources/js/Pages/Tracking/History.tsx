import React, { useState, useEffect, Suspense } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
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

interface Technicia {
    id: number;
    name: string;
}

interface Props {
    tracks?: Track[];
    technician: Technicia;
    selectedDate: string;
    allTechnicians?: Technicia[];
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    dalam_perjalanan: 'Dalam Perjalanan',
    tiba: 'Tiba',
    bekerja: 'Bekerja',
    offline: 'Offline',
};

const statusColors: Record<string, string> = {
    aktif: '#16a34a',
    dalam_perjalanan: '#2563eb',
    tiba: '#7928ca',
    bekerja: '#f5a623',
    offline: '#888888',
};

export default function History({ tracks = [], technician, selectedDate, allTechnicians = [] }: Props) {
    const [techId, setTechId] = useState(String(technician?.id || ''));
    const [date, setDate] = useState(selectedDate);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const applyFilter = () => {
        router.get('/tracking/history', { technician_id: techId, date }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Riwayat Lokasi" />

            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.get('/tracking')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">Riwayat Lokasi</h1>
                            <p className="text-body-sm text-mute mt-0.5">Jalur pergerakan {technician?.name ?? 'Teknisi'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <select
                            value={techId}
                            onChange={(e) => setTechId(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
                        >
                            {allTechnicians.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button onClick={applyFilter} variant="outline" className="text-body-sm-strong">
                            Tampilkan
                        </Button>
                    </div>
                </div>

                <div className="h-[450px] rounded-lg overflow-hidden border border-hairline shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] bg-canvas">
                    {isClient && (
                        <Suspense fallback={<div className="h-[450px] w-full flex items-center justify-center bg-canvas text-mute text-body-sm">Memuat peta...</div>}>
                            <HistoryMap tracks={tracks} />
                        </Suspense>
                    )}
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">#</th>
                                    <th className="py-3 px-4 font-semibold">Waktu</th>
                                    <th className="py-3 px-4 font-semibold">Koordinat</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold">Akurasi</th>
                                    <th className="py-3 px-4 font-semibold">Kecepatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {tracks.length > 0 ? (
                                    tracks.map((track, idx) => (
                                        <tr key={track.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 text-mute">{idx + 1}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-mute" />
                                                    {new Date(track.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <MapPin className="w-3.5 h-3.5 text-mute" />
                                                    <span className="font-mono">{Number(track.latitude).toFixed(6)}, {Number(track.longitude).toFixed(6)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: statusColors[track.status_teknisi] }}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[track.status_teknisi] }} />
                                                    {statusLabels[track.status_teknisi]}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-mute">
                                                {track.akurasi ? `${Number(track.akurasi).toFixed(1)}m` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-mute">
                                                {track.kecepatan ? `${Number(track.kecepatan).toFixed(1)} km/h` : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-mute text-body-sm">
                                            Tidak ada data lokasi untuk tanggal ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
