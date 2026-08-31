import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location: string;
    npwp: string | null;
    status: 'active' | 'inactive';
    sales_pic: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface IndexProps {
    customers: PaginatedCustomers;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ customers, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/customers', { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        router.get('/customers', { search, status: newStatus }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, companyName: string) => {
        if (confirm(`Are you sure you want to delete customer "${companyName}"?`)) {
            router.delete(`/customers/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Customers" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Customers</h1>
                        <p className="text-body-sm text-mute mt-1">Manage customer records, contracts, and contacts.</p>
                    </div>
                    <Link href="/customers/create">
                        <Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Customer
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
                                placeholder="Search company name or customer ID..."
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong w-full sm:w-auto">
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Customers Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Customer ID</th>
                                    <th className="py-3 px-4 font-semibold">Company Name</th>
                                    <th className="py-3 px-4 font-semibold">PIC Name</th>
                                    <th className="py-3 px-4 font-semibold">Phone / Email</th>
                                    <th className="py-3 px-4 font-semibold">Location</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {customers.data && customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-mono text-body-sm-strong">{customer.customer_id}</td>
                                            <td className="py-3 px-4 font-medium">{customer.company_name}</td>
                                            <td className="py-3 px-4 text-body-text">{customer.pic_name}</td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div>{customer.phone}</div>
                                                <div className="text-xs text-mute">{customer.email}</div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">{customer.location}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    customer.status === 'active'
                                                        ? 'bg-success/15 text-success'
                                                        : 'bg-hairline text-body-text'
                                                }`}>
                                                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/customers/${customer.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/customers/${customer.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(customer.id, customer.company_name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-mute text-body-sm">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.links && customers.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">
                                Showing {customers.data.length} of {customers.total} customers
                            </div>
                            <div className="flex items-center gap-1">
                                {customers.links.map((link, idx) => (
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
