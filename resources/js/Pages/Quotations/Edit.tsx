import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Plus, Trash2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface Customer { id: number; company_name: string; address: string | null; contact_person: string | null; phone: string | null; email: string | null; }
interface QuotationItem { id?: number; jenis_layanan: string; deskripsi: string; kuantitas: number; satuan: string; harga_satuan: number; diskon_persen: number; subtotal: number; }

interface QuotationData {
    id: number;
    nomor_quotation: string;
    customer_id: number;
    berlaku_hingga: string;
    syarat_ketentuan: string | null;
    catatan: string | null;
    status: string;
    items: QuotationItem[];
}

interface Props {
    quotation: QuotationData;
    customers: Customer[];
}

const calcSubtotal = (item: QuotationItem): number => {
    const gross = item.kuantitas * item.harga_satuan;
    return gross - gross * (item.diskon_persen / 100);
};

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function Edit({ quotation, customers }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const { data, setData, put, processing, errors } = useForm({
        customer_id: String(quotation.customer_id),
        lead_id: '',
        berlaku_hingga: quotation.berlaku_hingga,
        syarat_ketentuan: quotation.syarat_ketentuan ?? '',
        catatan: quotation.catatan ?? '',
        status: quotation.status as 'draft' | 'dikirim',
        items: quotation.items.map((i) => ({
            id: i.id,
            jenis_layanan: i.jenis_layanan,
            deskripsi: i.deskripsi ?? '',
            kuantitas: i.kuantitas,
            satuan: i.satuan,
            harga_satuan: i.harga_satuan,
            diskon_persen: i.diskon_persen,
            subtotal: i.subtotal,
        })) as QuotationItem[],
    });

    const handleItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        newItems[index].subtotal = calcSubtotal(newItems[index]);
        setData('items', newItems);
    };

    const addItem = () => {
        setData('items', [...data.items, { id: undefined, jenis_layanan: '', deskripsi: '', kuantitas: 1, satuan: 'pcs', harga_satuan: 0, diskon_persen: 0, subtotal: 0 }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) return;
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const grandTotal = data.items.reduce((sum, item) => sum + calcSubtotal(item), 0);

    const handleSubmit = (e: React.FormEvent, status: 'draft' | 'dikirim') => {
        e.preventDefault();
        setData('status', status);
        setTimeout(() => put(`/quotations/${quotation.id}`), 0);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${quotation.nomor_quotation}`} />
            <div className="max-w-4xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Edit {quotation.nomor_quotation}</h1>
                    <p className="text-body-sm text-mute mt-1">Perbarui data quotation.</p>
                </div>

                <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-6">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Informasi Quotation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer <span className="text-[#ee0000]">*</span></Label>
                                <select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="">Pilih Customer</option>
                                    {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                </select>
                                {errors.customer_id && <span className="text-xs text-[#ee0000]">{errors.customer_id}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Berlaku Hingga <span className="text-[#ee0000]">*</span></Label>
                                <Input type="date" value={data.berlaku_hingga} onChange={(e) => setData('berlaku_hingga', e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Syarat & Ketentuan</Label>
                            <textarea value={data.syarat_ketentuan} onChange={(e) => setData('syarat_ketentuan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y" />
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-hairline pb-3">
                            <h2 className="text-body-md-strong text-ink">Item Quotation</h2>
                            <Button type="button" onClick={addItem} variant="outline" className="text-body-sm-strong flex items-center gap-2"><Plus className="w-4 h-4" />Tambah Item</Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-body-sm">
                                <thead><tr className="border-b border-hairline">
                                    <th className="text-left py-2 px-2 text-xs font-medium text-mute w-8">No</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-mute">Jenis Layanan</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-mute">Deskripsi</th>
                                    <th className="text-right py-2 px-2 text-xs font-medium text-mute w-16">Qty</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-mute w-20">Satuan</th>
                                    <th className="text-right py-2 px-2 text-xs font-medium text-mute w-28">Harga Satuan</th>
                                    <th className="text-right py-2 px-2 text-xs font-medium text-mute w-20">Diskon %</th>
                                    <th className="text-right py-2 px-2 text-xs font-medium text-mute w-28">Subtotal</th>
                                    <th className="w-10"></th>
                                </tr></thead>
                                <tbody>
                                    {data.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-hairline">
                                            <td className="py-2 px-2 text-xs text-mute">{idx + 1}</td>
                                            <td className="py-2 px-2"><Input value={item.jenis_layanan} onChange={(e) => handleItemChange(idx, 'jenis_layanan', e.target.value)} className="h-8 text-xs" required /></td>
                                            <td className="py-2 px-2"><Input value={item.deskripsi} onChange={(e) => handleItemChange(idx, 'deskripsi', e.target.value)} className="h-8 text-xs" /></td>
                                            <td className="py-2 px-2"><Input type="number" value={item.kuantitas} onChange={(e) => handleItemChange(idx, 'kuantitas', Number(e.target.value))} className="h-8 text-xs text-right" min="0.01" step="0.01" required /></td>
                                            <td className="py-2 px-2"><Input value={item.satuan} onChange={(e) => handleItemChange(idx, 'satuan', e.target.value)} className="h-8 text-xs" required /></td>
                                            <td className="py-2 px-2"><Input type="number" value={item.harga_satuan} onChange={(e) => handleItemChange(idx, 'harga_satuan', Number(e.target.value))} className="h-8 text-xs text-right" min="0" required /></td>
                                            <td className="py-2 px-2"><Input type="number" value={item.diskon_persen} onChange={(e) => handleItemChange(idx, 'diskon_persen', Number(e.target.value))} className="h-8 text-xs text-right" min="0" max="100" /></td>
                                            <td className="py-2 px-2 text-right text-xs font-medium">{fmt(calcSubtotal(item))}</td>
                                            <td className="py-2 px-2"><button type="button" onClick={() => removeItem(idx)} className="p-1 rounded hover:bg-[#ee0000]/10"><Trash2 className="w-3.5 h-3.5 text-[#ee0000]" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-2">
                            <div className="w-80 bg-canvas-soft rounded-md p-4 space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-mute">Subtotal</span><span>{fmt(data.items.reduce((s, i) => s + i.kuantitas * i.harga_satuan, 0))}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-mute">Diskon</span><span className="text-[#ee0000]">- {fmt(data.items.reduce((s, i) => s + (i.kuantitas * i.harga_satuan - calcSubtotal(i)), 0))}</span></div>
                                <div className="flex justify-between text-lg font-bold border-t border-hairline pt-2"><span className="text-ink">Grand Total</span><span className="text-primary">{fmt(grandTotal)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Catatan</Label>
                            <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href={`/quotations/${quotation.id}`}><Button type="button" variant="outline" className="text-body-sm-strong">Batal</Button></Link>
                        <Button type="submit" className="bg-[#f5a623] hover:bg-[#e6960a] text-white text-body-sm-strong flex items-center gap-2" disabled={processing}>{processing ? 'Menyimpan...' : <><FileText className="w-4 h-4" />Simpan Draft</>}</Button>
                        <Button type="button" onClick={(e) => handleSubmit(e, 'dikirim')} className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2" disabled={processing}>{processing ? 'Mengirim...' : <><FileText className="w-4 h-4" />Simpan & Kirim</>}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
