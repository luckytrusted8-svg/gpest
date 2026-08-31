import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface FormData {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas-soft">
            <Head title="Log in" />

            <div className="w-full max-w-md p-8 bg-canvas rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] border border-hairline">
                <h1 className="text-display-sm font-semibold text-ink mb-6">Log in to GPEST</h1>

                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-body-sm-strong text-ink">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="password" className="text-body-sm-strong text-ink">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <div className="text-error text-sm mt-1">{errors.password}</div>}
                        </div>

                        <div className="block mt-4">
                            <label htmlFor="remember" className="flex items-center">
                                <Input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-hairline text-primary shadow-sm focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-body-text">Remember me</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Button
                                className="bg-primary text-on-primary hover:bg-ink"
                                disabled={processing}
                            >
                                Log in
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
