import { Link, usePage, router } from '@inertiajs/react';
import { LogOut, LayoutDashboard, FileText, CalendarCheck, ClipboardList, User, CreditCard, MessageSquare } from 'lucide-react';
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
        { name: 'Request / Komplain', href: '/portal/requests', icon: MessageSquare },
    ];

    const handleLogout = () => {
        router.post('/portal/logout');
    };

    return (
        <div className="min-h-screen bg-canvas-soft flex flex-col">
            {/* Header Navbar */}
            <header className="bg-canvas border-b border-hairline sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-9 w-auto object-contain bg-white p-1 rounded border border-hairline" />
                            <div>
                                <div className="text-body-md-strong text-ink leading-tight flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">Customer Portal</span>
                                </div>
                                <div className="text-xs text-mute font-medium truncate max-w-[200px] sm:max-w-xs mt-0.5">
                                    {displayCompanyName}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links - Desktop */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-canvas-soft-2 text-ink font-semibold border border-hairline'
                                                : 'text-body-text hover:bg-canvas-soft hover:text-ink'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 text-mute" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile & Logout */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-right">
                                <div className="w-7 h-7 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-xs font-semibold text-ink">
                                    {customerUser?.nama ? customerUser.nama.slice(0, 2).toUpperCase() : <User className="w-3.5 h-3.5" />}
                                </div>
                                <div className="text-xs">
                                    <div className="font-semibold text-ink">{customerUser?.nama || displayCompanyName}</div>
                                    <div className="text-mute">{customerUser?.email || ''}</div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="text-body-sm text-error hover:bg-error/10 border-hairline flex items-center gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation bar */}
                    <div className="flex md:hidden border-t border-hairline py-2 overflow-x-auto gap-1 no-scrollbar">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                                        isActive
                                            ? 'bg-canvas-soft-2 text-ink font-semibold border border-hairline'
                                            : 'text-body-text hover:bg-canvas-soft'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5 text-mute" />
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

            {/* Simple Footer */}
            <footer className="bg-canvas border-t border-hairline py-4">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-mute">
                    © {new Date().getFullYear()} GPEST Control System — Customer Portal. Seluruh hak cipta dilindungi.
                </div>
            </footer>
        </div>
    );
}
