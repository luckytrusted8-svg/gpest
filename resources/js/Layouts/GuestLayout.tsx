import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas-soft p-4 sm:p-6 text-ink antialiased">
            <div className="mb-6 flex flex-col items-center">
                <Link href="/" className="transition-transform hover:scale-105">
                    <img src="/images/logo.png" alt="G-PEST Logo" className="h-10 w-auto object-contain" />
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden bg-canvas p-6 sm:p-8 border border-hairline rounded-xl shadow-level-3">
                {children}
            </div>
        </div>
    );
}
