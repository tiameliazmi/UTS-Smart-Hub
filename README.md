# Smart Hub Equipment Management System

Sistem Peminjaman Peralatan berbasis web yang dibangun dengan Laravel, React, dan Inertia.js. Dirancang untuk mengelola inventaris peralatan dan transaksi peminjaman di lingkungan universitas.

---

## Fitur Utama

### Untuk Semua Pengguna
- **Dashboard** - Ringkasan statistik peralatan dan peminjaman
- **Transaksi** - Buat, lihat, dan lacak status peminjaman peralatan
- **Notifikasi** - Notifikasi terkait peminjaman
- **Profil** - Kelola informasi profil dan kata sandi

### Untuk Admin
- **Master Data** - Kelola inventaris peralatan (kode, nama, stok, kondisi)
- **Persetujuan** - Setujui atau tolak permintaan peminjaman
- **Pengembalian** - Proses pengembalian peralatan

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Laravel 13.8, PHP 8.3+ |
| **Frontend** | React 18.2, Inertia.js v2 |
| **Styling** | Tailwind CSS 3.2 |
| **Build** | Vite 8 |
| **Database** | MySQL |
| **Auth** | Laravel Breeze, Sanctum |
| **Icons** | Lucide React |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  REACT (VITE)                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │   Sidebar     │  │   Pages      │  │Components│  │    │
│  │  │  Navigation   │  │  Dashboard   │  │  Shared  │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                    Inertia.js (SPA)                          │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    LARAVEL SERVER                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   ROUTES                             │    │
│  │  web.php  │  auth.php  │  api.php                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               MIDDLEWARE                             │    │
│  │  auth  │  admin  │  handle-inertia                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             CONTROLLERS                              │    │
│  │  Dashboard  │  MasterData  │  Transaction  │  API   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               MODELS                                 │    │
│  │  User  │  Equipment  │  Booking  │  Checkin          │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               DATABASE                               │    │
│  │  users  │  equipments  │  bookings  │  checkins      │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────┐       ┌─────────────────┐
│      users       │       │    equipments    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ code (UNIQUE)   │
│ email (UNIQUE)  │       │ name            │
│ password        │       │ stock           │
│ role            │       │ condition       │
│ email_verified  │       │ status          │
│ remember_token  │       │ timestamps      │
│ timestamps      │       └────────┬────────┘
└────────┬────────┘                │
         │                         │
         │    ┌─────────────────┐  │
         │    │    bookings      │  │
         │    ├─────────────────┤  │
         │    │ id (PK)         │  │
         ├────│ user_id (FK)    │  │
         │    │ equipment_id(FK)│──┘
         │    │ borrow_date     │
         │    │ return_date     │
         │    │ status          │
         │    │ timestamps      │
         │    └────────┬────────┘
         │             │
         │    ┌────────┴────────┐
         │    │    checkins      │
         │    ├─────────────────┤
         │    │ id (PK)         │
         │    │ booking_id (FK) │
         │    │ checkin_time    │
         │    │ note            │
         │    │ timestamps      │
         │    └─────────────────┘
         │
         │    ┌─────────────────┐
         │    │personal_access  │
         │    │    tokens       │
         │    ├─────────────────┤
         └────│ id (PK)         │
              │ tokenable_type  │
              │ tokenable_id    │
              │ name            │
              │ token           │
              │ abilities       │
              │ timestamps      │
              └─────────────────┘
```

---

## Alur Sistem

### 1. Alur Autentikasi

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────>│  Validasi │────>│  Session  │────>│ Dashboard│
│  Page    │     │  Credentials│   │  Created  │     │  Loaded  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      │                                  │
      │                                  v
      │                           ┌──────────┐
      └──────────────────────────>│ Register │
                                  │  Page    │
                                  └──────────┘
```

**Detail Alur Login:**
1. User mengakses halaman login
2. Memasukkan email dan password
3. Sistem memvalidasi credentials di database
4. Jika valid, session dibuat dan user diarahkan ke dashboard
5. Jika tidak valid, error message ditampilkan

