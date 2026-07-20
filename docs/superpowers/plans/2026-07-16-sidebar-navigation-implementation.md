# Sidebar Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating navbar with a fixed glassmorphism sidebar navigation for the Equipment Borrowing Management System.

**Architecture:** Create a new Sidebar component with logo, navigation menu, and user profile sections. Update AuthenticatedLayout to use sidebar layout with proper content offset. Add lucide-react for icons.

**Tech Stack:** React 18.2, Tailwind CSS 3.2, Inertia.js, Lucide React (new dependency)

## Global Constraints

- Laravel 13.8 with Inertia.js v2
- React 18.2 (JSX, not TypeScript)
- Tailwind CSS 3.2 with @tailwindcss/forms plugin
- Glassmorphism design: `bg-white/70 backdrop-blur-xl border border-white/40`
- Gradient colors: `from-indigo-500 to-purple-600`
- Fonts: Inter (sans), Outfit (display)
- Role-based access: `user.role === 'admin'` for Master Data

---

### Task 1: Install Lucide React Icons

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto-generated)

**Interfaces:**
- Consumes: None
- Produces: `lucide-react` package available for import

- [ ] **Step 1: Install lucide-react package**

Run: `npm install lucide-react`

Expected: Package installed successfully, package-lock.json updated

- [ ] **Step 2: Verify installation**

Run: `npm list lucide-react`

Expected: `lucide-react@0.xxx.x` listed in dependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add lucide-react for sidebar icons"
```

---

### Task 2: Create SidebarMenuItem Component

**Files:**
- Create: `resources/js/Components/SidebarMenuItem.jsx`

**Interfaces:**
- Consumes: None
- Produces: `SidebarMenuItem` component (used by Sidebar)

- [ ] **Step 1: Create SidebarMenuItem component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/Components/SidebarMenuItem.jsx
git commit -m "feat: add SidebarMenuItem component"
```

---

### Task 3: Create Sidebar Component

**Files:**
- Create: `resources/js/Components/Sidebar.jsx`

**Interfaces:**
- Consumes: `SidebarMenuItem` component, `usePage().props.auth.user`
- Produces: `Sidebar` component (used by AuthenticatedLayout)

- [ ] **Step 1: Create Sidebar component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/Components/Sidebar.jsx
git commit -m "feat: add Sidebar component with glassmorphism design"
```

---

### Task 4: Update AuthenticatedLayout to Use Sidebar

**Files:**
- Modify: `resources/js/Layouts/AuthenticatedLayout.jsx`

**Interfaces:**
- Consumes: `Sidebar` component
- Produces: Updated layout with sidebar instead of navbar

- [ ] **Step 1: Update AuthenticatedLayout**

Replace the entire file content with:

```jsx
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white/70 backdrop-blur-xl border-r border-white/40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-[280px]">
                {/* Mobile Header with Hamburger */}
                <div className="lg:hidden sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/40 px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-500"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Header (optional) */}
                {header && (
                    <header className="px-4 sm:px-6 lg:px-8 mt-8 mb-4">
                        {header}
                    </header>
                )}

                {/* Page Content */}
                <main className="px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/Layouts/AuthenticatedLayout.jsx
git commit -m "feat: replace navbar with sidebar layout"
```

---

### Task 5: Create Stub Routes for New Menu Items

**Files:**
- Modify: `routes/web.php`
- Create: `resources/js/Pages/Notifications/Index.jsx`
- Create: `resources/js/Pages/Settings/Index.jsx`
- Create: `resources/js/Pages/Help/Index.jsx`

**Interfaces:**
- Consumes: None
- Produces: Working routes for Notifikasi, Settings, Help pages

- [ ] **Step 1: Add routes to web.php**

Add these routes after the existing transaction routes:

```php
// Notifications
Route::get('/notifications', function () {
    return Inertia::render('Notifications/Index');
})->name('notifications.index');

// Settings
Route::get('/settings', function () {
    return Inertia::render('Settings/Index');
})->name('settings.index');

// Help
Route::get('/help', function () {
    return Inertia::render('Help/Index');
})->name('help.index');
```

- [ ] **Step 2: Create Notifications page**

```jsx
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
```

- [ ] **Step 3: Create Settings page**

```jsx
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
```

- [ ] **Step 4: Create Help page**

```jsx
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
```

- [ ] **Step 5: Commit**

```bash
git add routes/web.php resources/js/Pages/Notifications/Index.jsx resources/js/Pages/Settings/Index.jsx resources/js/Pages/Help/Index.jsx
git commit -m "feat: add notifications, settings, and help pages"
```

---

### Task 6: Test Sidebar Navigation

**Files:**
- None (testing only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Verified working sidebar

- [ ] **Step 1: Start development server**

Run: `npm run dev`

Expected: Vite dev server starts without errors

- [ ] **Step 2: Test desktop view**

1. Open browser to http://localhost:5173
2. Login with test credentials
3. Verify sidebar is visible on left side
4. Verify all menu items are clickable
5. Verify active state highlighting works
6. Verify user profile section displays correctly

- [ ] **Step 3: Test mobile view**

1. Open browser DevTools, switch to mobile view (<768px)
2. Verify sidebar is hidden by default
3. Click hamburger menu icon
4. Verify sidebar slides in from left
5. Click a menu item, verify sidebar closes
6. Click backdrop overlay, verify sidebar closes

- [ ] **Step 4: Test admin visibility**

1. Login as admin user
2. Verify "Master Data" menu item is visible
3. Login as regular user
4. Verify "Master Data" menu item is hidden

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete sidebar navigation implementation"
```

---

### Task 7: Build for Production

**Files:**
- Modify: `public/build/` (auto-generated)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Production-ready build

- [ ] **Step 1: Run production build**

Run: `npm run build`

Expected: Build completes without errors, assets in public/build/

- [ ] **Step 2: Verify build output**

Check that `public/build/manifest.json` exists and contains the compiled assets.

- [ ] **Step 3: Commit build artifacts**

```bash
git add public/build/
git commit -m "chore: build production assets"
```
