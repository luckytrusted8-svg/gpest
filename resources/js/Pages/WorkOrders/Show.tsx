import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { 
    ArrowLeft, ClipboardList, MapPin, UserCheck, Calendar, 
    CheckCircle2, XCircle, AlertCircle, Clock, ShieldCheck, FileText 
} from 'lucide-react';

interface InspectionAnswer {
    id: number;
    answer_value: string;
    field?: { label: string };
}

interface Treatment {
    id: number;
    treatment_type: string;
    quantity: number;
    unit: string;
    area: string | null;
    chemical?: { nama_bahan: string };
}

interface WorkOrder {
    id: number;
    wo_number: string;
    service_type: string;
    priority: string;
    instruction: string | null;
    status: string;
    check_in_latitude: number | null;
    check_in_longitude: number | null;
    check_in_time: string | null;
    check_out_time: string | null;
    rejection_reason: string | null;
    created_at: string;
    customer?: { id: number; company_name: string; address: string; phone: string };
    site?: { id: number; site_name: string; address: string };
    technician?: { id: number; name: string; email: string };
    inspection_answers: InspectionAnswer[];
    treatments: Treatment[];
}

interface Props {
    workOrder: WorkOrder;
}

export default function WorkOrdersShow({ workOrder }: Props) {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleUpdateStatus = (newStatus: string, reason?: string) => {
        router.put(`/work-orders/${workOrder.id}/status`, {
            status: newStatus,
            rejection_reason: reason ?? null,
        });
    };

    return (
        <AppLayout>
            <Head title={`Detail Work Order ${workOrder.wo_number}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Navbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/work-orders">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {workOrder.wo_number}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    workOrder.status === 'APPROVED' ? 'bg-emerald-600 text-white' :
                                    workOrder.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {workOrder.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h1 className="text-display-sm font-semibold text-ink mt-1">{workOrder.service_type}</h1>
                        </div>
                    </div>

                    {/* Action Controls for Supervisor / Admin */}
                    <div className="flex items-center gap-2">
                        {workOrder.status === 'PENDING_REVIEW' && (
                            <>
                                <Button
                                    onClick={() => handleUpdateStatus('APPROVED')}
                                    className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Approve WO
                                </Button>
                                <Button
                                    onClick={() => setShowRejectModal(true)}
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs flex items-center gap-1.5"
                                >
                                    <XCircle className="w-4 h-4" /> Reject / Revisi
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column (Informasi Client & Task) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2">
                                Informasi Pelanggan & Lokasi
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-mute">Perusahaan Pelanggan:</span>
                                    <p className="font-semibold text-ink mt-0.5">{workOrder.customer?.company_name ?? '-'}</p>
                                </div>
                                <div>
                                    <span className="text-mute">Titik Lokasi (Site):</span>
                                    <p className="font-semibold text-ink mt-0.5">{workOrder.site?.site_name ?? 'Site Utama'}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-mute">Alamat Pengerjaan:</span>
                                    <p className="text-ink mt-0.5">{workOrder.site?.address ?? workOrder.customer?.address ?? '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Audit GPS Check-In */}
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Log Check-In GPS Teknisi
                            </h3>
                            {workOrder.check_in_time ? (
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="text-mute">Waktu Check-In:</span>
                                        <p className="font-mono font-medium text-ink mt-0.5">{workOrder.check_in_time}</p>
                                    </div>
                                    <div>
                                        <span className="text-mute">Waktu Check-Out:</span>
                                        <p className="font-mono font-medium text-ink mt-0.5">{workOrder.check_out_time ?? 'Sedang Berjalan'}</p>
                                    </div>
                                    <div>
                                        <span className="text-mute">Koordinat GPS:</span>
                                        <p className="font-mono text-ink mt-0.5">{workOrder.check_in_latitude}, {workOrder.check_in_longitude}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-mute italic">Teknisi belum melakukan Check-In lokasi.</p>
                            )}
                        </div>

                        {/* Treatments & Chemical Usage */}
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2">
                                Tindakan Treatment & Bahan Kimia
                            </h3>
                            {workOrder.treatments.length > 0 ? (
                                <div className="divide-y divide-hairline">
                                    {workOrder.treatments.map((t) => (
                                        <div key={t.id} className="py-2 flex justify-between items-center text-xs">
                                            <div>
                                                <span className="font-bold text-ink uppercase">{t.treatment_type}</span>
                                                <div className="text-mute">Bahan: {t.chemical?.nama_bahan ?? '-'} &middot; Area: {t.area ?? 'Utama'}</div>
                                            </div>
                                            <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                                                {t.quantity} {t.unit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-mute italic">Belum ada rincian treatment dicatat.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Side Meta) */}
                    <div className="space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-4 text-xs">
                            <h3 className="font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2">
                                Status & Penugasan
                            </h3>
                            <div>
                                <span className="text-mute">Teknisi Lapangan:</span>
                                <div className="font-semibold text-ink mt-1 flex items-center gap-1.5">
                                    <UserCheck className="w-4 h-4 text-emerald-600" />
                                    {workOrder.technician?.name ?? 'Belum Ditugaskan'}
                                </div>
                            </div>
                            <div>
                                <span className="text-mute">Prioritas WO:</span>
                                <p className="font-bold text-ink uppercase mt-0.5">{workOrder.priority}</p>
                            </div>
                            <div>
                                <span className="text-mute">Tanggal Diterbitkan:</span>
                                <p className="font-mono text-ink mt-0.5">{workOrder.created_at}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
