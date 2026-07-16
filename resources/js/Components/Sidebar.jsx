import ApplicationLogo from '@/Components/ApplicationLogo';
import SidebarMenuItem from '@/Components/SidebarMenuItem';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    FileText,
    Bell,
    Settings,
    HelpCircle,
    User,
    LogOut,
} from 'lucide-react';

export default function Sidebar({ onClose }) {
    const user = usePage().props.auth.user;

    const menuItems = [
        { href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard, label: 'Dashboard' },
        { href: route('master-data.index'), active: route().current('master-data.*'), icon: Package, label: 'Master Data', adminOnly: true },
        { href: route('transactions.index'), active: route().current('transactions.*'), icon: FileText, label: 'Transactions' },
        { href: route('notifications.index'), active: route().current('notifications.*'), icon: Bell, label: 'Notifikasi' },
        { href: route('settings.index'), active: route().current('settings.*'), icon: Settings, label: 'Settings' },
        { href: route('help.index'), active: route().current('help.*'), icon: HelpCircle, label: 'Help' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="px-6 py-5">
                <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <ApplicationLogo className="block h-5 w-auto fill-current text-white" />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-800">Smart Hub</div>
                        <div className="text-xs font-medium text-slate-500">Equipment</div>
                    </div>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {menuItems
                    .filter((item) => !item.adminOnly || user.role === 'admin')
                    .map((item) => (
                        <SidebarMenuItem
                            key={item.href}
                            href={item.href}
                            active={item.active}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
            </nav>

            {/* User Profile Section */}
            <div className="px-3 py-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 border border-indigo-200 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold text-xs">
                            {user.name.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
                        <div className="text-xs font-medium text-slate-500 truncate">{user.email}</div>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
