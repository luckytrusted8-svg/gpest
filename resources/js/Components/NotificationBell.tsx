import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Notification {
    id: number;
    judul: string;
    pesan: string;
    jenis: 'info' | 'sukses' | 'peringatan' | 'error';
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
    if (diffMin < 60) return `${diffMin} menit lalu`;
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
    info: 'text-[#0070f3]',
    sukses: 'text-[#0070f3]',
    peringatan: 'text-[#f5a623]',
    error: 'text-[#ee0000]',
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
                setNotifications((data.data ?? data).slice(0, 5));
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

    const handleMarkRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, {
            onFinish: () => {
                fetchNotifications();
                router.reload({ only: ['notifikasi_belum_dibaca'] });
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
                className="p-2 rounded-md hover:bg-canvas-soft text-mute hover:text-ink transition-colors relative"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-[#ee0000] text-white text-[10px] font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-canvas border border-hairline rounded-lg shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
                        <span className="text-body-sm-strong text-ink">Notifikasi</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={loading}
                                className="text-xs text-link hover:underline disabled:opacity-50"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-hairline">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const Icon = jenisIcon[notif.jenis] ?? Bell;
                                const color = jenisColor[notif.jenis] ?? 'text-mute';
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkRead(notif.id)}
                                        className="px-4 py-3 hover:bg-canvas-soft/50 cursor-pointer transition-colors flex gap-3"
                                    >
                                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-body-sm font-medium text-ink truncate">{notif.judul}</div>
                                            <div className="text-xs text-mute line-clamp-2 mt-0.5">{notif.pesan}</div>
                                            <div className="text-[11px] text-mute mt-1">{timeAgo(notif.created_at)}</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-mute text-body-sm">
                                Tidak ada notifikasi baru.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-hairline px-4 py-2.5">
                        <Link
                            href="/notifications"
                            onClick={() => setOpen(false)}
                            className="block text-center text-xs text-link hover:underline font-medium"
                        >
                            Lihat semua notifikasi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
