import { Link, usePage, router } from '@inertiajs/react';
import { 
    Home, Users, Calendar, FileText, DollarSign, Settings, ClipboardList, 
    Shield, CheckCircle, XCircle, X, MapPin, Radar, MessageSquare, 
    ShieldCheck, CreditCard, LogOut, User as UserIcon, ChevronDown
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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
    const pendingRequestsCount = (props.pending_requests_count as number) ?? 0;

    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sidebarNavRef = useRef<HTMLElement>(null);

    // Restore sidebar scroll position across Inertia page transitions
    useEffect(() => {
        const savedScroll = sessionStorage.getItem('gpest_sidebar_scroll');
        if (savedScroll && sidebarNavRef.current) {
            sidebarNavRef.current.scrollTop = Number(savedScroll);
        }
    }, [url]);

    const handleSidebarScroll = (e: React.UIEvent<HTMLElement>) => {
        sessionStorage.setItem('gpest_sidebar_scroll', String(e.currentTarget.scrollTop));
    };

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userRoles = auth?.user?.roles || [];
    const userPermissions = auth?.user?.permissions || [];
    const isSuperAdmin = userRoles.includes('super_admin');
    const isTechnician = userRoles.includes('technician');

    const canAccess = (permission?: string) => {
        if (!permission) return true;
        if (isSuperAdmin) return true;
        return userPermissions.includes(permission);
    };

    const rawNavItems = [
        {
            label: 'WORKSPACE',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: Home, permission: 'dashboard.view' },
            ],
        },
        {
            label: 'CRM & PROSPEK',
            items: [
                { name: 'Prospek (Leads)', href: '/crm', icon: Users, permission: 'customers.view' },
            ],
        },
        {
            label: 'PELANGGAN & LOKASI',
            items: [
                { name: 'Daftar Pelanggan', href: '/customers', icon: Users, permission: 'customers.view' },
                { name: 'Titik Lokasi (Site)', href: '/sites', icon: MapPin, permission: 'sites.view' },
            ],
        },
        {
            label: 'PERMINTAAN KLIEN',
            items: [
                { name: 'Tiket Request Klien', href: '/customer-requests', icon: MessageSquare, permission: 'customer-requests.view' },
            ],
        },
        {
            label: 'LAYANAN & WORK ORDER',
            items: [
                { name: 'Perintah Kerja (WO)', href: '/work-orders', icon: ClipboardList, permission: 'work-orders.view' },
                { name: 'Jadwal Layanan', href: '/schedules', icon: Calendar, permission: 'schedules.view' },
            ],
        },
        {
            label: 'PEMANTAUAN LAPANGAN',
            items: [
                { name: 'Lacak Teknisi Real-Time', href: '/tracking', icon: Radar, permission: 'technicians.view' },
                { name: 'Batas Wilayah (Geofence)', href: '/geofences', icon: ShieldCheck, permission: 'technicians.view' },
            ],
        },
        {
            label: 'LAPORAN KERJA',
            items: [
                { name: 'Laporan Hasil Kerja', href: '/work-reports', icon: ClipboardList, permission: 'work-reports.view' },
                { name: 'Laporan Survey & Inspeksi', href: '/survey-reports', icon: FileText, permission: 'survey-reports.view' },
            ],
        },
        {
            label: 'KEUANGAN & KONTRAK',
            items: [
                { name: 'Penawaran Harga (Quotation)', href: '/quotations', icon: DollarSign, permission: 'quotations.view' },
                { name: 'Kontrak Kerja', href: '/contracts', icon: FileText, permission: 'contracts.view' },
                { name: 'Tagihan (Invoice)', href: '/invoices', icon: CreditCard, permission: 'invoices.view' },
            ],
        },
        {
            label: 'HUMAN RESOURCES',
            items: [
                { name: 'Absensi Teknisi', href: '/attendance', icon: MapPin, permission: 'attendance.view' },
                { name: 'Pengajuan Cuti & Izin', href: '/leaves', icon: Shield },
                { name: 'Data Teknisi', href: '/technicians', icon: Users, permission: 'technicians.view' },
            ],
        },
        {
            label: 'SISTEM & PENGATURAN',
            items: [
                { name: 'App-Builder', href: '/app-builder', icon: Settings, permission: 'master-data.view' },
                { name: 'Data Master', href: '/master-data', icon: Settings, permission: 'master-data.view' },
                { name: 'Kelola Pengguna', href: '/users', icon: Users, permission: 'users.view' },
                { name: 'Audit Log', href: '/audit-logs', icon: ShieldCheck, permission: 'users.view' },
            ],
        },
    ];

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

    const mobileTapItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Jadwal', href: '/schedules', icon: Calendar },
        { name: 'Absen', href: '/attendance/check-in', icon: MapPin, isCenter: true },
        { name: 'Laporan', href: '/work-reports', icon: ClipboardList },
        { name: 'Cuti', href: '/leaves', icon: Shield },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col md:flex-row text-slate-900 antialiased font-sans">
            {/* Flash Toast Notifications */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[9999] flex items-start gap-3 px-4 py-3 rounded-2xl shadow-ambient-lg border text-xs max-w-sm transition-all duration-300 ${
                    notification.type === 'success'
                        ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/95 border-rose-200 text-rose-900'
                }`}>
                    {notification.type === 'success'
                        ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        : <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    }
                    <span className="flex-1 font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Desktop Sidebar (Only for non-technicians) */}
            {!isTechnician && (
                <aside className="hidden md:flex w-[240px] bg-white border-r border-slate-200 fixed inset-y-0 left-0 flex-col z-40 shadow-xs">
                    {/* Brand Header */}
                    <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav
                        ref={sidebarNavRef}
                        onScroll={handleSidebarScroll}
                        className="flex-1 px-3 py-4 space-y-5 overflow-y-auto"
                    >
                        {navItems.map((section, idx) => (
                            <div key={idx} className="space-y-1">
                                <h2 className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                                    {section.label}
                                </h2>
                                <div className="space-y-0.5 mt-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = item.href === '/dashboard' ? url === item.href : url.startsWith(item.href);
                                        const isRequestMenu = item.href === '/customer-requests';
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                preserveScroll
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                                                    isActive
                                                        ? 'bg-slate-900 text-white shadow-xs'
                                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                <span className="flex-1 truncate">{item.name}</span>
                                                {isRequestMenu && pendingRequestsCount > 0 && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-900 text-white border border-slate-700">
                                                        {pendingRequestsCount}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* User Profile Card at Bottom */}
                    <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate">{auth?.user?.name || 'User'}</p>
                                <p className="text-[10px] text-slate-400 truncate capitalize font-mono">
                                    {userRoles[0] ? userRoles[0].replace('_', ' ') : 'User'}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Viewport */}
            <div className={`flex-1 flex flex-col min-w-0 ${!isTechnician ? 'md:pl-[240px]' : ''} pb-16 md:pb-0`}>
                {/* Header Navbar */}
                <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Logo visible for technicians ALWAYS and for non-technicians on mobile */}
                        <Link href="/dashboard" className={`flex items-center ${!isTechnician ? 'md:hidden' : ''}`}>
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-8 w-auto object-contain" />
                        </Link>

                        {!isTechnician && (
                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span className="font-mono text-slate-400">G-PEST</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-900 font-semibold">{currentPage?.name || 'Overview'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <NotificationBell />

                        {/* User Avatar Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                                    {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-ambient-lg border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2.5 border-b border-slate-100">
                                        <div className="font-semibold text-slate-900 truncate">{auth?.user?.name || 'User'}</div>
                                        <div className="text-slate-400 truncate text-[11px] mt-0.5">{auth?.user?.email || ''}</div>
                                        <div className="inline-block px-2 py-0.5 bg-slate-50 text-slate-700 text-[10px] font-mono font-medium rounded-md mt-1.5 border border-slate-200">
                                            {userRoles[0] ? userRoles[0].replace('_', ' ') : 'User'}
                                        </div>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="w-full px-4 py-2 text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 text-slate-400" /> Pengaturan Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors border-t border-slate-100 mt-1 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" /> Keluar dari Akun
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area - Balanced and Centered */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full flex justify-center">
                    <div className="w-full max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Tap Bar */}
            <nav className={`fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 h-16 flex items-center justify-around px-2 shadow-sm ${!isTechnician ? 'md:hidden' : ''}`}>
                {mobileTapItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/dashboard' ? url === item.href : url.startsWith(item.href);

                    if (item.isCenter) {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center group -mt-5"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                                    isActive
                                        ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 ring-4 ring-white'
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                                isActive ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                            <span className="text-[10px] mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}