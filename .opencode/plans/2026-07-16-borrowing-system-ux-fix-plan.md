# Quick Fix Sistem Peminjaman UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical bugs and UX issues in the borrowing system including dead routes, missing enum values, equipment status updates, flash messages, status filtering, and real dashboard data.

**Architecture:** Minimal changes to existing files — add migration for enum, activate dead routes, add equipment status logic to TransactionController, update frontend components for better UX.

**Tech Stack:** Laravel 11, Inertia.js (React), MySQL, Tailwind CSS

## Global Constraints

- PHP 8.2+
- Laravel 11.x
- MySQL/MariaDB
- Inertia.js with React
- Tailwind CSS
- Follow existing code patterns (Indonesian language for UI)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `database/migrations/xxxx_add_rejected_to_bookings_status.php` | Add `rejected` to booking status enum |
| `routes/web.php` | Add checkin route |
| `app/Http/Controllers/TransactionController.php` | Equipment status + stock update on status change |
| `app/Http/Controllers/DashboardController.php` | Send real data to Inertia |
| `app/Models/Booking.php` | Add checkin() relationship |
| `resources/js/Pages/Transactions/Index.jsx` | Flash messages, status filter, action buttons, confirmation |
| `resources/js/Pages/Dashboard.jsx` | Use real data from props |
| `resources/js/Pages/MasterData/Edit.jsx` | Condition dropdown |

---

### Task 1: Database Migration — Add `rejected` to Enum

**Files:**
- Create: `database/migrations/2026_07_16_130000_add_rejected_to_bookings_status.php`

