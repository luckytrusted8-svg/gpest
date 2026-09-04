import React, { useState, useEffect, useCallback } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Clock, RefreshCw, History, Shield, MapPin, User, Compass, CheckCircle2, 
    AlertCircle, Building2, Users, HelpCircle, Navigation, ChevronRight, ShieldCheck, Radius
} from 'lucide-react';
import TrackingMap, { TeknisiData, GeofenceData, getDistanceMeters } from '@/Components/TrackingMap';

interface Props {
    technicians?: TeknisiData[];
    geofences?: GeofenceData[];
    selectedDate?: string;
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif / Standby',
    dalam_perjalanan: 'Dalam Perjalanan (OTW)',
    tiba: 'Tiba di Lokasi',
    bekerja: 'Proses Pengerjaan',
    offline: 'Offline / Absen',
};

const statusDotColors: Record<string, string> = {
    aktif: 'bg-emerald-500',
    dalam_perjalanan: 'bg-amber-500',
    tiba: 'bg-purple-500',
    bekerja: 'bg-indigo-500',
    offline: 'bg-slate-400',
};

const statusBadgeColors: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dalam_perjalanan: 'bg-amber-50 text-amber-700 border-amber-200',
    tiba: 'bg-purple-50 text-purple-700 border-purple-200',
    bekerja: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium',
    offline: 'bg-slate-100 text-slate-600 border-slate-200',
};

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return 'Belum ada data';
    const now = new Date();
    const past = new Date(dateStr);
    const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffSec < 60) return `${diffSec} detik lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function TrackingIndex({ technicians = [], geofences = [], selectedDate }: Props) {
    const [date, setDate] = useState<string>(selectedDate || new Date().toISOString().split('T')[0]);
    const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [showPurposeGuide, setShowPurposeGuide] = useState<boolean>(true);
    
    // State to trigger interactive map flyTo animation when user clicks a Geofence or Technician card
    const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        router.reload({
            only: ['technicians', 'geofences'],
            onFinish: () => setIsRefreshing(false),
        });
    }, []);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            handleRefresh();
        }, 15000);
        return () => clearInterval(interval);
    }, [autoRefresh, handleRefresh]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get('/tracking', { date: newDate }, { preserveState: true });
    };

    const onlineCount = technicians.filter((t) => t.status_teknisi !== 'offline').length;
    const workingCount = technicians.filter((t) => ['bekerja', 'tiba', 'dalam_perjalanan'].includes(t.status_teknisi)).length;

    // Calculate technician location relative to active Geofences
    const techsWithGeofenceInfo = technicians.map((tech) => {
        if (!tech.latitude || !tech.longitude) {
            return { ...tech, insideGeofence: null, distanceToPusat: null };
        }

        let matchedGeofence: { gf: GeofenceData; dist: number } | null = null;

        for (const gf of geofences) {
            const gfLat = Number(gf.latitude_pusat);
            const gfLng = Number(gf.longitude_pusat);
            const radius = Number(gf.radius_meter) || 100;
            const dist = getDistanceMeters(Number(tech.latitude), Number(tech.longitude), gfLat, gfLng);

            if (dist <= radius) {
                matchedGeofence = { gf, dist };
                break;
            }
        }

        return {
            ...tech,
            insideGeofence: matchedGeofence?.gf ?? null,
            distanceToPusat: matchedGeofence?.dist ?? null,
        };
    });

    const techsInsideGeofenceTotal = techsWithGeofenceInfo.filter((t) => t.insideGeofence !== null).length;

    return (
        <AppLayout>
            <Head title="Lacak Teknisi & Monitoring Geofence Real-Time" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 tracking-wide">
                                Monitoring Lapangan G-PEST
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-mono">
                                Monitoring Real-Time Presisi
                            </span>
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                            <Compass className="w-5 h-5 text-blue-600" />
                            Lacak Teknisi Real-Time & Monitoring Geofence
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Memantau koordinat GPS teknisi di lapangan dan kepadatan personel dalam radius geofence lokasi site.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                            Refresh
                        </button>
                        <Link href="/tracking/history">
                            <button className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors">
                                <History className="w-3.5 h-3.5" />
                                Riwayat Rute
                            </button>
                        </Link>
                        <Link href="/geofences">
                            <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs">
                                <Shield className="w-3.5 h-3.5 text-white" />
                                Kelola Geofence
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Explainer Banner: Fungsi & Manfaat Geofence */}
                {showPurposeGuide && (
                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300">
                                    <ShieldCheck className="w-5 h-5" />
                                </span>
                                <h3 className="text-sm font-extrabold text-white tracking-wide">
                                    Fungsi & Manfaat Fitur Geofencing di G-PEST
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowPurposeGuide(false)}
                                className="text-slate-300 hover:text-white text-xs font-semibold px-2 py-0.5 rounded bg-white/10"
                            >
                                Sembunyikan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    1. Validasi Absensi Presisi
                                </div>
                                <p className="text-[11px] text-blue-100 leading-relaxed">
                                    Memastikan teknisi berada di dalam radius area site saat Check-in (mencegah absen dari luar lokasi).
                                </p>
                            </div>

                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                                    2. Deteksi Kedatangan Otomatis
                                </div>
                                <p className="text-[11px] text-blue-100 leading-relaxed">
                                    Status tugas otomatis berubah menjadi "Tiba di Lokasi" begitu teknisi masuk ke dalam gelombang geofence site.
                                </p>
                            </div>

                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                                    3. Monitoring Jumlah Personel
                                </div>
                                <p className="text-[11px] text-blue-100 leading-relaxed">
                                    Mengetahui secara tepat berapa personel teknisi yang sedang bertugas di dalam tiap zona geofence klien.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Geofence Active Zone Live Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Geofence Aktif</div>
                            <div className="text-2xl font-extrabold text-blue-600 mt-1">{geofences.length} Zona Area</div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teknisi di Dalam Geofence</div>
                            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{techsInsideGeofenceTotal} Personel</div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teknisi di Luar Geofence</div>
                            <div className="text-2xl font-extrabold text-slate-700 mt-1">{technicians.length - techsInsideGeofenceTotal} Personel</div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Tracking Main View Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left: Interactive Leaflet Map (3 Span) */}
                    <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-blue-600" />
                                Peta Pemantauan GPS Real-Time ({technicians.length} Teknisi • {geofences.length} Zona Radius)
                            </h2>
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 flex-wrap">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Aktif</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Bekerja</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Offline</span>
                                <span className="flex items-center gap-1 font-bold text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Radius Geofence</span>
                            </div>
                        </div>

                        {/* Direct Vanilla Leaflet Map with Focus Target FlyTo Support */}
                        <TrackingMap data={technicians} geofences={geofences} height="560px" focusTarget={focusTarget} />

                        {/* Active Geofence Zones Live Breakdown Cards (Clickable to FlyTo Map) */}
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                                    Kepadatan Personel per Radius Area Geofence:
                                </h3>
                                <span className="text-[11px] text-blue-600 font-semibold italic">
                                    * Klik kartu di bawah untuk mengarahkan kamera peta ke titik lokasi geofence
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {geofences.map((gf) => {
                                    const gfLat = Number(gf.latitude_pusat);
                                    const gfLng = Number(gf.longitude_pusat);
                                    const radius = Number(gf.radius_meter) || 100;

                                    const insideTechs = technicians.filter((t) => {
                                        if (!t.latitude || !t.longitude) return false;
                                        return getDistanceMeters(Number(t.latitude), Number(t.longitude), gfLat, gfLng) <= radius;
                                    });

                                    return (
                                        <div
                                            key={gf.id}
                                            onClick={() => setFocusTarget({ lat: gfLat, lng: gfLng, zoom: 16 })}
                                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50/60 hover:border-blue-300 transition-all space-y-2 cursor-pointer group shadow-xs hover:shadow-md"
                                            title="Klik untuk mengarahkan kamera peta ke lokasi geofence ini"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-700">
                                                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    {gf.nama}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${insideTechs.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {insideTechs.length} Teknisi di Dalam Radius
                                                    </span>
                                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1">
                                                        <Compass className="w-3 h-3" />
                                                        Fokuskan Peta 🎯
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-slate-500 flex justify-between font-mono">
                                                <span>Radius: <strong>{radius} Meter</strong></span>
                                                <span>{gfLat.toFixed(5)}, {gfLng.toFixed(5)}</span>
                                            </div>

                                            {insideTechs.length > 0 ? (
                                                <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                                                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Teknisi Bertugas di Area Ini:</div>
                                                    {insideTechs.map((it) => (
                                                        <div key={it.id} className="text-[11px] font-semibold text-slate-800 flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                                            <span>👤 {it.name}</span>
                                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">{it.status_teknisi}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200/60 flex items-center justify-between">
                                                    <span>Tidak ada teknisi di dalam radius geofence ini saat ini.</span>
                                                    <span className="text-blue-600 text-[10px] font-bold underline">Arahkan Peta →</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {geofences.length === 0 && (
                                    <div className="col-span-2 text-center py-4 text-slate-400 text-xs">
                                        Belum ada area geofence yang aktif. Tambahkan di menu "Kelola Geofence".
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Technician Status & Geofence Verification Panel (1 Span) */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Tim Teknisi ({technicians.length})
                                </h2>
                                <p className="text-[11px] text-slate-500">{onlineCount} Online • {workingCount} Bertugas</p>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                            {techsWithGeofenceInfo.map((tech) => {
                                const dotColor = statusDotColors[tech.status_teknisi] || 'bg-slate-400';
                                const badgeClass = statusBadgeColors[tech.status_teknisi] || 'bg-slate-100 text-slate-600 border-slate-200';
                                const hasCoordinates = tech.latitude !== null && tech.longitude !== null;

                                return (
                                    <div
                                        key={tech.id}
                                        onClick={() => {
                                            if (hasCoordinates) {
                                                setFocusTarget({ lat: Number(tech.latitude), lng: Number(tech.longitude), zoom: 16 });
                                            }
                                        }}
                                        className={`p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all space-y-2 ${hasCoordinates ? 'cursor-pointer group' : ''}`}
                                        title={hasCoordinates ? 'Klik untuk mengarahkan kamera peta ke posisi GPS teknisi ini' : 'Teknisi belum mengirim koordinat GPS'}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                                                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{tech.name}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${badgeClass}`}>
                                                {statusLabels[tech.status_teknisi] || tech.status_teknisi}
                                            </span>
                                        </div>

                                        {/* Geofence Position Badge */}
                                        {tech.insideGeofence ? (
                                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold space-y-0.5">
                                                <div className="flex items-center gap-1 font-bold text-emerald-900">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>Di Dalam Area Geofence:</span>
                                                </div>
                                                <p className="text-emerald-700 pl-4">{tech.insideGeofence.nama}</p>
                                                <p className="text-[10px] text-emerald-600 pl-4 font-mono">
                                                    Jarak ke pusat: {tech.distanceToPusat}m (Max {tech.insideGeofence.radius_meter}m)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-medium flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span>Di Luar Area Geofence Aktif</span>
                                            </div>
                                        )}

                                        {tech.schedule ? (
                                            <div className="text-[11px] bg-white border border-slate-200 rounded-lg p-2 space-y-1">
                                                <div className="font-mono font-bold text-blue-600">{tech.schedule.schedule_code}</div>
                                                <div className="text-slate-700 font-medium flex items-start gap-1">
                                                    <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                                    <span className="truncate">{tech.schedule.lokasi}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-slate-400 italic pl-2">
                                                Tidak ada penugasan aktif
                                            </div>
                                        )}

                                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-slate-300" />
                                                {timeAgo(tech.last_update)}
                                            </span>
                                            {hasCoordinates ? (
                                                <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:underline">
                                                    <Compass className="w-3 h-3" />
                                                    Fokuskan Peta →
                                                </span>
                                            ) : (
                                                <span className="text-rose-500 font-semibold">GPS Off</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {technicians.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    Belum ada data teknisi terdaftar.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
