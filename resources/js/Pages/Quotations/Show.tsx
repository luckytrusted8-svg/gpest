import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowLeft, Send, Check, X, Copy, FileText, ExternalLink, ArrowRight, Trash2 } from 'lucide-react';

interface QuotationItem {
    id: number;
    jenis_layanan: string;
    deskripsi: string | null;
    kuantitas: number;
    satuan: string;
    harga_satuan: number;
    diskon_persen: number;
    subtotal: number;
}

interface QuotationData {
    id: number;
    nomor_quotation: string;
    customer: { id: number; company_name: string; address: string | null; contact_person: string | null; phone: string | null; email: string | null };
    berlaku_hingga: string;
    syarat_ketentuan: string | null;
    catatan: string | null;
    status: string;
    dibuat_oleh: number;
    creator: { id: number; name: string };
    items: QuotationItem[];
    total: number;
    created_at: string;
}

interface Props {
    quotation: QuotationData;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft: { label: 'Draft', cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        dikirim: { label: 'Dikirim', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        dilihat: { label: 'Dilihat', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        diterima: { label: 'Diterima', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        ditolak: { label: 'Ditolak', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
        kadaluarsa: { label: 'Kadaluarsa', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function Show({ quotation }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const [processing, setProcessing] = useState(false);

    const action = (url: string, method: 'post' | 'put' = 'post') => {
        if (!confirm('Lanjutkan aksi ini?')) return;
        setProcessing(true);
        router[method](url, {}, { onFinish: () => setProcessing(false) });
    };

    const handleDelete = () => {
        if (!confirm('Hapus quotation ini?')) return;
        router.delete(`/quotations/${quotation.id}`);
    };

    const pageProps = usePage().props as Record<string, unknown>;
    const auth = pageProps.auth as { user?: { id: number } } | undefined;
    const isCreator = auth?.user?.id === quotation.dibuat_oleh;

    const quotationUrl = '/quotations/' + quotation.id;

    return (
        <AppLayout>
            <Head title={`Quotation ${quotation.nomor_quotation}`} />
            <div className="max-w-4xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/quotations"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button></Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">{quotation.nomor_quotation}</h1>
                            <p className="text-body-sm text-mute mt-0.5">Detail penawaran.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {quotation.status === 'draft' && (
                            <>
                                <Button onClick={() => action(quotationUrl + '/kirim')} className="bg-[#f5a623] hover:bg-[#e6960a] text-white text-body-sm-strong flex items-center gap-2" disabled={processing}><Send className="w-4 h-4" /> Kirim</Button>
                                <Link href={quotationUrl + '/edit'}><Button variant="outline" className="text-body-sm-strong">Edit</Button></Link>
                            </>
                        )}
                        {(quotation.status === 'dikirim' || quotation.status === 'dilihat') && (
                            <>
                                <Button onClick={() => action(quotationUrl + '/terima')} className="bg-[#0070f3] hover:bg-[#0060df] text-white text-body-sm-strong flex items-center gap-2" disabled={processing}><Check className="w-4 h-4" /> Tandai Diterima</Button>
                                <Button onClick={() => action(quotationUrl + '/tolak')} variant="outline" className="text-[#ee0000] border-[#ee0000] hover:bg-[#ee0000]/10 text-body-sm-strong flex items-center gap-2" disabled={processing}><X className="w-4 h-4" /> Tandai Ditolak</Button>
                            </>
                        )}
                        {quotation.status === 'diterima' && (
                            <Link href={'/contracts/create?from_quotation=' + quotation.id}><Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Buat Kontrak</Button></Link>
                        )}
                        <Button onClick={() => action(quotationUrl + '/duplikat')} variant="outline" className="text-body-sm-strong flex items-center gap-2" disabled={processing}><Copy className="w-4 h-4" /> Duplikat</Button>
                        <a href={quotationUrl + '/pdf'} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="text-body-sm-strong flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Cetak PDF</Button></a>
                        {quotation.status === 'draft' && <Button variant="outline" size="icon" className="h-9 w-9 text-[#ee0000] hover:bg-[#ee0000]/10" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="bg-primary p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-xl font-bold tracking-wide">G-PEST</h1>
                                <p className="text-xs opacity-80">Pest Control & Fumigation Services</p>
                                <p className="text-xs opacity-80">Jl. Contoh No. 123, Jakarta Selatan</p>
                                <p className="text-xs opacity-80">Telp: (021) 1234-5678</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold tracking-widest uppercase opacity-90">Penawaran</div>
                                <div className="text-lg font-mono mt-1">{quotation.nomor_quotation}</div>
                                <div className="mt-2"><StatusBadge status={quotation.status} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-semibold text-mute uppercase mb-2">Kepada Yth.</h3>
                                <div className="p-3 bg-canvas-soft/50 rounded-md">
                                    <div className="font-semibold text-ink">{quotation.customer.company_name}</div>
                                    {quotation.customer.address && <div className="text-xs text-mute mt-1">{quotation.customer.address}</div>}
                                    {quotation.customer.contact_person && <div className="text-xs text-mute">Attention: {quotation.customer.contact_person}</div>}
                                    {quotation.customer.phone && <div className="text-xs text-mute">Telp: {quotation.customer.phone}</div>}
                                    {quotation.customer.email && <div className="text-xs text-mute">Email: {quotation.customer.email}</div>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-mute uppercase mb-2">Detail Quotation</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-mute">Nomor</span><span className="font-mono font-medium">{quotation.nomor_quotation}</span></div>
                                    <div className="flex justify-between"><span className="text-mute">Tanggal</span><span>{new Date(quotation.created_at).toLocaleDateString('id-ID')}</span></div>
                                    <div className="flex justify-between"><span className="text-mute">Berlaku Hingga</span><span>{new Date(quotation.berlaku_hingga).toLocaleDateString('id-ID')}</span></div>
                                    <div className="flex justify-between"><span className="text-mute">Dibuat Oleh</span><span>{quotation.creator.name}</span></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-mute uppercase mb-2">Rincian Layanan</h3>
                            <div className="border border-hairline rounded-md overflow-hidden">
                                <table className="w-full text-body-sm">
                                    <thead><tr className="bg-canvas-soft border-b border-hairline">
                                        <th className="text-left py-2.5 px-3 text-xs font-medium text-mute w-8">No</th>
                                        <th className="text-left py-2.5 px-3 text-xs font-medium text-mute">Layanan</th>
                                        <th className="text-left py-2.5 px-3 text-xs font-medium text-mute">Deskripsi</th>
                                        <th className="text-right py-2.5 px-3 text-xs font-medium text-mute">Qty</th>
                                        <th className="text-right py-2.5 px-3 text-xs font-medium text-mute">Harga</th>
                                        <th className="text-right py-2.5 px-3 text-xs font-medium text-mute">Diskon</th>
                                        <th className="text-right py-2.5 px-3 text-xs font-medium text-mute">Subtotal</th>
                                    </tr></thead>
                                    <tbody>
                                        {quotation.items.map((item, idx) => (
                                            <tr key={item.id} className="border-b border-hairline last:border-0">
                                                <td className="py-2.5 px-3 text-xs text-mute">{idx + 1}</td>
                                                <td className="py-2.5 px-3 font-medium">{item.jenis_layanan}</td>
                                                <td className="py-2.5 px-3 text-xs text-mute">{item.deskripsi ?? '-'}</td>
                                                <td className="py-2.5 px-3 text-right">{item.kuantitas} {item.satuan}</td>
                                                <td className="py-2.5 px-3 text-right">{fmt(item.harga_satuan)}</td>
                                                <td className="py-2.5 px-3 text-right">{item.diskon_persen}%</td>
                                                <td className="py-2.5 px-3 text-right font-medium">{fmt(item.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end mt-3">
                                <div className="w-80 bg-primary/5 border border-primary/20 rounded-md p-4">
                                    <div className="flex justify-between text-sm mb-1"><span className="text-mute">Subtotal</span><span>{fmt(quotation.items.reduce((s, i) => s + i.kuantitas * i.harga_satuan, 0))}</span></div>
                                    <div className="flex justify-between text-sm mb-2"><span className="text-mute">Diskon</span><span className="text-[#ee0000]">- {fmt(quotation.items.reduce((s, i) => s + (i.kuantitas * i.harga_satuan - i.subtotal), 0))}</span></div>
                                    <div className="flex justify-between text-lg font-bold border-t border-primary/20 pt-2"><span>Total</span><span className="text-primary">{fmt(quotation.total)}</span></div>
                                </div>
                            </div>
                        </div>

                        {quotation.syarat_ketentuan && (
                            <div>
                                <h3 className="text-xs font-semibold text-mute uppercase mb-2">Syarat & Ketentuan</h3>
                                <div className="text-sm text-body-text whitespace-pre-wrap bg-canvas-soft/50 rounded-md p-4">{quotation.syarat_ketentuan}</div>
                            </div>
                        )}

                        {quotation.catatan && (
                            <div>
                                <h3 className="text-xs font-semibold text-mute uppercase mb-2">Catatan</h3>
                                <div className="text-sm text-body-text whitespace-pre-wrap">{quotation.catatan}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-8 pt-8">
                            <div className="text-center">
                                <div className="border-t border-ink w-40 mx-auto mt-16 pt-2 text-sm font-medium">Hormat Kami,</div>
                                <div className="text-xs text-mute mt-1">G-PEST</div>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-ink w-40 mx-auto mt-16 pt-2 text-sm font-medium">Penerima,</div>
                                <div className="text-xs text-mute mt-1">{quotation.customer.company_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
