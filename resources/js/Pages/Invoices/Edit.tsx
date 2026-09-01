import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface InvoiceItem {
    [key: string]: unknown;
    id?: number;
    deskripsi: string;
    kuantitas: number;
    satuan: string;
    harga_satuan: number;
    diskon_persen: number;
}

interface InvoiceData {
    id: number;
    nomor_invoice: string;
    customer_id: number;
    tanggal_invoice: string;
    jatuh_tempo: string;
    status_pembayaran: string;
    catatan?: string | null;
    items?: InvoiceItem[];
}

interface Customer { id: number; company_name: string; }

interface Props {
    invoice: InvoiceData;
    customers?: Customer[];
}

export default function Edit({ invoice, customers = [] }: Props) {
    const [items, setItems] = useState<InvoiceItem[]>(
        invoice.items && invoice.items.length > 0
            ? invoice.items
            : [{ deskripsi: 'Layanan Pest Control', kuantitas: 1, satuan: 'paket', harga_satuan: 0, diskon_persen: 0 }]
    );

    const { data, setData, put, processing, errors } = useForm({
        customer_id: String(invoice.customer_id),
        tanggal_invoice: invoice.tanggal_invoice,
        jatuh_tempo: invoice.jatuh_tempo,
        status_pembayaran: invoice.status_pembayaran,
        catatan: invoice.catatan ?? '',
    });

    const addItem = () => {
        setItems([...items, { deskripsi: '', kuantitas: 1, satuan: 'paket', harga_satuan: 0, diskon_persen: 0 }]);
    };

    const removeItem = (idx: number) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: unknown) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setItems(newItems);
    };

    const subtotal = items.reduce((acc, it) => {
        const gross = (Number(it.kuantitas) || 0) * (Number(it.harga_satuan) || 0);
        return acc + (gross - (gross * ((Number(it.diskon_persen) || 0) / 100)));
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/invoices/${invoice.id}`, { ...data, items } as any);
    };

    return (
        <AppLayout>
            <Head title={`Edit Invoice ${invoice.nomor_invoice}`} />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Edit Invoice {invoice.nomor_invoice}</h1>
                        <p className="text-body-sm text-mute mt-0.5">Perbarui rincian tagihan dan status pembayaran.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-canvas border border-hairline rounded-md p-6 space-y-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="customer_id">Customer *</Label>
                            <select
                                id="customer_id"
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            >
                                {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-xs text-error">{errors.customer_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status_pembayaran">Status Pembayaran *</Label>
                            <select
                                id="status_pembayaran"
                                value={data.status_pembayaran}
                                onChange={(e) => setData('status_pembayaran', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                                required
                            >
                                {['draft', 'terbit', 'dikirim', 'dibayar_sebagian', 'lunas', 'jatuh_tempo', 'batal'].map((s) => (
                                    <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal_invoice">Tanggal Invoice *</Label>
                            <Input
                                id="tanggal_invoice"
                                type="date"
                                value={data.tanggal_invoice}
                                onChange={(e) => setData('tanggal_invoice', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="jatuh_tempo">Jatuh Tempo *</Label>
                            <Input
                                id="jatuh_tempo"
                                type="date"
                                value={data.jatuh_tempo}
                                onChange={(e) => setData('jatuh_tempo', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center border-b border-hairline pb-2">
                            <h3 className="text-body-sm-strong font-medium text-ink">Rincian Item Tagihan</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addItem} className="flex items-center gap-1.5 text-xs">
                                <Plus className="w-3.5 h-3.5" />Tambah Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {items.map((it, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-canvas-soft/50 p-3 rounded-md border border-hairline">
                                    <div className="col-span-5 space-y-1">
                                        <Label className="text-[11px] text-mute">Deskripsi *</Label>
                                        <Input
                                            value={it.deskripsi}
                                            onChange={(e) => updateItem(idx, 'deskripsi', e.target.value)}
                                            placeholder="Deskripsi layanan..."
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-[11px] text-mute">Qty *</Label>
                                        <Input
                                            type="number"
                                            min="0.01"
                                            step="any"
                                            value={it.kuantitas}
                                            onChange={(e) => updateItem(idx, 'kuantitas', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-[11px] text-mute">Harga Satuan (Rp) *</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={it.harga_satuan}
                                            onChange={(e) => updateItem(idx, 'harga_satuan', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 text-right pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(idx)}
                                            className="h-8 w-8 text-error hover:bg-error/10"
                                            disabled={items.length <= 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <div className="w-72 bg-canvas-soft p-3 rounded-md border border-hairline text-right">
                            <div className="text-xs text-mute mb-1">Total Tagihan:</div>
                            <div className="text-xl font-bold text-primary font-mono">Rp {subtotal.toLocaleString('id-ID')}</div>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <Label htmlFor="catatan">Catatan / Instruksi Pembayaran</Label>
                        <textarea
                            id="catatan"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-hairline bg-canvas p-3 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-hairline">
                        <Link href={`/invoices/${invoice.id}`}>
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
