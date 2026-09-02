import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, ArrowRight, MessageSquare, ClipboardList, Calendar, MapPin, FileText } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Notification {
    id: number;
    judul: string;
    pesan: string;
    jenis: 'info' | 'sukses' | 'peringatan' | 'error';
    modul?: string;
    url_tujuan: string | null;
    dibaca_pada: string | null;
    created_at: string;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hri lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const jenisIcon: Record<string, typeof Bell> = {
    info: Info,
    sukses: CheckCircle,
    peringatan: AlertTriangle,
    error: AlertCircle,
};

const jenisColor: Record<string, string> = {
    info: 'text-blue-600',
    sukses: 'text-emerald-600',
    peringatan: 'text-amber-600',
    error: 'text-rose-600',
};

const getModuleBadge = (modul?: string) => {
    switch (modul) {
        case 'customer-requests':
            return { label: 'Tiket Request Klien', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'work-reports':
            return { label: 'Laporan Kerja', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        case 'schedules':
            return { label: 'Jadwal Layanan', cls: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'contracts':
            return { label: 'Kontrak Layanan', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
        case 'attendance':
            return { label: 'Absensi Teknisi', cls: 'bg-teal-50 text-teal-700 border-teal-200' };
        default:
            return { label: 'Sistem', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
};

export default function NotificationBell() {
    const { props } = usePage();
    const unreadCount = (props as Record<string, unknown>).notifikasi_belum_dibaca as number ?? 0;

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/notifications?filter=belum_dibaca', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
                setNotifications(list.slice(0, 5));
            }
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        intervalRef.current = setInterval(fetchNotifications, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && ! dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = () => {
        setLoading(true);
        router.post('/notifications/read-all', {}, {
            onFinish: () => {
                fetchNotifications();
                setLoading(false);
                router.reload({ only: ['notifikasi_belum_dibaca'] });
            },
        });
    };

    const handleMarkRead = (id: number, urlTujuan: string | null) => {
        router.post(`/notifications/${id}/read`, {}, {
            onFinish: () => {
                fetchNotifications();
                router.reload({ only: ['notifikasi_belum_dibaca'] });
                if (urlTujuan) {
                    router.visit(urlTujuan);
                }
            },
        });
    };

    const toggle = () => {
        setOpen((prev) => ! prev);
        if (! open) fetchNotifications();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors relative"
                title="Pemberitahuan & Notifikasi"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 flex items-center justify-center px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-88 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">Notifikasi Masuk</span>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {unreadCount} Belum Dibaca
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={loading}
                                className="text-xs text-blue-600 hover:underline font-semibold disabled:opacity-50"
                            >
                                Tandai Semua Dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const Icon = jenisIcon[notif.jenis] ?? Bell;
                                const color = jenisColor[notif.jenis] ?? 'text-slate-500';
                                const badge = getModuleBadge(notif.modul);

                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkRead(notif.id, notif.url_tujuan)}
                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon className={`w-4 h-4 ${color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900 truncate">{notif.judul}</span>
                                                <span className="text-[10px] text-slate-400 font-medium shrink-0">{timeAgo(notif.created_at)}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.pesan}</p>

                                            {notif.url_tujuan && (
                                                <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 pt-0.5 hover:underline">
                                                    <span>Lihat Detail Halaman</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center text-slate-400">
                                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-600">Tidak ada notifikasi baru.</p>
                                <p className="text-[11px] text-slate-400">Pemberitahuan modul akan muncul di sini secara otomatis.</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50/50">
                        <Link
                            href="/notifications"
                            onClick={() => setOpen(false)}
                            className="block text-center text-xs text-blue-600 hover:underline font-bold"
                        >
                            Buka Pusat Notifikasi Lengkap →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
