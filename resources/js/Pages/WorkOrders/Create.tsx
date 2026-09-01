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

interface Props {
    autoWoNumber: string;
    customers: OptionItem[];
    sites: OptionItem[];
    contracts: OptionItem[];
    schedules: OptionItem[];
    technicians: OptionItem[];
}

export default function WorkOrdersCreate({
    autoWoNumber,
    customers,
    sites,
    contracts,
    schedules,
    technicians,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        wo_number: autoWoNumber,
        customer_id: customers[0]?.id ? String(customers[0].id) : '',
        site_id: '',
        contract_id: '',
        schedule_id: '',
        technician_id: '',
        service_type: 'General Pest Control',
        priority: 'medium',
        instruction: '',
        status: 'ASSIGNED',
    });

    const filteredSites = data.customer_id
        ? sites.filter((s) => String(s.customer_id) === String(data.customer_id))
        : sites;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/work-orders');
    };

    return (
        <AppLayout>
            <Head title="Buat Work Order (Perintah Kerja) Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/work-orders">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Buat Work Order (Perintah Kerja) Baru</h1>
                        <p className="text-body-sm text-mute">Terbitkan instruksi pekerjaan teknisi untuk penanganan hama di lokasi client.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-canvas border border-hairline rounded-md p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold">Nomor WO (Otomatis)</Label>
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
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                        <Link href="/work-orders">
                            <Button type="button" variant="outline" className="text-xs">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink text-xs flex items-center gap-2">
                            <Save className="w-4 h-4" /> Terbitkan Work Order
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
