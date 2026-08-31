import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { StatusBadge } from './Index';
import { Calendar, FileText, Building2, User, Paperclip, ArrowLeft, Edit } from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name?: string;
    phone?: string;
    email?: string;
}

interface Contract {
    id: number;
    contract_number: string;
    customer_id: number;
    customer?: Customer;
    location: string;
    contract_type: string;
    start_date: string;
    end_date: string;
    service_frequency: string;
    service_type: string;
    contract_value: string | number;
    status: 'draft' | 'active' | 'expiring_soon' | 'expired' | 'cancelled';
    pic: string | null;
    attachment: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    contract: Contract;
}

export default function Show({ contract }: Props) {
    const formatCurrency = (val: string | number) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    };

    return (
        <AppLayout>
            <Head title={`Contract: ${contract.contract_number}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('contracts.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-display-sm font-semibold text-ink font-mono">{contract.contract_number}</h1>
                                <StatusBadge status={contract.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">
                                Customer: <span className="font-medium text-ink">{contract.customer?.company_name || '-'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href={route('contracts.edit', contract.id)}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Contract
                            </Button>
                        </Link>
                        <Link href={route('contracts.index')}>
                            <Button variant="outline" className="text-body-sm-strong">
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Contract Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Contract Value</div>
                        <div className="text-display-md font-semibold text-ink font-mono">
                            {formatCurrency(contract.contract_value)}
                        </div>
                        <div className="text-caption text-mute mt-2">
                            Frequency: {contract.service_frequency}
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Duration</div>
                        <div className="text-body-md-strong text-ink flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-mute" />
                            {contract.start_date} &rarr; {contract.end_date}
                        </div>
                        <div className="text-caption text-mute mt-2">
                            Type: {contract.contract_type}
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Customer / Location</div>
                        <div className="text-body-md-strong text-ink flex items-center gap-2 truncate">
                            <Building2 className="w-4 h-4 text-mute shrink-0" />
                            <span className="truncate">{contract.customer?.company_name}</span>
                        </div>
                        <div className="text-caption text-mute mt-2 truncate">
                            {contract.location}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-6">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mute" />
                        Contract Specifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Contract Number</div>
                            <div className="text-body-sm font-mono font-medium text-ink">{contract.contract_number}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Customer Company</div>
                            <div className="text-body-sm font-medium text-ink">{contract.customer?.company_name} ({contract.customer?.customer_id})</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Contract Type</div>
                            <div className="text-body-sm text-body-text">{contract.contract_type}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Service Type</div>
                            <div className="text-body-sm text-body-text">{contract.service_type}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Service Frequency</div>
                            <div className="text-body-sm text-body-text">{contract.service_frequency}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Status</div>
                            <div><StatusBadge status={contract.status} /></div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Person In Charge (PIC)</div>
                            <div className="text-body-sm text-body-text flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-mute" />
                                {contract.pic || '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Location</div>
                            <div className="text-body-sm text-body-text">{contract.location}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Attachment</div>
                            <div className="text-body-sm text-body-text flex items-center gap-1.5">
                                <Paperclip className="w-3.5 h-3.5 text-mute" />
                                {contract.attachment ? (
                                    <a href={contract.attachment} target="_blank" rel="noreferrer" className="text-link hover:underline truncate">
                                        {contract.attachment}
                                    </a>
                                ) : (
                                    <span className="text-mute">No attachment</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Schedules Section (Empty State Placeholder) */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-hairline pb-3">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-mute" />
                            Related Service Schedules
                        </h2>
                        <span className="text-xs font-mono text-mute bg-canvas-soft px-2 py-0.5 rounded border border-hairline">
                            0 Schedules
                        </span>
                    </div>

                    <div className="py-12 text-center border border-dashed border-hairline rounded-md bg-canvas-soft/50">
                        <Calendar className="w-10 h-10 text-mute mx-auto mb-3 opacity-60" />
                        <h3 className="text-body-sm-strong text-ink mb-1">No Schedules Generated Yet</h3>
                        <p className="text-body-sm text-mute max-w-md mx-auto">
                            Service visit schedules linked to this contract will appear here automatically once created in the Scheduling module.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
