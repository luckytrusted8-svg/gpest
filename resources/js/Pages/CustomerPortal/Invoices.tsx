import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { ExternalLink, Receipt, FileDown, Calendar, Clock, AlertCircle } from 'lucide-react';

interface Invoice {
    id: number;
    nomor_invoice: string;
    tanggal_invoice: string;
    jatuh_tempo: string;
    total: number;
    status_pembayaran: string;
}

interface CustomerUser {
    id: number;
    name?: string;
    nama?: string;
    customer: { id: number; company_name: string };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    customerUser: CustomerUser;
    invoices?: {
        data: Invoice[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links?: PaginationLink[];
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    const normalized = (status || '').toLowerCase();
    const map: Record<string, { label: string; badgeClass: string }> = {
        draft: { label: 'Draft', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
        terbit: { label: 'Terbit', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        dikirim: { label: 'Dikirim', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
        dibayar_sebagian: { label: 'Dibayar Sebagian', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
        lunas: { label: 'Lunas', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        belum_dibayar: { label: 'Belum Dibayar', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
        jatuh_tempo: { label: 'Jatuh Tempo', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
        batal: { label: 'Batal', badgeClass: 'bg-slate-100 text-slate-500 border-slate-200' },
    };
    const { label, badgeClass } = map[normalized] ?? {
        label: status || 'Belum Dibayar',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {label}
        </span>
    );
};

const fmt = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

export default function Invoices({ customerUser, invoices }: Props) {
    const dataList = invoices?.data ?? [];
    const hasInvoices = dataList.length > 0;
    const paginationLinks = invoices?.links ?? [];

    return (
        <CustomerPortalLayout customerName={customerUser.customer?.company_name}>
            <Head title="Invoice & Tagihan Klien" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                            <Receipt className="w-5 h-5" />
                        </div>
                        <span>Invoice &amp; Tagihan Saya</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Daftar faktur tagihan layanan pest control perusahaan Anda.
                    </p>
                </div>

                {/* Main Content Box */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    {hasInvoices ? (
                        <>
                            {/* Desktop Table View (hidden on mobile < 640px) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-4">Nomor Invoice</th>
                                            <th className="py-3.5 px-4">Tanggal</th>
                                            <th className="py-3.5 px-4">Jatuh Tempo</th>
                                            <th className="py-3.5 px-4">Total Tagihan</th>
                                            <th className="py-3.5 px-4">Status</th>
                                            <th className="py-3.5 px-4 text-right">Berkas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {dataList.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                                                    {inv.nomor_invoice}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-slate-500">
                                                    {formatDate(inv.tanggal_invoice)}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-slate-500">
                                                    {formatDate(inv.jatuh_tempo)}
                                                </td>
                                                <td className="py-3.5 px-4 font-extrabold text-slate-900">
                                                    {fmt(inv.total)}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <StatusBadge status={inv.status_pembayaran} />
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <a
                                                        href={`/invoices/${inv.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                                                    >
                                                        <FileDown className="w-3.5 h-3.5" />
                                                        <span>Unduh PDF</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout View (visible only on mobile < 640px) */}
                            <div className="block sm:hidden divide-y divide-slate-100">
                                {dataList.map((inv) => (
                                    <div key={inv.id} className="p-4 space-y-3.5 hover:bg-slate-50/40 transition-colors">
                                        {/* Top Row: Nomor Invoice di kiri & Status di kanan */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                                    <Receipt className="w-4 h-4" />
                                                </div>
                                                <span className="font-mono font-bold text-sm text-slate-900">
                                                    {inv.nomor_invoice}
                                                </span>
                                            </div>
                                            <StatusBadge status={inv.status_pembayaran} />
                                        </div>

                                        {/* Card Info Details */}
                                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5">
                                            {/* Tanggal & Jatuh Tempo */}
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Tanggal
                                                    </span>
                                                    <span className="text-slate-700 font-semibold mt-0.5 block">
                                                        {formatDate(inv.tanggal_invoice)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Jatuh Tempo
                                                    </span>
                                                    <span className="text-slate-700 font-semibold mt-0.5 block">
                                                        {formatDate(inv.jatuh_tempo)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Total Tagihan */}
                                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                                <span className="text-xs text-slate-500 font-medium">
                                                    Total Tagihan:
                                                </span>
                                                <span className="text-base font-extrabold text-slate-900">
                                                    {fmt(inv.total)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button: Unduh PDF */}
                                        <div>
                                            <a
                                                href={`/invoices/${inv.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                                            >
                                                <FileDown className="w-4 h-4" />
                                                <span>Unduh Dokumen PDF</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Footer */}
                            {paginationLinks.length > 3 && (
                                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/50">
                                    <div className="text-slate-500 font-medium">
                                        Total {invoices?.total ?? dataList.length} tagihan
                                    </div>
                                    <div className="flex items-center gap-1 flex-wrap justify-center">
                                        {paginationLinks.map((link, idx) => (
                                            link.url ? (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    prefetch
                                                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 rounded-lg border text-xs font-medium bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty State Enhancement: Centered wallet/invoice icon with clean text */
                        <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                                <Receipt className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">
                                Belum Ada Tagihan
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
                                Semua faktur dan riwayat pembayaran Anda akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
