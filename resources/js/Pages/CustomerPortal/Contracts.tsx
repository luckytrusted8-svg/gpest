import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { StatusBadge } from '../Contracts/Index';
import { FileText, Calendar, MapPin, DollarSign, Tag } from 'lucide-react';

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

interface Contract {
    id: number;
    contract_number: string;
    location: string;
    contract_type: string;
    start_date: string;
    end_date: string;
    service_frequency: string;
    service_type: string;
    contract_value: number;
    status: 'draft' | 'active' | 'expiring_soon' | 'expired' | 'cancelled';
    pic: string | null;
    is_expiring_soon: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedContracts {
    data: Contract[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    customerUser: CustomerUser;
    contracts: PaginatedContracts;
}

export default function Contracts({ customerUser, contracts }: Props) {
    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Kontrak Saya - Customer Portal" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Daftar Kontrak Layanan</h1>
                    <p className="text-body-sm text-mute mt-1">Daftar seluruh perjanjian kontrak kerja pest control perusahaan Anda.</p>
                </div>

                {/* Contracts Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Nomor Kontrak</th>
                                    <th className="py-3 px-4 font-semibold">Tipe & Layanan</th>
                                    <th className="py-3 px-4 font-semibold">Lokasi</th>
                                    <th className="py-3 px-4 font-semibold">Periode Kontrak</th>
                                    <th className="py-3 px-4 font-semibold">Nilai Kontrak</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {contracts.data && contracts.data.length > 0 ? (
                                    contracts.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-4 px-4 font-mono font-semibold text-ink">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-mute shrink-0" />
                                                    {c.contract_number}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="font-medium text-ink">{c.contract_type}</div>
                                                <div className="text-xs text-mute mt-0.5">{c.service_type} ({c.service_frequency})</div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span className="truncate">{c.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span>{c.start_date} s/d {c.end_date}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-mono font-medium text-ink">
                                                {formatIDR(c.contract_value)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <StatusBadge status={c.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada data kontrak layanan untuk akun Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {contracts.links && contracts.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {contracts.total} kontrak</div>
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
                                        <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
