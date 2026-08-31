import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
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
}

interface Props {
    contract: Contract;
    customers: Customer[];
}

interface FormData {
    contract_number: string;
    customer_id: string;
    location: string;
    contract_type: string;
    start_date: string;
    end_date: string;
    service_frequency: string;
    service_type: string;
    contract_value: string;
    status: 'draft' | 'active' | 'expiring_soon' | 'expired' | 'cancelled';
    pic: string;
    attachment: string;
}

export default function Edit({ contract, customers }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        contract_number: contract.contract_number || '',
        customer_id: String(contract.customer_id) || '',
        location: contract.location || '',
        contract_type: contract.contract_type || 'General Pest Control',
        start_date: contract.start_date || '',
        end_date: contract.end_date || '',
        service_frequency: contract.service_frequency || 'Monthly',
        service_type: contract.service_type || 'Pest Control',
        contract_value: String(contract.contract_value || ''),
        status: contract.status || 'active',
        pic: contract.pic || '',
        attachment: contract.attachment || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('contracts.update', contract.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Contract: ${contract.contract_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink font-mono">Edit Contract: {contract.contract_number}</h1>
                        <p className="text-body-sm text-mute mt-1">Update details for this customer contract.</p>
                    </div>
                    <Link href={route('contracts.index')}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Back to List
                        </Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="contract_number" className="text-body-sm-strong text-ink">Contract Number</Label>
                                <Input
                                    id="contract_number"
                                    type="text"
                                    value={data.contract_number}
                                    onChange={(e) => setData('contract_number', e.target.value)}
                                    className="mt-1 font-mono"
                                />
                                {errors.contract_number && <div className="text-error text-sm mt-1">{errors.contract_number}</div>}
                            </div>

                            <div>
                                <Label htmlFor="customer_id" className="text-body-sm-strong text-ink">Customer</Label>
                                <Select
                                    value={data.customer_id}
                                    onValueChange={(val: string) => setData('customer_id', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((cust) => (
                                            <SelectItem key={cust.id} value={String(cust.id)}>
                                                {cust.company_name} ({cust.customer_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <div className="text-error text-sm mt-1">{errors.customer_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="location" className="text-body-sm-strong text-ink">Location / Address</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Site / Building location"
                                    className="mt-1"
                                />
                                {errors.location && <div className="text-error text-sm mt-1">{errors.location}</div>}
                            </div>

                            <div>
                                <Label htmlFor="contract_type" className="text-body-sm-strong text-ink">Contract Type</Label>
                                <Select
                                    value={data.contract_type}
                                    onValueChange={(val: string) => setData('contract_type', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Contract Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Pest Control">General Pest Control</SelectItem>
                                        <SelectItem value="Termite Control">Termite Control</SelectItem>
                                        <SelectItem value="Rodent Control">Rodent Control</SelectItem>
                                        <SelectItem value="Fumigation">Fumigation</SelectItem>
                                        <SelectItem value="Commercial Agreement">Commercial Agreement</SelectItem>
                                        <SelectItem value="Residential Agreement">Residential Agreement</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.contract_type && <div className="text-error text-sm mt-1">{errors.contract_type}</div>}
                            </div>

                            <div>
                                <Label htmlFor="start_date" className="text-body-sm-strong text-ink">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.start_date && <div className="text-error text-sm mt-1">{errors.start_date}</div>}
                            </div>

                            <div>
                                <Label htmlFor="end_date" className="text-body-sm-strong text-ink">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.end_date && <div className="text-error text-sm mt-1">{errors.end_date}</div>}
                            </div>

                            <div>
                                <Label htmlFor="service_frequency" className="text-body-sm-strong text-ink">Service Frequency</Label>
                                <Select
                                    value={data.service_frequency}
                                    onValueChange={(val: string) => setData('service_frequency', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Bi-Monthly">Bi-Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="One-Time">One-Time</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.service_frequency && <div className="text-error text-sm mt-1">{errors.service_frequency}</div>}
                            </div>

                            <div>
                                <Label htmlFor="service_type" className="text-body-sm-strong text-ink">Service Type</Label>
                                <Input
                                    id="service_type"
                                    type="text"
                                    value={data.service_type}
                                    onChange={(e) => setData('service_type', e.target.value)}
                                    placeholder="e.g. Pest & Rodent Control"
                                    className="mt-1"
                                />
                                {errors.service_type && <div className="text-error text-sm mt-1">{errors.service_type}</div>}
                            </div>

                            <div>
                                <Label htmlFor="contract_value" className="text-body-sm-strong text-ink">Contract Value (IDR)</Label>
                                <Input
                                    id="contract_value"
                                    type="number"
                                    step="1000"
                                    value={data.contract_value}
                                    onChange={(e) => setData('contract_value', e.target.value)}
                                    placeholder="e.g. 15000000"
                                    className="mt-1 font-mono"
                                />
                                {errors.contract_value && <div className="text-error text-sm mt-1">{errors.contract_value}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-body-sm-strong text-ink">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: string) => setData('status', val as FormData['status'])}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <div className="text-error text-sm mt-1">{errors.status}</div>}
                            </div>

                            <div>
                                <Label htmlFor="pic" className="text-body-sm-strong text-ink">Person In Charge (PIC)</Label>
                                <Input
                                    id="pic"
                                    type="text"
                                    value={data.pic}
                                    onChange={(e) => setData('pic', e.target.value)}
                                    placeholder="PIC Name / Staff"
                                    className="mt-1"
                                />
                                {errors.pic && <div className="text-error text-sm mt-1">{errors.pic}</div>}
                            </div>

                            <div>
                                <Label htmlFor="attachment" className="text-body-sm-strong text-ink">Attachment URL / Ref (optional)</Label>
                                <Input
                                    id="attachment"
                                    type="text"
                                    value={data.attachment}
                                    onChange={(e) => setData('attachment', e.target.value)}
                                    placeholder="URL or document reference"
                                    className="mt-1"
                                />
                                {errors.attachment && <div className="text-error text-sm mt-1">{errors.attachment}</div>}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-hairline">
                            <Link href={route('contracts.index')}>
                                <Button type="button" variant="outline" className="text-body-sm-strong">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
                            >
                                Update Contract
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
