# Sidebar Navigation Design - Smart Hub Equipment

**Date**: 2026-07-16
**Status**: Approved
**Project**: UTS-Smart-hub - Sistem Peminjaman Peralatan

---

## Overview

Mengubah navigasi dari **floating navbar** (top navigation) menjadi **fixed sidebar** (sisi kiri) dengan gaya **glassmorphism** yang konsisten dengan design system existing.

---

## Requirements

1. **Sidebar Type**: Fixed/Always visible (desktop), collapsible (tablet), drawer (mobile)
2. **Navbar**: Dihapus total, semua navigasi di sidebar
3. **Menu Items**: Dashboard, Master Data (admin only), Transactions, Notifikasi, Settings, Help
4. **User Section**: Profile + Sign Out di bagian bawah sidebar
5. **Style**: Glassmorphism (blur, gradient, transparansi) - konsisten dengan desain existing

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  ┌─────────┐  ┌────────────────────────────────────┐ │
│  │         │  │                                    │ │
│  │ SIDEBAR │  │         CONTENT AREA               │ │
│  │ 280px   │  │                                    │ │
│  │         │  │                                    │ │
│  └─────────┘  └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Sidebar Behavior |
|------------|------------------|
| ≥1024px (Desktop) | Fixed, full width (280px) |
| 768px-1023px (Tablet) | Collapsible, icon-only (80px) |
| <768px (Mobile) | Hidden, drawer overlay (slide from left) |

---

## Sidebar Sections

### 1. Header Section (Top)

```
┌─────────────────────┐
│  [Logo]  Smart Hub  │
│          Equipment  │
└─────────────────────┘
```

**Styles:**
- Container: `px-6 py-5`
- Logo: `w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200`
- App Name: "Smart Hub" (`text-lg font-bold text-slate-800`), "Equipment" (`text-xs font-medium text-slate-500`)

### 2. Navigation Menu (Middle)

```
┌─────────────────────┐
│  📊 Dashboard       │
│  📦 Master Data     │  (Admin only)
│  📋 Transactions    │
│  🔔 Notifikasi      │
│  ⚙️ Settings        │
│  ❓ Help            │
└─────────────────────┘
```

**Menu Items:**

| Label | Route | Icon | Access |
|-------|-------|------|--------|
| Dashboard | `dashboard` | `LayoutDashboard` | All users |
| Master Data | `master-data.index` | `Package` | Admin only |
| Transactions | `transactions.index` | `FileText` | All users |
| Notifikasi | `notifications.index` | `Bell` | All users |
| Settings | `settings.index` | `Settings` | All users |
| Help | `help.index` | `HelpCircle` | All users |

**Styles:**
- Container: `px-3 py-2`
- Menu item: `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`
- Icon: `w-5 h-5` (20px)
- Label: `text-sm font-medium`
- Active state: `bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/50`
- Hover state: `bg-slate-100 text-slate-900`
- Default state: `text-slate-600`
- Spacing: `space-y-1` between items

### 3. User Profile Section (Bottom)

```
┌─────────────────────┐
│  ┌──┐  John Doe     │
│  └──┘  admin@email  │
│                     │
│  [👤 Profile]       │
│  [🚪 Sign Out]      │
└─────────────────────┘
```

**Styles:**
- Container: `px-3 py-4 border-t border-slate-200`
- Avatar: `w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 border border-indigo-200 flex items-center justify-center`
- User name: `text-sm font-semibold text-slate-800`
- User email: `text-xs font-medium text-slate-500`
- Profile link: `flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100`
- Sign Out: `flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50`

---

## Color Palette

| Element | Color/Style |
|---------|-------------|
| Sidebar background | `bg-white/70 backdrop-blur-xl border-r border-white/40` |
| Active menu | `bg-gradient-to-r from-indigo-500 to-purple-600 text-white` |
| Hover menu | `bg-slate-100` |
| Default text | `text-slate-600` |
| Active text | `text-white` |
| Hover text | `text-slate-900` |
| Divider | `border-t border-slate-200` |
| Logo background | `bg-gradient-to-br from-indigo-500 to-purple-600` |
| Avatar background | `bg-gradient-to-tr from-purple-100 to-indigo-100` |

