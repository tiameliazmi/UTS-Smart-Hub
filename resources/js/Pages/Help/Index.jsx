import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Help() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Help</h2>
                    <p className="text-slate-500 mt-1">Bantuan penggunaan sistem</p>
                </div>
            }
        >
            <Head title="Help" />

            <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Cara Meminjam Peralatan</h3>
                        <p className="text-slate-600">1. Buka menu Transactions<br />2. Klik "Buat Peminjaman"<br />3. Isi form dan kirim</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Status Peminjaman</h3>
                        <p className="text-slate-600">• Pending: Menunggu persetujuan admin<br />• Approved: Peminjaman disetujui<br />• Rejected: Peminjaman ditolak<br />• Returned: Peralatan sudah dikembalikan</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
