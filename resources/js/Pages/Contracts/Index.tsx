import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
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
                    Aktif
                </span>
            );
        case 'expiring_soon':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5a623]/15 text-[#ab570a]">
                    Akan Berakhir
                </span>
            );
        case 'expired':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Berakhir
                </span>
            );
        case 'cancelled':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
                    Dibatalkan
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
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

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
        if (confirm(`Hapus kontrak "${contractNum}"?`)) {
            router.delete(`/contracts/${id}`);
        }
    };

    const formatCurrency = (val: string | number) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    };

    return (
        <AppLayout>
            <Head title="Kontrak" />

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
                        <h1 className="text-display-sm font-semibold text-ink">Kontrak</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola perjanjian pelanggan, jadwal layanan, dan siklus hidup kontrak.</p>
                    </div>
                    <Link href="/contracts/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Buat Kontrak
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
                                placeholder="Cari nomor kontrak, customer, lokasi..."
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
                            <option value="draft">Draft</option>
                            <option value="active">Aktif</option>
                            <option value="expiring_soon">Akan Berakhir</option>
                            <option value="expired">Berakhir</option>
                            <option value="cancelled">Dibatalkan</option>
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
                                    <th className="py-3 px-4 font-semibold">Nomor Kontrak</th>
                                    <th className="py-3 px-4 font-semibold">Customer</th>
                                    <th className="py-3 px-4 font-semibold">Jenis</th>
                                    <th className="py-3 px-4 font-semibold">Mulai</th>
                                    <th className="py-3 px-4 font-semibold">Berakhir</th>
                                    <th className="py-3 px-4 font-semibold">Nilai</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
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
                                                        className="h-8 w-8 text-[#ee0000] hover:bg-[#ee0000]/10"
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
                                            Tidak ada data kontrak.
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
                                Menampilkan {contracts.data.length} dari {contracts.total} kontrak
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
