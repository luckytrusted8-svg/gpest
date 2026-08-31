import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ServerError() {
    return (
        <>
            <Head title="500 - Server Error" />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-card rounded-full flex items-center justify-center shadow-lg border border-border">
                            <span className="text-5xl font-bold text-destructive">500</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Kesalahan Server</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Terjadi kesalahan di server. Tim teknis kami sedang menangani masalah ini. Silakan coba lagi nanti.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors"
                        >
                            Coba Lagi
                        </button>
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
