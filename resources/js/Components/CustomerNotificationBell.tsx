import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle,
    ArrowRight,
    MessageSquare,
    ClipboardList,
    CalendarCheck,
    FileText,
    CheckCheck,
    X,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { playNotificationChime } from '@/lib/sound';

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
    if (diffDay < 7) return `${diffDay} hari lalu`;
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
            return { label: 'Jadwal Treatment', cls: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'contracts':
            return { label: 'Kontrak Layanan', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
        case 'invoices':
            return { label: 'Tagihan Invoice', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
        default:
            return { label: 'Pemberitahuan', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
};

export default function CustomerNotificationBell() {
    const { props } = usePage();
    const initialUnreadCount = (props as Record<string, unknown>).notifikasi_belum_dibaca as number ?? 0;

    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/portal/notifications?filter=belum_dibaca', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
                setNotifications(list.slice(0, 8));
                if (typeof data.unread_count === 'number') {
                    setUnreadCount(data.unread_count);
                }
            }
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        intervalRef.current = setInterval(fetchNotifications, 25000);
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
        router.post('/portal/notifications/read-all', {}, {
            preserveScroll: true,
            onFinish: () => {
                setUnreadCount(0);
                fetchNotifications();
                setLoading(false);
            },
        });
    };

    const handleMarkRead = (id: number, urlTujuan: string | null) => {
        setOpen(false);
        router.post(`/portal/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onFinish: () => {
                fetchNotifications();
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
                type="button"
                onClick={toggle}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200 cursor-pointer focus:outline-hidden"
                aria-label="Buka Notifikasi Pelanggan"
            >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white shadow-xs animate-pulse ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover Panel */}
            {open && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-900">Pemberitahuan Layanan</span>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full">
                                    {unreadCount} Baru
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={loading}
                                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span>Tandai Semua Dibaca</span>
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center px-4">
                                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-semibold text-slate-700">Tidak ada notifikasi baru</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Semua info jadwal, laporan, dan tiket layanan Anda telah dibaca.</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const Icon = jenisIcon[n.jenis] ?? Info;
                                const colorClass = jenisColor[n.jenis] ?? 'text-blue-600 bg-blue-50';
                                const badge = getModuleBadge(n.modul);
                                const isUnread = !n.dibaca_pada;

                                return (
                                    <div
                                        key={n.id}
                                        className={`p-3.5 transition-colors relative flex items-start gap-3 hover:bg-slate-50/90 ${
                                            isUnread ? 'bg-blue-50/30' : ''
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                                    {timeAgo(n.created_at)}
                                                </span>
                                            </div>

                                            <p className={`text-xs leading-snug line-clamp-1 ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                                                {n.judul}
                                            </p>
                                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                                {n.pesan}
                                            </p>

                                            <div className="flex items-center gap-3 mt-2">
                                                {n.url_tujuan && (
                                                    <Link
                                                        href={n.url_tujuan}
                                                        onClick={() => handleMarkRead(n.id, n.url_tujuan)}
                                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <span>Buka Halaman</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                                {isUnread && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMarkRead(n.id, null)}
                                                        className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                                                    >
                                                        Tandai dibaca
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {isUnread && (
                                            <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
