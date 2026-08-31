import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

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
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const handleDelete = () => {
        if (!confirm(`Hapus customer "${customer.company_name}"?`)) return;
        router.delete(`/customers/${customer.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Pelanggan: ${customer.company_name}`} />

            <div className="max-w-5xl mx-auto space-y-6">
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
                            <h1 className="text-display-sm font-semibold text-ink">{customer.company_name}</h1>
                            <p className="text-body-sm text-mute mt-0.5">{customer.customer_id}</p>
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

                {/* Info Card */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 mb-4">Informasi Pelanggan</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-xs text-mute uppercase">ID Customer</div>
                            <div className="text-body-sm font-medium text-ink mt-1 font-mono">{customer.customer_id}</div>
                        </div>
                        <div>
                            <div className="text-xs text-mute uppercase">Status</div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                customer.status === 'active'
                                    ? 'bg-[#0070f3]/15 text-[#0070f3]'
                                    : 'bg-canvas-soft-2 text-body-text border border-hairline'
                            }`}>
                                {customer.status === 'active' ? 'Aktif' : 'Non-aktif'}
                            </span>
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
                        <div className="text-body-sm text-ink mt-1">{new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