- [ ] **Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'returned'])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'returned'])->default('pending')->change();
        });
    }
};
```

- [ ] **Step 2: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

- [ ] **Step 3: Commit**

```bash
git add database/migrations/2026_07_16_130000_add_rejected_to_bookings_status.php
git commit -m "feat: add rejected status to bookings enum"
```

---

### Task 2: Add Checkin Relationship to Booking Model

**Files:**
- Modify: `app/Models/Booking.php`

- [ ] **Step 1: Read current Booking model**

Read `app/Models/Booking.php` to understand current structure.

- [ ] **Step 2: Add checkin() relationship**

Add after the equipment() relationship:

```php
public function checkin()
{
    return $this->hasOne(\App\Models\Checkin::class);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/Models/Booking.php
git commit -m "feat: add checkin relationship to Booking model"
```

---

### Task 3: Add Checkin Route

**Files:**
- Modify: `routes/web.php`

- [ ] **Step 1: Read current routes**

Read `routes/web.php` to find the correct location.

- [ ] **Step 2: Add checkin route**

Add inside the auth middleware group, after the transactions routes:

```php
Route::post('/bookings/{id}/checkin', [\App\Http\Controllers\CheckinController::class, 'checkin'])
    ->name('bookings.checkin')
    ->middleware('auth');
```

- [ ] **Step 3: Commit**

```bash
git add routes/web.php
git commit -m "feat: add checkin route for bookings"
```

---

### Task 4: TransactionController — Equipment Status Update

**Files:**
- Modify: `app/Http/Controllers/TransactionController.php`

- [ ] **Step 1: Read current TransactionController**

Read `app/Http/Controllers/TransactionController.php` to understand the update method.

- [ ] **Step 2: Add Equipment model import**

Add at the top of the file:

```php
use App\Models\Equipment;
```

- [ ] **Step 3: Modify update method**

Replace the status update logic in the `update` method. Find the section that updates booking status and add equipment logic:

```php
public function update(Request $request, $id)
{
    $booking = Booking::findOrFail($id);

    // Only admin can update
    if (Auth::user()->role !== 'admin') {
        return redirect()->route('transactions.index')->with('error', 'Unauthorized');
    }

    $validated = $request->validate([
        'borrow_date' => 'required|date',
        'return_date' => 'required|date|after_or_equal:borrow_date',
        'status' => 'required|in:pending,approved,rejected,returned',
    ]);

    $oldStatus = $booking->status;
    $newStatus = $validated['status'];

    $booking->update($validated);

    // Update equipment status based on booking status change
    if ($oldStatus !== $newStatus) {
        $equipment = Equipment::find($booking->equipment_id);

        if ($equipment) {
            if ($newStatus === 'approved' && $oldStatus !== 'approved') {
                // Approving: mark equipment as borrowed, reduce stock
                $equipment->update([
                    'status' => 'borrowed',
                    'stock' => max(0, $equipment->stock - 1),
                ]);
            } elseif ($newStatus === 'returned' && $oldStatus === 'approved') {
                // Returning: mark equipment as available, increase stock
                $equipment->update([
                    'status' => 'available',
                    'stock' => $equipment->stock + 1,
                ]);
            }
            // rejected: no equipment change needed
        }
    }

    return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil diperbarui');
}
```

- [ ] **Step 4: Commit**

```bash
git add app/Http/Controllers/TransactionController.php
git commit -m "feat: add equipment status update on booking status change"
```

---

### Task 5: DashboardController — Send Real Data

**Files:**
- Modify: `app/Http/Controllers/DashboardController.php`

- [ ] **Step 1: Read current DashboardController**

Read `app/Http/Controllers/DashboardController.php`.

- [ ] **Step 2: Modify index method**

Replace the index method to use Inertia:

```php
public function index()
{
    $totalEquipment = Equipment::count();
    $totalBookings = Booking::count();
    $pendingCount = Booking::where('status', 'pending')->count();
    $approvedCount = Booking::where('status', 'approved')->count();
    $returnedCount = Booking::where('status', 'returned')->count();
    $rejectedCount = Booking::where('status', 'rejected')->count();

    return inertia('Dashboard', [
        'totalEquipment' => $totalEquipment,
        'totalBookings' => $totalBookings,
        'pendingCount' => $pendingCount,
        'approvedCount' => $approvedCount,
        'returnedCount' => $returnedCount,
        'rejectedCount' => $rejectedCount,
    ]);
}
```

- [ ] **Step 3: Add imports**

Add at the top if not present:

```php
use App\Models\Equipment;
use App\Models\Booking;
use Inertia\Inertia;
```

- [ ] **Step 4: Commit**

```bash
git add app/Http/Controllers/DashboardController.php
git commit -m "feat: dashboard shows real data from database"
```

---

### Task 6: Dashboard.jsx — Use Real Data

**Files:**
- Modify: `resources/js/Pages/Dashboard.jsx`

- [ ] **Step 1: Read current Dashboard.jsx**

Read `resources/js/Pages/Dashboard.jsx` to understand current structure.

- [ ] **Step 2: Update component to use props**

Replace the hardcoded stats with real data from props. The component should receive props and use them:

```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, totalEquipment, totalBookings, pendingCount, approvedCount, returnedCount, rejectedCount }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Selamat datang, {auth.user.name}!</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{totalEquipment}</div>
                                    <div className="text-sm text-gray-600">Total Peralatan</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                                    <div className="text-sm text-gray-600">Menunggu Persetujuan</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                                    <div className="text-sm text-gray-600">Sedang Dipinjam</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-600">{returnedCount}</div>
                                    <div className="text-sm text-gray-600">Sudah Dikembalikan</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Dashboard.jsx
