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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
            {/* Header Navbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Logo & Brand Info */}
                        <div className="flex items-center gap-3 shrink-0">
                            <img
                                src="/images/logo.png"
                                alt="G-PEST Logo"
                                className="h-9 w-auto object-contain bg-white p-1 rounded-md border border-slate-200"
                            />
                            <div className="hidden sm:block border-l border-slate-200 pl-3 py-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Customer Portal
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 font-medium truncate max-w-[180px] md:max-w-[220px] mt-0.5 flex items-center gap-1">
                                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{displayCompanyName}</span>
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
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Info & Logout */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2.5 text-right pl-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-800 shrink-0">
                                    {customerUser?.nama ? customerUser.nama.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                                </div>
                                <div className="hidden sm:block text-xs text-left">
                                    <div className="font-semibold text-slate-900 leading-snug truncate max-w-[140px]">
                                        {customerUser?.nama || displayCompanyName}
                                    </div>
                                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                                        {customerUser?.email || ''}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200 hover:border-rose-200 flex items-center gap-1.5 h-8 px-3 transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </div>
                    </div>

                    {/* Navigation bar for Tablet / Small Screen */}
                    <div className="flex lg:hidden border-t border-slate-200 py-2 overflow-x-auto gap-1.5 no-scrollbar scroll-smooth">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/portal/dashboard' ? url === item.href : url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
            <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} GPEST Control System — Portal Pelanggan Berlangganan.
                </div>
            </footer>
        </div>
    );
}
