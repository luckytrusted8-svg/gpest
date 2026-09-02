import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, CheckCircle, Calendar, Send, Building2, ShieldCheck, MessageSquare } from 'lucide-react';
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
                {f?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {f.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href="/customer-requests">
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 font-mono">{requestItem.request_number}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                {requestItem.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Detail tiket permintaan & komplain dari pelanggan.</p>
                    </div>
                </div>

                {/* Routing Distribution Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-xs space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-900 font-bold">
                            <Send className="w-4 h-4 text-blue-600" />
                            Indikator Alur & Distribusi Tiket Request
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Dari Portal Pelanggan
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-[11px] pt-1">
                        <span className="font-bold text-slate-900">Asal Pengirim:</span> Customer Portal ({requestItem.customer?.company_name})
                        <span className="text-slate-400">➔</span>
                        <span className="font-bold text-slate-900">Tujuan Penerima:</span> Admin & Tim Operasional G-PEST
                    </div>
                </div>

                {/* Request Detail Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-200 pb-4 text-xs">
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Customer / Perusahaan:</div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                {requestItem.customer?.company_name ?? '-'}
                            </div>
                            {requestItem.customer?.address && <div className="text-xs text-slate-500 mt-1">{requestItem.customer.address}</div>}
                            {requestItem.customer?.phone && <div className="text-xs text-slate-500">Telp: {requestItem.customer.phone}</div>}
                        </div>
                        <div className="text-left sm:text-right space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Layanan Requested:</div>
                            <div className="font-extrabold text-blue-600 text-sm">{requestItem.jenis_layanan}</div>
                            <div className="text-xs text-slate-500">Prioritas: <span className="font-bold text-slate-900 uppercase">{requestItem.prioritas}</span></div>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deskripsi / Detail Permintaan:</div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap text-slate-800 font-medium">
                            {requestItem.deskripsi}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/60 p-4 rounded-xl border border-blue-200 gap-3">
                        <div>
                            <div className="text-xs font-bold text-slate-900">Buat Jadwal Baru dari Request Ini</div>
                            <div className="text-xs text-slate-600">Konversi langsung permintaan ini menjadi jadwal penanganan teknisi.</div>
                        </div>
                        <Link href={`/schedules/create?customer_id=${requestItem.customer?.id || ''}&service=${encodeURIComponent(requestItem.jenis_layanan)}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 text-xs">
                                <Calendar className="w-3.5 h-3.5" /> Buat Jadwal Pekerjaan
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleUpdateStatus} className="border-t border-slate-200 pt-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Update Status & Catatan Tanggapan Admin</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Permintaan</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-semibold"
                                >
                                    {['baru', 'ditinjau', 'dijadwalkan', 'diproses', 'selesai', 'ditolak'].map((s) => (
                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="catatan_admin" className="text-xs font-semibold text-slate-700">Catatan Tanggapan (Terlihat di Customer Portal)</Label>
                            <textarea
                                id="catatan_admin"
                                value={data.catatan_admin}
                                onChange={(e) => setData('catatan_admin', e.target.value)}
                                rows={3}
                                placeholder="Masukkan catatan penanganan atau balasan untuk pelanggan..."
                                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
                                {processing ? 'Memperbarui...' : 'Simpan Balasan & Status'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
