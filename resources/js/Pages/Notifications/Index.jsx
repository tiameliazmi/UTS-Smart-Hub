import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Notifications() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Notifikasi</h2>
                    <p className="text-slate-500 mt-1">Kelola notifikasi peminjaman Anda</p>
                </div>
            }
        >
            <Head title="Notifikasi" />

            <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <p className="text-slate-500 text-center py-8">Belum ada notifikasi</p>
            </div>
        </AuthenticatedLayout>
    );
}
