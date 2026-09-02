import { Head, useForm, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Plus, MessageSquare, CheckCircle, AlertCircle, X, Clock, Calendar } from 'lucide-react';
import React, { useState } from 'react';

interface RequestItem {
    id: number;
    request_number: string;
    jenis_layanan: string;
    prioritas: string;
    deskripsi: string;
    status: string;
    catatan_admin?: string | null;
    created_at: string;
}

interface CustomerUser {
    id: number;
    name: string;
    customer: { id: number; company_name: string };
}

interface Props {
    customerUser: CustomerUser;
    requests?: { data: RequestItem[]; current_page: number; last_page: number; per_page: number; total: number };
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        baru: { label: 'Baru', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
        ditinjau: { label: 'Ditinjau', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
        dijadwalkan: { label: 'Dijadwalkan', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
        diproses: { label: 'Diproses', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        selesai: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ditolak: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
            {label}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        rendah: { label: 'Rendah', cls: 'bg-slate-100 text-slate-600' },
        sedang: { label: 'Normal', cls: 'bg-blue-100 text-blue-700' },
        tinggi: { label: 'Tinggi', cls: 'bg-amber-100 text-amber-800' },
        darurat: { label: 'Darurat', cls: 'bg-rose-100 text-rose-800 font-bold' },
    };
    const { label, cls } = map[priority] ?? { label: priority, cls: 'bg-slate-100 text-slate-600' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}>{label}</span>;
};

export default function Requests({ customerUser, requests }: Props) {
    const [showModal, setShowModal] = useState(false);
    const pageProps = usePage().props as Record<string, any>;
    const flash = pageProps.flash as { success?: string; error?: string } | undefined;
    const dataList = requests?.data ?? [];

    const { data, setData, post, processing, reset, errors } = useForm({
        jenis_layanan: 'General Pest Control',
        prioritas: 'sedang',
        deskripsi: '',
        tanggal_permintaan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/portal/requests', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <CustomerPortalLayout customerName={customerUser.customer?.company_name}>
            <Head title="Permintaan Layanan & Komplain" />
            <div className="space-y-6">
                {/* Notification Flash */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Header Page */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" /> Permintaan Layanan & Komplain
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Kirimkan permintaan penanganan hama darurat, penanganan tambahan, atau komplain ke tim G-PEST.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Kirim Request Baru
                    </button>
                </div>

                {/* Table Data */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-700">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">No. Request</th>
                                    <th className="py-3 px-4">Jenis Layanan</th>
                                    <th className="py-3 px-4">Prioritas</th>
                                    <th className="py-3 px-4">Deskripsi Permintaan</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Tanggal Kirim</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {dataList.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">{req.request_number}</td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900">{req.jenis_layanan}</td>
                                        <td className="py-3.5 px-4"><PriorityBadge priority={req.prioritas} /></td>
                                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm">
                                            <p className="line-clamp-2">{req.deskripsi}</p>
                                            {req.catatan_admin && (
                                                <div className="mt-1 text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-500">
                                                    <span className="font-semibold text-slate-700">Tanggapan Admin: </span>
                                                    {req.catatan_admin}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4"><StatusBadge status={req.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-xs text-slate-400 font-medium">
                                            {new Date(req.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                {dataList.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                            <p className="font-medium text-slate-600 text-sm">Belum ada permintaan yang diajukan.</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Klik tombol "Kirim Request Baru" untuk membuat permintaan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setShowModal(false)}
                        />

                        {/* Modal Box */}
                        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
                            {/* Header Modal */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Form Request Layanan / Komplain Baru</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Sampaikan kebutuhan penanganan atau komplain Anda</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">Jenis Layanan / Masalah *</label>
                                    <select
                                        value={data.jenis_layanan}
                                        onChange={(e) => setData('jenis_layanan', e.target.value)}
                                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    >
                                        <option value="General Pest Control">General Pest Control (Kecoa / Tikus / Nyamuk)</option>
                                        <option value="Termite Control">Termite Control (Pengendalian Rayap)</option>
                                        <option value="Fumigasi">Fumigasi</option>
                                        <option value="Inspection / Survey">Inspeksi Ulang / Survey</option>
                                        <option value="Komplain Penanganan">Komplain Penanganan</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">Prioritas Penanganan *</label>
                                    <select
                                        value={data.prioritas}
                                        onChange={(e) => setData('prioritas', e.target.value)}
                                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    >
                                        <option value="rendah">Rendah (Pemeriksaan Rutin)</option>
                                        <option value="sedang">Sedang (Normal)</option>
                                        <option value="tinggi">Tinggi (Populasi Hama Meningkat)</option>
                                        <option value="darurat">Darurat (Perlu Kedatangan Segera)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Detail Permintaan / Lokasi Ruangan / Indikasi Hama *
                                    </label>
                                    <textarea
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        rows={4}
                                        placeholder="Jelaskan detail hama yang ditemukan, area lokasi ruangan, atau instruksi khusus untuk teknisi..."
                                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    {errors.deskripsi && <p className="text-xs text-rose-600">{errors.deskripsi}</p>}
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Sending...' : 'Kirim Permintaan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </CustomerPortalLayout>
    );
}