---

## Content Area Changes

### Before (Current)
```jsx
<div className="min-h-screen bg-slate-50 font-sans">
    {/* Floating Navbar */}
    <div className="pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav>...</nav>
    </div>
    
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {children}
    </main>
</div>
```

### After (New)
```jsx
<div className="min-h-screen bg-slate-50 font-sans flex">
    {/* Sidebar */}
    <aside className="fixed inset-y-0 left-0 w-[280px] bg-white/70 backdrop-blur-xl border-r border-white/40 z-50">
        {/* Logo Section */}
        {/* Navigation Menu */}
        {/* User Profile */}
    </aside>
    
    {/* Content Area */}
    <main className="flex-1 ml-[280px] p-8">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
        </div>
    </main>
</div>
```

---

## Mobile Drawer Behavior

### Desktop (≥1024px)
- Sidebar fixed, always visible
- No hamburger menu needed

### Tablet (768px-1023px)
- Sidebar collapsed to icon-only (80px width)
- Toggle button in top-left to expand/collapse
- Content area: `ml-[80px]` when collapsed

### Mobile (<768px)
- Sidebar hidden by default
- Hamburger button in top-left corner
- Sidebar slides in from left as overlay
- Backdrop overlay when open
- Close on backdrop click or menu item click

---

## Files to Modify

1. **`resources/js/Layouts/AuthenticatedLayout.jsx`**
   - Remove floating navbar
   - Add sidebar component
   - Adjust content area layout
   - Add mobile drawer logic

2. **`resources/js/Components/Sidebar.jsx`** (NEW)
   - Sidebar component with all sections
   - Menu items with icons
   - User profile section
   - Mobile responsive behavior

3. **`resources/js/Components/SidebarMenuItem.jsx`** (NEW)
   - Individual menu item component
   - Active/hover states
   - Icon + label

4. **`resources/js/Pages/Dashboard.jsx`**
   - Minor layout adjustments if needed

5. **`resources/js/Pages/MasterData/Index.jsx`**
   - Minor layout adjustments if needed

6. **`resources/js/Pages/Transactions/Index.jsx`**
   - Minor layout adjustments if needed

7. **`resources/js/Pages/Transactions/Form.jsx`**
   - Minor layout adjustments if needed

8. **`resources/js/Pages/Profile/Edit.jsx`**
   - Minor layout adjustments if needed

---

## Icon Library

Menggunakan **Lucide React** untuk ikon:

```bash
npm install lucide-react
```

Icons yang digunakan:
- `LayoutDashboard` - Dashboard
- `Package` - Master Data
- `FileText` - Transactions
- `Bell` - Notifikasi
- `Settings` - Settings
- `HelpCircle` - Help
- `User` - Profile
- `LogOut` - Sign Out
- `Menu` - Hamburger menu (mobile)
- `X` - Close menu (mobile)
- `ChevronLeft` - Collapse sidebar
- `ChevronRight` - Expand sidebar

---

## Accessibility

- All menu items are focusable via keyboard
- Active state has sufficient color contrast
- Mobile drawer has focus trap
- ESC key closes mobile drawer
- ARIA labels for interactive elements

---

## Testing

1. **Desktop**: Sidebar visible, all menu items clickable, active states work
2. **Tablet**: Sidebar collapsible, toggle works, content adjusts
3. **Mobile**: Hamburger opens drawer, backdrop closes it, menu items work
4. **Role-based**: Master Data only visible for admin users
5. **Responsive**: All pages render correctly with sidebar layout

---

## Success Criteria

- [ ] Sidebar replaces floating navbar completely
- [ ] Glassmorphism style consistent with existing design
- [ ] All menu items functional with correct routes
- [ ] Admin-only menu (Master Data) properly hidden for regular users
- [ ] Mobile drawer works smoothly
- [ ] Content area properly offset by sidebar width
- [ ] User profile section displays correctly
- [ ] Sign Out functionality works
- [ ] All pages render correctly with new layout
