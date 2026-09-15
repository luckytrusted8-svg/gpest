import { Head, useForm, usePage, usePoll } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import {
    Plus,
    MessageSquare,
    CheckCircle,
    X,
    Clock,
    Calendar,
    MapPin,
    Building2,
    Store,
    User,
    Phone,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    FileText,
} from 'lucide-react';
import React, { useState } from 'react';

interface SiteItem {
    id: number;
    site_name: string;
    address?: string;
    location?: string;
    pic_name?: string;
    phone?: string;
}

interface CustomerInfo {
    id: number;
    company_name: string;
    address?: string;
    location?: string;
    pic_name?: string;
    phone?: string;
}

interface RequestItem {
    id: number;
    request_number: string;
    site_id?: number | null;
    site?: SiteItem | null;
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

interface CustomerUser {
    id: number;
    name?: string;
    nama?: string;
    customer: CustomerInfo;
}

interface Props {
    customerUser: CustomerUser;
    customer?: CustomerInfo;
    sites?: SiteItem[];
    requests?: { data: RequestItem[]; current_page: number; last_page: number; per_page: number; total: number };
}

const StatusBadge = ({ status }: { status: string }) => {
    const normalized = (status || '').toLowerCase();
    const map: Record<string, { label: string; badgeClass: string }> = {
        baru: { label: 'Menunggu Review Admin', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        ditinjau: { label: 'Sedang Ditinjau', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
        dijadwalkan: { label: 'Teknisi Dijadwalkan', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
        diproses: { label: 'Sedang Dikerjakan', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        selesai: { label: 'Selesai', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ditolak: { label: 'Ditolak', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
    };
    const { label, badgeClass } = map[normalized] ?? {
        label: status || 'Baru',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
            {label}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const normalized = (priority || '').toLowerCase();
    const map: Record<string, { label: string; badgeClass: string }> = {
        rendah: { label: 'Rendah (Rutin)', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
        sedang: { label: 'Normal', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        tinggi: { label: 'Tinggi (Banyak Hama)', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
        darurat: { label: 'Darurat (Urgent)', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
    };
    const { label, badgeClass } = map[normalized] ?? {
        label: priority || 'Normal',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeClass}`}>
            {label}
        </span>
    );
};

const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

export default function Requests({ customerUser, customer: propCustomer, sites = [], requests }: Props) {
    // Auto-poll requests every 2.5 seconds
    usePoll(2500, { only: ['requests'] });

    const customer = propCustomer || customerUser?.customer;
    const [showModal, setShowModal] = useState(false);
    const pageProps = usePage().props as Record<string, any>;
    const flash = pageProps.flash as { success?: string; error?: string } | undefined;
    const dataList = requests?.data ?? [];
    const hasRequests = dataList.length > 0;

    // Location Mode state: 'main' | 'site' | 'custom'
    const [locationMode, setLocationMode] = useState<'main' | 'site' | 'custom'>('main');
    const [selectedSiteId, setSelectedSiteId] = useState<string>('');

    const defaultAddress = customer?.address || customer?.location || 'Alamat Kantor Utama';
    const defaultPicName = customer?.pic_name || customerUser?.nama || customerUser?.name || '';
    const defaultPicPhone = customer?.phone || '';

    const { data, setData, post, processing, reset, errors } = useForm({
        site_id: '' as string | number,
        lokasi: customer?.company_name ? `${customer.company_name} (Kantor Utama)` : 'Kantor Utama',
        alamat_detail: defaultAddress,
        pic_name: defaultPicName,
        pic_phone: defaultPicPhone,
        jenis_layanan: 'General Pest Control (Kecoa / Tikus / Nyamuk)',
        prioritas: 'sedang',
        tanggal_permintaan: '',
        waktu_layanan: 'Pagi (08:00 - 12:00)',
        deskripsi: '',
    });

    // Handle switching location mode
    const handleLocationModeChange = (mode: 'main' | 'site' | 'custom') => {
        setLocationMode(mode);
        if (mode === 'main') {
            setData((prev) => ({
                ...prev,
                site_id: '',
                lokasi: customer?.company_name ? `${customer.company_name} (Kantor Utama)` : 'Kantor Utama',
                alamat_detail: defaultAddress,
                pic_name: prev.pic_name || defaultPicName,
                pic_phone: prev.pic_phone || defaultPicPhone,
            }));
        } else if (mode === 'site') {
            if (sites.length > 0) {
                const firstSite = sites[0];
                setSelectedSiteId(String(firstSite.id));
                setData((prev) => ({
                    ...prev,
                    site_id: firstSite.id,
                    lokasi: firstSite.site_name,
                    alamat_detail: firstSite.address || firstSite.location || '',
                    pic_name: firstSite.pic_name || prev.pic_name || defaultPicName,
                    pic_phone: firstSite.phone || prev.pic_phone || defaultPicPhone,
                }));
            } else {
                setLocationMode('custom');
            }
        } else if (mode === 'custom') {
            setData((prev) => ({
                ...prev,
                site_id: '',
                lokasi: '',
                alamat_detail: '',
            }));
        }
    };

    const handleSelectSite = (siteIdStr: string) => {
        setSelectedSiteId(siteIdStr);
        const found = sites.find((s) => String(s.id) === siteIdStr);
        if (found) {
            setData((prev) => ({
                ...prev,
                site_id: found.id,
                lokasi: found.site_name,
                alamat_detail: found.address || found.location || '',
                pic_name: found.pic_name || prev.pic_name || defaultPicName,
                pic_phone: found.phone || prev.pic_phone || defaultPicPhone,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/portal/requests', {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setLocationMode('main');
            },
        });
    };

    const handleOpenCreateModal = () => {
        setData({
            site_id: '',
            lokasi: customer?.company_name ? `${customer.company_name} (Kantor Utama)` : 'Kantor Utama',
            alamat_detail: defaultAddress,
            pic_name: defaultPicName,
            pic_phone: defaultPicPhone,
            jenis_layanan: 'General Pest Control (Kecoa / Tikus / Nyamuk)',
            prioritas: 'sedang',
            tanggal_permintaan: '',
            waktu_layanan: 'Pagi (08:00 - 12:00)',
            deskripsi: '',
        });
        setLocationMode('main');
        setShowModal(true);
    };

    return (
        <CustomerPortalLayout customerName={customer?.company_name}>
            <Head title="Permintaan Layanan & Komplain" />
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Notification Flash */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Header Page & Primary Action Button */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span>Permintaan Layanan &amp; Komplain</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pesan kunjungan penanganan hama darurat, penambahan jadwal treatment cabang, atau ajukan komplain garansi.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Request Layanan Baru</span>
                    </button>
                </div>

                {/* Main Content: Requests Table & Mobile Cards */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    {hasRequests ? (
                        <>
                            {/* Desktop Table View (hidden on mobile < 640px) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700 border-collapse table-fixed">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-4 w-[14%]">No. Request</th>
                                            <th className="py-3.5 px-4 w-[18%]">Lokasi &amp; Cabang</th>
                                            <th className="py-3.5 px-4 w-[16%]">Jenis Layanan &amp; Waktu</th>
                                            <th className="py-3.5 px-4 w-[16%]">Prioritas &amp; Status</th>
                                            <th className="py-3.5 px-4 w-[26%]">Detail Kebutuhan</th>
                                            <th className="py-3.5 px-4 w-[10%] text-right">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {dataList.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                                {/* No. Request */}
                                                <td className="py-4 px-4 font-mono font-bold text-blue-600 text-xs align-top">
                                                    {req.request_number}
                                                </td>

                                                {/* Lokasi & Cabang */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <span className="truncate">{req.lokasi || req.site?.site_name || 'Kantor Utama'}</span>
                                                    </div>
                                                    {req.alamat_detail && (
                                                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 pl-5">
                                                            {req.alamat_detail}
                                                        </p>
                                                    )}
                                                    {(req.pic_name || req.pic_phone) && (
                                                        <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-1 pl-5">
                                                            {req.pic_name && (
                                                                <span className="flex items-center gap-1 truncate">
                                                                    <User className="w-3 h-3 text-slate-400 shrink-0" /> {req.pic_name}
                                                                </span>
                                                            )}
                                                            {req.pic_phone && (
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {req.pic_phone}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Jenis Layanan & Waktu */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span>{req.jenis_layanan}</span>
                                                    </div>
                                                    {(req.tanggal_permintaan || req.waktu_layanan) && (
                                                        <div className="text-[11px] text-slate-500 mt-1 flex flex-col gap-0.5 pl-5">
                                                            {req.tanggal_permintaan && (
                                                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                                    {formatDate(req.tanggal_permintaan)}
                                                                </span>
                                                            )}
                                                            {req.waktu_layanan && (
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                                    {req.waktu_layanan}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Prioritas & Status */}
                                                <td className="py-4 px-4 align-top space-y-1.5">
                                                    <div><StatusBadge status={req.status} /></div>
                                                    <div><PriorityBadge priority={req.prioritas} /></div>
                                                </td>

                                                {/* Detail Kebutuhan & Tanggapan Admin (Ruang Paling Luas) */}
                                                <td className="py-4 px-4 text-xs text-slate-700 align-top">
                                                    <p className="whitespace-normal break-words leading-relaxed font-medium">
                                                        {req.deskripsi}
                                                    </p>
                                                    {req.catatan_admin && (
                                                        <div className="mt-2 text-[11px] bg-blue-50/90 border border-blue-200 p-2.5 rounded-xl text-blue-900 whitespace-normal break-words shadow-2xs">
                                                            <span className="font-bold flex items-center gap-1.5 text-blue-700">
                                                                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                                                                Tanggapan / Konfirmasi Admin:
                                                            </span>
                                                            <p className="mt-1 leading-relaxed text-blue-950 font-normal">
                                                                {req.catatan_admin}
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Tanggal Request */}
                                                <td className="py-4 px-4 text-right text-xs text-slate-500 font-medium align-top">
                                                    {formatDate(req.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout View (visible only on mobile < 640px) */}
                            <div className="block sm:hidden divide-y divide-slate-100">
                                {dataList.map((req) => (
                                    <div key={req.id} className="p-4 space-y-3 hover:bg-slate-50/40 transition-colors">
                                        {/* Card Header: Nomor Request di kiri & Status + Prioritas di kanan */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-mono font-bold text-sm text-blue-600">
                                                    {req.request_number}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                                <StatusBadge status={req.status} />
                                                <PriorityBadge priority={req.prioritas} />
                                            </div>
                                        </div>

                                        {/* Card Meta Info Box */}
                                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                                            {/* Lokasi Cabang */}
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                                <div className="min-w-0 flex-1">
                                                    <span className="font-bold text-slate-900 block">
                                                        {req.lokasi || req.site?.site_name || 'Kantor Utama'}
                                                    </span>
                                                    {req.alamat_detail && (
                                                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                                            {req.alamat_detail}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Jenis Layanan & Jadwal Kunjungan */}
                                            <div className="grid grid-cols-1 gap-1 pt-2 border-t border-slate-200/60 text-[11px]">
                                                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                                                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                    <span>{req.jenis_layanan}</span>
                                                </div>
                                                {(req.tanggal_permintaan || req.waktu_layanan) && (
                                                    <div className="flex items-center gap-3 text-slate-500 pl-5">
                                                        {req.tanggal_permintaan && (
                                                            <span className="flex items-center gap-1 font-medium text-slate-700">
                                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                                {formatDate(req.tanggal_permintaan)}
                                                            </span>
                                                        )}
                                                        {req.waktu_layanan && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3 text-slate-400" />
                                                                {req.waktu_layanan}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {(req.pic_name || req.pic_phone) && (
                                                    <div className="flex items-center gap-2 text-slate-500 pl-5">
                                                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span>{req.pic_name} {req.pic_phone ? `(${req.pic_phone})` : ''}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content (Detail Kebutuhan) - Full text without truncation */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                Detail Kebutuhan / Permintaan:
                                            </span>
                                            <div className="text-xs text-slate-800 leading-relaxed break-words whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                                                {req.deskripsi}
                                            </div>
                                        </div>

                                        {/* Admin Response Box (Tanggapan / Konfirmasi Admin) */}
                                        {req.catatan_admin && (
                                            <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-1 shadow-2xs">
                                                <span className="font-bold flex items-center gap-1.5 text-blue-700">
                                                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                                    Tanggapan / Konfirmasi Admin:
                                                </span>
                                                <p className="text-blue-950 leading-relaxed break-words pl-5.5 text-[11px]">
                                                    {req.catatan_admin}
                                                </p>
                                            </div>
                                        )}

                                        {/* Card Footer: Tanggal Request */}
                                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                                            <span>Diajukan pada:</span>
                                            <span className="font-medium text-slate-600">{formatDate(req.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">
                                Belum Ada Permintaan
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mb-5">
                                Belum ada permohonan kunjungan atau komplain yang diajukan untuk akun Anda.
                            </p>
                            <button
                                type="button"
                                onClick={handleOpenCreateModal}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Buat Request Layanan Pertama</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Modal (Tambah Request Layanan) */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setShowModal(false)}
                        />

                        {/* Modal Box */}
                        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-8">
                            {/* Header Modal */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Form Request Layanan &amp; Kunjungan Teknisi
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Lengkapi data lokasi cabang, kontak, dan keluhan agar Admin dapat menugaskan teknisi yang tepat
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
                                {/* SECTION 1: LOKASI PENANGANAN */}
                                <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            1. Tentukan Lokasi / Cabang Penanganan *
                                        </label>
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Wajib ditentukan terlebih dahulu
                                        </span>
                                    </div>

                                    {/* Selection Mode Options */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {/* Mode 1: Main Office */}
                                        <button
                                            type="button"
                                            onClick={() => handleLocationModeChange('main')}
                                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                locationMode === 'main'
                                                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <Building2 className={`w-4 h-4 ${locationMode === 'main' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                {locationMode === 'main' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">Kantor Utama</div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {customer?.company_name || 'Alamat Terdaftar'}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Mode 2: Registered Sites */}
                                        <button
                                            type="button"
                                            onClick={() => handleLocationModeChange('site')}
                                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                locationMode === 'site'
                                                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <Store className={`w-4 h-4 ${locationMode === 'site' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                                    {sites.length} Cabang
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">Cabang Terdaftar</div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    Pilih dari titik lokasi Anda
                                                </div>
                                            </div>
                                        </button>

                                        {/* Mode 3: Custom / New Address */}
                                        <button
                                            type="button"
                                            onClick={() => handleLocationModeChange('custom')}
                                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                locationMode === 'custom'
                                                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <Plus className={`w-4 h-4 ${locationMode === 'custom' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                {locationMode === 'custom' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">Lokasi / Cabang Baru</div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    Input alamat cabang lain
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Dropdown if Mode is 'site' */}
                                    {locationMode === 'site' && (
                                        <div className="space-y-2 pt-2 border-t border-slate-200">
                                            {sites.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    <label className="block text-xs font-semibold text-slate-700">
                                                        Pilih Titik Lokasi / Cabang Perusahaan *
                                                    </label>
                                                    <select
                                                        value={selectedSiteId}
                                                        onChange={(e) => handleSelectSite(e.target.value)}
                                                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        required
                                                    >
                                                        {sites.map((s) => (
                                                            <option key={s.id} value={String(s.id)}>
                                                                {s.site_name} {s.location ? `(${s.location})` : ''} - {s.address || 'Alamat terdaftar'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                                    Belum ada titik cabang terdaftar di akun Anda. Silakan pilih <strong>&quot;Lokasi / Cabang Baru&quot;</strong> untuk mengisi nama dan alamat cabang.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Inputs for Location Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Nama Tempat / Gedung / Cabang *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.lokasi}
                                                onChange={(e) => setData('lokasi', e.target.value)}
                                                placeholder="Contoh: Kantor Pusat, Cabang Kemang, Gudang Daan Mogot..."
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                                required
                                            />
                                            {errors.lokasi && <p className="text-xs text-rose-600">{errors.lokasi}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Alamat Lengkap / Patokan Lokasi
                                            </label>
                                            <input
                                                type="text"
                                                value={data.alamat_detail}
                                                onChange={(e) => setData('alamat_detail', e.target.value)}
                                                placeholder="Jl. Thamrin No. 10, Lantai 3, Jakarta Pusat..."
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 2: KONTAK PIC DI LOKASI */}
                                <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-blue-600" />
                                        2. Kontak Penanggung Jawab (PIC) di Lapangan
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Nama PIC di Lokasi
                                            </label>
                                            <input
                                                type="text"
                                                value={data.pic_name}
                                                onChange={(e) => setData('pic_name', e.target.value)}
                                                placeholder="Nama PIC yang akan ditemui teknisi..."
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                No. WhatsApp / Telepon Aktif PIC
                                            </label>
                                            <input
                                                type="text"
                                                value={data.pic_phone}
                                                onChange={(e) => setData('pic_phone', e.target.value)}
                                                placeholder="081234567890 (Untuk konfirmasi teknisi)"
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: LAYANAN, WAKTU & PRIORITAS */}
                                <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        3. Kebutuhan Layanan &amp; Jadwal Kunjungan
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Jenis Layanan / Masalah *
                                            </label>
                                            <select
                                                value={data.jenis_layanan}
                                                onChange={(e) => setData('jenis_layanan', e.target.value)}
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            >
                                                <option value="General Pest Control (Kecoa / Tikus / Nyamuk)">General Pest Control (Kecoa / Tikus / Nyamuk)</option>
                                                <option value="Termite Control (Pengendalian Rayap)">Termite Control (Pengendalian Rayap)</option>
                                                <option value="Rodent Control (Khusus Tikus / Rodensia)">Rodent Control (Khusus Tikus / Rodensia)</option>
                                                <option value="Fumigasi">Fumigasi Treatment</option>
                                                <option value="Inspeksi Ulang / Survey Lokasi">Inspeksi Ulang / Survey Lokasi</option>
                                                <option value="Komplain Penanganan / Garansi">Komplain Penanganan / Klaim Garansi</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Prioritas Penanganan *
                                            </label>
                                            <select
                                                value={data.prioritas}
                                                onChange={(e) => setData('prioritas', e.target.value)}
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            >
                                                <option value="rendah">Rendah (Pemeriksaan Rutin)</option>
                                                <option value="sedang">Sedang (Normal)</option>
                                                <option value="tinggi">Tinggi (Populasi Hama Meningkat)</option>
                                                <option value="darurat">Darurat (Butuh Segera / Urgent)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Tanggal Harapan Kunjungan
                                            </label>
                                            <input
                                                type="date"
                                                value={data.tanggal_permintaan}
                                                onChange={(e) => setData('tanggal_permintaan', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Preferensi Waktu
                                            </label>
                                            <select
                                                value={data.waktu_layanan}
                                                onChange={(e) => setData('waktu_layanan', e.target.value)}
                                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="Pagi (08:00 - 12:00)">Pagi (08:00 - 12:00)</option>
                                                <option value="Siang (13:00 - 17:00)">Siang (13:00 - 17:00)</option>
                                                <option value="Fleksibel / Jam Operasional">Fleksibel / Sesuai Jadwal Teknisi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 4: DETAIL PERMINTAAN */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Detail Permintaan / Ruangan Terdampak / Indikasi Hama *
                                    </label>
                                    <textarea
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        rows={3}
                                        placeholder="Contoh: Ditemukan kecoa dan tikus di area pantry lantai 2, mohon periksa juga celah pipa pembuangan..."
                                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    {errors.deskripsi && <p className="text-xs text-rose-600">{errors.deskripsi}</p>}
                                </div>

                                {/* ADMIN DISPATCH NOTICE */}
                                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="text-xs text-blue-900">
                                        <span className="font-bold block">Penugasan Teknisi oleh Admin G-PEST:</span>
                                        Permintaan Anda akan langsung diverifikasi oleh tim Admin operasional G-PEST, dan teknisi spesialis yang bertugas di zona area lokasi Anda akan segera ditugaskan.
                                    </div>
                                </div>

                                {/* FOOTER BUTTONS */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Permintaan Layanan'}
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
