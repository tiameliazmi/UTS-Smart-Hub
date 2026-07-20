import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Form({ auth, transaction, masterData }) {
    const isEditing = !!transaction;

    const { data, setData, post, put, processing, errors } = useForm({
        equipment_id: transaction?.equipment_id || '',
        borrow_date: transaction?.borrow_date || '',
        return_date: transaction?.return_date || '',
        status: transaction?.status || 'pending',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (new Date(data.return_date) < new Date(data.borrow_date)) {
            alert("Tanggal pengembalian tidak boleh lebih awal dari tanggal pinjam");
            return;
        }

        if (isEditing) {
            put(route('transactions.update', transaction.id));
        } else {
            post(route('transactions.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('transactions.index')} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">
                            {isEditing ? 'Proses Transaksi' : 'Peminjaman Baru'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {isEditing ? 'Perbarui status dan detail peminjaman.' : 'Silakan isi formulir peminjaman peralatan di bawah ini.'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'} />

            <div className="mt-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                    {/* Decorative Header */}
                    <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl transform translate-y-1/2 -translate-x-1/4"></div>
                    </div>

                    <div className="p-8 relative -mt-16 bg-white mx-6 mb-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-50">
                        {errors.equipment_id && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{errors.equipment_id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Peralatan yang Dipinjam</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-3 px-4 shadow-sm"
                                    value={data.equipment_id}
                                    onChange={(e) => setData('equipment_id', e.target.value)}
                                    required
                                    disabled={isEditing}
                                >
                                    <option value="" disabled>-- Pilih Peralatan --</option>
                                    {masterData && masterData.map((item) => (
                                        <option key={item.id} value={item.id} disabled={item.stock < 1}>
                                            {item.name} - (Tersedia: {item.stock} Unit) {item.stock < 1 ? '[HABIS]' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700">Tanggal Mulai Pinjam</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-3 px-4 shadow-sm"
                                        value={data.borrow_date}
                                        onChange={(e) => setData('borrow_date', e.target.value)}
                                        required
                                    />
                                    {errors.borrow_date && <p className="text-red-500 text-xs mt-1">{errors.borrow_date}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700">Rencana Pengembalian</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-3 px-4 shadow-sm"
                                        value={data.return_date}
                                        onChange={(e) => setData('return_date', e.target.value)}
                                        required
                                    />
                                    {errors.return_date && <p className="text-red-500 text-xs mt-1">{errors.return_date}</p>}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="space-y-1.5 pt-2 border-t border-slate-100 mt-6">
                                    <label className="block text-sm font-semibold text-slate-700">Update Status Transaksi</label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {['pending', 'approved', 'returned', 'rejected'].map((statusOption) => (
                                            <label 
                                                key={statusOption} 
                                                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                    data.status === statusOption 
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                                    : 'border-slate-100 hover:border-slate-300 bg-white text-slate-600'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={statusOption}
                                                    checked={data.status === statusOption}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <span className="font-semibold capitalize">{statusOption}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                <Link 
                                    href={route('transactions.index')}
                                    className="px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors focus:ring-2 focus:ring-slate-200"
                                >
                                    Batalkan
                                </Link>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Transaksi Peminjaman')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
