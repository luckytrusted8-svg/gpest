import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import {
    ArrowLeft,
    CheckCircle,
    Calendar,
    Send,
    Building2,
    ShieldCheck,
    MessageSquare,
    MapPin,
    User,
    Phone,
    Clock,
} from 'lucide-react';
import React from 'react';

interface CustomerRequestItem {
    id: number;
    request_number: string;
    customer_id?: number | null;
    customer?: { id: number; company_name: string; address?: string | null; phone?: string | null; email?: string | null } | null;
    site_id?: number | null;
    site?: { id: number; site_name: string; address?: string | null; location?: string | null } | null;
    lokasi?: string | null;
    alamat_detail?: string | null;
    pic_name?: string | null;
    pic_phone?: string | null;
    jenis_layanan: string;
    prioritas: string;
    deskripsi: string;
    tanggal_permintaan?: string | null;
    waktu_layanan?: string | null;
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

    const targetLocationName = requestItem.lokasi || requestItem.site?.site_name || requestItem.customer?.company_name || 'Kantor Pelanggan';
    const targetAddress = requestItem.alamat_detail || requestItem.site?.address || requestItem.customer?.address || '';

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

                {/* Back Button & Header */}
                <div className="flex items-center gap-3">
                    <Link href="/customer-requests">
                        <Button variant="outline" size="sm" className="h-9 px-3 gap-1.5 text-xs text-slate-700">
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-slate-900 font-mono">{requestItem.request_number}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                {requestItem.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Detail tiket permintaan & komplain dari pelanggan.</p>
                    </div>
                </div>

                {/* Request Detail Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
                    {/* Customer & Location Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-200 pb-4 text-xs">
                        <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Customer / Perusahaan:</div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                                {requestItem.customer?.company_name ?? '-'}
                            </div>
                            {requestItem.customer?.address && <div className="text-xs text-slate-500">{requestItem.customer.address}</div>}
                            {requestItem.customer?.phone && <div className="text-xs text-slate-500">Telp Perusahaan: {requestItem.customer.phone}</div>}
                        </div>
                        <div className="text-left sm:text-right space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Layanan Requested:</div>
                            <div className="font-extrabold text-blue-600 text-sm">{requestItem.jenis_layanan}</div>
                            <div className="text-xs text-slate-500">Prioritas: <span className="font-bold text-slate-900 uppercase">{requestItem.prioritas}</span></div>
                        </div>
                    </div>

                    {/* Target Service Location & PIC Details */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Lokasi Kunjungan & Kontak PIC Lapangan
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <span className="text-slate-400 text-[11px] block font-medium">Titik Lokasi / Cabang:</span>
                                <div className="font-bold text-slate-900 text-sm mt-0.5">{targetLocationName}</div>
                                {targetAddress && (
                                    <div className="text-xs text-slate-600 mt-0.5">{targetAddress}</div>
                                )}
                            </div>
                            <div>
                                <span className="text-slate-400 text-[11px] block font-medium">Kontak PIC Lapangan:</span>
                                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    {requestItem.pic_name || '-'}
                                </div>
                                {requestItem.pic_phone && (
                                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        {requestItem.pic_phone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preferred Date & Time Window */}
                        {(requestItem.tanggal_permintaan || requestItem.waktu_layanan) && (
                            <div className="border-t border-slate-200/80 pt-2.5 flex flex-wrap items-center gap-4 text-xs">
                                {requestItem.tanggal_permintaan && (
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <span>Target Kunjungan:</span>
                                        <span className="font-bold text-slate-900">
                                            {new Date(requestItem.tanggal_permintaan).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                                {requestItem.waktu_layanan && (
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span>Waktu:</span>
                                        <span className="font-bold text-slate-900">{requestItem.waktu_layanan}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deskripsi / Detail Permintaan & Indikasi Hama:</div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap text-slate-800 font-medium">
                            {requestItem.deskripsi}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/60 p-4 rounded-xl border border-blue-200 gap-3">
                        <div>
                            <div className="text-xs font-bold text-slate-900">Buat Jadwal Baru dari Request Ini</div>
                            <div className="text-xs text-slate-600">Konversi langsung permintaan ini menjadi jadwal penanganan teknisi dengan smart area matching.</div>
                        </div>
                        <Link href={`/schedules/create?${new URLSearchParams({
                            customer_id: String(requestItem.customer?.id || requestItem.customer_id || ''),
                            service: requestItem.jenis_layanan || '',
                            priority: requestItem.prioritas || '',
                            notes: requestItem.deskripsi || '',
                            request_id: String(requestItem.id || ''),
                            lokasi: targetLocationName + (targetAddress ? ` - ${targetAddress}` : ''),
                            site_id: String(requestItem.site_id || ''),
                        }).toString()}`}>
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
