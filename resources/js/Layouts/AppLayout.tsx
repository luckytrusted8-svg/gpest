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
            label: 'DASHBOARD',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: Home, permission: 'dashboard.view' },
            ],
        },
        {
            label: 'CRM',
            items: [
                { name: 'Leads', href: '/crm', icon: Users, permission: 'customers.view' },
            ],
        },
        {
            label: 'CUSTOMER',
            items: [
                { name: 'Customer List', href: '/customers', icon: Users, permission: 'customers.view' },
                { name: 'Sites (Lokasi)', href: '/sites', icon: MapPin, permission: 'customers.view' },
            ],
        },
        {
            label: 'REQUEST',
            items: [
                { name: 'Customer Request', href: '/customer-requests', icon: MessageSquare, permission: 'customers.view' },
            ],
        },
        {
            label: 'SERVICE',
            items: [
                { name: 'Work Orders', href: '/work-orders', icon: ClipboardList, permission: 'work-reports.view' },
                { name: 'Scheduling', href: '/schedules', icon: Calendar, permission: 'schedules.view' },
            ],
        },
        {
            label: 'MONITORING',
            items: [
                { name: 'Live Tracking', href: '/tracking', icon: Radar, permission: 'technicians.view' },
                { name: 'Geofences', href: '/geofences', icon: ShieldCheck, permission: 'technicians.view' },
            ],
        },
        {
            label: 'REPORTS',
            items: [
                { name: 'Work Report', href: '/work-reports', icon: ClipboardList, permission: 'work-reports.view' },
                { name: 'Survey Report', href: '/survey-reports', icon: FileText, permission: 'work-reports.view' },
            ],
        },
        {
            label: 'FINANCE',
            items: [
                { name: 'Quotation', href: '/quotations', icon: DollarSign, permission: 'contracts.view' },
                { name: 'Contract', href: '/contracts', icon: FileText, permission: 'contracts.view' },
                { name: 'Invoice', href: '/invoices', icon: CreditCard, permission: 'contracts.view' },
            ],
        },
        {
            label: 'HR',
            items: [
                { name: 'Attendance', href: '/attendance', icon: MapPin, permission: 'attendance.view' },
                { name: 'Leave', href: '/leaves', icon: Shield },
                { name: 'Employee / Teknisi', href: '/technicians', icon: Users, permission: 'technicians.view' },
            ],
        },
        {
            label: 'SETTINGS',
            items: [
                { name: 'Form Builder', href: '/app-builder', icon: Settings, permission: 'master-data.view' },
                { name: 'Data Master', href: '/master-data', icon: Settings, permission: 'master-data.view' },
                { name: 'Users', href: '/users', icon: Users, permission: 'users.view' },
                { name: 'Audit Log', href: '/audit-logs', icon: ShieldCheck, permission: 'users.view' },
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

    // Mobile Bottom Tap Bar Items for Technician / Mobile view
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
        <div className="min-h-screen bg-canvas-soft flex flex-col md:flex-row">
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

            {/* Desktop Sidebar - Hidden for Technicians or Mobile View */}
            {!isTechnician && (
                <aside className="hidden md:flex w-[240px] bg-canvas border-r border-hairline fixed inset-y-0 left-0 flex-col z-40 shadow-sm">
                    <div className="p-3.5 border-b border-hairline flex items-center justify-center bg-white shrink-0 sticky top-0 z-10 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 w-auto max-w-[190px] object-contain" />
                    </div>

                    <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
                        {navItems.map((section, idx) => (
                            <div key={idx} className="space-y-1">
                                <h2 className="px-3 text-[10px] font-mono uppercase tracking-wider text-mute font-semibold">
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
                                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-body-sm transition-colors ${
                                                    isActive
                                                        ? 'bg-canvas-soft-2 text-ink font-medium border border-hairline'
                                                        : 'text-body-text hover:bg-canvas-soft hover:text-ink'
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-mute'}`} />
                                                <span className="flex-1">{item.name}</span>
                                                {isRequestMenu && pendingRequestsCount > 0 && (
                                                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
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

                    <div className="p-3 border-t border-hairline shrink-0 bg-canvas">
                        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-canvas-soft">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-ink truncate">{auth?.user?.name || 'User'}</p>
                                <p className="text-[10px] text-mute truncate capitalize">
                                    {userRoles[0] ? userRoles[0].replace('_', ' ') : 'User'}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Container Area */}
            <div className={`flex-1 flex flex-col min-w-0 ${!isTechnician ? 'md:pl-[240px]' : ''} pb-16 md:pb-0`}>
                {/* Header Navbar */}
                <header className="h-14 bg-canvas border-b border-hairline flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
                    {/* Left Brand / Breadcrumb */}
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-7 w-auto object-contain" />
                        </Link>
                        {!isTechnician && (
                            <div className="hidden sm:flex items-center gap-2 text-xs text-mute border-l border-hairline pl-3">
                                <span>Aplikasi</span>
                                <span>/</span>
                                <span className="text-ink font-medium">{currentPage?.name || 'Halaman'}</span>
                            </div>
                        )}
                    </div>

                    {/* Right User Profile Dropdown & Notifications */}
                    <div className="flex items-center gap-3">
                        <NotificationBell />

                        {/* User Avatar Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-canvas-soft transition-colors border border-hairline"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                                    {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-mute hidden sm:block" />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-hairline py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 border-b border-hairline">
                                        <div className="font-bold text-gray-900 truncate">{auth?.user?.name || 'User'}</div>
                                        <div className="text-gray-500 truncate text-[11px]">{auth?.user?.email || ''}</div>
                                        <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full mt-1 uppercase">
                                            {userRoles[0] ? userRoles[0].replace('_', ' ') : 'User'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Keluar dari Akun
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content View */}
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>

            {/* Mobile Bottom Navigation Tab Bar (Tap Bar) - Rendered for Technicians & Mobile Screens */}
            <nav className={`fixed bottom-0 inset-x-0 bg-white border-t border-hairline z-50 h-16 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] ${!isTechnician ? 'md:hidden' : ''}`}>
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
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                                    isActive
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                        : 'bg-primary text-white hover:bg-blue-700 ring-4 ring-white'
                                }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
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
                                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}