import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowLeft, Phone, Mail, Building2, MapPin, User, Calendar, Edit, Trash2, ArrowRight, ChevronDown, Clock } from 'lucide-react';

interface Activity {
    id: number;
    jenis_aktivitas: string;
    judul: string;
    deskripsi: string | null;
    tanggal_aktivitas: string;
    user: { id: number; name: string };
    created_at: string;
}

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
    activities: Activity[];
    created_at: string;
}

interface Props {
    lead: LeadData;
    allStatuses: string[];
}

const PIPELINE = ['baru', 'dihubungi', 'survey', 'quotation', 'negosiasi', 'menang'];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    baru: { label: 'Baru', bg: 'bg-canvas-soft-2', text: 'text-body-text' },
    dihubungi: { label: 'Dihubungi', bg: 'bg-[#7928ca]/10', text: 'text-[#7928ca]' },
    survey: { label: 'Survey', bg: 'bg-[#7928ca]/10', text: 'text-[#7928ca]' },
    quotation: { label: 'Quotation', bg: 'bg-[#f5a623]/10', text: 'text-[#ab570a]' },
    negosiasi: { label: 'Negosiasi', bg: 'bg-[#f5a623]/10', text: 'text-[#ab570a]' },
    menang: { label: 'Menang', bg: 'bg-[#0070f3]/10', text: 'text-[#0070f3]' },
    kalah: { label: 'Kalah', bg: 'bg-[#ee0000]/10', text: 'text-[#ee0000]' },
    customer: { label: 'Customer', bg: 'bg-[#0070f3]/10', text: 'text-[#0070f3]' },
};

const ACTIVITY_ICONS: Record<string, string> = {
    telepon: 'bg-[#7928ca]/15 text-[#7928ca]',
    email: 'bg-[#0070f3]/15 text-[#0070f3]',
    meeting: 'bg-[#f5a623]/15 text-[#ab570a]',
    survey: 'bg-[#00b8a9]/15 text-[#00b8a9]',
    follow_up: 'bg-[#7928ca]/15 text-[#7928ca]',
    catatan: 'bg-canvas-soft-2 text-body-text',
};

