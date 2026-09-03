import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { Plus, CheckCircle, Clock } from 'lucide-react';

interface LeaveItem {
    id: number;
    user: { id: number; name: string } | null;
    jenis_izin: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
    status: string;
    approver?: { id: number; name: string } | null;
    catatan_approval?: string | null;
    created_at: string;
}

interface Props {
    leaves?: { data: LeaveItem[]; current_page: number; last_page: number; per_page: number; total: number };
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        menunggu: { label: 'Menunggu', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        disetujui: { label: 'Disetujui', cls: 'bg-[#16a34a]/15 text-[#16a34a]' },
        ditolak: { label: 'Ditolak', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

export default function Index({ leaves }: Props) {
    const { flash, auth } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const userRole = (auth as { user?: { roles?: { name: string }[] } })?.user?.roles?.[0]?.name;

    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        jenis_izin: 'cuti',
        tanggal_mulai: '',
        tanggal_selesai: '',
        alasan: '',
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leaves', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleApproveAction = (id: number, statusVal: 'disetujui' | 'ditolak') => {
        const cat = prompt(`Berikan catatan untuk status ${statusVal}:`) ?? '';
        router.post(`/leaves/${id}/approve`, { status: statusVal, catatan_approval: cat });
    };

    const dataList = leaves?.data ?? [];

    return (
        <AppLayout>
            <Head title="Pengajuan Cuti & Izin" />
            <div className="space-y-4">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Pengajuan Cuti & Izin Teknisi</h1>
                        <p className="text-body-sm text-mute mt-0.5">Kelola data izin, sakit, dan cuti karyawan.</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" />Ajukan Cuti / Izin
                    </Button>
                </div>

                <div className="bg-canvas border border-hairline rounded-md overflow-x-auto shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                    <table className="w-full text-body-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-canvas-soft">
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Nama Karyawan</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Jenis Izin</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Mulai</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Selesai</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Alasan</th>
                                <th className="text-left py-3 px-4 text-body-sm-strong text-ink font-medium">Status</th>
                                <th className="text-right py-3 px-4 text-body-sm-strong text-ink font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((l) => (
                                <tr key={l.id} className="border-b border-hairline hover:bg-canvas-soft/50">
                                    <td className="py-3 px-4 font-semibold text-ink">{l.user?.name ?? '-'}</td>
                                    <td className="py-3 px-4 uppercase font-medium text-xs text-primary">{l.jenis_izin}</td>
                                    <td className="py-3 px-4 text-xs text-mute">{new Date(l.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3 px-4 text-xs text-mute">{new Date(l.tanggal_selesai).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3 px-4 text-xs text-mute max-w-xs truncate">{l.alasan}</td>
                                    <td className="py-3 px-4"><StatusBadge status={l.status} /></td>
                                    <td className="py-3 px-4 text-right">
                                        {l.status === 'menunggu' && (userRole === 'super_admin' || userRole === 'admin' || userRole === 'supervisor') ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" onClick={() => handleApproveAction(l.id, 'disetujui')} className="bg-[#16a34a] text-white hover:bg-[#15803d] text-xs h-7 px-2">
                                                    Setujui
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleApproveAction(l.id, 'ditolak')} className="text-error border-error hover:bg-error/10 text-xs h-7 px-2">
                                                    Tolak
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-mute">{l.approver?.name ? `Oleh: ${l.approver.name}` : '-'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-mute text-body-sm">
                                        Belum ada pengajuan cuti.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                        <div className="relative bg-canvas border border-hairline rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 space-y-4">
                            <h2 className="text-body-lg font-semibold text-ink">Form Pengajuan Cuti / Izin</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="jenis_izin">Jenis Izin *</Label>
                                    <select
                                        id="jenis_izin"
                                        value={data.jenis_izin}
                                        onChange={(e) => setData('jenis_izin', e.target.value)}
                                        className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="cuti">Cuti Tahunan</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="izin">Izin Keperluan</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                                        <Input
                                            id="tanggal_mulai"
                                            type="date"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                                        <Input
                                            id="tanggal_selesai"
                                            type="date"
                                            value={data.tanggal_selesai}
                                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="alasan">Alasan Pengajuan *</Label>
                                    <textarea
                                        id="alasan"
                                        value={data.alasan}
                                        onChange={(e) => setData('alasan', e.target.value)}
                                        rows={3}
                                        placeholder="Jelaskan alasan pengajuan cuti..."
                                        className="w-full rounded-md border border-hairline bg-canvas p-3 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-hairline">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                                    <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink">
                                        {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
