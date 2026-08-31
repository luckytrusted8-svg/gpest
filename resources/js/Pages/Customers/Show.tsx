import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

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
    updated_at: string;
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    return (
        <div className="max-w-6xl mx-auto">
            <Head title={`Customer: ${customer.company_name}`} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-display-sm font-semibold text-ink">Customer Details</h1>
                <div className="space-x-2">
                    <Link href={route('customers.edit', customer.id)}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Edit
                        </Button>
                    </Link>
                    <Link href={route('customers.index')}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Back to List
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Customer ID</h2>
                        <p className="text-body-sm text-body-text">{customer.customer_id}</p>
                    </div>
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Company Name</h2>
                        <p className="text-body-sm text-body-text">{customer.company_name}</p>
                    </div>
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">PIC Name</h2>
                        <p className="text-body-sm text-body-text">{customer.pic_name}</p>
                    </div>
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Phone</h2>
                        <p className="text-body-sm text-body-text">{customer.phone}</p>
                    </div>
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Email</h2>
                        <p className="text-body-sm text-body-text">{customer.email}</p>
                    </div>
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Location</h2>
                        <p className="text-body-sm text-body-text">{customer.location}</p>
                    </div>
                    {customer.npwp && (
                        <div>
                            <h2 className="text-body-sm-strong text-ink mb-2">NPWP</h2>
                            <p className="text-body-sm text-body-text">{customer.npwp}</p>
                        </div>
                    )}
                    <div>
                        <h2 className="text-body-sm-strong text-ink mb-2">Status</h2>
                        <p className={`text-body-sm ${customer.status === 'active' ? 'text-success' : 'text-error'}`}>
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                    {customer.sales_pic && (
                        <div>
                            <h2 className="text-body-sm-strong text-ink mb-2">Sales PIC</h2>
                            <p className="text-body-sm text-body-text">{customer.sales_pic}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="text-body-sm-strong text-ink mb-2">Address</h2>
                    <p className="text-body-sm text-body-text whitespace-pre-line">{customer.address}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-canvas-soft rounded-md">
                    <TabsTrigger value="overview" className="text-body-sm-strong">Overview</TabsTrigger>
                    <TabsTrigger value="locations" className="text-body-sm-strong">Locations</TabsTrigger>
                    <TabsTrigger value="contracts" className="text-body-sm-strong">Contracts</TabsTrigger>
                    <TabsTrigger value="work-reports" className="text-body-sm-strong">Work Reports</TabsTrigger>
                    <TabsTrigger value="documents" className="text-body-sm-strong">Documents</TabsTrigger>
                    <TabsTrigger value="activity" className="text-body-sm-strong">Activity History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Overview</h3>
                        <p className="text-body-sm text-body-text">Customer overview content goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="locations" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Locations</h3>
                        <p className="text-body-sm text-body-text">Customer locations content goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="contracts" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Contracts</h3>
                        <p className="text-body-sm text-body-text">Customer contracts content goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="work-reports" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Work Reports</h3>
                        <p className="text-body-sm text-body-text">Customer work reports content goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Documents</h3>
                        <p className="text-body-sm text-body-text">Customer documents content goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                        <h3 className="text-body-sm-strong text-ink mb-4">Activity History</h3>
                        <p className="text-body-sm text-body-text">Customer activity history content goes here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
