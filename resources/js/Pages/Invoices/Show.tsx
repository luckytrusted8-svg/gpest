import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';

interface InvoiceItem {
    id: number;
    deskripsi: string;
    kuantitas: number;
    satuan: string;
    harga_satuan: number;
    diskon_persen: number;
    subtotal: number;
}

interface InvoiceData {
    id: number;
    nomor_invoice: string;
    customer?: { id: number; company_name: string; address?: string | null; phone?: string | null; email?: string | null } | null;
    tanggal_invoice: string;
    jatuh_tempo: string;
    status_pembayaran: string;
    total: number;
    catatan?: string | null;
    items?: InvoiceItem[];
}

interface Props {
    invoice: InvoiceData;
}

const fmt = (n: number | null | undefined) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

export default function Show({ invoice }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const handleDelete = () => {
        if (!confirm(`Hapus invoice ${invoice.nomor_invoice}?`)) return;
        router.delete(`/invoices/${invoice.id}`);
    };

    const items = invoice?.items ?? [];

    return (
        <AppLayout>
            <Head title={`Invoice ${invoice.nomor_invoice}`} />
            <div className="max-w-4xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/invoices">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
                        </Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">{invoice.nomor_invoice}</h1>
                            <p className="text-body-sm text-mute mt-0.5">Detail faktur tagihan.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Cetak PDF
                            </Button>
                        </a>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-error hover:bg-error/10" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden p-6 space-y-6">
                    <div className="flex justify-between items-start border-b border-hairline pb-4">
                        <div>
                            <div className="text-xl font-bold text-primary tracking-wide">G-PEST</div>
                            <div className="text-xs text-mute">Pest Control & Fumigation Services</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-mono font-bold text-ink">{invoice.nomor_invoice}</div>
                            <div className="text-xs text-mute mt-1">Status: <span className="font-semibold text-primary uppercase">{invoice.status_pembayaran}</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-body-sm">
                        <div>
                            <div className="text-xs font-semibold text-mute uppercase mb-1">Tagihan Kepada:</div>
                            <div className="font-semibold text-ink">{invoice.customer?.company_name ?? '-'}</div>
                            {invoice.customer?.address && <div className="text-xs text-mute mt-1">{invoice.customer.address}</div>}
                            {invoice.customer?.phone && <div className="text-xs text-mute">Telp: {invoice.customer.phone}</div>}
                            {invoice.customer?.email && <div className="text-xs text-mute">Email: {invoice.customer.email}</div>}
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="text-xs font-semibold text-mute uppercase mb-1">Tanggal:</div>
                            <div>Tanggal Invoice: <span className="font-medium">{invoice.tanggal_invoice ? new Date(invoice.tanggal_invoice).toLocaleDateString('id-ID') : '-'}</span></div>
                            <div>Jatuh Tempo: <span className="font-medium text-error">{invoice.jatuh_tempo ? new Date(invoice.jatuh_tempo).toLocaleDateString('id-ID') : '-'}</span></div>
                        </div>
                    </div>

                    <div className="border border-hairline rounded-md overflow-hidden">
                        <table className="w-full text-body-sm">
                            <thead>
                                <tr className="bg-canvas-soft border-b border-hairline">
                                    <th className="py-2.5 px-3 text-left text-xs font-medium text-mute w-8">No</th>
                                    <th className="py-2.5 px-3 text-left text-xs font-medium text-mute">Deskripsi</th>
                                    <th className="py-2.5 px-3 text-right text-xs font-medium text-mute">Qty</th>
                                    <th className="py-2.5 px-3 text-right text-xs font-medium text-mute">Harga Satuan</th>
                                    <th className="py-2.5 px-3 text-right text-xs font-medium text-mute">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((it, idx) => (
                                    <tr key={it.id || idx} className="border-b border-hairline last:border-0">
                                        <td className="py-2.5 px-3 text-xs text-mute">{idx + 1}</td>
                                        <td className="py-2.5 px-3 font-medium">{it.deskripsi}</td>
                                        <td className="py-2.5 px-3 text-right text-xs">{it.kuantitas} {it.satuan}</td>
                                        <td className="py-2.5 px-3 text-right text-xs">{fmt(it.harga_satuan)}</td>
                                        <td className="py-2.5 px-3 text-right font-medium">{fmt(it.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-72 bg-canvas-soft p-4 rounded-md border border-hairline text-right space-y-1">
                            <div className="text-xs text-mute">Total Tagihan:</div>
                            <div className="text-2xl font-bold text-primary font-mono">{fmt(invoice.total)}</div>
                        </div>
                    </div>

                    {invoice.catatan && (
                        <div className="p-4 bg-canvas-soft/50 rounded-md border border-hairline text-body-sm">
                            <div className="text-xs font-semibold text-mute mb-1">Catatan / Instruksi Pembayaran:</div>
                            <div className="text-ink whitespace-pre-wrap">{invoice.catatan}</div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
