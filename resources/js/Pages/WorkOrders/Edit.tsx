import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save, ClipboardList } from 'lucide-react';

interface OptionItem {
    id: number;
    company_name?: string;
    site_name?: string;
    customer_id?: number;
    contract_number?: string;
    schedule_code?: string;
    tanggal?: string;
    name?: string;
}

interface WorkOrder {
    id: number;
    wo_number: string;
    customer_id: number;
    site_id: number | null;
    contract_id: number | null;
    schedule_id: number | null;
    technician_id: number | null;
    service_type: string;
    priority: string;
    instruction: string | null;
    status: string;
}

interface Props {
    workOrder: WorkOrder;
    customers: OptionItem[];
    sites: OptionItem[];
    contracts: OptionItem[];
    schedules: OptionItem[];
    technicians: OptionItem[];
    statuses: string[];
}

export default function WorkOrdersEdit({
    workOrder,
    customers,
    sites,
    contracts,
    schedules,
    technicians,
    statuses,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        wo_number: workOrder.wo_number || '',
        customer_id: workOrder.customer_id ? String(workOrder.customer_id) : '',
        site_id: workOrder.site_id ? String(workOrder.site_id) : '',
        contract_id: workOrder.contract_id ? String(workOrder.contract_id) : '',
        schedule_id: workOrder.schedule_id ? String(workOrder.schedule_id) : '',
        technician_id: workOrder.technician_id ? String(workOrder.technician_id) : '',
        service_type: workOrder.service_type || 'General Pest Control',
        priority: workOrder.priority || 'medium',
        instruction: workOrder.instruction || '',
        status: workOrder.status || 'ASSIGNED',
    });

    const filteredSites = data.customer_id
        ? sites.filter((s) => String(s.customer_id) === String(data.customer_id))
        : sites;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/work-orders/${workOrder.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Work Order ${workOrder.wo_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/work-orders">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Edit Work Order (Perintah Kerja)</h1>
                        <p className="text-body-sm text-mute">Perbarui instruksi pekerjaan, penugasan teknisi, atau status eksekusi.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-canvas border border-hairline rounded-md p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold">Nomor WO</Label>
                            <Input
                                value={data.wo_number}
                                onChange={(e) => setData('wo_number', e.target.value)}
                                className="font-mono text-xs mt-1 bg-canvas-soft"
                                required
                            />
                            {errors.wo_number && <p className="text-xs text-red-600 mt-1">{errors.wo_number}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Pilih Pelanggan *</Label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                            {errors.customer_id && <p className="text-xs text-red-600 mt-1">{errors.customer_id}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Titik Lokasi (Site)</Label>
                            <select
                                value={data.site_id}
                                onChange={(e) => setData('site_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            >
                                <option value="">-- Lokasi Utama (Default) --</option>
                                {filteredSites.map((s) => (
                                    <option key={s.id} value={s.id}>{s.site_name}</option>
                                ))}
                            </select>
                            {errors.site_id && <p className="text-xs text-red-600 mt-1">{errors.site_id}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Jenis Layanan *</Label>
                            <select
                                value={data.service_type}
                                onChange={(e) => setData('service_type', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                <option value="General Pest Control">General Pest Control</option>
                                <option value="Termite Control (Rayap)">Termite Control (Rayap)</option>
                                <option value="Rodent Control (Tikus)">Rodent Control (Tikus)</option>
                                <option value="Fumigation">Fumigation</option>
                                <option value="Disinfection">Disinfection</option>
                            </select>
                            {errors.service_type && <p className="text-xs text-red-600 mt-1">{errors.service_type}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Tugaskan Teknisi (Assign)</Label>
                            <select
                                value={data.technician_id}
                                onChange={(e) => setData('technician_id', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            >
                                <option value="">-- Pilih Teknisi Lapangan --</option>
                                {technicians.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {errors.technician_id && <p className="text-xs text-red-600 mt-1">{errors.technician_id}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Skala Prioritas *</Label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                <option value="low">Rendah (Low)</option>
                                <option value="medium">Sedang (Medium)</option>
                                <option value="high">Tinggi (High)</option>
                                <option value="urgent">Urgent / Darurat</option>
                            </select>
                            {errors.priority && <p className="text-xs text-red-600 mt-1">{errors.priority}</p>}
                        </div>

                        <div>
                            <Label className="text-xs font-semibold">Status Work Order *</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                required
                            >
                                {statuses.map((st) => (
                                    <option key={st} value={st}>{st.replace('_', ' ')}</option>
                                ))}
                            </select>
                            {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="text-xs font-semibold">Instruksi Pekerjaan Khusus</Label>
                            <textarea
                                value={data.instruction}
                                onChange={(e) => setData('instruction', e.target.value)}
                                placeholder="Masukkan catatan khusus atau penanganan hama spesifik untuk teknisi..."
                                rows={3}
                                className="w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            />
                            {errors.instruction && <p className="text-xs text-red-600 mt-1">{errors.instruction}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                        <Link href="/work-orders">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-slate-900 text-white hover:bg-slate-800 text-xs flex items-center gap-2 font-semibold">
                            <Save className="w-4 h-4" /> Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