### 2. Alur Peminjaman Peralatan

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────>│  Buat    │────>│  Admin   │────>│  Status  │
│  Login   │     │  Request │     │ Review   │     │  Update  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                     │                  │
                     │                  v
                     │           ┌──────────┐
                     │           │ Approve/ │
                     │           │ Reject   │
                     │           └──────────┘
                     v                  │
              ┌──────────┐              v
              │  Pending │       ┌──────────┐
              │  Status  │       │  Approved │
              └──────────┘       │  Status   │
                                 └──────────┘
                                      │
                                      v
                               ┌──────────┐
                               │  Stok    │
                               │  Berkurang│
                               └──────────┘
```

**Detail Alur Peminjaman:**

1. **User Membuat Request**
   - User login ke sistem
   - Membuka menu Transactions
   - Klik "Buat Peminjaman"
   - Memilih peralatan, tanggal pinjam, tanggal kembali
   - Submit form

2. **Status: Pending**
   - Request masuk ke database dengan status `pending`
   - Stok peralatan belum berubah
   - Menunggu persetujuan admin

3. **Admin Review**
   - Admin membuka menu Transactions
   - Melihat daftar request dengan status pending
   - Memilih untuk Approve atau Reject

4. **Jika Disetujui (Approved)**
   - Status berubah menjadi `approved`
   - Stok peralatan berkurang sesuai jumlah peminjaman
   - User mendapat notifikasi persetujuan

5. **Jika Ditolak (Rejected)**
   - Status berubah menjadi `rejected`
   - Stok tidak berubah
   - User mendapat notifikasi penolakan

### 3. Alur Pengembalian Peralatan

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────>│  Proses  │────>│  Checkin │────>│  Status  │
│  Klik    │     │  Return  │     │  Created │     │  Update  │
│  Return  │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                     │                                    │
                     v                                    v
              ┌──────────┐                         ┌──────────┐
              │  Stok    │                         │ Returned │
              │  Bertambah│                         │  Status  │
              └──────────┘                         └──────────┘
```

**Detail Alur Pengembalian:**

1. **Admin Memproses Pengembalian**
   - Admin membuka menu Transactions
   - Mencari peminjaman dengan status `approved`
   - Klik tombol "Return"

2. **Proses Checkin**
   - Record checkin dibuat dengan timestamp
   - Catatan (note) dapat ditambahkan

3. **Status Update**
   - Status peminjaman berubah menjadi `returned`
   - Stok peralatan bertambah sesuai jumlah peminjaman
   - Peminjaman selesai

### 4. Alur Manajemen Peralatan (Admin Only)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────>│  Master  │────>│  CRUD    │────>│  Database│
│  Login   │     │  Data    │     │  Operasi │     │  Update  │
└──────────┘     │  Menu    │     │          │     └──────────┘
                 └──────────┘     └──────────┘
```

**Operasi CRUD:**
- **Create**: Tambah peralatan baru (kode, nama, stok, kondisi)
- **Read**: Lihat daftar peralatan dan detail
- **Update**: Edit informasi peralatan
- **Delete**: Hapus peralatan dari sistem

### 5. Alur Role-Based Access

```
┌─────────────────────────────────────────────────────────────┐
│                     USER LOGIN                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            v
                    ┌───────────────┐
                    │  Cek Role     │
                    │  User         │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              v                           v
      ┌───────────────┐           ┌───────────────┐
      │  Role: Admin  │           │  Role: User   │
      └───────┬───────┘           └───────┬───────┘
              │                           │
              v                           v
      ┌───────────────┐           ┌───────────────┐
      │ Dashboard     │           │ Dashboard     │
      │ Master Data   │           │ Transactions  │
      │ Transactions  │           │ Notifikasi    │
      │ Notifikasi    │           │ Settings      │
      │ Settings      │           │ Help          │
      │ Help          │           │ Profile       │
      └───────────────┘           └───────────────┘
```

---

## Instalasi

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- npm
- MySQL

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/your-repo/UTS-Smart-hub.git
cd UTS-Smart-hub
```

2. **Install Dependencies PHP**
```bash
composer install
```

3. **Install Dependencies JavaScript**
```bash
npm install
```

