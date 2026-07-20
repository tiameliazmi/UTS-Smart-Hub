import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, totalEquipment, totalBookings, pendingCount, approvedCount, returnedCount, rejectedCount }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Overview</h2>
                        <p className="text-slate-500 mt-1">Welcome back, {auth.user.name}</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                
                {/* Stats Card 1 */}
                <div className="relative group rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Peralatan</p>
                            <h3 className="text-4xl font-display font-bold text-slate-800">{totalEquipment}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                    </div>
                    <div className="relative z-10 mt-4 flex items-center text-sm">
                        <span className="text-emerald-500 font-semibold flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12%
                        </span>
                        <span className="text-slate-400 ml-2">dari bulan lalu</span>
                    </div>
                </div>

                {/* Stats Card 2 */}
                <div className="relative group rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Peminjaman Aktif</p>
                            <h3 className="text-4xl font-display font-bold text-slate-800">{pendingCount}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        </div>
                    </div>
                    <div className="relative z-10 mt-4 flex items-center text-sm">
                        <span className="text-slate-500 font-semibold">
                            Menunggu persetujuan
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl shadow-slate-900/20 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-lg font-display font-semibold mb-4 text-white">Aksi Cepat</h3>
                        <div className="space-y-3">
                            <Link href={route('transactions.create')} className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl backdrop-blur-sm transition-colors group">
                                <span className="font-medium">Buat Peminjaman</span>
                                <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                            {auth.user.role === 'admin' && (
                                <Link href={route('master-data.index')} className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl backdrop-blur-sm transition-colors group">
                                    <span className="font-medium text-slate-300">Kelola Peralatan</span>
                                    <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        </AuthenticatedLayout>
    );
}
