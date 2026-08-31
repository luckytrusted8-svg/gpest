import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';

interface FormData {
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location: string;
    npwp: string;
    status: 'active' | 'inactive';
    sales_pic: string;
}

interface Props {
    customer: FormData & { id: number };
}

export default function Edit({ customer }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({ ...customer });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Head title={`Edit Customer: ${customer.company_name}`} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-display-sm font-semibold text-ink">Edit Customer</h1>
                <Link href={route('customers.index')}>
                    <Button variant="outline" className="text-body-sm-strong">
                        Back to List
                    </Button>
                </Link>
            </div>

            <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="customer_id" className="text-body-sm-strong text-ink">Customer ID</Label>
                            <Input
                                id="customer_id"
                                type="text"
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="mt-1"
                            />
                            {errors.customer_id && <div className="text-error text-sm mt-1">{errors.customer_id}</div>}
                        </div>

                        <div>
                            <Label htmlFor="company_name" className="text-body-sm-strong text-ink">Company Name</Label>
                            <Input
                                id="company_name"
                                type="text"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                className="mt-1"
                            />
                            {errors.company_name && <div className="text-error text-sm mt-1">{errors.company_name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="pic_name" className="text-body-sm-strong text-ink">PIC Name</Label>
                            <Input
                                id="pic_name"
                                type="text"
                                value={data.pic_name}
                                onChange={(e) => setData('pic_name', e.target.value)}
                                className="mt-1"
                            />
                            {errors.pic_name && <div className="text-error text-sm mt-1">{errors.pic_name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-body-sm-strong text-ink">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1"
                            />
                            {errors.phone && <div className="text-error text-sm mt-1">{errors.phone}</div>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-body-sm-strong text-ink">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1"
                            />
                            {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <Label htmlFor="location" className="text-body-sm-strong text-ink">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="mt-1"
                            />
                            {errors.location && <div className="text-error text-sm mt-1">{errors.location}</div>}
                        </div>

                        <div>
                            <Label htmlFor="npwp" className="text-body-sm-strong text-ink">NPWP (optional)</Label>
                            <Input
                                id="npwp"
                                type="text"
                                value={data.npwp}
                                onChange={(e) => setData('npwp', e.target.value)}
                                className="mt-1"
                            />
                            {errors.npwp && <div className="text-error text-sm mt-1">{errors.npwp}</div>}
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-body-sm-strong text-ink">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: string) => setData('status', value as 'active' | 'inactive')}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <div className="text-error text-sm mt-1">{errors.status}</div>}
                        </div>

                        <div>
                            <Label htmlFor="sales_pic" className="text-body-sm-strong text-ink">Sales PIC (optional)</Label>
                            <Input
                                id="sales_pic"
                                type="text"
                                value={data.sales_pic}
                                onChange={(e) => setData('sales_pic', e.target.value)}
                                className="mt-1"
                            />
                            {errors.sales_pic && <div className="text-error text-sm mt-1">{errors.sales_pic}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address" className="text-body-sm-strong text-ink">Address</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                            className="mt-1 min-h-[100px]"
                        />
                        {errors.address && <div className="text-error text-sm mt-1">{errors.address}</div>}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link href={route('customers.index')}>
                            <Button type="button" variant="outline" className="text-body-sm-strong">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
                        >
                            Update Customer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
