import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
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
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

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
        if (confirm(`Hapus customer "${companyName}"?`)) {
            router.delete(`/customers/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Pelanggan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {f?.success && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {f.success}
                    </div>
                )}
                {f?.error && (
                    <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {f.error}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Pelanggan</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola data pelanggan, kontrak, dan kontak.</p>
                    </div>
                    <Link href="/customers/create">
                        <Button className="bg-primary text-white hover:bg-primary/90 text-body-sm-strong flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Pelanggan
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
                                placeholder="Cari nama perusahaan atau ID customer..."
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
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Non-aktif</option>
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
                                    <th className="py-3 px-4 font-semibold">ID Customer</th>
                                    <th className="py-3 px-4 font-semibold">Nama Perusahaan</th>
                                    <th className="py-3 px-4 font-semibold">PIC</th>
                                    <th className="py-3 px-4 font-semibold">Telepon / Email</th>
                                    <th className="py-3 px-4 font-semibold">Lokasi</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
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
                                                        ? 'bg-[#0070f3]/15 text-[#0070f3]'
                                                        : 'bg-canvas-soft-2 text-body-text border border-hairline'
                                                }`}>
                                                    {customer.status === 'active' ? 'Aktif' : 'Non-aktif'}
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
                                                        className="h-8 w-8 text-[#ee0000] hover:bg-[#ee0000]/10"
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
                                            Tidak ada data pelanggan.
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
                                Menampilkan {customers.data.length} dari {customers.total} pelanggan
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