const StatusBadge = ({ status }: { status: string }) => {
    const c = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-canvas-soft-2', text: 'text-body-text' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

export default function Show({ lead, allStatuses }: Props) {
    const { flash, auth } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const user = (auth as { user: { id: number; roles: string[] } }).user;

    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showConvertDialog, setShowConvertDialog] = useState(false);
    const [showActivityForm, setShowActivityForm] = useState(false);

    const { data: actData, setData: setActData, post: postAct, processing: actProcessing, reset: resetAct } = useForm({
        jenis_aktivitas: 'catatan' as string,
        judul: '',
        deskripsi: '',
        tanggal_aktivitas: new Date().toISOString().split('T')[0],
    });

    const changeStatus = (newStatus: string) => {
        router.put(`/crm/${lead.id}`, {
            nama_perusahaan: lead.nama_perusahaan,
            nama_pic: lead.nama_pic,
            telepon: lead.telepon,
            email: lead.email,
            alamat: lead.alamat,
            sumber_lead: lead.sumber_lead,
            kebutuhan: lead.kebutuhan,
            status: newStatus,
            assigned_sales: lead.assigned_sales?.id ?? null,
            catatan: lead.catatan,
        }, { preserveState: true });
        setShowStatusDropdown(false);
    };

    const handleConvert = () => {
        router.post(`/crm/${lead.id}/convert`, {}, { onSuccess: () => setShowConvertDialog(false) });
    };

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        postAct(`/crm/${lead.id}/activity`, {
            onSuccess: () => {
                resetAct();
                setShowActivityForm(false);
            },
        });
    };

    const handleDelete = () => {
        if (!confirm('Hapus lead ini?')) return;
        router.delete(`/crm/${lead.id}`);
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AppLayout>
            <Head title={`Lead ${lead.lead_id}`} />
            <div className="max-w-6xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/crm"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button></Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">{lead.nama_perusahaan}</h1>
                            <p className="text-body-sm text-mute mt-0.5">{lead.lead_id} &middot; {lead.nama_pic}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                                Ubah Status <ChevronDown className="w-3.5 h-3.5" />
                            </Button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-canvas border border-hairline rounded-md shadow-lg z-50 py-1">
                                    {allStatuses.filter((s) => s !== lead.status && s !== 'customer').map((s) => (
                                        <button key={s} onClick={() => changeStatus(s)} className="w-full text-left px-3 py-2 text-body-sm text-ink hover:bg-canvas-soft flex items-center gap-2">
                                            <StatusBadge status={s} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {lead.status === 'menang' && (
                            <Button onClick={() => setShowConvertDialog(true)} className="bg-[#0070f3] hover:bg-[#0060df] text-white text-body-sm-strong flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Konversi ke Customer
                            </Button>
                        )}
                        <Link href={`/crm/${lead.id}/edit`}><Button variant="outline" className="text-body-sm-strong flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Button></Link>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-[#ee0000] hover:bg-[#ee0000]/10" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {PIPELINE.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${lead.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border-current ring-2 ring-offset-1` : 'bg-canvas-soft-2 text-mute border-hairline'}`}>
                                {STATUS_CONFIG[s].label}
                            </div>
                            {i < PIPELINE.length - 1 && <div className={`w-6 h-px mx-1 ${PIPELINE.indexOf(lead.status) > i ? 'bg-primary' : 'bg-hairline'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 mb-4">Informasi Lead</h2>
                            <div className="grid grid-cols-2 gap-4 text-body-sm">
                                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-mute" /><div><span className="text-mute">Perusahaan</span><div className="font-medium text-ink">{lead.nama_perusahaan}</div></div></div>
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-mute" /><div><span className="text-mute">PIC</span><div className="font-medium text-ink">{lead.nama_pic}</div></div></div>
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-mute" /><div><span className="text-mute">Telepon</span><div className="font-medium text-ink">{lead.telepon}</div></div></div>
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-mute" /><div><span className="text-mute">Email</span><div className="font-medium text-ink">{lead.email ?? '-'}</div></div></div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-mute" /><div><span className="text-mute">Alamat</span><div className="font-medium text-ink">{lead.alamat ?? '-'}</div></div></div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-mute" /><div><span className="text-mute">Tanggal Dibuat</span><div className="font-medium text-ink">{formatDate(lead.created_at)}</div></div></div>
                            </div>
                            {lead.kebutuhan && <div className="mt-4 pt-4 border-t border-hairline"><span className="text-body-sm text-mute">Kebutuhan</span><p className="text-body-sm text-ink mt-1 whitespace-pre-wrap">{lead.kebutuhan}</p></div>}
                            {lead.catatan && <div className="mt-4 pt-4 border-t border-hairline"><span className="text-body-sm text-mute">Catatan</span><p className="text-body-sm text-ink mt-1 whitespace-pre-wrap">{lead.catatan}</p></div>}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex items-center justify-between border-b border-hairline pb-3">
                                <h2 className="text-body-md-strong text-ink">Timeline Aktivitas</h2>
                                <Button onClick={() => setShowActivityForm(!showActivityForm)} variant="outline" className="text-xs">+ Tambah</Button>
                            </div>

                            {showActivityForm && (
                                <form onSubmit={handleAddActivity} className="p-4 bg-canvas-soft/50 border-b border-hairline space-y-3">
                                    <div className="space-y-2">
                                        <Label>Jenis Aktivitas</Label>
                                        <select value={actData.jenis_aktivitas} onChange={(e) => setActData('jenis_aktivitas', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                                            {['catatan', 'telepon', 'email', 'meeting', 'survey', 'follow_up'].map((j) => <option key={j} value={j}>{j.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Judul <span className="text-[#ee0000]">*</span></Label>
                                        <Input value={actData.judul} onChange={(e) => setActData('judul', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deskripsi</Label>
                                        <textarea value={actData.deskripsi} onChange={(e) => setActData('deskripsi', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal</Label>
                                        <Input type="date" value={actData.tanggal_aktivitas} onChange={(e) => setActData('tanggal_aktivitas', e.target.value)} required />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="ghost" onClick={() => setShowActivityForm(false)} className="text-xs">Batal</Button>
                                        <Button type="submit" className="bg-primary text-on-primary text-xs" disabled={actProcessing}>{actProcessing ? 'Menyimpan...' : 'Simpan'}</Button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-0">
                                {lead.activities.map((act) => (
                                    <div key={act.id} className="flex gap-3 py-3 border-b border-hairline last:border-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${ACTIVITY_ICONS[act.jenis_aktivitas] ?? ACTIVITY_ICONS.catatan}`}>
                                            {act.jenis_aktivitas.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-body-sm font-medium text-ink truncate">{act.judul}</span>
                                                <span className="text-[10px] text-mute flex-shrink-0">{formatDate(act.tanggal_aktivitas)}</span>
                                            </div>
                                            <div className="text-xs text-mute mt-0.5">{act.user.name}</div>
                                            {act.deskripsi && <p className="text-xs text-body-text mt-1 whitespace-pre-wrap">{act.deskripsi}</p>}
                                        </div>
                                    </div>
                                ))}
                                {lead.activities.length === 0 && <p className="py-6 text-center text-sm text-mute">Belum ada aktivitas.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConvertDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-canvas border border-hairline rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-body-md-strong text-ink mb-2">Konversi ke Customer?</h3>
                        <p className="text-body-sm text-mute mb-4">Lead <strong>{lead.lead_id}</strong> akan dikonversi menjadi customer. Anda akan diarahkan ke halaman pembuatan customer dengan data terisi otomatis.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowConvertDialog(false)} className="text-body-sm-strong">Batal</Button>
                            <Button onClick={handleConvert} className="bg-[#0070f3] hover:bg-[#0060df] text-white text-body-sm-strong">Konversi</Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
