import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Menu,
    X,
    LogOut,
    LayoutDashboard,
    FileText,
    CalendarCheck,
    ClipboardList,
    User,
    CreditCard,
    MessageSquare,
    Building2,
    MapPin,
    ChevronRight,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import CustomerNotificationBell from '@/Components/CustomerNotificationBell';

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    avatar?: string;
    customer?: {
        id: number;
        customer_id: string;
        company_name: string;
    };
}

interface Props {
    children: React.ReactNode;
    customerUser?: CustomerUser;
    customerName?: string;
}

export default function CustomerPortalLayout({ children, customerUser, customerName }: Props) {
    const { url } = usePage();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const displayCompanyName = customerName || customerUser?.customer?.company_name || 'Pelanggan';

    const navItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
        { name: 'Titik Lokasi (Site)', href: '/portal/sites', icon: MapPin },
        { name: 'Kontrak Saya', href: '/portal/contracts', icon: FileText },
        { name: 'Jadwal Layanan', href: '/portal/schedules', icon: CalendarCheck },
        { name: 'Laporan Kerja', href: '/portal/work-reports', icon: ClipboardList },
        { name: 'Tagihan Invoice', href: '/portal/invoices', icon: CreditCard },
        { name: 'Request Layanan', href: '/portal/requests', icon: MessageSquare },
        { name: 'Profil Perusahaan', href: '/portal/profile', icon: Building2 },
    ];

    // Close drawer on route change or escape key
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [url]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        router.post('/portal/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-900 selection:text-white">
            {/* Header Navbar - Bersih, Minimalis & Modern */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-3">
                        {/* Sebelah Kiri: Logo 'GPEST' & Identitas Perusahaan */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href="/portal/dashboard" className="flex items-center group transition-opacity hover:opacity-90">
                                <img
                                    src="/images/logo.png"
                                    alt="GPEST Logo"
                                    className="h-8 w-auto object-contain"
                                />
                            </Link>

                            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                                <span className="text-[10px] font-bold text-[#0f2444] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    CLIENT PORTAL
                                </span>
                                <div className="text-xs text-slate-500 font-medium truncate max-w-[180px] md:max-w-[240px] flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate text-slate-700 font-semibold">{displayCompanyName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sebelah Kanan: Notifikasi Layanan, Profil Pengguna & Hamburger Menu */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            {/* Notifikasi Lonceng Pelanggan */}
                            <CustomerNotificationBell />

                            {/* Ikon Profil Pengguna dengan Dropdown Cepat */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label="Profil Pengguna"
                                        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer focus:outline-hidden group"
                                    >
                                        {customerUser?.avatar ? (
                                            <img
                                                src={customerUser.avatar}
                                                alt={customerUser.nama}
                                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#0f2444] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                                                {customerUser?.nama ? customerUser.nama.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                                            </div>
                                        )}
                                        <div className="hidden md:block text-left text-xs leading-tight pr-1">
                                            <div className="font-bold text-slate-800 truncate max-w-[120px] group-hover:text-[#0f2444]">
                                                {customerUser?.nama || 'Akun Klien'}
                                            </div>
                                            <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                                                {displayCompanyName}
                                            </div>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-60 bg-white border border-slate-200 shadow-lg rounded-xl p-1.5 z-50">
                                    <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-lg">
                                        <p className="text-xs font-bold text-slate-900 truncate">{customerUser?.nama || 'Pengguna'}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{customerUser?.email || ''}</p>
                                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#0f2444] bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100/80 w-fit">
                                            <Building2 className="w-3 h-3 text-[#0f2444]" />
                                            <span className="truncate max-w-[180px]">{displayCompanyName}</span>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/portal/profile"
                                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                <span>Profil Perusahaan</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/portal/requests"
                                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MessageSquare className="w-4 h-4 text-slate-400" />
                                                <span>Request Layanan Baru</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </div>

                                    <DropdownMenuSeparator className="my-1 border-slate-100" />

                                    <DropdownMenuItem asChild>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                                        >
                                            <LogOut className="w-4 h-4 text-rose-500" />
                                            <span>Keluar (Logout)</span>
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Ikon Hamburger Menu (≡) */}
                            <button
                                type="button"
                                onClick={() => setIsDrawerOpen(true)}
                                aria-label="Buka Menu Navigasi"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200 cursor-pointer focus:outline-hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Slide-over Drawer / Hamburger Menu Responsif */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-label="Menu Navigasi Mobile"
            >
                {/* Header Drawer */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/images/logo.png"
                            alt="GPEST Logo"
                            className="h-7 w-auto object-contain"
                        />
                        <span className="text-xs font-bold text-[#0f2444] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            PORTAL MENU
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        aria-label="Tutup Menu"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer focus:outline-hidden"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Kartu Profil Pengguna di dalam Drawer */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-3">
                        {customerUser?.avatar ? (
                            <img
                                src={customerUser.avatar}
                                alt={customerUser.nama}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#0f2444] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                                {customerUser?.nama ? customerUser.nama.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                                {customerUser?.nama || 'Pengguna'}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                                {customerUser?.email || ''}
                            </p>
                            <p className="text-[11px] font-semibold text-[#0f2444] truncate mt-0.5">
                                {displayCompanyName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Daftar Menu Navigasi Lengkap */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Menu Utama
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch
                                onClick={() => setIsDrawerOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                                    isActive
                                        ? 'bg-[#0f2444] text-white shadow-xs'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    <span>{item.name}</span>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-500'}`} />
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Drawer */}
                <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar (Logout)</span>
                    </button>

                    <div className="text-center text-[10px] text-slate-400 font-mono">
                        © {new Date().getFullYear()} GPEST Business Dashboard
                    </div>
                </div>
            </aside>

            {/* Konten Utama Langsung di Bawah Header */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                {children}
            </main>

            {/* Footer Minimalis */}
            <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-mono">
                    © {new Date().getFullYear()} GPEST ENTERPRISE — PORTAL KLIEN TERPADU.
                </div>
            </footer>
        </div>
    );
}
