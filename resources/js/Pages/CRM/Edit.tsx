import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface LeadData {
    id: number;
    lead_id: string;
    nama_perusahaan: string;
    nama_pic: string;
    telepon: string;
    email: string | null;
    alamat: string | null;
    sumber_lead: string;
    kebutuhan: string | null;
    status: string;
    assigned_sales: { id: number; name: string } | null;
    catatan: string | null;
}

interface SalesUser { id: number; name: string; }

interface Props {
    lead: LeadData;
    salesUsers: SalesUser[];
}

export default function Edit({ lead, salesUsers }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const { data, setData, put, processing, errors } = useForm({
        nama_perusahaan: lead.nama_perusahaan,
        nama_pic: lead.nama_pic,
        telepon: lead.telepon,
        email: lead.email ?? '',
        alamat: lead.alamat ?? '',
        sumber_lead: lead.sumber_lead,
        kebutuhan: lead.kebutuhan ?? '',
        status: lead.status,
        assigned_sales: lead.assigned_sales?.id ? String(lead.assigned_sales.id) : '',
        catatan: lead.catatan ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/crm/${lead.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${lead.lead_id}`} />
            <div className="max-w-3xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Edit {lead.lead_id}</h1>
                    <p className="text-body-sm text-mute mt-1">Perbarui data lead.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Data Perusahaan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Perusahaan <span className="text-[#ee0000]">*</span></Label>
                                <Input value={data.nama_perusahaan} onChange={(e) => setData('nama_perusahaan', e.target.value)} required />
                                {errors.nama_perusahaan && <span className="text-xs text-[#ee0000]">{errors.nama_perusahaan}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Nama PIC <span className="text-[#ee0000]">*</span></Label>
                                <Input value={data.nama_pic} onChange={(e) => setData('nama_pic', e.target.value)} required />
                                {errors.nama_pic && <span className="text-xs text-[#ee0000]">{errors.nama_pic}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Telepon <span className="text-[#ee0000]">*</span></Label>
                                <Input value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} required />
                                {errors.telepon && <span className="text-xs text-[#ee0000]">{errors.telepon}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <span className="text-xs text-[#ee0000]">{errors.email}</span>}
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label>Alamat</Label>
                                <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Info Lead</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Sumber Lead <span className="text-[#ee0000]">*</span></Label>
                                <select value={data.sumber_lead} onChange={(e) => setData('sumber_lead', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="telepon">Telepon</option>
                                    <option value="website">Website</option>
                                    <option value="referral">Referral</option>
                                    <option value="media_sosial">Media Sosial</option>
                                    <option value="walk_in">Walk In</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                                    {['baru', 'dihubungi', 'survey', 'quotation', 'negosiasi', 'menang', 'kalah'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assigned Sales</Label>
                                <select value={data.assigned_sales} onChange={(e) => setData('assigned_sales', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Belum Ditugaskan</option>
                                    {salesUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label>Kebutuhan</Label>
                                <textarea value={data.kebutuhan} onChange={(e) => setData('kebutuhan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y" />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label>Catatan</Label>
                                <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href={`/crm/${lead.id}`}><Button type="button" variant="outline" className="text-body-sm-strong">Batal</Button></Link>
                        <Button type="submit" className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
