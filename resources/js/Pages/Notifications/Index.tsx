import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { 
    Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2, 
    CheckCheck, ArrowRight, ExternalLink, Send, Building2, User, ShieldCheck, ClipboardList, MessageSquare 
} from 'lucide-react';
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
    info: 'text-blue-600',
    sukses: 'text-emerald-600',
    peringatan: 'text-amber-600',
    error: 'text-rose-600',
};

const jenisBg: Record<string, string> = {
    info: 'bg-blue-50 border-blue-100',
    sukses: 'bg-emerald-50 border-emerald-100',
    peringatan: 'bg-amber-50 border-amber-100',
    error: 'bg-rose-50 border-rose-100',
};

const getModuleRouting = (modul: string) => {
    switch (modul) {
        case 'customer-requests':
            return {
                label: 'Tiket Request Klien',
                origin: 'Pelanggan (Customer Portal)',
                destination: 'Admin & Tim Operasional Dashboard',
                badgeCls: 'bg-blue-50 text-blue-700 border-blue-200',
            };
        case 'work-reports':
            return {
                label: 'Laporan Kerja',
                origin: 'Teknisi Lapangan',
                destination: 'Supervisor & Klien Portal',
                badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            };
        case 'schedules':
            return {
                label: 'Jadwal Layanan',
                origin: 'Admin / Alokasi Sistem',
                destination: 'Teknisi & Klien Berlangganan',
                badgeCls: 'bg-purple-50 text-purple-700 border-purple-200',
            };
        case 'contracts':
            return {
                label: 'Kontrak Layanan',
                origin: 'Sistem Pengingat Kontrak',
                destination: 'Super Admin & Sales PIC',
                badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
            };
        case 'attendance':
            return {
                label: 'Absensi Teknisi',
                origin: 'Check-In GPS Teknisi',
                destination: 'Supervisor & HR Management',
                badgeCls: 'bg-teal-50 text-teal-700 border-teal-200',
            };
        default:
            return {
                label: 'Sistem Utama',
                origin: 'Pemberitahuan Otomatis Sistem',
                destination: 'Pengguna Terdaftar',
                badgeCls: 'bg-slate-100 text-slate-700 border-slate-200',
            };
    }
};

const filterTabs = [
    { value: 'semua', label: 'Semua Notifikasi' },
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
            <Head title="Pusat Notifikasi & Indikator Pesan" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Page */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" /> Pusat Notifikasi & Indikator Pesan
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Memantau asal pesan (*origin*) dan tujuan distribusi notifikasi di seluruh modul G-PEST.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            onClick={handleMarkAllRead}
                            variant="outline"
                            className="text-xs font-semibold flex items-center gap-2 border-slate-200"
                        >
                            <CheckCheck className="w-4 h-4 text-emerald-600" />
                            Tandai Semua Dibaca
                        </Button>
                    </div>
                </div>

                {/* Routing Guide Legend Box */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <Send className="w-4 h-4" /> Indikator Alur & Distribusi Pesan Sistem
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                            <span className="font-bold text-blue-300">1. Klien ➔ Admin</span>
                            <p className="text-[11px] text-slate-300">Request/komplain dari Customer Portal masuk ke Dashboard Admin.</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                            <span className="font-bold text-emerald-300">2. Teknisi ➔ Supervisor</span>
                            <p className="text-[11px] text-slate-300">Laporan kerja & absensi teknisi masuk untuk verifikasi supervisor.</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                            <span className="font-bold text-purple-300">3. Admin ➔ Klien & Teknisi</span>
                            <p className="text-[11px] text-slate-300">Pemberitahuan jadwal & status persetujuan laporan terkirim ke klien.</p>
                        </div>
                    </div>
                </div>

                {/* Notifications Table / List */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="flex border-b border-slate-200 bg-slate-50/60">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => changeFilter(tab.value)}
                                className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                                    activeFilter === tab.value
                                        ? 'text-blue-700 border-b-2 border-blue-600 bg-white'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-slate-100">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notif) => {
                                const Icon = jenisIcon[notif.jenis] ?? Bell;
                                const color = jenisColor[notif.jenis] ?? 'text-slate-500';
                                const bg = jenisBg[notif.jenis] ?? 'bg-slate-50 border-slate-200';
                                const routeInfo = getModuleRouting(notif.modul);

                                return (
                                    <div
                                        key={notif.id}
                                        className={`p-4 sm:p-5 transition-colors ${
                                            notif.sudah_dibaca ? 'bg-white' : 'bg-blue-50/20'
                                        } hover:bg-slate-50/80 space-y-2`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl border ${bg} flex items-center justify-center shrink-0`}>
                                                    <Icon className={`w-4 h-4 ${color}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-sm font-bold ${notif.sudah_dibaca ? 'text-slate-800' : 'text-slate-900'}`}>
                                                            {notif.judul}
                                                        </span>
                                                        {! notif.sudah_dibaca && (
                                                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase">
                                                                Baru
                                                            </span>
                                                        )}
                                                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${routeInfo.badgeCls}`}>
                                                            {routeInfo.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                        {timeAgo(notif.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                {! notif.sudah_dibaca && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs text-blue-600 hover:bg-blue-50 border-slate-200"
                                                        onClick={() => handleMarkRead(notif.id)}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-blue-600" />
                                                        Dibaca
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                                    onClick={() => handleDelete(notif.id)}
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Pesan Isi Notifikasi */}
                                        <p className="text-xs text-slate-700 leading-relaxed pl-12">
                                            {notif.pesan}
                                        </p>

                                        {/* Routing Details & Action Link */}
                                        <div className="ml-12 pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px]">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                <span className="font-semibold text-slate-700">Dari:</span> {routeInfo.origin}
                                                <span className="text-slate-300">➔</span>
                                                <span className="font-semibold text-slate-700">Tujuan:</span> {routeInfo.destination}
                                            </div>

                                            {notif.url_tujuan && (
                                                <Link href={notif.url_tujuan}>
                                                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-blue-200">
                                                        <span>Buka Halaman Modul</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-16 text-center text-slate-400">
                                <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                <p className="text-sm font-semibold text-slate-700">Tidak ada notifikasi.</p>
                                <p className="text-xs text-slate-400 mt-1">Notifikasi sistem akan otomatis terdaftar di sini.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                            <div className="text-slate-500 font-medium">Total {notifications.total} notifikasi</div>
                            <div className="flex items-center gap-1">
                                {notifications.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                                                link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={idx} className="px-3 py-1 rounded-lg border text-xs font-medium bg-slate-50 text-slate-400 border-slate-200 opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
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
