import { Link, router, usePage } from '@inertiajs/react';
import { 
    Bell, CheckCircle, AlertCircle, Info, AlertTriangle, ArrowRight, 
    MessageSquare, ClipboardList, Calendar, MapPin, FileText, X, CheckCheck
} from 'lucide-react';
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
    info: 'text-blue-600 bg-blue-50',
    sukses: 'text-emerald-600 bg-emerald-50',
    peringatan: 'text-amber-600 bg-amber-50',
    error: 'text-rose-600 bg-rose-50',
};

const getModuleBadge = (modul?: string) => {
    switch (modul) {
        case 'customer-requests':
            return { label: 'Tiket Request', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'work-reports':
            return { label: 'Laporan Kerja', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        case 'schedules':
            return { label: 'Jadwal Layanan', cls: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'contracts':
            return { label: 'Kontrak Layanan', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
        case 'attendance':
            return { label: 'Presensi', cls: 'bg-teal-50 text-teal-700 border-teal-200' };
        case 'leaves':
            return { label: 'Cuti & Izin', cls: 'bg-orange-50 text-orange-700 border-orange-200' };
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
                setNotifications(list.slice(0, 6));
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
                    setOpen(false);
                    router.visit(urlTujuan);
                }
            },
        });
    };

    const toggle = () => {
        setOpen((prev) => !prev);
        if (!open) fetchNotifications();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Trigger */}
            <button
                onClick={toggle}
                className="w-10 h-10 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all relative shadow-2xs cursor-pointer active:scale-95"
                title="Pemberitahuan & Notifikasi"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] flex items-center justify-center px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-sm animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Backdrop on mobile */}
            {open && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-150" 
                    onClick={() => setOpen(false)} 
                />
            )}

            {/* Notification Popover Panel (Full mobile responsive) */}
            {open && (
                <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">Notifikasi Masuk</span>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {unreadCount} Baru
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={loading}
                                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 disabled:opacity-50"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span>Tandai Dibaca</span>
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg sm:hidden"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const Icon = jenisIcon[notif.jenis] ?? Bell;
                                const colorClass = jenisColor[notif.jenis] ?? 'text-slate-600 bg-slate-100';
                                const badge = getModuleBadge(notif.modul);

                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkRead(notif.id, notif.url_tujuan)}
                                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 items-start"
                                    >
                                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60 ${colorClass}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-xs font-bold text-slate-900 truncate">{notif.judul}</span>
                                                <span className="text-[10px] text-slate-400 font-medium shrink-0 font-mono">{timeAgo(notif.created_at)}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">{notif.pesan}</p>

                                            {notif.url_tujuan && (
                                                <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1 pt-1">
                                                    <span>Buka Halaman Terkait</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-12 px-4 text-center text-slate-400">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">Tidak ada notifikasi baru</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto leading-relaxed">
                                    Pemberitahuan tugas, jadwal, laporan, dan persetujuan cuti akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Link */}
                    <div className="border-t border-slate-100 p-3 bg-slate-50/80">
                        <Link
                            href="/notifications"
                            onClick={() => setOpen(false)}
                            className="block text-center text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors"
                        >
                            Buka Semua Notifikasi →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
