<!DOCTYPE html>
<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>UTS Smart Hub</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>

        body{
            background:#e2e8f0;
            font-family:Arial, Helvetica, sans-serif;
        }

        .navbar{
            background:#334155;
            padding:15px 0;
            box-shadow:0 3px 10px rgba(0,0,0,0.08);
        }

        .navbar-brand{
            color:white !important;
            font-size:28px;
            font-weight:bold;
        }

        .hero{
            text-align:center;
            padding:45px 0 25px;
        }

        .hero h1{
            font-size:42px;
            font-weight:bold;
            color:#1e293b;
        }

        .hero p{
            color:#475569;
            margin-top:10px;
        }

        .dashboard-card{
            border:none;
            border-radius:18px;
            padding:28px;
            color:white;
            box-shadow:0 5px 15px rgba(0,0,0,0.08);
        }

        .blue-card{
            background:#3b82f6;
        }

        .green-card{
            background:#10b981;
        }

        .section-box{
            background:#f8fafc;
            border-radius:18px;
            padding:25px;
            margin-bottom:30px;
            box-shadow:0 5px 15px rgba(0,0,0,0.06);
        }

        .section-title{
            font-size:24px;
            font-weight:bold;
            margin-bottom:20px;
            color:#1e293b;
        }

        .table{
            vertical-align:middle;
        }

        .table thead{
            background:#cbd5e1;
        }

        .table-hover tbody tr:hover{
            background:#e2e8f0;
        }

        .badge-custom{
            padding:8px 14px;
            border-radius:10px;
            font-size:13px;
        }

        .btn-custom{
            border-radius:10px;
            padding:6px 14px;
            font-weight:bold;
        }

    </style>

</head>

<body>

<nav class="navbar navbar-expand-lg">

    <div class="container">

        <span class="navbar-brand">
            Smart Hub
        </span>

    </div>

</nav>

<div class="container">

    <div class="hero">

        <h1>
            Smart Hub Management Dashboard
        </h1>

        <p>
            Equipment & Booking Monitoring System
        </p>

    </div>

    <div class="row mb-4">

        <div class="col-md-6 mb-3">

            <div class="dashboard-card blue-card">

                <h5>Total Equipment</h5>

                <h1 class="display-3 fw-bold">
                    {{ $equipment }}
                </h1>

            </div>

        </div>

        <div class="col-md-6 mb-3">

            <div class="dashboard-card green-card">

                <h5>Total Booking</h5>

                <h1 class="display-3 fw-bold">
                    {{ $booking }}
                </h1>

            </div>

        </div>

    </div>

    <div class="section-box">

        <div class="section-title">
            Equipment Data
        </div>

        <table class="table table-hover">

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                @foreach($equipmentData as $item)

                <tr>

                    <td>{{ $item->id }}</td>
                    <td>{{ $item->code }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->stock }}</td>

                    <td>

                        @if($item->status == 'available')

                            <span class="badge bg-success badge-custom">
                                Available
                            </span>

                        @else

                            <span class="badge bg-danger badge-custom">
                                Borrowed
                            </span>

                        @endif

                    </td>

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>

    <div class="section-box">

        <div class="section-title">
            Booking Data
        </div>

        <table class="table table-hover">

            <thead>

                <tr>

                    <th>ID</th>
                    <th>User</th>
                    <th>Equipment</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Approve</th>
                    <th>Check-In</th>

                </tr>

            </thead>

            <tbody>

                @foreach($bookingData as $item)

                <tr>

                    <td>{{ $item->id }}</td>
                    <td>{{ $item->user->name }}</td>
                    <td>{{ $item->equipment->name }}</td>
                    <td>{{ $item->borrow_date }}</td>
                    <td>{{ $item->return_date }}</td>

                    <td>

                        @if($item->status == 'pending')

                            <span class="badge bg-warning text-dark badge-custom">
                                Pending
                            </span>

                        @else

                            <span class="badge bg-success badge-custom">
                                Approved
                            </span>

                        @endif

                    </td>

                    <td>

                        @if($item->status == 'pending')

                            <a href="/approve-booking/{{ $item->id }}"
                               class="btn btn-success btn-sm btn-custom">

                                Approve

                            </a>

                        @else

                            <button class="btn btn-secondary btn-sm btn-custom" disabled>
                                Approved
                            </button>

                        @endif

                    </td>

                    <td>

                        @if($item->equipment->status == 'available')

                            <a href="/checkin/{{ $item->id }}"
                               class="btn btn-primary btn-sm btn-custom">

                                Check-In

                            </a>

                        @else

                            <button class="btn btn-dark btn-sm btn-custom" disabled>
                                Checked-In
                            </button>

                        @endif

                    </td>

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>

    <div class="section-box">

        <div class="section-title">
            Check-In History
        </div>

        <table class="table table-hover">

            <thead>

                <tr>

                    <th>ID</th>
                    <th>User</th>
                    <th>Equipment</th>
                    <th>Check-In Time</th>
                    <th>Note</th>

                </tr>

            </thead>

            <tbody>

                @foreach($checkinData as $item)

                <tr>

                    <td>{{ $item->id }}</td>

                    <td>
                        {{ $item->booking->user->name }}
                    </td>

                    <td>
                        {{ $item->booking->equipment->name }}
                    </td>

                    <td>
                        {{ $item->checkin_time }}
                    </td>

                    <td>

                        <span class="badge bg-info text-dark badge-custom">
                            {{ $item->note }}
                        </span>

                    </td>

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>

    <div class="footer text-center mt-5">

    <h5 class="mb-4 text-dark fw-bold">
        UTS Pemrograman Fullstack - Laravel 13 - Smart-Hub Management System
    </h5>

    <div class="mb-2">
        Tia Amelia Azmi
    </div>

    <div class="mb-2">
        Nim : 411231052
    </div>

    <div class="mb-2">
        Teknik Informatika
    </div>

    <div class="fw-bold text-primary mt-3">
        UNIVERSITAS DIAN NUSANTARA
    </div>

</div>

</div>

</body>

</html>