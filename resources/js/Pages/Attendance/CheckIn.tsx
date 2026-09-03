import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Clock, MapPin, LogIn, LogOut, CheckCircle, AlertCircle, 
    Calendar, User, ChevronLeft, ChevronRight, CheckCircle2, 
    Briefcase, Sparkles 
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface AttendanceRecord {
    id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_keluar: string | null;
    status: string;
    durasi_kerja: string | null;
    latitude_masuk?: number | null;
    longitude_masuk?: number | null;
}

interface Props {
    todayAttendance: AttendanceRecord | null;
    monthlyAttendances: AttendanceRecord[];
    selectedMonth?: string;
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
        if (!navigator.geolocation) {
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

export default function CheckIn({ todayAttendance, monthlyAttendances = [], selectedMonth }: Props) {
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;
    const auth = (props as Record<string, unknown>).auth as { user?: { id: number; name: string } } | undefined;
    const currentTime = useCurrentTime();
    const { coords, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
    const [processing, setProcessing] = useState(false);

    const currentMonthStr = selectedMonth || new Date().toISOString().slice(0, 7);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    const hasCheckedIn = Boolean(todayAttendance?.jam_masuk);
    const hasCheckedOut = Boolean(todayAttendance?.jam_keluar);

    const handleCheckIn = () => {
        if (!coords) {
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
        if (!coords) {
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

    const statusText = hasCheckedOut ? 'Sudah Selesai (Check-Out)' : hasCheckedIn ? 'Sudah Hadir (Check-In)' : 'Belum Melakukan Presensi';

    // Monthly Navigation Handlers
    const [yearNum, monthNum] = currentMonthStr.split('-').map(Number);
    const monthDate = new Date(yearNum, monthNum - 1, 1);
    const monthDisplayTitle = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        const d = new Date(yearNum, monthNum - 2, 1);
        const nextStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.get('/attendance/check-in', { month: nextStr }, { preserveScroll: true, preserveState: true });
    };

    const handleNextMonth = () => {
        const d = new Date(yearNum, monthNum, 1);
        const nextStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.get('/attendance/check-in', { month: nextStr }, { preserveScroll: true, preserveState: true });
    };

    const formatHeaderDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <AppLayout>
            <Head title="Presensi Harian & Riwayat Bulanan - G-PEST" />

            <div className="max-w-xl mx-auto space-y-6">
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
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Main Card Check-In Hari Ini */}
                <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-semibold text-slate-800">{auth?.user?.name || 'Teknisi Lapangan'}</span>
                        </div>

                        <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight font-mono tabular-nums pt-1">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-xs text-slate-500">{formatDate(currentTime)}</div>

                        <div className="pt-2">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold ${
                                hasCheckedOut ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : hasCheckedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${hasCheckedOut ? 'bg-slate-400' : hasCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                {statusText}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 p-5 bg-slate-50/60">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono font-semibold">Jam Masuk</div>
                                <div className="text-base font-bold text-slate-900 font-mono">{todayAttendance?.jam_masuk ? todayAttendance.jam_masuk.slice(0, 5) : '-'}</div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono font-semibold">Jam Keluar</div>
                                <div className="text-base font-bold text-slate-900 font-mono">{todayAttendance?.jam_keluar ? todayAttendance.jam_keluar.slice(0, 5) : '-'}</div>
                            </div>
                        </div>

                        {coords && (
                            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-700 font-mono bg-emerald-50/80 py-1.5 px-3 rounded-xl border border-emerald-200/60">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>GPS Aktif: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}</span>
                            </div>
                        )}
                        {geoError && (
                            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{geoError}</span>
                            </div>
                        )}
                        {geoLoading && (
                            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                                <MapPin className="w-3.5 h-3.5 animate-pulse text-slate-500" />
                                <span>Mendapatkan lokasi GPS presisi...</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-5 space-y-3">
                        {!hasCheckedIn && (
                            <button
                                onClick={handleCheckIn}
                                disabled={processing || !coords}
                                className="w-full h-13 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 shadow-sm cursor-pointer"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>{processing ? 'Memproses...' : 'CHECK IN MASUK'}</span>
                            </button>
                        )}
                        {hasCheckedIn && !hasCheckedOut && (
                            <button
                                onClick={handleCheckOut}
                                disabled={processing || !coords}
                                className="w-full h-13 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 shadow-sm cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>{processing ? 'Memproses...' : 'CHECK OUT KELUAR'}</span>
                            </button>
                        )}
                        {hasCheckedOut && (
                            <div className="text-center text-xs text-slate-500 py-2 font-medium">
                                Anda telah menyelesaikan presensi kerja hari ini.
                            </div>
                        )}
                        {!coords && !geoLoading && (
                            <button
                                onClick={requestLocation}
                                className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Aktifkan GPS / Ambil Ulang Lokasi</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MONTH NAVIGATION HEADER (Sesuai Referensi Foto) */}
                <div className="pt-2">
                    <div className="flex items-center justify-between px-1 mb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                            title="Bulan Sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
                            {monthDisplayTitle}
                        </h2>

                        <button
                            onClick={handleNextMonth}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                            title="Bulan Berikutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* DAFTAR KARTU PRESENSI BULANAN (Sesuai Layout Foto) */}
                    <div className="space-y-4">
                        {monthlyAttendances.length > 0 ? (
                            monthlyAttendances.map((att) => {
                                const inTime = att.jam_masuk ? att.jam_masuk.slice(0, 5) : '-';
                                const outTime = att.jam_keluar ? att.jam_keluar.slice(0, 5) : '-';

                                return (
                                    <div key={att.id} className="space-y-1.5">
                                        {/* Tanggal Header */}
                                        <div className="text-xs font-bold text-slate-500 px-1 font-mono">
                                            {formatHeaderDate(att.tanggal)}
                                        </div>

                                        {/* Card Presensi */}
                                        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors">
                                            {/* Top Tag */}
                                            <div className="flex justify-end">
                                                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                                    {att.status === 'hadir' ? 'WFO / LAPANGAN' : att.status.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Row Check-In / Durasi Tugas / Check-Out */}
                                            <div className="flex items-center justify-between gap-2">
                                                {/* Left: Check In */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <LogIn className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] text-slate-400 font-medium">Check In</div>
                                                        <div className="text-base font-bold text-slate-900 font-mono">{inTime}</div>
                                                        <div className="text-[10px] font-semibold text-emerald-600">Presensi Masuk</div>
                                                    </div>
                                                </div>

                                                {/* Center: Durasi Penugasan Fleksibel */}
                                                <div className="flex-1 max-w-[150px] text-center px-1">
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                                                        Penugasan Lapangan
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full my-1.5 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all ${
                                                                att.jam_keluar ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-2/3 animate-pulse'
                                                            }`} 
                                                        />
                                                    </div>
                                                    <div className={`text-[10px] font-semibold font-mono ${
                                                        att.jam_keluar ? 'text-emerald-700' : 'text-amber-700'
                                                    }`}>
                                                        {att.jam_keluar 
                                                            ? (att.durasi_kerja ? `${att.durasi_kerja} • Selesai` : 'Tugas Selesai')
                                                            : 'Sedang Bertugas • Aktif'
                                                        }
                                                    </div>
                                                </div>

                                                {/* Right: Check Out */}
                                                <div className="flex items-center gap-3 text-right">
                                                    <div>
                                                        <div className="text-[11px] text-slate-400 font-medium">Check Out</div>
                                                        <div className="text-base font-bold text-slate-900 font-mono">{outTime}</div>
                                                        <div className={`text-[10px] font-semibold ${att.jam_keluar ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {att.jam_keluar ? 'Presensi Selesai' : 'Sedang Berjalan'}
                                                        </div>
                                                    </div>
                                                    <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                                                        <LogOut className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Address */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                <span className="truncate">
                                                    G-PEST Central Service • Titik Lokasi Presensi Terverifikasi
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center text-slate-400 text-xs shadow-2xs">
                                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                <p className="font-semibold text-slate-700">Belum Ada Presensi di Bulan {monthDisplayTitle}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Gunakan tombol panah di atas untuk melihat bulan lainnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
