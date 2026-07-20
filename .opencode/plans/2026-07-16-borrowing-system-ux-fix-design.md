# Design Spec: Quick Fix Sistem Peminjaman UX

**Tanggal:** 2026-07-16
**Pendekatan:** Quick Fix (Minimal Changes)

## Problem Statement

Sistem peminjaman memiliki beberapa bug kritis dan UX issues yang menghambat penggunaan:
- CheckinController tidak ter-route (dead code)
- Status `rejected` ada di UI tapi tidak ada di DB enum
- Equipment status tidak pernah diupdate saat approve/return
- Stock tidak pernah berubah
- Dashboard menampilkan data hardcode
- Flash messages tidak ditampilkan
- Tidak ada filter status di transaksi
- Condition field di master data bukan dropdown

## Changes

### 1. Database Migration — Tambah `rejected` ke Enum

**File:** `database/migrations/xxxx_add_rejected_to_bookings_status.php`

Ubah enum dari `['pending', 'approved', 'returned']` menjadi `['pending', 'approved', 'rejected', 'returned']`.

### 2. Route — Aktifkan CheckinController

**File:** `routes/web.php`

Tambah route: `POST /bookings/{id}/checkin` → `CheckinController@checkin` dengan middleware auth + admin.

### 3. TransactionController — Equipment Status Update

**File:** `app/Http/Controllers/TransactionController.php`

Modifikasi method `update`:
- **Saat status → approved:** set equipment status = `borrowed`, kurangi stock -1
- **Saat status → returned:** set equipment status = `available`, tambah stock +1
- **Saat status → rejected:** tidak perubahan equipment

### 4. Booking Model — Tambah Relationship

**File:** `app/Models/Booking.php`

Tambah `hasOne(Checkin::class)` relationship.

### 5. Frontend — Flash Messages

**File:** `resources/js/Pages/Transactions/Index.jsx`

Tampilkan `flash.success` dari `usePage().props` sebagai alert hijau.

### 6. Frontend — Status Filter

**File:** `resources/js/Pages/Transactions/Index.jsx`

Tambah dropdown filter: Semua / Pending / Disetujui / Ditolak / Dikembalikan.

### 7. Frontend — Dashboard Real Data

**File:** `resources/js/Pages/Dashboard.jsx` + `app/Http/Controllers/DashboardController.php`

Kirim data real: totalEquipment, totalBookings, pendingCount, approvedCount, returnedCount.

### 8. Frontend — Reject/Approve/Return Buttons

**File:** `resources/js/Pages/Transactions/Index.jsx`

Tombol aksi langsung untuk admin: Setujui, Tolak, Kembalikan.

### 9. Frontend — Confirmation Dialog

Gunakan `window.confirm()` sebelum aksi approve/reject/return.

### 10. Validasi — Condition Field

**File:** `resources/js/Pages/MasterData/*.jsx`

Ganti free text input jadi dropdown `baik`/`rusak`.

## Files to Modify

| File | Change |
|------|--------|
| `database/migrations/xxxx_add_rejected_to_bookings_status.php` | New migration |
| `routes/web.php` | Add checkin route |
| `app/Http/Controllers/TransactionController.php` | Equipment status update |
| `app/Http/Controllers/DashboardController.php` | Send real data |
| `app/Models/Booking.php` | Add checkin relationship |
| `resources/js/Pages/Transactions/Index.jsx` | Flash, filter, buttons, confirm |
| `resources/js/Pages/Dashboard.jsx` | Real data props |
| `resources/js/Pages/MasterData/*.jsx` | Condition dropdown |

## Verification

1. `php artisan migrate`
2. Test booking flow: create → approve → return
3. Test rejection flow
4. Verify equipment status + stock updates
5. Verify dashboard real numbers
6. Verify flash messages
7. Verify status filter
