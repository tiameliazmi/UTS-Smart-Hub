import { Link } from '@inertiajs/react';

export default function SidebarMenuItem({ href, active, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/50'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}