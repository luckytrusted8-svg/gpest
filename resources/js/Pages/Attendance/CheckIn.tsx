import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
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

    return (
        <AppLayout>
            <Head title="Presensi & Absensi Teknisi - G-PEST" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Information Banner Shift Working Hours */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                        <Clock className="w-4 h-4 text-slate-700 shrink-0" />
                        <span>Ketentuan Jam Kerja Operasional:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <strong className="text-slate-900 font-semibold block text-xs">Teknisi Lapangan</strong>
                            <span className="text-[11px]">Jam fleksibel / Sesuai jadwal work order</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <strong className="text-slate-900 font-semibold block text-xs">Staff Kantor</strong>
                            <span className="text-[11px]">Senin - Jumat: 08:00 - 16:00 WIB</span>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        {flash.error}
                    </div>
                )}

                {/* Main Card Check-In */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 text-center space-y-3">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium text-slate-700">{auth?.user?.name || 'Teknisi'}</span>
                        </div>

                        <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-xs text-slate-500">{formatDate(currentTime)}</div>

                        <div className="pt-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                hasCheckedOut ? 'bg-slate-100 text-slate-600'
                                : hasCheckedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${hasCheckedOut ? 'bg-slate-400' : hasCheckedIn ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {statusText}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Jam Masuk</div>
                                <div className="text-base font-semibold text-slate-900 font-mono">{todayAttendance?.jam_masuk ?? '-'}</div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Jam Keluar</div>
                                <div className="text-base font-semibold text-slate-900 font-mono">{todayAttendance?.jam_keluar ?? '-'}</div>
                            </div>
                        </div>

                        {coords && (
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                <span>GPS Aktif ({coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)})</span>
                            </div>
                        )}
                        {geoError && (
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{geoError}</span>
                            </div>
                        )}
                        {geoLoading && (
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                                <MapPin className="w-3.5 h-3.5 animate-pulse text-slate-500" />
                                <span>Mendapatkan lokasi GPS...</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-6 space-y-3">
                        {! hasCheckedIn && (
                            <button
                                onClick={handleCheckIn}
                                disabled={processing || ! coords}
                                className="w-full h-14 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 shadow-sm cursor-pointer"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>{processing ? 'Memproses...' : 'CHECK IN MASUK'}</span>
                            </button>
                        )}
                        {hasCheckedIn && ! hasCheckedOut && (
                            <button
                                onClick={handleCheckOut}
                                disabled={processing || ! coords}
                                className="w-full h-14 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 shadow-sm cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>{processing ? 'Memproses...' : 'CHECK OUT KELUAR'}</span>
                            </button>
                        )}
                        {hasCheckedOut && (
                            <div className="text-center text-xs text-slate-500 py-3 font-medium">
                                Anda sudah melakukan check-out hari ini.
                            </div>
                        )}
                        {! coords && ! geoLoading && (
                            <button
                                onClick={requestLocation}
                                className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Aktifkan GPS</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* History Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            Riwayat Presensi 7 Hari Terakhir
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentAttendances.length > 0 ? (
                            recentAttendances.map((att) => (
                                <div key={att.id} className="px-4 py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <div className="text-slate-900 font-medium">{att.tanggal}</div>
                                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                            {att.jam_masuk ?? '-'} - {att.jam_keluar ?? '-'}
                                            {att.durasi_kerja && ` (${att.durasi_kerja})`}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                        att.status === 'hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : att.status === 'izin' ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {att.status === 'hadir' ? 'Hadir' : att.status === 'izin' ? 'Izin' : att.status === 'sakit' ? 'Sakit' : 'Tidak Hadir'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                Belum ada riwayat presensi.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
