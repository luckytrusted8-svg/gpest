import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Customer { id: number; company_name: string; }
interface Contract { id: number; contract_number: string; customer_id: number; contract_value: number; }
interface WorkReport { id: number; nomor_laporan?: string; report_number?: string; customer_id: number; }

interface InvoiceItem {
    [key: string]: unknown;
    deskripsi: string;
    kuantitas: number;
    satuan: string;
    harga_satuan: number;
    diskon_persen: number;
}

interface Props {
    customers?: Customer[];
    contracts?: Contract[];
    workReports?: WorkReport[];
    selectedContract?: Contract | null;
}

export default function Create({ customers = [], contracts = [], workReports = [], selectedContract }: Props) {
    const [items, setItems] = useState<InvoiceItem[]>([
        { deskripsi: selectedContract ? `Layanan Kontrak ${selectedContract.contract_number}` : 'Layanan Pest Control', kuantitas: 1, satuan: 'paket', harga_satuan: selectedContract ? selectedContract.contract_value : 0, diskon_persen: 0 }
    ]);

    const { data, setData, processing, errors } = useForm({
        customer_id: selectedContract ? String(selectedContract.customer_id) : '',
        contract_id: selectedContract ? String(selectedContract.id) : '',
        work_report_id: '',
        tanggal_invoice: new Date().toISOString().split('T')[0],
        jatuh_tempo: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status_pembayaran: 'terbit',
        catatan: 'Pembayaran dapat dilakukan melalui transfer Bank BCA 123-456-7890 a.n PT G-PEST Indonesia.',
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
        router.post('/invoices', { ...data, items } as any);
    };

    return (
        <AppLayout>
            <Head title="Buat Invoice Baru" />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/invoices">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Buat Invoice Baru</h1>
                        <p className="text-body-sm text-mute mt-0.5">Terbitkan tagihan baru untuk pelanggan.</p>
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
                                <option value="">-- Pilih Customer --</option>
                                {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-xs text-error">{errors.customer_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contract_id">Kontrak Terkait (Opsional)</Label>
                            <select
                                id="contract_id"
                                value={data.contract_id}
                                onChange={(e) => setData('contract_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tanpa Kontrak Spesifik</option>
                                {contracts.map((c) => <option key={c.id} value={c.id}>{c.contract_number}</option>)}
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
                        <Link href="/invoices">
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink">
                            {processing ? 'Menyimpan...' : 'Terbit Invoice'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
