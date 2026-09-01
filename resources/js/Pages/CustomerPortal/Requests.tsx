import { Head, useForm } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Plus, MessageSquare, CheckCircle } from 'lucide-react';
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
        baru: { label: 'Baru', cls: 'bg-blue-100 text-blue-700' },
        ditinjau: { label: 'Ditinjau', cls: 'bg-amber-100 text-amber-700' },
        dijadwalkan: { label: 'Dijadwalkan', cls: 'bg-purple-100 text-purple-700' },
        diproses: { label: 'Diproses', cls: 'bg-amber-100 text-amber-700' },
        selesai: { label: 'Selesai', cls: 'bg-green-100 text-green-700' },
        ditolak: { label: 'Ditolak', cls: 'bg-red-100 text-red-700' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

export default function Requests({ customerUser, requests }: Props) {
    const [showModal, setShowModal] = useState(false);
    const dataList = requests?.data ?? [];

    const { data, setData, post, processing, reset } = useForm({
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
        <CustomerPortalLayout customerName={customerUser.customer.company_name}>
            <Head title="Permintaan Layanan & Komplain" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-blue-600" /> Permintaan & Komplain Hama
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Kirimkan permintaan penanganan hama darurat atau penanganan tambahan kepada tim G-PEST.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Kirim Request Baru
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="py-3 px-4">Nomor</th>
                                <th className="py-3 px-4">Layanan</th>
                                <th className="py-3 px-4">Prioritas</th>
                                <th className="py-3 px-4">Deskripsi Permintaan</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Tanggal Kirim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dataList.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-3.5 px-4 font-mono font-medium text-blue-600">{req.request_number}</td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-900">{req.jenis_layanan}</td>
                                    <td className="py-3.5 px-4 uppercase text-xs font-semibold text-gray-600">{req.prioritas}</td>
                                    <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs truncate">{req.deskripsi}</td>
                                    <td className="py-3.5 px-4"><StatusBadge status={req.status} /></td>
                                    <td className="py-3.5 px-4 text-right text-xs text-gray-400">
                                        {new Date(req.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                            {dataList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-gray-400">
                                        Belum ada permintaan yang Anda kirimkan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                        <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900">Form Request Layanan / Komplain Baru</h2>
                            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-700">Jenis Layanan / Masalah *</label>
                                    <select
                                        value={data.jenis_layanan}
                                        onChange={(e) => setData('jenis_layanan', e.target.value)}
                                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="General Pest Control">General Pest Control (Kecoa/Tikus/Nyamuk)</option>
                                        <option value="Termite Control">Termite Control (Pengendalian Rayap)</option>
                                        <option value="Fumigasi">Fumigasi</option>
                                        <option value="Inspection / Survey">Inspeksi Ulang / Survey</option>
                                        <option value="Komplain Penanganan">Komplain Penanganan</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-700">Prioritas Penanganan *</label>
                                    <select
                                        value={data.prioritas}
                                        onChange={(e) => setData('prioritas', e.target.value)}
                                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="rendah">Rendah (Pemeriksaan Rutin)</option>
                                        <option value="sedang">Sedang (Normal)</option>
                                        <option value="tinggi">Tinggi (Populasi Hama Meningkat)</option>
                                        <option value="darurat">Darurat (Perlu Kedatangan Segera)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-700">Detail Permintaan / Lokasi / Gejala Hama *</label>
                                    <textarea
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        rows={4}
                                        placeholder="Jelaskan detail hama yang ditemukan, area ruangan, atau permintaan kedatangan teknisi..."
                                        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
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
