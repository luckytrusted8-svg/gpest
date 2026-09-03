import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState, useRef, useEffect } from 'react';
import { 
    Plus, CheckCircle, Clock, FileText, Camera, 
    X, CheckCircle2, XCircle, AlertCircle, Eye, Calendar, UserCheck, 
    Edit, Trash2, ShieldCheck, User, MoreVertical, Check
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

const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
};

const formatCode = (type: string, id: number) => {
    const prefix = type === 'sakit' ? 'SKT' : type === 'izin' ? 'IZN' : 'CUT';
    return `${prefix}-${String(id).padStart(4, '0')}`;
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

    // Filter tab: all, cuti, sakit, izin
    const [selectedTab, setSelectedTab] = useState<'all' | 'cuti' | 'sakit' | 'izin'>('all');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submittedSuccessItem, setSubmittedSuccessItem] = useState<LeaveItem | null>(null);
    const [activeDetailItem, setActiveDetailItem] = useState<LeaveItem | null>(null);
    const [editingLeave, setEditingLeave] = useState<LeaveItem | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

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
    const createFileInputRef = useRef<HTMLInputElement | null>(null);
    const [createPhotoPreview, setCreatePhotoPreview] = useState<string | null>(null);

    const createForm = useForm<{
        jenis_izin: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
        foto_surat: File | null;
    }>({
        jenis_izin: 'sakit',
        tanggal_mulai: new Date().toISOString().slice(0, 10),
        tanggal_selesai: new Date().toISOString().slice(0, 10),
        alasan: '',
        foto_surat: null,
    });

    // Edit Form
    const editFileInputRef = useRef<HTMLInputElement | null>(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

    const editForm = useForm<{
        jenis_izin: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
        foto_surat: File | null;
        _method: string;
    }>({
        jenis_izin: 'sakit',
        tanggal_mulai: '',
        tanggal_selesai: '',
        alasan: '',
        foto_surat: null,
        _method: 'PUT',
    });

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

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
                setSubmittedSuccessItem({
                    id: Math.floor(Math.random() * 900) + 100,
                    user_id: currentUserId,
                    user: { id: currentUserId, name: (auth as any)?.user?.name || 'User' },
                    jenis_izin: createForm.data.jenis_izin,
                    tanggal_mulai: createForm.data.tanggal_mulai,
                    tanggal_selesai: createForm.data.tanggal_selesai,
                    alasan: createForm.data.alasan,
                    foto_surat: createPhotoPreview,
                    status: 'menunggu',
                    created_at: new Date().toISOString(),
                });
                createForm.reset();
                setCreatePhotoPreview(null);
            },
        });
    };

    const handleOpenEdit = (leave: LeaveItem) => {
        setOpenDropdownId(null);
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

    const handleDelete = (leave: LeaveItem) => {
        setOpenDropdownId(null);
        const msg = isSuperior
            ? `Hapus permohonan ${leave.jenis_izin.toUpperCase()} dari ${leave.user?.name || 'karyawan'}?`
            : `Batalkan / hapus pengajuan ${leave.jenis_izin.toUpperCase()} Anda?`;

        if (confirm(msg)) {
            router.delete(`/leaves/${leave.id}`, { preserveScroll: true });
        }
    };

    const openApprovalDialog = (leave: LeaveItem, statusVal: 'disetujui' | 'ditolak') => {
        setOpenDropdownId(null);
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

    const dataList = (leaves?.data ?? []).filter((item) => {
        if (selectedTab === 'all') return true;
        return item.jenis_izin === selectedTab;
    });

    return (
        <AppLayout>
            <Head title="Cuti & Izin Teknisi - G-PEST" />

            <div className="max-w-xl mx-auto space-y-5">
                {/* Header Navbar (Sesuai Foto 1 & 2) */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {selectedTab === 'sakit' ? 'Sick' : selectedTab === 'cuti' ? 'Leave' : selectedTab === 'izin' ? 'Permission' : 'Cuti & Izin'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">Riwayat & pengajuan izin kerja teknisi</p>
                    </div>

                    <button
                        onClick={() => {
                            createForm.setData('jenis_izin', selectedTab === 'all' ? 'sakit' : selectedTab);
                            setShowCreateModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>New</span>
                    </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`px-3.5 py-1.5 rounded-full font-bold transition-colors ${
                            selectedTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setSelectedTab('sakit')}
                        className={`px-3.5 py-1.5 rounded-full font-bold transition-colors ${
                            selectedTab === 'sakit' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Sakit (Sick)
                    </button>
                    <button
                        onClick={() => setSelectedTab('cuti')}
                        className={`px-3.5 py-1.5 rounded-full font-bold transition-colors ${
                            selectedTab === 'cuti' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Cuti Tahunan
                    </button>
                    <button
                        onClick={() => setSelectedTab('izin')}
                        className={`px-3.5 py-1.5 rounded-full font-bold transition-colors ${
                            selectedTab === 'izin' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Izin Keperluan
                    </button>
                </div>

                {/* Flash Notifications */}
                {f?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{f.success}</span>
                    </div>
                )}
                {f?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{f.error}</span>
                    </div>
                )}

                {/* DAFTAR CARD CUTI / SAKIT (Sesuai Screenshot 2) */}
                <div className="space-y-3">
                    {dataList.map((item) => {
                        const days = calculateDays(item.tanggal_mulai, item.tanggal_selesai);
                        const isOwner = item.user_id === currentUserId;
                        const isPending = item.status === 'menunggu';

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3 relative hover:border-slate-300 transition-colors"
                            >
                                {/* Top Row: Status Pill & 2 days + 3 dots */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                        isPending 
                                            ? 'bg-amber-100/80 text-amber-800' 
                                            : item.status === 'disetujui' 
                                            ? 'bg-emerald-100 text-emerald-800' 
                                            : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {isPending ? 'Pending' : item.status === 'disetujui' ? 'Approved' : 'Rejected'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium">
                                            {days} {days > 1 ? 'days' : 'day'}
                                        </span>

                                        {/* 3-Dots Dropdown Trigger */}
                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {/* Dropdown Menu (Sesuai Screenshot 2) */}
                                            {openDropdownId === item.id && (
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 text-white rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            setActiveDetailItem(item);
                                                        }}
                                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 transition-colors font-medium"
                                                    >
                                                        View Detail
                                                    </button>

                                                    {(isOwner && isPending) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 transition-colors font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}

                                                    {isSuperior && isPending && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => openApprovalDialog(item, 'disetujui')}
                                                                className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-emerald-400 transition-colors font-medium"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openApprovalDialog(item, 'ditolak')}
                                                                className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-rose-400 transition-colors font-medium"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}

                                                    {(isOwner || isSuperior) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item)}
                                                            className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-rose-400 transition-colors font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Date Line with Clock Icon */}
                                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{item.tanggal_mulai} – {item.tanggal_selesai}</span>
                                </div>

                                {/* Description / Reason */}
                                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                                    {item.alasan}
                                </div>
                            </div>
                        );
                    })}

                    {dataList.length === 0 && (
                        <div className="bg-white rounded-3xl p-10 border border-slate-200/90 text-center text-slate-400 text-xs shadow-2xs">
                            <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">Belum ada data pengajuan</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Klik tombol "+ New" di atas untuk membuat pengajuan baru.</p>
                        </div>
                    )}
                </div>

                {/* MODAL 1: SUBMIT SICK / LEAVE FORM (Sesuai Screenshot 1) */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Submit {createForm.data.jenis_izin === 'sakit' ? 'Sick' : createForm.data.jenis_izin === 'cuti' ? 'Leave' : 'Permission'}
                                </h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1">
                                {/* Pilihan Tipe Izin */}
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Tipe Izin *</Label>
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                        {(['sakit', 'cuti', 'izin'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => createForm.setData('jenis_izin', type)}
                                                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                                                    createForm.data.jenis_izin === type
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Start Date & End Date (2 Kolom) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={createForm.data.tanggal_mulai}
                                            onChange={(e) => createForm.setData('tanggal_mulai', e.target.value)}
                                            className="mt-1 text-xs rounded-xl h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700">End Date</Label>
                                        <Input
                                            type="date"
                                            value={createForm.data.tanggal_selesai}
                                            onChange={(e) => createForm.setData('tanggal_selesai', e.target.value)}
                                            className="mt-1 text-xs rounded-xl h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Description</Label>
                                    <textarea
                                        value={createForm.data.alasan}
                                        onChange={(e) => createForm.setData('alasan', e.target.value)}
                                        rows={3}
                                        placeholder="Tulis kondisi/keluhan sakit..."
                                        className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 mt-1 font-medium"
                                        required
                                    />
                                </div>

                                {/* Photo (optional) - Dashed Box with Add Photo */}
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Photo (optional)</Label>
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
                                            className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-5 text-center transition-all bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-500 font-medium"
                                        >
                                            <Camera className="w-5 h-5 text-slate-400" />
                                            <span>{createForm.data.foto_surat ? createForm.data.foto_surat.name : 'Add photo'}</span>
                                        </button>
                                        {createPhotoPreview && (
                                            <div className="mt-2 relative inline-block">
                                                <img 
                                                    src={createPhotoPreview} 
                                                    alt="Preview" 
                                                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-2xs" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        createForm.setData('foto_surat', null);
                                                        setCreatePhotoPreview(null);
                                                    }}
                                                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons (Submit & Cancel) */}
                                <div className="space-y-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs"
                                    >
                                        {createForm.processing ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: REQUEST SUBMITTED SUCCESS SHEET (Sesuai Screenshot 3) */}
                {submittedSuccessItem && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom duration-250">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-base font-bold text-slate-900">Request Submitted</h3>
                                <button
                                    onClick={() => setSubmittedSuccessItem(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Green Success Box */}
                            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-1 text-xs">
                                <div className="font-bold text-emerald-800 text-sm">Successfully submitted!</div>
                                <div className="font-mono font-bold text-emerald-700">
                                    {formatCode(submittedSuccessItem.jenis_izin, submittedSuccessItem.id)}
                                </div>
                                <p className="text-emerald-700 text-[11px] leading-relaxed pt-0.5">
                                    {submittedSuccessItem.jenis_izin.toUpperCase()} {submittedSuccessItem.tanggal_mulai} – {submittedSuccessItem.tanggal_selesai} is awaiting admin approval.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const item = submittedSuccessItem;
                                        setSubmittedSuccessItem(null);
                                        setActiveDetailItem(item);
                                    }}
                                    className="w-full py-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all"
                                >
                                    View Detail
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubmittedSuccessItem(null)}
                                    className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 3: SICK / LEAVE DETAIL BOTTOM-SHEET (Sesuai Screenshot 4) */}
                {activeDetailItem && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {activeDetailItem.jenis_izin === 'sakit' ? 'Sick Detail' : activeDetailItem.jenis_izin === 'cuti' ? 'Leave Detail' : 'Permission Detail'}
                                    </h3>
                                    <p className="text-[11px] font-mono text-slate-400">
                                        {formatCode(activeDetailItem.jenis_izin, activeDetailItem.id)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveDetailItem(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Profile Card */}
                            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-base overflow-hidden shrink-0">
                                        {activeDetailItem.user?.name ? activeDetailItem.user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-xs">
                                            {activeDetailItem.user?.name ?? 'Karyawan'}
                                        </div>
                                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                            Diajukan {new Date(activeDetailItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    activeDetailItem.status === 'menunggu'
                                        ? 'bg-amber-100 text-amber-800'
                                        : activeDetailItem.status === 'disetujui'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}>
                                    {activeDetailItem.status === 'menunggu' ? 'Menunggu' : activeDetailItem.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                                </span>
                            </div>

                            {/* Periode Card */}
                            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600 font-medium">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                        <Clock className="w-4 h-4 text-slate-500" /> Periode
                                    </div>
                                    <span className="text-slate-500">
                                        {calculateDays(activeDetailItem.tanggal_mulai, activeDetailItem.tanggal_selesai)} days
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                                    <div>
                                        <div className="text-[11px] text-slate-400">Dari</div>
                                        <div className="font-bold text-slate-900">{activeDetailItem.tanggal_mulai}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-slate-400">Sampai</div>
                                        <div className="font-bold text-slate-900">{activeDetailItem.tanggal_selesai}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-slate-500">Keterangan</Label>
                                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                                    {activeDetailItem.alasan}
                                </div>
                            </div>

                            {/* Foto Lampiran if exists */}
                            {activeDetailItem.foto_surat && (
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold text-slate-500">Lampiran Foto Surat Dokter</Label>
                                    <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                                        <img
                                            src={activeDetailItem.foto_surat}
                                            alt="Lampiran Surat"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Catatan Approval if exists */}
                            {activeDetailItem.catatan_approval && (
                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                                    <span className="font-bold text-slate-800 block">Catatan Atasan:</span>
                                    <span className="italic mt-0.5 block">"{activeDetailItem.catatan_approval}"</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveDetailItem(null)}
                                    className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 4: EDIT MODAL */}
                {editingLeave && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-base font-bold text-slate-900">Edit Pengajuan</h3>
                                <button
                                    onClick={() => setEditingLeave(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4 pt-1">
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Tipe Izin</Label>
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                        {(['sakit', 'cuti', 'izin'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => editForm.setData('jenis_izin', type)}
                                                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                                                    editForm.data.jenis_izin === type
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={editForm.data.tanggal_mulai}
                                            onChange={(e) => editForm.setData('tanggal_mulai', e.target.value)}
                                            className="mt-1 text-xs rounded-xl h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700">End Date</Label>
                                        <Input
                                            type="date"
                                            value={editForm.data.tanggal_selesai}
                                            onChange={(e) => editForm.setData('tanggal_selesai', e.target.value)}
                                            className="mt-1 text-xs rounded-xl h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Description</Label>
                                    <textarea
                                        value={editForm.data.alasan}
                                        onChange={(e) => editForm.setData('alasan', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 mt-1 font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700">Foto Surat (Opsional)</Label>
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
                                            className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-4 text-center transition-all bg-slate-50 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium"
                                        >
                                            <Camera className="w-4 h-4 text-slate-400" />
                                            <span>{editForm.data.foto_surat ? editForm.data.foto_surat.name : 'Ganti foto surat'}</span>
                                        </button>
                                        {editPhotoPreview && (
                                            <div className="mt-2">
                                                <img 
                                                    src={editPhotoPreview} 
                                                    alt="Preview" 
                                                    className="w-20 h-20 object-cover rounded-xl border border-slate-200" 
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingLeave(null)}
                                        className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 5: APPROVAL DIALOG (Untuk Atasan) */}
                {approvalDialog.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom duration-250">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-base font-bold text-slate-900">
                                    {approvalDialog.status === 'disetujui' ? 'Setujui Permohonan' : 'Tolak Permohonan'}
                                </h3>
                                <button
                                    onClick={() => setApprovalDialog((p) => ({ ...p, isOpen: false }))}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Konfirmasi persetujuan <strong>{approvalDialog.leaveType.toUpperCase()}</strong> untuk teknisi <strong>{approvalDialog.leaveName}</strong>.
                            </p>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700">Catatan Approval (Opsional)</Label>
                                <textarea
                                    value={approvalNote}
                                    onChange={(e) => setApprovalNote(e.target.value)}
                                    placeholder="Tulis catatan persetujuan..."
                                    rows={3}
                                    className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 mt-1 font-medium"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setApprovalDialog((p) => ({ ...p, isOpen: false }))}
                                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={submitApprovalAction}
                                    disabled={submittingApproval}
                                    className={`flex-1 py-3 rounded-2xl text-white text-xs font-bold transition-all shadow-xs ${
                                        approvalDialog.status === 'disetujui' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                    }`}
                                >
                                    {submittingApproval ? 'Memproses...' : approvalDialog.status === 'disetujui' ? 'Ya, Setujui' : 'Tolak Izin'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
