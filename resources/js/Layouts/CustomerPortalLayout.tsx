import { Link, usePage, router } from '@inertiajs/react';
import { LogOut, LayoutDashboard, FileText, CalendarCheck, ClipboardList, User, CreditCard, MessageSquare, Building2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
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

    const displayCompanyName = customerName || customerUser?.customer?.company_name || 'Pelanggan';

    const navItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
        { name: 'Kontrak Saya', href: '/portal/contracts', icon: FileText },
        { name: 'Jadwal Layanan', href: '/portal/schedules', icon: CalendarCheck },
        { name: 'Laporan Kerja', href: '/portal/work-reports', icon: ClipboardList },
        { name: 'Tagihan Invoice', href: '/portal/invoices', icon: CreditCard },
        { name: 'Request & Komplain', href: '/portal/requests', icon: MessageSquare },
    ];

    const handleLogout = () => {
        router.post('/portal/logout');
    };

    return (
        <div className="min-h-screen bg-canvas-soft flex flex-col font-sans antialiased text-ink">
            {/* Header Navbar - 64px Height */}
            <header className="bg-canvas border-b border-hairline sticky top-0 z-40 shadow-level-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Logo & Brand Info */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href="/portal/dashboard" className="flex items-center">
                                <img
                                    src="/images/logo.png"
                                    alt="G-PEST Logo"
                                    className="h-8 w-auto object-contain"
                                />
                            </Link>
                            <div className="hidden sm:flex items-center gap-2 border-l border-hairline pl-3 py-0.5">
                                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    CLIENT PORTAL
                                </span>
                                <div className="text-xs text-mute font-medium truncate max-w-[180px] md:max-w-[220px] flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5 text-mute shrink-0" />
                                    <span className="truncate text-ink">{displayCompanyName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-primary text-white shadow-xs'
                                                : 'text-body hover:bg-canvas-soft-2 hover:text-ink'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-mute'}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Info & Logout */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2.5 text-right pl-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
                                    {customerUser?.nama ? customerUser.nama.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                                </div>
                                <div className="hidden sm:block text-xs text-left">
                                    <div className="font-semibold text-ink leading-snug truncate max-w-[140px]">
                                        {customerUser?.nama || displayCompanyName}
                                    </div>
                                    <div className="text-[11px] text-mute truncate max-w-[140px]">
                                        {customerUser?.email || ''}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-xs font-medium text-primary hover:text-primary-hover hover:bg-error-soft border border-hairline hover:border-error-soft rounded-lg flex items-center gap-1.5 h-8 px-3 transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation bar for Tablet / Small Screen */}
                    <div className="flex lg:hidden border-t border-hairline py-2 overflow-x-auto gap-1.5 no-scrollbar scroll-smooth">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                                        isActive
                                            ? 'bg-primary text-white shadow-xs'
                                            : 'text-body hover:bg-canvas-soft hover:text-ink'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-mute'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-canvas border-t border-hairline py-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-mute font-mono">
                    © {new Date().getFullYear()} G-PEST CONTROL ENTERPRISE — PORTAL KLIEN TERPADU.
                </div>
            </footer>
        </div>
    );
}
