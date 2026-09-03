import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState, useRef } from 'react';
import { 
    Plus, CheckCircle, Clock, FileText, Image as ImageIcon, 
    X, CheckCircle2, XCircle, AlertCircle, Eye, Calendar, UserCheck, 
    Edit, Trash2, ShieldCheck, User
} from 'lucide-react';

interface LeaveItem {
    id: number;
    user_id: number;
    user: { id: number; name: string; email?: string } | null;
    jenis_izin: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
    foto_surat?: string | null;
    status: string;
    disetujui_oleh?: number | null;
    approver?: { id: number; name: string } | null;
    catatan_approval?: string | null;
    created_at: string;
}

interface Props {
    leaves?: { data: LeaveItem[]; current_page: number; last_page: number; per_page: number; total: number };
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        menunggu: { label: 'Menunggu Persetujuan', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
        disetujui: { label: 'Disetujui', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        ditolak: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-700 border border-rose-200' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700 border border-slate-200' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : diffDays;
};

export default function LeavesIndex({ leaves }: Props) {
    const { flash, auth } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const currentUserId = (auth as any)?.user?.id;

    const rawRoles = (auth as any)?.user?.roles;
    const roles: string[] = Array.isArray(rawRoles)
        ? rawRoles.map((r: any) => (typeof r === 'string' ? r : r.name || ''))
        : [];
    const isSuperior = roles.includes('super_admin') || roles.includes('admin') || roles.includes('supervisor');

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const createFileInputRef = useRef<HTMLInputElement | null>(null);
    const [createPhotoPreview, setCreatePhotoPreview] = useState<string | null>(null);

    // Edit Modal State
    const [editingLeave, setEditingLeave] = useState<LeaveItem | null>(null);
    const editFileInputRef = useRef<HTMLInputElement | null>(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

    // Show Detail Modal State
    const [detailLeave, setDetailLeave] = useState<LeaveItem | null>(null);

    // Photo Lightbox State
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    // Approval Dialog State
    const [approvalDialog, setApprovalDialog] = useState<{
        isOpen: boolean;
        leaveId: number | null;
        status: 'disetujui' | 'ditolak';
        leaveName: string;
        leaveType: string;
    }>({
        isOpen: false,
        leaveId: null,
        status: 'disetujui',
        leaveName: '',
        leaveType: '',
    });
    const [approvalNote, setApprovalNote] = useState('');
    const [submittingApproval, setSubmittingApproval] = useState(false);

    // Create Form
    const createForm = useForm<{
        jenis_izin: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
        foto_surat: File | null;
    }>({
        jenis_izin: 'cuti',
        tanggal_mulai: '',
        tanggal_selesai: '',
        alasan: '',
        foto_surat: null,
    });

    // Edit Form
    const editForm = useForm<{
        jenis_izin: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
        foto_surat: File | null;
        _method: string;
    }>({
        jenis_izin: 'cuti',
        tanggal_mulai: '',
        tanggal_selesai: '',
        alasan: '',
        foto_surat: null,
        _method: 'PUT',
    });

    const handleCreatePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        createForm.setData('foto_surat', file);
        if (file) {
            setCreatePhotoPreview(URL.createObjectURL(file));
        } else {
            setCreatePhotoPreview(null);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/leaves', {
            forceFormData: true,
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
                setCreatePhotoPreview(null);
            },
        });
    };

    const handleOpenEditModal = (leave: LeaveItem) => {
        setEditingLeave(leave);
        editForm.setData({
            jenis_izin: leave.jenis_izin,
            tanggal_mulai: leave.tanggal_mulai,
            tanggal_selesai: leave.tanggal_selesai,
            alasan: leave.alasan,
            foto_surat: null,
            _method: 'PUT',
        });
        setEditPhotoPreview(leave.foto_surat || null);
    };

    const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        editForm.setData('foto_surat', file);
        if (file) {
            setEditPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLeave) return;

