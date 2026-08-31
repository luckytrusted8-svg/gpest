import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, FileText, CalendarCheck, ClipboardList, UserCheck, UserPlus, UserMinus, UserX, ArrowRight, Calendar, Clock } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
}

const KpiCard = ({ title, value, icon: Icon, href }: KpiCardProps) => {
    const card = (
        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-caption-mono uppercase text-mute">{title}</div>
                    <div className="text-display-md font-semibold mt-2">{value}</div>
                </div>
                <Icon className="w-8 h-8 text-primary" />
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{card}</Link>;
    }
    return card;
};

const StatusBadge = ({ label, color }: { label: string; color: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const Dashboard = () => {
    const kpiData = [
        { title: 'Total Pelanggan', value: '1,245', icon: Users, href: '/customers' },
        { title: 'Kontrak Aktif', value: '321', icon: FileText, href: '/contracts' },
        { title: 'Jadwal Hari Ini', value: '18', icon: CalendarCheck, href: '/schedules' },
        { title: 'Laporan Pending', value: '7', icon: ClipboardList, href: '/work-reports' },
    ];

    const scheduleData = [
        { customer: 'PT ABC Indonesia', time: '08:00 - 10:00', status: 'Selesai', color: 'bg-[#0070f3]/15 text-[#0070f3]' },
        { customer: 'PT XYZ Corp', time: '10:00 - 12:00', status: 'Sedang Berlangsung', color: 'bg-[#f5a623]/15 text-[#ab570a]' },
        { customer: 'PT DEF Group', time: '13:00 - 15:00', status: 'Dijadwalkan', color: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        { customer: 'PT GHI Utama', time: '15:00 - 17:00', status: 'Dijadwalkan', color: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        { customer: 'PT JKL Abadi', time: '08:00 - 10:00', status: 'Sedang Berlangsung', color: 'bg-[#f5a623]/15 text-[#ab570a]' },
    ];

    const technicianStatus = [
        { label: 'Online', count: 12, icon: UserCheck, color: 'text-[#00b8a9]' },
        { label: 'Sedang Bekerja', count: 5, icon: UserPlus, color: 'text-[#f5a623]' },
        { label: 'Selesai Hari Ini', count: 8, icon: UserMinus, color: 'text-[#0070f3]' },
        { label: 'Offline', count: 3, icon: UserX, color: 'text-[#ee0000]' },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((item) => (
                        <KpiCard key={item.title} {...item} />
                    ))}
                </div>

                {/* Schedule and Technician Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Schedule */}
                    <div className="lg:col-span-2">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                            <div className="p-4 border-b border-hairline flex items-center justify-between">
                                <h2 className="text-body-md-strong text-ink flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-mute" />
                                    Jadwal Hari Ini
                                </h2>
                                <Link href="/schedules" className="text-xs text-link hover:underline flex items-center gap-1">
                                    Lihat Semua <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="divide-y divide-hairline">
                                {scheduleData.map((item, index) => (
                                    <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-canvas-soft/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 border border-hairline flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-mute" />
                                            </div>
                                            <div>
                                                <div className="text-body-sm font-medium text-ink">{item.customer}</div>
                                                <div className="text-xs text-mute">{item.time}</div>
                                            </div>
                                        </div>
                                        <StatusBadge label={item.status} color={item.color} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Technician Status */}
                    <div>
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                            <div className="p-4 border-b border-hairline">
                                <h2 className="text-body-md-strong text-ink">Status Teknisi</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {technicianStatus.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-md bg-canvas-soft-2 border border-hairline flex items-center justify-center ${item.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-body-sm text-ink">{item.label}</span>
                                            </div>
                                            <span className="text-body-md-strong font-semibold text-ink">{item.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-4 border-t border-hairline">
                                <Link href="/tracking" className="text-xs text-link hover:underline flex items-center justify-center gap-1">
                                    Pantau Lokasi Teknisi <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