4. **Konfigurasi Environment**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Konfigurasi Database**
`.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=uts_smart_hub
DB_USERNAME=root
DB_PASSWORD=
```

6. **Jalankan Migration**
```bash
php artisan migrate
```

7. **Jalankan Seeder (Optional)**
```bash
php artisan db:seed
```

8. **Build Assets**
```bash
npm run build
```

9. **Jalankan Server**
```bash
php artisan serve
```

10. **Akses Aplikasi**
Buka browser: `http://localhost:8000`

---

## API Documentation

### Authentication API

#### Register
```
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password"
}
```

### Equipment API

#### Get All Equipment
```
GET /api/equipments
Authorization: Bearer {token}
```

#### Create Equipment (Admin)
```
POST /api/equipments
Authorization: Bearer {token}
Content-Type: application/json

{
    "code": "EQ001",
    "name": "Laptop",
    "stock": 10,
    "condition": "baik"
}
```

#### Update Equipment (Admin)
```
PUT /api/equipments/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "stock": 8
}
```

#### Delete Equipment (Admin)
```
DELETE /api/equipments/{id}
Authorization: Bearer {token}
```

### Booking API

#### Get All Bookings
```
GET /api/bookings
Authorization: Bearer {token}
```

#### Create Booking
```
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
    "equipment_id": 1,
    "borrow_date": "2026-07-20",
    "return_date": "2026-07-25"
}
```

#### Update Booking Status (Admin)
```
PUT /api/bookings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "approved"
}
```

---

## Struktur Project

```
UTS-Smart-hub/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php
│   │   │   ├── MasterDataController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── CheckinController.php
│   │   │   ├── ProfileController.php
│   │   │   └── API/
│   │   │       ├── AuthController.php
│   │   │       ├── EquipmentController.php
│   │   │       └── BookingController.php
│   │   └── Middleware/
│   │       ├── AdminMiddleware.php
│   │       └── HandleInertiaRequests.php
│   └── Models/
│       ├── User.php
│       ├── Equipment.php
│       ├── Booking.php
│       └── Checkin.php
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_equipment_table.php
│   │   ├── create_bookings_table.php
│   │   └── create_checkins_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── resources/
│   └── js/
│       ├── Components/
│       │   ├── Sidebar.jsx
│       │   ├── SidebarMenuItem.jsx
│       │   └── ... (other components)
│       ├── Layouts/
│       │   ├── AuthenticatedLayout.jsx
│       │   └── GuestLayout.jsx
│       └── Pages/
│           ├── Dashboard.jsx
│           ├── MasterData/
│           │   └── Index.jsx
│           ├── Transactions/
│           │   ├── Index.jsx
│           │   └── Form.jsx
│           ├── Profile/
│           │   └── Edit.jsx
│           ├── Notifications/
│           │   └── Index.jsx
│           ├── Settings/
│           │   └── Index.jsx
│           └── Help/
│               └── Index.jsx
├── routes/
│   ├── web.php
│   ├── auth.php
│   └── api.php
└── public/
    └── build/
```

---

## Layout & Design

### Sidebar Navigation
- **Style**: Glassmorphism (backdrop-blur, gradient, transparansi)
- **Width**: 280px (desktop), 80px (tablet), drawer (mobile)
- **Position**: Fixed di sisi kiri
- **Menu**: Dashboard, Master Data (admin), Transactions, Notifikasi, Settings, Help

### Responsive Breakpoints
| Breakpoint | Layout |
|------------|--------|
| ≥1024px | Sidebar tetap, content offset |
| 768px-1023px | Sidebar collapsed (icon-only) |
| <768px | Sidebar drawer (overlay) |

### Color Palette
- Primary: Indigo (#4F46E5)
- Secondary: Purple (#7C3AED)
- Background: Slate-50 (#F8FAFC)
- Text: Slate-800 (#1E293B)

---

## Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/new-feature`)
3. Commit perubahan (`git commit -m 'Add new feature'`)
4. Push ke branch (`git push origin feature/new-feature`)
5. Buat Pull Request

---

## License

MIT License

---

## Contact

Untuk pertanyaan atau masukan, silakan buka issue di GitHub atau hubungi tim pengembang.
