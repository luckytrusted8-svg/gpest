import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Clock, MapPin, LogIn, LogOut, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface RecentAttendance {
    id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_keluar: string | null;
    status: string;
    durasi_kerja: string | null;
}

interface Props {
    todayAttendance: RecentAttendance | null;
    recentAttendances: RecentAttendance[];
}

function useCurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    return time;
}

function useGeolocation() {
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const requestLocation = useCallback(() => {
        if (! navigator.geolocation) {
            setError('Geolocation tidak didukung oleh browser ini.');
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                setLoading(false);
            },
            (err) => {
                setError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    return { coords, error, loading, requestLocation };
}

export default function CheckIn({ todayAttendance, recentAttendances }: Props) {
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;
    const auth = (props as Record<string, unknown>).auth as { user?: { id: number; name: string } } | undefined;
    const currentTime = useCurrentTime();
    const { coords, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    const hasCheckedIn = !! todayAttendance?.jam_masuk;
    const hasCheckedOut = !! todayAttendance?.jam_keluar;

    const handleCheckIn = () => {
        if (! coords) {
            alert('Lokasi GPS belum tersedia. Silakan aktifkan GPS dan coba lagi.');
            return;
        }
        setProcessing(true);
        router.post('/attendance/check-in', {
            latitude: coords.latitude,
            longitude: coords.longitude,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleCheckOut = () => {
        if (! coords) {
            alert('Lokasi GPS belum tersedia. Silakan aktifkan GPS dan coba lagi.');
            return;
        }
        setProcessing(true);
        router.post('/attendance/check-out', {
            latitude: coords.latitude,
            longitude: coords.longitude,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const statusText = hasCheckedOut ? 'Sudah Keluar' : hasCheckedIn ? 'Sudah Masuk' : 'Belum Masuk';
    const statusColor = hasCheckedOut ? 'text-mute' : hasCheckedIn ? 'text-[#0070f3]' : 'text-mute';

    return (
        <AppLayout>
            <Head title="Check-in Kehadiran" />

            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {flash.error}
                    </div>
                )}

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="p-6 text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 text-body-sm text-mute">
                            <User className="w-4 h-4" />
                            {auth?.user?.name}
                        </div>

                        <div className="text-display-xl font-bold text-ink tracking-tight font-mono tabular-nums">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-body-sm text-mute">{formatDate(currentTime)}</div>

                        <div className={`inline-flex items-center gap-1.5 text-body-sm-strong ${statusColor}`}>
                            <div className={`w-2 h-2 rounded-full ${hasCheckedOut ? 'bg-mute' : hasCheckedIn ? 'bg-[#0070f3]' : 'bg-mute'}`} />
                            {statusText}
                        </div>
                    </div>

                    <div className="border-t border-hairline p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-canvas-soft rounded-md p-4 text-center">
                                <div className="text-caption text-mute uppercase tracking-wider mb-1">Jam Masuk</div>
                                <div className="text-body-md-strong text-ink font-mono">{todayAttendance?.jam_masuk ?? '-'}</div>
                            </div>
                            <div className="bg-canvas-soft rounded-md p-4 text-center">
                                <div className="text-caption text-mute uppercase tracking-wider mb-1">Jam Keluar</div>
                                <div className="text-body-md-strong text-ink font-mono">{todayAttendance?.jam_keluar ?? '-'}</div>
                            </div>
                        </div>

                        {coords && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mute">
                                <MapPin className="w-3 h-3" />
                                GPS aktif ({coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)})
                            </div>
                        )}
                        {geoError && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#ee0000]">
                                <AlertCircle className="w-3 h-3" />
                                {geoError}
                            </div>
                        )}
                        {geoLoading && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mute">
                                <MapPin className="w-3 h-3 animate-pulse" />
                                Mendapatkan lokasi...
                            </div>
                        )}
                    </div>

                    <div className="border-t border-hairline p-6 space-y-3">
                        {! hasCheckedIn && (
                            <Button
                                onClick={handleCheckIn}
                                disabled={processing || ! coords}
                                className="w-full h-16 text-body-lg font-semibold bg-[#0070f3] hover:bg-[#0060df] text-white rounded-md flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                <LogIn className="w-6 h-6" />
                                {processing ? 'Memproses...' : 'MASUK'}
                            </Button>
                        )}
                        {hasCheckedIn && ! hasCheckedOut && (
                            <Button
                                onClick={handleCheckOut}
                                disabled={processing || ! coords}
                                variant="outline"
                                className="w-full h-16 text-body-lg font-semibold border-[#ee0000] text-[#ee0000] hover:bg-[#ee0000]/5 rounded-md flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                <LogOut className="w-6 h-6" />
                                {processing ? 'Memproses...' : 'KELUAR'}
                            </Button>
                        )}
                        {hasCheckedOut && (
                            <div className="text-center text-body-sm text-mute py-4">
                                Anda sudah check-out hari ini. Sampai jumpa besok!
                            </div>
                        )}
                        {! coords && ! geoLoading && (
                            <Button
                                onClick={requestLocation}
                                variant="outline"
                                className="w-full text-body-sm-strong flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
                                Aktifkan Lokasi GPS
                            </Button>
                        )}
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="p-4 border-b border-hairline">
                        <h2 className="text-body-md-strong text-ink flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-mute" />
                            Riwayat 7 Hari Terakhir
                        </h2>
                    </div>
                    <div className="divide-y divide-hairline">
                        {recentAttendances.length > 0 ? (
                            recentAttendances.map((att) => (
                                <div key={att.id} className="px-4 py-3 flex items-center justify-between text-body-sm">
                                    <div>
                                        <div className="text-ink font-medium">{att.tanggal}</div>
                                        <div className="text-xs text-mute mt-0.5">
                                            {att.jam_masuk ?? '-'} - {att.jam_keluar ?? '-'}
                                            {att.durasi_kerja && ` (${att.durasi_kerja})`}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        att.status === 'hadir' ? 'bg-[#0070f3]/15 text-[#0070f3]'
                                        : att.status === 'izin' ? 'bg-[#f5a623]/15 text-[#ab570a]'
                                        : att.status === 'sakit' ? 'bg-[#7928ca]/15 text-[#7928ca]'
                                        : 'bg-[#ee0000]/15 text-[#ee0000]'
                                    }`}>
                                        {att.status === 'hadir' ? 'Hadir' : att.status === 'izin' ? 'Izin' : att.status === 'sakit' ? 'Sakit' : 'Tidak Hadir'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-mute text-body-sm">
                                Belum ada riwayat kehadiran.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
