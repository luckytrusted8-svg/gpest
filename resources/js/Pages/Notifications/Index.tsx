import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2, CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: number;
    judul: string;
    pesan: string;
    jenis: 'info' | 'sukses' | 'peringatan' | 'error';
    modul: string;
    url_tujuan: string | null;
    dibaca_pada: string | null;
    created_at: string;
    sudah_dibaca: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedNotifications {
    data: Notification[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    notifications: PaginatedNotifications;
    filter: string;
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
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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

const jenisBg: Record<string, string> = {
    info: 'bg-[#0070f3]/10',
    sukses: 'bg-[#0070f3]/10',
    peringatan: 'bg-[#f5a623]/10',
    error: 'bg-[#ee0000]/10',
};

const filterTabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'belum_dibaca', label: 'Belum Dibaca' },
    { value: 'sudah_dibaca', label: 'Sudah Dibaca' },
];

export default function Index({ notifications, filter }: Props) {
    const [activeFilter, setActiveFilter] = useState(filter);

    const changeFilter = (f: string) => {
        setActiveFilter(f);
        router.get('/notifications', { filter: f }, { preserveState: true, replace: true });
    };

    const handleMarkRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, {
            onFinish: () => router.reload({ only: ['notifications', 'notifikasi_belum_dibaca'] }),
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/notifications/${id}`, {
            onFinish: () => router.reload({ only: ['notifications', 'notifikasi_belum_dibaca'] }),
        });
    };

    const handleMarkAllRead = () => {
        router.post('/notifications/read-all', {}, {
            onFinish: () => router.reload({ only: ['notifications', 'notifikasi_belum_dibaca'] }),
        });
    };

    return (
        <AppLayout>
            <Head title="Notifikasi" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Notifikasi</h1>
                        <p className="text-body-sm text-mute mt-1">Pusat notifikasi dari seluruh modul sistem.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleMarkAllRead}
                            variant="outline"
                            className="text-body-sm-strong flex items-center gap-2"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Tandai Semua Dibaca
                        </Button>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="flex border-b border-hairline">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => changeFilter(tab.value)}
                                className={`flex-1 px-4 py-3 text-body-sm font-medium transition-colors ${
                                    activeFilter === tab.value
                                        ? 'text-ink border-b-2 border-ink bg-canvas-soft/50'
                                        : 'text-mute hover:text-ink hover:bg-canvas-soft/30'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-hairline">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notif) => {
                                const Icon = jenisIcon[notif.jenis] ?? Bell;
                                const color = jenisColor[notif.jenis] ?? 'text-mute';
                                const bg = jenisBg[notif.jenis] ?? 'bg-canvas-soft-2';
                                return (
                                    <div
                                        key={notif.id}
                                        className={`flex items-start gap-4 px-4 py-4 transition-colors ${
                                            notif.sudah_dibaca ? 'bg-white' : 'bg-canvas-soft/30'
                                        } hover:bg-canvas-soft/50`}
                                    >
                                        <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-4 h-4 ${color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-body-sm-strong ${notif.sudah_dibaca ? 'text-body-text' : 'text-ink'}`}>
                                                    {notif.judul}
                                                </span>
                                                {! notif.sudah_dibaca && (
                                                    <span className="w-2 h-2 rounded-full bg-[#0070f3] shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-body-sm text-body-text mt-0.5 line-clamp-2">{notif.pesan}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[11px] text-mute">{timeAgo(notif.created_at)}</span>
                                                <span className="text-[11px] text-mute capitalize">{notif.modul}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {! notif.sudah_dibaca && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-mute hover:text-[#0070f3]"
                                                    onClick={() => handleMarkRead(notif.id)}
                                                    title="Tandai sudah dibaca"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-mute hover:text-[#ee0000]"
                                                onClick={() => handleDelete(notif.id)}
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 text-mute mx-auto mb-3" />
                                <p className="text-body-sm text-mute">Tidak ada notifikasi.</p>
                            </div>
                        )}
                    </div>

                    {notifications.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {notifications.total} notifikasi</div>
                            <div className="flex items-center gap-1">
                                {notifications.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${link.active ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
