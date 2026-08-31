import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Contract {
    id: number;
    contract_number: string;
    customer_id: number;
    customer?: Customer;
    location: string;
    contract_type: string;
    start_date: string;
    end_date: string;
    service_frequency: string;
    service_type: string;
    contract_value: string | number;
    status: 'draft' | 'active' | 'expiring_soon' | 'expired' | 'cancelled';
    pic: string | null;
    attachment: string | null;
    is_expiring_soon?: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedContracts {
    data: Contract[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    contracts: PaginatedContracts;
    filters: {
        search?: string;
        status?: string;
    };
}

export const StatusBadge = ({ status }: { status: Contract['status'] }) => {
    switch (status) {
        case 'active':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">
                    Active
                </span>
            );
        case 'expiring_soon':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Expiring Soon
                </span>
            );
        case 'expired':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Expired
                </span>
            );
        case 'cancelled':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Cancelled
                </span>
            );
        case 'draft':
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft-2 text-body-text border border-hairline">
                    Draft
                </span>
            );
    }
};

export default function Index({ contracts, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/contracts', { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        router.get('/contracts', { search, status: newStatus }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, contractNum: string) => {
        if (confirm(`Are you sure you want to delete contract "${contractNum}"?`)) {
            router.delete(`/contracts/${id}`);
        }
    };

    const formatCurrency = (val: string | number) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    };

    return (
        <AppLayout>
            <Head title="Contracts" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Contract Management</h1>
                        <p className="text-body-sm text-mute mt-1">Manage customer agreements, service schedules, and contract lifecycles.</p>
                    </div>
                    <Link href="/contracts/create">
                        <Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Contract
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Search contract number, customer, location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="expiring_soon">Expiring Soon</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong w-full sm:w-auto">
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Contracts Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Contract Number</th>
                                    <th className="py-3 px-4 font-semibold">Customer</th>
                                    <th className="py-3 px-4 font-semibold">Type</th>
                                    <th className="py-3 px-4 font-semibold">Start Date</th>
                                    <th className="py-3 px-4 font-semibold">End Date</th>
                                    <th className="py-3 px-4 font-semibold">Value</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {contracts.data && contracts.data.length > 0 ? (
                                    contracts.data.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-mono text-body-sm-strong flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-mute shrink-0" />
                                                <Link href={`/contracts/${contract.id}`} className="hover:underline text-link">
                                                    {contract.contract_number}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4 font-medium">
                                                {contract.customer?.company_name || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-body-text">{contract.contract_type}</td>
                                            <td className="py-3 px-4 text-body-text">{contract.start_date}</td>
                                            <td className="py-3 px-4 text-body-text">{contract.end_date}</td>
                                            <td className="py-3 px-4 font-mono text-body-sm">{formatCurrency(contract.contract_value)}</td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={contract.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/contracts/${contract.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/contracts/${contract.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(contract.id, contract.contract_number)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-mute text-body-sm">
                                            No contracts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {contracts.links && contracts.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">
                                Showing {contracts.data.length} of {contracts.total} contracts
                            </div>
                            <div className="flex items-center gap-1">
                                {contracts.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
