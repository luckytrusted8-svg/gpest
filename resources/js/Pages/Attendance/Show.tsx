import React, { useState, useEffect, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { 
    ArrowLeft, Calendar, Clock, MapPin, User, Activity, 
    ExternalLink, Camera, Building2, Globe, ShieldCheck, 
    Sparkles, X, Image as ImageIcon 
} from 'lucide-react';
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
    work_type?: string | null;
    lokasi_nama?: string | null;
    selfie_masuk?: string | null;
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
    const [photoModalOpen, setPhotoModalOpen] = useState(false);

    const isWfa = attendance.work_type === 'WFA' || (!attendance.work_type && attendance.lokasi_nama?.includes('WFA'));

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/attendance" prefetch>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-display-sm font-semibold text-ink">Detail Kehadiran</h1>
                                {isWfa ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        <Globe className="w-3.5 h-3.5" />
                                        Work From Anywhere (WFA)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <Building2 className="w-3.5 h-3.5" />
                                        Work From Office (WFO)
                                    </span>
                                )}
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">Informasi lengkap presensi, foto kehadiran wajah, dan verifikasi GPS {attendance.technician?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/tracking/history?technician_id=${attendance.technician_id}&date=${attendance.tanggal}`}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Buka Full Live Tracking
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Header Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <User className="w-4 h-4 text-primary" />
                            Nama Teknisi
                        </div>
                        <p className="mt-2 text-body-md font-bold text-slate-900">{attendance.technician?.name || '-'}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">ID: #{attendance.technician_id}</p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            Tanggal Absensi
                        </div>
                        <p className="mt-2 text-body-md font-bold text-slate-900">{attendance.tanggal}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Status: <strong className="text-blue-600 uppercase">{attendance.status}</strong></p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Clock className="w-4 h-4 text-primary" />
                            Jam Masuk / Keluar
                        </div>
                        <p className="mt-2 text-body-md font-bold font-mono text-slate-900">
                            {attendance.jam_masuk || '-'} s/d {attendance.jam_keluar || 'Belum Check-Out'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Zona Waktu: WIB</p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-mute text-body-xs font-medium">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            Total Durasi Kerja
                        </div>
                        <p className="mt-2 text-body-md font-bold font-mono text-blue-600">
                            {attendance.durasi_kerja || '-'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {!attendance.jam_keluar ? 'Sedang Berlangsung' : 'Selesai Bertugas'}
                        </p>
                    </div>
                </div>

                {/* Section Foto Wajah & Metadata Presensi */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs p-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Camera className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-body-md font-bold text-slate-900">Verifikasi Foto Muka & Lokasi Check-In</h2>
                                <p className="text-xs text-slate-400">Bukti visual kehadiran fisik teknisi saat presensi masuk</p>
                            </div>
                        </div>
                        {attendance.selfie_masuk && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPhotoModalOpen(true)}
                                className="text-xs flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                Perbesar Foto
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Foto Preview Box */}
                        <div className="md:col-span-1">
                            {attendance.selfie_masuk ? (
                                <div 
                                    onClick={() => setPhotoModalOpen(true)}
                                    className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 aspect-[4/3] flex items-center justify-center shadow-md hover:border-blue-500 transition-all"
                                >
                                    <img
                                        src={attendance.selfie_masuk}
                                        alt={`Selfie ${attendance.technician?.name}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white text-xs">
                                        <div className="font-bold flex items-center gap-1">
                                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                                            <span>Foto Check-In Masuk</span>
                                        </div>
                                        <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                                            {attendance.tanggal} • {attendance.jam_masuk} WIB
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 aspect-[4/3] flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                    <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                                    <span className="text-xs font-semibold">Tidak ada foto selfie</span>
                                    <span className="text-[11px] text-slate-400 mt-0.5">Presensi dicatat tanpa foto wajah</span>
                                </div>
                            )}
                        </div>

                        {/* Location Details & Verification Badges */}
                        <div className="md:col-span-2 space-y-3">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lokasi Penugasan / Presensi</div>
                                <div className="text-body-md font-bold text-slate-900 mt-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>{attendance.lokasi_nama || (isWfa ? 'Titik Tugas Lapangan (WFA)' : 'G-PEST Central Service • Head Office')}</span>
                                </div>
                                {attendance.latitude_masuk && attendance.longitude_masuk && (
                                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit">
                                        <span>GPS:</span>
                                        <span className="font-bold text-slate-900">{Number(attendance.latitude_masuk).toFixed(6)}, {Number(attendance.longitude_masuk).toFixed(6)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <div>
                                        <div className="font-bold">Kehadiran Tervalidasi</div>
                                        <div className="text-[11px] text-emerald-700">GPS & Timestamp Otentik</div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl flex items-center gap-2.5">
                                    <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                                    <div>
                                        <div className="font-bold">Skema {isWfa ? 'WFA' : 'WFO'}</div>
                                        <div className="text-[11px] text-blue-700">Tracking GPS Terhubung</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map & Timeline Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs p-4 flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-body-md font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Peta Rute Tracking Teknisi
                            </h2>
                            <Link href={`/tracking/history?technician_id=${attendance.technician_id}&date=${attendance.tanggal}`}>
                                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Buka Tracking Full
                                </Button>
                            </Link>
                        </div>
                        <div className="h-[450px] rounded-xl overflow-hidden border border-slate-200">
                            {isClient && (
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-mute">Memuat peta...</div>}>
                                    <HistoryMap tracks={combinedTracks} />
                                </Suspense>
                            )}
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <h2 className="text-body-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider text-xs">
                                <Activity className="w-4 h-4 text-blue-600" />
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
                                        <div key={t.id || idx} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-l-transparent">
                                            <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                                                isCheckIn ? 'bg-emerald-500 text-white' : isCheckOut ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                            }`} />

                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                                <div className="flex items-center justify-between text-body-xs font-semibold text-slate-900">
                                                    <span>
                                                        {isCheckIn ? '📍 Check-In Masuk' : isCheckOut ? '🏁 Check-Out Keluar' : `Titik Rute #${idx + 1}`}
                                                    </span>
                                                    <span className="text-slate-400 font-mono">{timeStr} WIB</span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-mono">
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

            {/* Photo Zoom Modal */}
            {photoModalOpen && attendance.selfie_masuk && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setPhotoModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h3 className="text-sm font-bold">Foto Presensi - {attendance.technician?.name || 'Teknisi'}</h3>
                                    <p className="text-[11px] text-slate-300 font-mono">{attendance.tanggal} • {attendance.jam_masuk} WIB • {isWfa ? 'WFA' : 'WFO'}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPhotoModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
                            <img
                                src={attendance.selfie_masuk}
                                alt="Foto Selfie Presensi"
                                className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-slate-800 shadow-lg"
                            />
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                <Sparkles className="w-4 h-4" />
                                Foto Presensi Terverifikasi
                            </span>
                            <a
                                href={attendance.selfie_masuk}
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
        </AppLayout>
    );
}