        editForm.post(`/leaves/${editingLeave.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingLeave(null);
                editForm.reset();
                setEditPhotoPreview(null);
            },
        });
    };

    const handleDeleteLeave = (leave: LeaveItem) => {
        const msg = isSuperior
            ? `Hapus permohonan ${leave.jenis_izin.toUpperCase()} dari ${leave.user?.name || 'karyawan'}?`
            : `Batalkan / hapus pengajuan ${leave.jenis_izin.toUpperCase()} Anda (${leave.tanggal_mulai} s/d ${leave.tanggal_selesai})?`;

        if (confirm(msg)) {
            router.delete(`/leaves/${leave.id}`, { preserveScroll: true });
        }
    };

    const openApprovalDialog = (leave: LeaveItem, statusVal: 'disetujui' | 'ditolak') => {
        setApprovalDialog({
            isOpen: true,
            leaveId: leave.id,
            status: statusVal,
            leaveName: leave.user?.name || 'Karyawan',
            leaveType: leave.jenis_izin,
        });
        setApprovalNote('');
    };

    const submitApprovalAction = () => {
        if (!approvalDialog.leaveId) return;
        setSubmittingApproval(true);

        router.post(
            `/leaves/${approvalDialog.leaveId}/approve`,
            {
                status: approvalDialog.status,
                catatan_approval: approvalNote,
            },
            {
                onFinish: () => {
                    setSubmittingApproval(false);
                    setApprovalDialog((prev) => ({ ...prev, isOpen: false }));
                },
            }
        );
    };

    const dataList = leaves?.data ?? [];

    return (
        <AppLayout>
            <Head title="Pengajuan Cuti & Izin - G-PEST" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Flash Notifications */}
                {f?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f.success}</span>
                    </div>
                )}
                {f?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{f.error}</span>
                    </div>
                )}

                {/* Header Navbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-slate-900">Pengajuan Cuti & Izin Teknisi</h1>
                        <p className="text-body-sm text-slate-500 mt-0.5">
                            {isSuperior
                                ? 'Pusat evaluasi persetujuan cuti & sakit tim teknisi lapangan.'
                                : 'Ajukan permohonan izin atau cuti kerja dan pantau status persetujuan dari atasan.'}
                        </p>
                    </div>
                    <Button 
                        onClick={() => setShowCreateModal(true)} 
                        className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Ajukan Cuti / Izin
                    </Button>
                </div>

                {/* Main Table */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px] font-mono">
                                    <th className="py-3 px-4">Nama Karyawan</th>
                                    <th className="py-3 px-4">Jenis Izin</th>
                                    <th className="py-3 px-4">Periode & Durasi</th>
                                    <th className="py-3 px-4">Alasan</th>
                                    <th className="py-3 px-4">Lampiran Bukti</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                {dataList.map((l) => {
                                    const days = calculateDays(l.tanggal_mulai, l.tanggal_selesai);
                                    const isOwner = l.user_id === currentUserId;

                                    return (
                                        <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-900">{l.user?.name ?? '-'}</div>
                                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                    Diajukan: {new Date(l.created_at).toLocaleDateString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                                                    l.jenis_izin === 'sakit' ? 'bg-orange-100 text-orange-800' :
                                                    l.jenis_izin === 'izin' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {l.jenis_izin}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono">
                                                <div className="text-slate-900 font-medium">
                                                    {new Date(l.tanggal_mulai).toLocaleDateString('id-ID')}
                                                </div>
                                                <div className="text-slate-500 text-[11px]">
                                                    s/d {new Date(l.tanggal_selesai).toLocaleDateString('id-ID')} ({days} Hari)
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 max-w-xs">
                                                <p className="line-clamp-2 text-slate-700 leading-relaxed">{l.alasan}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                {l.foto_surat ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewPhoto(l.foto_surat!)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors border border-blue-200"
                                                    >
                                                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                                                        <span>Lihat Bukti Foto</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px] italic">Tanpa Lampiran</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={l.status} />
                                                {l.catatan_approval && (
                                                    <div className="text-[11px] text-slate-500 italic mt-1 max-w-[180px]">
                                                        "{l.catatan_approval}"
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                    {/* ROLE ATASAN: APPROVE / REJECT / SHOW / DELETE */}
                                                    {isSuperior ? (
                                                        <>
                                                            {l.status === 'menunggu' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => openApprovalDialog(l, 'disetujui')}
                                                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-2xs flex items-center gap-1"
                                                                        title="Setujui Pengajuan Cuti"
                                                                    >
                                                                        <CheckCircle2 className="w-3 h-3" /> Setujui
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openApprovalDialog(l, 'ditolak')}
                                                                        className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                                        title="Tolak Pengajuan Cuti"
                                                                    >
                                                                        <XCircle className="w-3 h-3" /> Tolak
                                                                    </button>
                                                                </>
                                                            )}

                                                            <button
                                                                onClick={() => setDetailLeave(l)}
                                                                className="px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                                title="Lihat Rincian Pengajuan"
                                                            >
                                                                <Eye className="w-3 h-3" /> Detail
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteLeave(l)}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                                title="Hapus Data Pengajuan Cuti"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        /* ROLE TEKNISI: EDIT / BATALKAN (DELETE) / DETAIL */
                                                        <>
                                                            {l.status === 'menunggu' && isOwner ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleOpenEditModal(l)}
                                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                                        title="Edit Pengajuan Cuti"
                                                                    >
                                                                        <Edit className="w-3 h-3" /> Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteLeave(l)}
                                                                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                                        title="Batalkan Pengajuan Izin"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" /> Batalkan
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setDetailLeave(l)}
                                                                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                                >
                                                                    <Eye className="w-3 h-3" /> Detail
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {dataList.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                                            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                            Belum ada data pengajuan cuti/izin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal 1: Buat Pengajuan Baru */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Form Pengajuan Cuti & Izin</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Kirimkan permohonan istirahat/izin untuk ditinjau oleh atasan.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <Label className="text-xs font-semibold">Jenis Izin *</Label>
                                    <select
                                        value={createForm.data.jenis_izin}
                                        onChange={(e) => createForm.setData('jenis_izin', e.target.value)}
                                        className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1 font-medium"
                                        required
                                    >
                                        <option value="cuti">Cuti Tahunan (Libur / Istirahat)</option>
                                        <option value="sakit">Sakit (Kesehatan)</option>
                                        <option value="izin">Izin Keperluan Mendesak</option>
                                    </select>
                                    {createForm.errors.jenis_izin && <p className="text-xs text-rose-600 mt-1">{createForm.errors.jenis_izin}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold">Tanggal Mulai *</Label>
                                        <Input
                                            type="date"
                                            value={createForm.data.tanggal_mulai}
                                            onChange={(e) => createForm.setData('tanggal_mulai', e.target.value)}
                                            className="mt-1 text-xs"
                                            required
                                        />
                                        {createForm.errors.tanggal_mulai && <p className="text-xs text-rose-600 mt-1">{createForm.errors.tanggal_mulai}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold">Tanggal Selesai *</Label>
                                        <Input
                                            type="date"
                                            value={createForm.data.tanggal_selesai}
                                            onChange={(e) => createForm.setData('tanggal_selesai', e.target.value)}
                                            className="mt-1 text-xs"
                                            required
                                        />
                                        {createForm.errors.tanggal_selesai && <p className="text-xs text-rose-600 mt-1">{createForm.errors.tanggal_selesai}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold">Alasan Pengajuan *</Label>
                                    <textarea
                                        value={createForm.data.alasan}
                                        onChange={(e) => createForm.setData('alasan', e.target.value)}
                                        rows={3}
                                        placeholder="Jelaskan alasan pengajuan izin atau kondisi medis..."
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1 font-medium"
                                        required
                                    />
                                    {createForm.errors.alasan && <p className="text-xs text-rose-600 mt-1">{createForm.errors.alasan}</p>}
                                </div>

                                {/* Upload Foto Surat / Bukti (Optional) */}
                                <div>
                                    <Label className="text-xs font-semibold">
                                        Foto Surat Dokter / Dokumen Pendukung <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            ref={createFileInputRef}
                                            accept="image/*"
                                            onChange={handleCreatePhotoChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => createFileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-3 text-center transition-colors bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-medium text-slate-600"
                                        >
                                            <ImageIcon className="w-4 h-4 text-slate-500" />
                                            <span>{createForm.data.foto_surat ? createForm.data.foto_surat.name : 'Pilih Foto / Gambar Surat Pendukung (JPG, PNG)'}</span>
                                        </button>
                                        {createPhotoPreview && (
                                            <div className="mt-2 relative inline-block">
                                                <img 
                                                    src={createPhotoPreview} 
                                                    alt="Preview Lampiran" 
                                                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-2xs" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        createForm.setData('foto_surat', null);
                                                        setCreatePhotoPreview(null);
                                                    }}
                                                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                        {createForm.errors.foto_surat && <p className="text-xs text-rose-600 mt-1">{createForm.errors.foto_surat}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {createForm.processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Form Modal 2: Edit Pengajuan (Khusus Teknisi Saat Masih Status Menunggu) */}
                {editingLeave && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Edit Pengajuan Cuti / Izin</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Perbarui tanggal atau alasan pengajuan sebelum diproses atasan.</p>
                                </div>
                                <button
                                    onClick={() => setEditingLeave(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <Label className="text-xs font-semibold">Jenis Izin *</Label>
                                    <select
                                        value={editForm.data.jenis_izin}
                                        onChange={(e) => editForm.setData('jenis_izin', e.target.value)}
                                        className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1 font-medium"
                                        required
                                    >
                                        <option value="cuti">Cuti Tahunan</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="izin">Izin Keperluan</option>
                                    </select>
                                    {editForm.errors.jenis_izin && <p className="text-xs text-rose-600 mt-1">{editForm.errors.jenis_izin}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold">Tanggal Mulai *</Label>
                                        <Input
                                            type="date"
                                            value={editForm.data.tanggal_mulai}
                                            onChange={(e) => editForm.setData('tanggal_mulai', e.target.value)}
                                            className="mt-1 text-xs"
                                            required
                                        />
                                        {editForm.errors.tanggal_mulai && <p className="text-xs text-rose-600 mt-1">{editForm.errors.tanggal_mulai}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold">Tanggal Selesai *</Label>
                                        <Input
                                            type="date"
                                            value={editForm.data.tanggal_selesai}
                                            onChange={(e) => editForm.setData('tanggal_selesai', e.target.value)}
                                            className="mt-1 text-xs"
                                            required
                                        />
                                        {editForm.errors.tanggal_selesai && <p className="text-xs text-rose-600 mt-1">{editForm.errors.tanggal_selesai}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold">Alasan Pengajuan *</Label>
                                    <textarea
                                        value={editForm.data.alasan}
                                        onChange={(e) => editForm.setData('alasan', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1 font-medium"
                                        required
                                    />
                                    {editForm.errors.alasan && <p className="text-xs text-rose-600 mt-1">{editForm.errors.alasan}</p>}
                                </div>

                                {/* Ubah Foto Surat / Bukti */}
                                <div>
                                    <Label className="text-xs font-semibold">
                                        Perbarui Foto / Surat Pendukung <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            accept="image/*"
                                            onChange={handleEditPhotoChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => editFileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-3 text-center transition-colors bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-medium text-slate-600"
                                        >
                                            <ImageIcon className="w-4 h-4 text-slate-500" />
                                            <span>{editForm.data.foto_surat ? editForm.data.foto_surat.name : 'Ganti atau Unggah Foto Surat'}</span>
                                        </button>
                                        {editPhotoPreview && (
                                            <div className="mt-2">
                                                <img 
                                                    src={editPhotoPreview} 
                                                    alt="Preview Lampiran" 
                                                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-2xs" 
                                                />
                                            </div>
                                        )}
                                        {editForm.errors.foto_surat && <p className="text-xs text-rose-600 mt-1">{editForm.errors.foto_surat}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingLeave(null)}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal 3: Detail Lengkap Pengajuan Cuti (Show Modal) */}
                {detailLeave && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-[11px] font-mono uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        ID Cuti #{detailLeave.id}
                                    </span>
                                    <h2 className="text-base font-bold text-slate-900 mt-1">Rincian Pengajuan Cuti & Izin</h2>
                                </div>
                                <button
                                    onClick={() => setDetailLeave(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                    <div>
                                        <span className="text-slate-500 font-medium">Nama Karyawan:</span>
                                        <p className="font-bold text-slate-900 text-sm mt-0.5">{detailLeave.user?.name ?? '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium">Jenis Izin:</span>
                                        <p className="font-bold uppercase text-slate-900 text-sm mt-0.5">{detailLeave.jenis_izin}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium">Periode Cuti:</span>
                                        <p className="font-semibold text-slate-900 mt-0.5">
                                            {new Date(detailLeave.tanggal_mulai).toLocaleDateString('id-ID')} s/d {new Date(detailLeave.tanggal_selesai).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium">Total Durasi:</span>
                                        <p className="font-bold text-blue-700 mt-0.5">
                                            {calculateDays(detailLeave.tanggal_mulai, detailLeave.tanggal_selesai)} Hari Kalender
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-slate-500 font-medium">Alasan / Keterangan:</span>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 mt-1 leading-relaxed">
                                        {detailLeave.alasan}
                                    </div>
                                </div>

                                {detailLeave.foto_surat && (
                                    <div>
                                        <span className="text-slate-500 font-medium">Lampiran Foto Surat / Bukti:</span>
                                        <div className="mt-1">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewPhoto(detailLeave.foto_surat!)}
                                                className="relative group rounded-xl overflow-hidden border border-slate-200 block"
                                            >
                                                <img 
                                                    src={detailLeave.foto_surat} 
                                                    alt="Bukti Surat" 
                                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform" 
                                                />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1">
                                                    <Eye className="w-4 h-4" /> Klik untuk Memperbesar
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 font-medium">Status Persetujuan:</span>
                                        <StatusBadge status={detailLeave.status} />
                                    </div>
                                    {detailLeave.approver && (
                                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                                            <span className="text-slate-500">Ditinjau oleh:</span>
                                            <span className="font-semibold text-slate-900">{detailLeave.approver.name}</span>
                                        </div>
                                    )}
                                    {detailLeave.catatan_approval && (
                                        <div className="text-[11px] text-slate-600 italic pt-1">
                                            Catatan Atasan: "{detailLeave.catatan_approval}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setDetailLeave(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                                >
                                    Tutup Rincian
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal 4: Approval Dialog (Setujui / Tolak oleh Atasan) */}
                {approvalDialog.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                    approvalDialog.status === 'disetujui' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                                }`}>
                                    {approvalDialog.status === 'disetujui' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <button
                                    onClick={() => setApprovalDialog((p) => ({ ...p, isOpen: false }))}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    {approvalDialog.status === 'disetujui' ? 'Setujui Permohonan Cuti / Izin' : 'Tolak Permohonan Cuti / Izin'}
                                </h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    Konfirmasi permohonan <strong>{approvalDialog.leaveType.toUpperCase()}</strong> dari teknisi <strong>{approvalDialog.leaveName}</strong>.
                                </p>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700">
                                    Catatan Approval <span className="text-slate-400 font-normal">(Opsional)</span>
                                </Label>
                                <textarea
                                    value={approvalNote}
                                    onChange={(e) => setApprovalNote(e.target.value)}
                                    placeholder={approvalDialog.status === 'disetujui' ? 'Contoh: Disetujui, jaga kesehatan dan istirahat yang cukup...' : 'Contoh: Mohon maaf jadwal sedang padat, silakan koordinasikan kembali...'}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1 font-medium"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setApprovalDialog((p) => ({ ...p, isOpen: false }))}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={submitApprovalAction}
                                    disabled={submittingApproval}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors shadow-xs ${
                                        approvalDialog.status === 'disetujui'
                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                            : 'bg-rose-600 hover:bg-rose-700'
                                    }`}
                                >
                                    {submittingApproval ? 'Memproses...' : approvalDialog.status === 'disetujui' ? 'Ya, Setujui Cuti' : 'Tolak Pengajuan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal 5: Preview Lightbox Foto Lampiran */}
                {previewPhoto && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                                    <ImageIcon className="w-4 h-4 text-blue-600" /> Lampiran Bukti Foto Cuti / Izin
                                </h3>
                                <button
                                    onClick={() => setPreviewPhoto(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[70vh]">
                                <img
                                    src={previewPhoto}
                                    alt="Foto Bukti Surat"
                                    className="max-h-[68vh] w-auto object-contain rounded-lg shadow-xs"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setPreviewPhoto(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
