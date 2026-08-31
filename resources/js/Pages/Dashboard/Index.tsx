import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, FileText, CalendarCheck, ClipboardList, UserCheck, UserMinus, UserPlus, UserX } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface ScheduleItem {
    customer: string;
    time: string;
    status: 'completed' | 'in-progress' | 'scheduled';
}

interface TechnicianStatus {
    online: number;
    working: number;
    completed: number;
    offline: number;
}

const KpiCard = ({ title, value, icon: Icon }: KpiCardProps) => (
    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
        <div className="flex items-center justify-between">
            <div>
                <div className="text-caption-mono uppercase text-mute">{title}</div>
                <div className="text-display-md font-semibold mt-2">{value}</div>
            </div>
            <Icon className="w-8 h-8 text-primary" />
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: ScheduleItem['status'] }) => {
    const statusConfig = {
        completed: { text: 'Completed', color: 'bg-success text-success' },
        'in-progress': { text: 'In Progress', color: 'bg-warning text-warning' },
        scheduled: { text: 'Scheduled', color: 'bg-hairline text-body-text' },
    };

    const { text, color } = statusConfig[status];

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>
    );
};

const Dashboard = () => {
    const kpiData = [
        { title: 'Total Customers', value: '1,245', icon: Users },
        { title: 'Active Contracts', value: '321', icon: FileText },
        { title: "Today's Jobs", value: '18', icon: CalendarCheck },
        { title: 'Pending Reports', value: '7', icon: ClipboardList },
    ];

    const scheduleData: ScheduleItem[] = [
        { customer: 'PT ABC Indonesia', time: '08:00', status: 'completed' },
        { customer: 'PT XYZ', time: '10:00', status: 'in-progress' },
        { customer: 'PT DEF', time: '13:00', status: 'scheduled' },
        { customer: 'PT GHI', time: '15:00', status: 'scheduled' },
        { customer: 'PT JKL', time: '17:00', status: 'in-progress' },
    ];

    const technicianStatus: TechnicianStatus = {
        online: 12,
        working: 5,
        completed: 8,
        offline: 3,
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {kpiData.map((item) => (
                    <KpiCard key={item.title} {...item} />
                ))}
            </div>

            {/* Today's Schedule and Technician Status */}
            <div className="flex gap-6">
                {/* Today's Schedule */}
                <div className="w-3/5">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h2 className="text-body-sm-strong text-ink mb-4">Today's Schedule</h2>
                        <div className="space-y-4">
                            {scheduleData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <div className="text-body-sm font-medium">{item.customer}</div>
                                        <div className="text-body-sm text-mute">{item.time}</div>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technician Status */}
                <div className="w-2/5">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h2 className="text-body-sm-strong text-ink mb-4">Technician Status</h2>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <UserCheck className="w-5 h-5 text-success mr-2" />
                                <span className="text-body-sm">Online: {technicianStatus.online}</span>
                            </div>
                            <div className="flex items-center">
                                <UserPlus className="w-5 h-5 text-warning mr-2" />
                                <span className="text-body-sm">Working: {technicianStatus.working}</span>
                            </div>
                            <div className="flex items-center">
                                <UserMinus className="w-5 h-5 text-primary mr-2" />
                                <span className="text-body-sm">Completed: {technicianStatus.completed}</span>
                            </div>
                            <div className="flex items-center">
                                <UserX className="w-5 h-5 text-error mr-2" />
                                <span className="text-body-sm">Offline: {technicianStatus.offline}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;