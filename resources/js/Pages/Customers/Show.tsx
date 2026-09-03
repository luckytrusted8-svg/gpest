import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import {
    ArrowLeft, Edit, Trash2, CheckCircle, AlertCircle,
    Building2, MapPin, FileText, Calendar, ClipboardList, Receipt, MessageSquare
} from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location: string;
    npwp: string | null;
    status: 'active' | 'inactive';
    sales_pic: string | null;
    created_at: string;
    contracts?: Contract[];
    schedules?: Schedule[];
    work_reports?: WorkReport[];
    invoices?: Invoice[];
    requests?: CustomerRequest[];
}

interface Contract {
    id: number;
    contract_number: string;
    contract_type: string;
    service_type: string;
    start_date: string;
    end_date: string;
    contract_value: string | number;
    status: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    jenis_layanan: string;
    lokasi: string;
    status: string;
    technician?: { id: number; name: string };
}

interface WorkReport {
    id: number;
    nomor_laporan: string;
    tanggal: string;
    jenis_layanan: string;
    status: string;
    technician?: { id: number; name: string };
}

interface Invoice {
    id: number;
    nomor_invoice: string;
    tanggal_invoice: string;
    total: string | number;
    status_pembayaran: string;
}

interface CustomerRequest {
    id: number;
    request_number: string;
    jenis_layanan: string;
    prioritas: string;
    status: string;
    created_at: string;
}

interface Site {
    id: number;
    site_code: string;
    site_name: string;
    address: string;
    pic_name: string;
    phone: string;
}

interface Props {
    customer: Customer;
    sites: Site[];
}

const tabs = [
    { key: 'overview', label: 'Ringkasan', icon: Building2 },
    { key: 'sites', label: 'Lokasi', icon: MapPin },
    { key: 'contracts', label: 'Kontrak', icon: FileText },
    { key: 'schedules', label: 'Jadwal', icon: Calendar },
    { key: 'reports', label: 'Laporan Kerja', icon: ClipboardList },
    { key: 'invoices', label: 'Invoice', icon: Receipt },
    { key: 'requests', label: 'Permintaan', icon: MessageSquare },
] as const;

type TabKey = typeof tabs[number]['key'];

const statusColors: Record<string, string> = {
    active: 'bg-[#0070f3]/15 text-[#0070f3]',
    inactive: 'bg-canvas-soft-2 text-body border border-hairline',
    draft: 'bg-canvas-soft-2 text-body border border-hairline',
    dikirim: 'bg-[#f59e0b]/15 text-[#f59e0b]',
    disetujui: 'bg-[#22c55e]/15 text-[#22c55e]',
    revisi: 'bg-[#ee0000]/15 text-[#ee0000]',
    selesai: 'bg-[#22c55e]/15 text-[#22c55e]',
    baru: 'bg-[#0070f3]/15 text-[#0070f3]',
    ditinjau: 'bg-[#f59e0b]/15 text-[#f59e0b]',
    dijadwalkan: 'bg-[#8b5cf6]/15 text-[#8b5cf6]',
    ditugaskan: 'bg-[#0070f3]/15 text-[#0070f3]',
    sedang_dikerjakan: 'bg-[#f59e0b]/15 text-[#f59e0b]',
    expired: 'bg-[#ee0000]/15 text-[#ee0000]',
    expiring_soon: 'bg-[#f59e0b]/15 text-[#f59e0b]',
    cancelled: 'bg-canvas-soft-2 text-body border border-hairline',
    terbit: 'bg-[#0070f3]/15 text-[#0070f3]',
    lunas: 'bg-[#22c55e]/15 text-[#22c55e]',
    jatuh_tempo: 'bg-[#ee0000]/15 text-[#ee0000]',
    dibayar_sebagian: 'bg-[#f59e0b]/15 text-[#f59e0b]',
};

function Badge({ status }: { status: string }) {
    const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-canvas-soft-2 text-body border border-hairline'}`}>
            {label}
        </span>
    );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="py-12 text-center border border-dashed border-hairline rounded-md bg-canvas-soft/50">
            <Icon className="w-10 h-10 text-mute mx-auto mb-3 opacity-60" />
            <h3 className="text-body-sm-strong text-ink mb-1">{title}</h3>
            <p className="text-body-sm text-mute max-w-md mx-auto">{description}</p>
        </div>
    );
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(val: string | number) {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
}

