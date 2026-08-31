import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-card rounded-full flex items-center justify-center shadow-lg border border-border">
                            <span className="text-5xl font-bold text-primary">404</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Halaman Tidak Ditemukan</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke lokasi lain.
                    </p>
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}
