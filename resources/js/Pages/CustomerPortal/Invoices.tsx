import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { ExternalLink, CreditCard } from 'lucide-react';

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
    name: string;
    customer: { id: number; company_name: string };
}

interface Props {
    customerUser: CustomerUser;
    invoices?: { data: Invoice[]; current_page: number; last_page: number; per_page: number; total: number };
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-700' },
        terbit: { label: 'Terbit', cls: 'bg-blue-100 text-blue-700' },
        dikirim: { label: 'Dikirim', cls: 'bg-amber-100 text-amber-700' },
        dibayar_sebagian: { label: 'Dibayar Sebagian', cls: 'bg-amber-100 text-amber-700' },
        lunas: { label: 'Lunas', cls: 'bg-green-100 text-green-700' },
        jatuh_tempo: { label: 'Jatuh Tempo', cls: 'bg-red-100 text-red-700' },
        batal: { label: 'Batal', cls: 'bg-red-100 text-red-700' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const fmt = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

export default function Invoices({ customerUser, invoices }: Props) {
    const dataList = invoices?.data ?? [];

    return (
        <CustomerPortalLayout customerName={customerUser.customer.company_name}>
            <Head title="Invoice & Tagihan Klien" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-600" /> Invoice & Tagihan Saya
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Daftar faktur tagihan layanan pest control perusahaan Anda.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="py-3 px-4">Nomor Invoice</th>
                                <th className="py-3 px-4">Tanggal</th>
                                <th className="py-3 px-4">Jatuh Tempo</th>
                                <th className="py-3 px-4">Total Tagihan</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Berkas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dataList.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-3.5 px-4 font-mono font-medium text-blue-600">{inv.nomor_invoice}</td>
                                    <td className="py-3.5 px-4 text-xs text-gray-500">{new Date(inv.tanggal_invoice).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3.5 px-4 text-xs text-gray-500">{new Date(inv.jatuh_tempo).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-900">{fmt(inv.total)}</td>
                                    <td className="py-3.5 px-4"><StatusBadge status={inv.status_pembayaran} /></td>
                                    <td className="py-3.5 px-4 text-right">
                                        <a href={`/invoices/${inv.id}/pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                                            <ExternalLink className="w-3.5 h-3.5" /> PDF
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-gray-400">
                                        Belum ada tagihan/invoice untuk akun ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
