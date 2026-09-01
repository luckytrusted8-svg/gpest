import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, CheckCircle, Calendar } from 'lucide-react';
import React from 'react';

interface CustomerRequestItem {
    id: number;
    request_number: string;
    customer?: { id: number; company_name: string; address?: string | null; phone?: string | null; email?: string | null } | null;
    jenis_layanan: string;
    prioritas: string;
    deskripsi: string;
    tanggal_permintaan?: string | null;
    status: string;
    catatan_admin?: string | null;
    created_at: string;
}

interface Props {
    requestItem: CustomerRequestItem;
}

export default function Show({ requestItem }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const { data, setData, put, processing } = useForm({
        status: requestItem.status,
        catatan_admin: requestItem.catatan_admin ?? '',
    });

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/customer-requests/${requestItem.id}/status`);
    };

    return (
        <AppLayout>
            <Head title={`Request ${requestItem.request_number}`} />
            <div className="max-w-3xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}

                <div className="flex items-center gap-3">
                    <Link href="/customer-requests">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">{requestItem.request_number}</h1>
                        <p className="text-body-sm text-mute mt-0.5">Detail permintaan dari pelanggan.</p>
                    </div>
                </div>

                <div className="bg-canvas border border-hairline rounded-md p-6 space-y-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                    <div className="grid grid-cols-2 gap-4 border-b border-hairline pb-4 text-body-sm">
                        <div>
                            <div className="text-xs text-mute mb-1">Customer / Perusahaan:</div>
                            <div className="font-semibold text-ink text-base">{requestItem.customer?.company_name ?? '-'}</div>
                            {requestItem.customer?.address && <div className="text-xs text-mute mt-1">{requestItem.customer.address}</div>}
                            {requestItem.customer?.phone && <div className="text-xs text-mute">Telp: {requestItem.customer.phone}</div>}
                        </div>
                        <div className="text-right space-y-1">
                            <div className="text-xs text-mute mb-1">Layanan Requested:</div>
                            <div className="font-bold text-primary">{requestItem.jenis_layanan}</div>
                            <div className="text-xs text-mute">Prioritas: <span className="font-semibold text-ink uppercase">{requestItem.prioritas}</span></div>
                        </div>
                    </div>

                    <div className="space-y-2 text-body-sm">
                        <div className="text-xs font-semibold text-mute uppercase">Deskripsi / Detail Permintaan:</div>
                        <div className="p-4 bg-canvas-soft/50 rounded-md border border-hairline whitespace-pre-wrap text-ink">
                            {requestItem.deskripsi}
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-canvas-soft/30 p-4 rounded-md border border-hairline">
                        <div>
                            <div className="text-xs text-mute">Buat Jadwal Baru dari Request Ini</div>
                            <div className="text-xs font-medium text-ink">Konversi langsung permintaan ini menjadi jadwal penanganan teknisi.</div>
                        </div>
                        <Link href={`/schedules/create?customer_id=${requestItem.customer?.id || ''}&service=${encodeURIComponent(requestItem.jenis_layanan)}`}>
                            <Button size="sm" className="bg-primary text-on-primary hover:bg-ink flex items-center gap-1.5 text-xs">
                                <Calendar className="w-3.5 h-3.5" />Buat Jadwal
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleUpdateStatus} className="border-t border-hairline pt-4 space-y-4">
                        <h3 className="text-body-sm-strong font-medium text-ink">Update Status & Catatan Admin</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status Permintaan</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                                >
                                    {['baru', 'ditinjau', 'dijadwalkan', 'diproses', 'selesai', 'ditolak'].map((s) => (
                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="catatan_admin">Catatan Internal / Balasan Klien</Label>
                            <textarea
                                id="catatan_admin"
                                value={data.catatan_admin}
                                onChange={(e) => setData('catatan_admin', e.target.value)}
                                rows={3}
                                placeholder="Masukkan catatan penanganan atau tindak lanjut..."
                                className="w-full rounded-md border border-hairline bg-canvas p-3 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink">
                                {processing ? 'Memperbarui...' : 'Simpan Status'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
