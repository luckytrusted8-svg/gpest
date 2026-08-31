import { Link, usePage } from '@inertiajs/react';
import { Home, Users, Calendar, FileText, DollarSign, Settings, ClipboardList, Shield, CheckCircle, XCircle, X, MapPin, Radar } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationBell from '@/Components/NotificationBell';

interface AppLayoutProps {
    children: React.ReactNode;
}

interface AuthProps {
    user?: {
        id: number;
        name: string;
        email: string;
        roles?: string[];
        permissions?: string[];
    };
}

interface FlashProps {
    success?: string;
    error?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { url, props } = usePage();
    const auth = props.auth as AuthProps;
    const flash = props.flash as FlashProps;

    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setNotification({ type: 'success', message: flash.success });
            const t = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(t);
        }
        if (flash?.error) {
            setNotification({ type: 'error', message: flash.error });
            const t = setTimeout(() => setNotification(null), 6000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    const userRoles = auth?.user?.roles || [];
    const userPermissions = auth?.user?.permissions || [];
    const isSuperAdmin = userRoles.includes('super_admin');

    const canAccess = (permission?: string) => {
        if (!permission) return true;
        if (isSuperAdmin) return true;
        return userPermissions.includes(permission);
    };

    const rawNavItems = [
        {
            label: 'UTAMA',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: Home, permission: 'dashboard.view' },
            ],
        },
        {
            label: 'OPERASIONAL',
            items: [
                { name: 'Pelanggan', href: '/customers', icon: Users, permission: 'customers.view' },
                { name: 'Kontrak', href: '/contracts', icon: FileText, permission: 'contracts.view' },
                { name: 'Jadwal', href: '/schedules', icon: Calendar, permission: 'schedules.view' },
                { name: 'Teknisi', href: '/technicians', icon: Shield, permission: 'technicians.view' },
            ],
        },
        {
            label: 'LAPANGAN',
            items: [
                { name: 'Laporan Kerja', href: '/work-reports', icon: ClipboardList, permission: 'work-reports.view' },
                { name: 'Laporan Survey', href: '/survey-reports', icon: FileText, permission: 'work-reports.view' },
                { name: 'Kehadiran', href: '/attendance', icon: MapPin, permission: 'attendance.view' },
            ],
        },
        {
            label: 'PELACAKAN',
            items: [
                { name: 'Monitoring Lokasi', href: '/tracking', icon: Radar, permission: 'technicians.view' },
            ],
        },
        {
            label: 'CRM',
            items: [
                { name: 'Leads', href: '/crm', icon: Users, permission: 'customers.view' },
            ],
        },
        {
            label: 'KEUANGAN',
            items: [
                { name: 'Penawaran', href: '/quotations', icon: DollarSign, permission: 'contracts.view' },
            ],
        },
        {
            label: 'SISTEM',
            items: [
                { name: 'Data Master', href: '/master-data', icon: Settings, permission: 'master-data.view' },
                { name: 'Pengguna', href: '/users', icon: Users, permission: 'users.view' },
            ],
        },
    ];

    // Filter items based on user permissions
    const navItems = rawNavItems
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => canAccess(item.permission)),
        }))
        .filter((section) => section.items.length > 0);

    const allItems = navItems.flatMap((s) => s.items);
    const currentPage = allItems.find((item) =>
        item.href === '/dashboard' ? url === item.href : url.startsWith(item.href)
    );

    return (
        <div className="min-h-screen bg-canvas-soft flex">
            {/* Flash Toast Notifications */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[9999] flex items-start gap-3 px-4 py-3 rounded-md shadow-md border text-body-sm max-w-sm transition-all ${
                    notification.type === 'success'
                        ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                        : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                }`}>
                    {notification.type === 'success'
                        ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#16a34a]" />
                        : <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc2626]" />
                    }
                    <span className="flex-1">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-[240px] bg-canvas border-r border-hairline fixed inset-y-0 left-0 flex flex-col z-40 shadow-sm">
                {/* Brand Header */}
                <div className="h-16 px-6 border-b border-hairline flex items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-primary text-on-primary font-bold font-mono flex items-center justify-center text-xs shadow-sm">
                            GP
                        </div>
                        <span className="text-display-sm font-bold text-ink tracking-tight">GPEST</span>
                    </div>
                </div>

                {/* Scrollable Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
                    {navItems.map((section) => (
                        <div key={section.label}>
                            <div className="px-3 text-[11px] font-mono font-semibold uppercase text-mute tracking-wider mb-2">
                                {section.label}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.href === '/dashboard'
                                        ? url === item.href
                                        : url.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-body-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-canvas-soft-2 text-ink font-semibold border border-hairline shadow-xs'
                                                    : 'text-body-text hover:bg-canvas-soft hover:text-ink'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-mute'}`} />
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
                {/* Topbar Header */}
                <header className="h-16 bg-canvas border-b border-hairline flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-xs">
                    <div className="text-body-md-strong text-ink font-semibold">
                        {currentPage?.name || 'Dashboard'}
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-4 w-[1px] bg-hairline" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-xs font-bold text-ink">
                                {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : 'US'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-body-sm-strong text-ink leading-tight flex items-center gap-1.5">
                                    {auth?.user?.name || 'Pengguna'}
                                    {userRoles.length > 0 && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-canvas-soft border border-hairline text-mute">
                                            {userRoles[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="text-caption text-mute">{auth?.user?.email || 'admin@gpest.com'}</div>
                            </div>
                            <div className="h-4 w-[1px] bg-hairline hidden sm:block" />
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="hidden sm:flex items-center gap-1 text-caption text-mute hover:text-error transition-colors"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 bg-canvas-soft overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}