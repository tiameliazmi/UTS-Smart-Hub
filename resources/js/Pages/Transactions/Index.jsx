import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, transactions }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('');
    const isAdmin = auth.user.role === 'admin';

    const transactionList = Array.isArray(transactions) ? transactions : (transactions?.data || []);
    const filteredTransactions = transactionList.filter(
        t => !statusFilter || t.status === statusFilter
    );

    const handleApprove = (id) => {
        if (window.confirm('Setujui peminjaman ini?')) {
            const item = transactionList.find(t => t.id === id);
            router.put(`/transactions/${id}`, {
                borrow_date: item.borrow_date,
                return_date: item.return_date,
                status: 'approved',
            });
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Tolak peminjaman ini?')) {
            const item = transactionList.find(t => t.id === id);
            router.put(`/transactions/${id}`, {
                borrow_date: item.borrow_date,
                return_date: item.return_date,
                status: 'rejected',
            });
        }
    };

    const handleReturn = (id) => {
        if (window.confirm('Kembalikan peralatan ini?')) {
            const item = transactionList.find(t => t.id === id);
            router.put(`/transactions/${id}`, {
                borrow_date: item.borrow_date,
                return_date: item.return_date,
                status: 'returned',
            });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
            case 'returned':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-100';
            case 'approved':
                return 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-100';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200 shadow-red-100';
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'completed':
            case 'returned':
                return 'bg-emerald-500';
            case 'approved':
                return 'bg-blue-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-amber-500 animate-pulse';
        }
    };

    const statusLabels = {
        pending: 'Pending',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        returned: 'Dikembalikan',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Riwayat Peminjaman</h2>
                        <p className="text-slate-500 mt-1">Pantau seluruh transaksi peminjaman dan pengembalian peralatan.</p>
                    </div>
                    <Link 
                        href={route('transactions.create')}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Buat Peminjaman Baru
                    </Link>
                </div>
            }
        >
            <Head title="Transaksi Peminjaman" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {flash.error}
                </div>
            )}

            {/* Status Filter */}
            <div className="mt-6 flex items-center gap-4">
                <label className="text-sm font-medium text-slate-600">Filter Status:</label>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                    <option value="returned">Dikembalikan</option>
                </select>
            </div>

            <div className="mt-4 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Ref</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Peminjam</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Peralatan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durasi (Tgl)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                                            #{String(item.id).padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                                                    {(item.user?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{item.user?.name || `User #${item.user_id}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                            {item.equipment?.name || `Alat #${item.equipment_id}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getStatusStyle(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(item.status)}`}></span>
                                                {statusLabels[item.status] || item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex flex-col">
                                                <span><span className="text-slate-400 text-xs">Pinjam:</span> {item.borrow_date}</span>
                                                <span><span className="text-slate-400 text-xs">Kembali:</span> {item.return_date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {isAdmin && item.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="inline-flex items-center text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id)}
                                                            className="inline-flex items-center text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                                {isAdmin && item.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleReturn(item.id)}
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                                        Kembalikan
                                                    </button>
                                                )}
                                                <Link 
                                                    href={route('transactions.edit', item.id)} 
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                            </div>
                                            <p className="text-base font-medium text-slate-900">Belum ada riwayat transaksi</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
