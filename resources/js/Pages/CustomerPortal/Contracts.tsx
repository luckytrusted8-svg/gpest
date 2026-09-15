import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { FileText, Calendar, MapPin } from 'lucide-react';

const ContractStatusBadge = ({ status }: { status: Contract['status'] | string }) => {
    const map: Record<string, { label: string; textClass: string }> = {
        active: { label: 'Aktif', textClass: 'text-emerald-600' },
        expiring_soon: { label: 'Akan Berakhir', textClass: 'text-amber-600' },
        expired: { label: 'Berakhir', textClass: 'text-rose-600' },
        cancelled: { label: 'Dibatalkan', textClass: 'text-rose-600' },
        draft: { label: 'Draft', textClass: 'text-slate-500' },
    };
    const { label, textClass } = map[status] ?? { label: status, textClass: 'text-slate-500' };
    return <span className={`font-bold text-xs ${textClass}`}>{label}</span>;
};

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

    const hasContracts = contracts.data && contracts.data.length > 0;

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Kontrak Saya - Customer Portal" />

            <div className="space-y-5 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-display-sm font-bold sm:font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 sm:hidden" />
                        <span>Daftar Kontrak Layanan</span>
                    </h1>
                    <p className="text-xs sm:text-body-sm text-slate-500 mt-1">
                        Daftar seluruh perjanjian kontrak kerja pest control perusahaan Anda.
                    </p>
                </div>

                {!hasContracts ? (
                    /* 2. Mobile & Desktop Empty State: Sembunyikan header kolom tabel, tampilkan container terpusat */
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-14 text-center shadow-xs">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Belum Ada Kontrak</h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                            Perjanjian kontrak kerja pest control Anda akan muncul di sini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 1. Dynamic Mobile Layout: Card List (vertikal stack) untuk mobile (< 640px) */}
                        <div className="sm:hidden flex flex-col gap-3">
                            {contracts.data.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3"
                                >
                                    {/* Header Card: Nomor Kontrak di atas dengan status badge */}
                                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-mono font-bold text-xs text-slate-900 truncate">
                                                {c.contract_number}
                                            </span>
                                        </div>
                                        <ContractStatusBadge status={c.status} />
                                    </div>

                                    {/* Body Card: Tipe & Layanan, Lokasi, Periode, Nilai Kontrak */}
                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                                Tipe & Layanan
                                            </span>
                                            <div className="font-bold text-slate-900 mt-0.5">{c.contract_type}</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">{c.service_type} ({c.service_frequency})</div>
                                        </div>

                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                                Lokasi
                                            </span>
                                            <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{c.location || 'Semua Area Terdaftar'}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                                    Periode Kontrak
                                                </span>
                                                <div className="flex items-center gap-1 text-slate-700 mt-0.5 text-[11px]">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{c.start_date} s/d {c.end_date}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                                    Nilai Kontrak
                                                </span>
                                                <div className="font-mono font-bold text-blue-700 mt-0.5 text-xs">
                                                    {formatIDR(c.contract_value)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View: Hidden di Mobile (hidden sm:block) */}
                        <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                            <th className="py-3 px-4">Nomor Kontrak</th>
                                            <th className="py-3 px-4">Tipe & Layanan</th>
                                            <th className="py-3 px-4">Lokasi</th>
                                            <th className="py-3 px-4">Periode Kontrak</th>
                                            <th className="py-3 px-4">Nilai Kontrak</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                                        {contracts.data.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                                        {c.contract_number}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-bold text-slate-900">{c.contract_type}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5">{c.service_type} ({c.service_frequency})</div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate">{c.location}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{c.start_date} s/d {c.end_date}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                                                    {formatIDR(c.contract_value)}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <ContractStatusBadge status={c.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Responsif */}
                        {contracts.links && contracts.links.length > 3 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                                <div className="text-slate-500 text-center sm:text-left">
                                    Total <strong>{contracts.total}</strong> kontrak layanan
                                </div>
                                <div className="flex items-center flex-wrap justify-center gap-1">
                                    {contracts.links.map((link, idx) => (
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-lg border text-xs font-medium bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomerPortalLayout>
    );
}