git commit -m "feat: dashboard displays real booking statistics"
```

---

### Task 7: Transactions/Index.jsx — Flash Messages + Status Filter + Action Buttons

**Files:**
- Modify: `resources/js/Pages/Transactions/Index.jsx`

- [ ] **Step 1: Read current Transactions/Index.jsx**

Read `resources/js/Pages/Transactions/Index.jsx` to understand current structure.

- [ ] **Step 2: Update component with flash messages, filter, and action buttons**

Replace the full component with:

```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Transactions({ auth, transactions }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('');
    const isAdmin = auth.user.role === 'admin';

    const filteredTransactions = transactions.data.filter(
        t => !statusFilter || t.status === statusFilter
    );

    const handleApprove = (id) => {
        if (window.confirm('Setujui peminjaman ini?')) {
            router.put(`/transactions/${id}`, {
                ...transactions.data.find(t => t.id === id),
                status: 'approved',
            });
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Tolak peminjaman ini?')) {
            router.put(`/transactions/${id}`, {
                ...transactions.data.find(t => t.id === id),
                status: 'rejected',
            });
        }
    };

    const handleReturn = (id) => {
        if (window.confirm('Kembalikan peralatan ini?')) {
            router.put(`/transactions/${id}`, {
                ...transactions.data.find(t => t.id === id),
                status: 'returned',
            });
        }
    };

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            returned: 'bg-gray-100 text-gray-800',
        };
        const labels = {
            pending: 'Pending',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            returned: 'Dikembalikan',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transaksi</h2>}
        >
            <Head title="Transaksi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Daftar Peminjaman</h3>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        className="border rounded px-3 py-2 text-sm"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Disetujui</option>
                                        <option value="rejected">Ditolak</option>
                                        <option value="returned">Dikembalikan</option>
                                    </select>
                                    <a
                                        href={route('transactions.create')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                    >
                                        Buat Peminjaman Baru
                                    </a>
                                </div>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peralatan</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #TRX-{String(transaction.id).padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.user?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.equipment?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.borrow_date} s/d {transaction.return_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {statusBadge(transaction.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {isAdmin && transaction.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(transaction.id)}
                                                                className="text-green-600 hover:text-green-900 font-semibold"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(transaction.id)}
                                                                className="text-red-600 hover:text-red-900 font-semibold"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {isAdmin && transaction.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleReturn(transaction.id)}
                                                            className="text-blue-600 hover:text-blue-900 font-semibold"
                                                        >
                                                            Kembalikan
                                                        </button>
                                                    )}
                                                    <a
                                                        href={route('transactions.edit', transaction.id)}
                                                        className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                                                    >
                                                        Edit
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada transaksi ditemukan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Transactions/Index.jsx
git commit -m "feat: add flash messages, status filter, and action buttons to transactions"
```

---

### Task 8: MasterData — Condition Dropdown

**Files:**
- Modify: `resources/js/Pages/MasterData/Edit.jsx` (or the form component)

- [ ] **Step 1: Read current MasterData form**

Read the MasterData form file to find the condition input field.

- [ ] **Step 2: Replace condition text input with dropdown**

Find the condition input field and replace:

```jsx
{/* Before: */}
<input
    type="text"
    name="condition"
    value={data.condition}
    onChange={handleChange}
    className="mt-1 block w-full"
/>

{/* After: */}
<select
    name="condition"
    value={data.condition}
    onChange={handleChange}
    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
>
    <option value="baik">Baik</option>
    <option value="rusak">Rusak</option>
</select>
```

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/MasterData/
git commit -m "feat: change condition field to dropdown in master data"
```

---

### Task 9: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Run migration**

Run: `php artisan migrate`
Expected: Migration completes successfully

- [ ] **Step 2: Test booking flow**

1. Login as user
2. Create new booking → status should be `pending`
3. Login as admin
4. Go to transactions → click "Setujui" → confirm
5. Verify booking status changes to `approved`
6. Verify equipment status changes to `borrowed`
7. Verify equipment stock decreases by 1

- [ ] **Step 3: Test return flow**

1. On approved booking → click "Kembalikan" → confirm
2. Verify booking status changes to `returned`
3. Verify equipment status changes to `available`
4. Verify equipment stock increases by 1

- [ ] **Step 4: Test rejection flow**

1. Create another booking
2. As admin → click "Tolak" → confirm
3. Verify booking status changes to `rejected`
4. Verify equipment status unchanged

- [ ] **Step 5: Test flash messages**

1. Perform any action → verify success message appears
2. Verify message disappears after page reload

- [ ] **Step 6: Test status filter**

1. Go to transactions page
2. Use filter dropdown → verify filtering works correctly

- [ ] **Step 7: Test dashboard**

1. Go to dashboard
2. Verify real numbers are displayed (not hardcoded)

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: complete borrowing system UX fixes"
```