export default function Show({ customer, sites }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    const contracts = customer.contracts || [];
    const schedules = customer.schedules || [];
    const reports = customer.work_reports || [];
    const invoices = customer.invoices || [];
    const requests = customer.requests || [];

    const handleDelete = () => {
        if (!confirm(`Hapus customer "${customer.company_name}"?`)) return;
        router.delete(`/customers/${customer.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Pelanggan: ${customer.company_name}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {f?.success && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {f.success}
                    </div>
                )}
                {f?.error && (
                    <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {f.error}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/customers">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-display-sm font-semibold text-ink">{customer.company_name}</h1>
                                <Badge status={customer.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5 font-mono">{customer.customer_id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/customers/${customer.id}/edit`}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="text-body-sm-strong flex items-center gap-2 text-[#ee0000] hover:bg-[#ee0000]/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" /> Hapus
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-hairline">
                    <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            let count = 0;
                            if (tab.key === 'sites') count = sites.length;
                            if (tab.key === 'contracts') count = contracts.length;
                            if (tab.key === 'schedules') count = schedules.length;
                            if (tab.key === 'reports') count = reports.length;
                            if (tab.key === 'invoices') count = invoices.length;
                            if (tab.key === 'requests') count = requests.length;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 text-body-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                        isActive
                                            ? 'border-ink text-ink'
                                            : 'border-transparent text-mute hover:text-body hover:border-hairline-strong'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.key !== 'overview' && count > 0 && (
                                        <span className="ml-1 text-xs bg-canvas-soft-2 border border-hairline px-1.5 py-0 rounded-full font-mono">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 mb-4">Informasi Pelanggan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-mute uppercase">ID Customer</div>
                                    <div className="text-body-sm font-medium text-ink mt-1 font-mono">{customer.customer_id}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">Status</div>
                                    <div className="mt-1"><Badge status={customer.status} /></div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">Nama Perusahaan</div>
                                    <div className="text-body-sm font-medium text-ink mt-1">{customer.company_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">PIC</div>
                                    <div className="text-body-sm font-medium text-ink mt-1">{customer.pic_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">Telepon</div>
                                    <div className="text-body-sm font-medium text-ink mt-1">{customer.phone}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">Email</div>
                                    <div className="text-body-sm font-medium text-ink mt-1">{customer.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-mute uppercase">Lokasi</div>
                                    <div className="text-body-sm font-medium text-ink mt-1">{customer.location}</div>
                                </div>
                                {customer.npwp && (
                                    <div>
                                        <div className="text-xs text-mute uppercase">NPWP</div>
                                        <div className="text-body-sm font-medium text-ink mt-1">{customer.npwp}</div>
                                    </div>
                                )}
                                {customer.sales_pic && (
                                    <div>
                                        <div className="text-xs text-mute uppercase">Sales PIC</div>
                                        <div className="text-body-sm font-medium text-ink mt-1">{customer.sales_pic}</div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-hairline">
                                <div className="text-xs text-mute uppercase">Alamat</div>
                                <div className="text-body-sm text-ink mt-1 whitespace-pre-line">{customer.address}</div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-hairline">
                                <div className="text-xs text-mute uppercase">Terdaftar Sejak</div>
                                <div className="text-body-sm text-ink mt-1">{formatDate(customer.created_at)}</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sites' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Daftar Lokasi / Site</h2>
                                <Link href={`/sites/create?customer_id=${customer.id}`}>
                                    <Button variant="outline" size="sm">+ Tambah Lokasi</Button>
                                </Link>
                            </div>
                            {sites.length === 0 ? (
                                <EmptyState icon={MapPin} title="Belum Ada Lokasi" description="Lokasi site untuk pelanggan ini belum ditambahkan." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">Kode</th><th className="pb-2 pr-4">Nama Site</th><th className="pb-2 pr-4">Alamat</th><th className="pb-2 pr-4">PIC</th><th className="pb-2">Telepon</th>
                                        </tr></thead>
                                        <tbody>
                                            {sites.map(s => (
                                                <tr key={s.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4 font-mono">{s.site_code}</td>
                                                    <td className="py-3 pr-4"><Link href={`/sites/${s.id}`} className="text-link hover:underline">{s.site_name}</Link></td>
                                                    <td className="py-3 pr-4 text-mute max-w-xs truncate">{s.address}</td>
                                                    <td className="py-3 pr-4">{s.pic_name}</td>
                                                    <td className="py-3">{s.phone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'contracts' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Daftar Kontrak</h2>
                                <Link href={`/contracts/create?customer_id=${customer.id}`}>
                                    <Button variant="outline" size="sm">+ Tambah Kontrak</Button>
                                </Link>
                            </div>
                            {contracts.length === 0 ? (
                                <EmptyState icon={FileText} title="Belum Ada Kontrak" description="Kontrak untuk pelanggan ini belum dibuat." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">No. Kontrak</th><th className="pb-2 pr-4">Tipe</th><th className="pb-2 pr-4">Layanan</th><th className="pb-2 pr-4">Periode</th><th className="pb-2 pr-4">Nilai</th><th className="pb-2">Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {contracts.map(c => (
                                                <tr key={c.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4"><Link href={`/contracts/${c.id}`} className="text-link hover:underline font-mono">{c.contract_number}</Link></td>
                                                    <td className="py-3 pr-4">{c.contract_type}</td>
                                                    <td className="py-3 pr-4">{c.service_type}</td>
                                                    <td className="py-3 pr-4 text-mute">{formatDate(c.start_date)} — {formatDate(c.end_date)}</td>
                                                    <td className="py-3 pr-4 font-mono">{formatCurrency(c.contract_value)}</td>
                                                    <td className="py-3"><Badge status={c.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'schedules' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Jadwal Pekerjaan</h2>
                                <Link href={`/schedules/create?customer_id=${customer.id}`}>
                                    <Button variant="outline" size="sm">+ Tambah Jadwal</Button>
                                </Link>
                            </div>
                            {schedules.length === 0 ? (
                                <EmptyState icon={Calendar} title="Belum Ada Jadwal" description="Jadwal pekerjaan untuk pelanggan ini belum dibuat." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">Kode</th><th className="pb-2 pr-4">Tanggal</th><th className="pb-2 pr-4">Jam</th><th className="pb-2 pr-4">Layanan</th><th className="pb-2 pr-4">Teknisi</th><th className="pb-2">Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {schedules.map(s => (
                                                <tr key={s.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4"><Link href={`/schedules/${s.id}`} className="text-link hover:underline font-mono">{s.schedule_code}</Link></td>
                                                    <td className="py-3 pr-4">{formatDate(s.tanggal)}</td>
                                                    <td className="py-3 pr-4 text-mute">{s.jam_mulai} - {s.jam_selesai}</td>
                                                    <td className="py-3 pr-4">{s.jenis_layanan}</td>
                                                    <td className="py-3 pr-4">{s.technician?.name || '-'}</td>
                                                    <td className="py-3"><Badge status={s.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Laporan Kerja</h2>
                            </div>
                            {reports.length === 0 ? (
                                <EmptyState icon={ClipboardList} title="Belum Ada Laporan" description="Laporan kerja untuk pelanggan ini belum ada." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">No. Laporan</th><th className="pb-2 pr-4">Tanggal</th><th className="pb-2 pr-4">Layanan</th><th className="pb-2 pr-4">Teknisi</th><th className="pb-2">Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {reports.map(r => (
                                                <tr key={r.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4"><Link href={`/work-reports/${r.id}`} className="text-link hover:underline font-mono">{r.nomor_laporan}</Link></td>
                                                    <td className="py-3 pr-4">{formatDate(r.tanggal)}</td>
                                                    <td className="py-3 pr-4">{r.jenis_layanan}</td>
                                                    <td className="py-3 pr-4">{r.technician?.name || '-'}</td>
                                                    <td className="py-3"><Badge status={r.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Daftar Invoice</h2>
                            </div>
                            {invoices.length === 0 ? (
                                <EmptyState icon={Receipt} title="Belum Ada Invoice" description="Invoice untuk pelanggan ini belum ada." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">No. Invoice</th><th className="pb-2 pr-4">Tanggal</th><th className="pb-2 pr-4">Total</th><th className="pb-2">Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {invoices.map(inv => (
                                                <tr key={inv.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4"><Link href={`/invoices/${inv.id}`} className="text-link hover:underline font-mono">{inv.nomor_invoice}</Link></td>
                                                    <td className="py-3 pr-4">{formatDate(inv.tanggal_invoice)}</td>
                                                    <td className="py-3 pr-4 font-mono">{formatCurrency(inv.total)}</td>
                                                    <td className="py-3"><Badge status={inv.status_pembayaran} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
                                <h2 className="text-body-md-strong text-ink">Permintaan Pelanggan</h2>
                            </div>
                            {requests.length === 0 ? (
                                <EmptyState icon={MessageSquare} title="Belum Ada Permintaan" description="Belum ada permintaan layanan dari pelanggan ini." />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-body-sm">
                                        <thead><tr className="border-b border-hairline text-left text-xs text-mute uppercase">
                                            <th className="pb-2 pr-4">No. Request</th><th className="pb-2 pr-4">Layanan</th><th className="pb-2 pr-4">Prioritas</th><th className="pb-2 pr-4">Tanggal</th><th className="pb-2">Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {requests.map(req => (
                                                <tr key={req.id} className="border-b border-hairline last:border-b-0 hover:bg-canvas-soft/50">
                                                    <td className="py-3 pr-4"><Link href={`/customer-requests/${req.id}`} className="text-link hover:underline font-mono">{req.request_number}</Link></td>
                                                    <td className="py-3 pr-4">{req.jenis_layanan}</td>
                                                    <td className="py-3 pr-4"><Badge status={req.prioritas} /></td>
                                                    <td className="py-3 pr-4">{formatDate(req.created_at)}</td>
                                                    <td className="py-3"><Badge status={req.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
