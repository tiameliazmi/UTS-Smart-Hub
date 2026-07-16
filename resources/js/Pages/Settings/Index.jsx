import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Settings() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Settings</h2>
                    <p className="text-slate-500 mt-1">Pengaturan akun Anda</p>
                </div>
            }
        >
            <Head title="Settings" />

            <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <p className="text-slate-500 text-center py-8">Halaman settings dalam pengembangan</p>
            </div>
        </AuthenticatedLayout>
    );
}
