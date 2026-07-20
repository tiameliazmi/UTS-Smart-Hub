<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Booking;
use App\Models\Checkin;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEquipment = Equipment::count();
        $totalBookings = Booking::count();
        $pendingCount = Booking::where('status', 'pending')->count();
        $approvedCount = Booking::where('status', 'approved')->count();
        $returnedCount = Booking::where('status', 'returned')->count();
        $rejectedCount = Booking::where('status', 'rejected')->count();

        return Inertia::render('Dashboard', [
            'totalEquipment' => $totalEquipment,
            'totalBookings' => $totalBookings,
            'pendingCount' => $pendingCount,
            'approvedCount' => $approvedCount,
            'returnedCount' => $returnedCount,
            'rejectedCount' => $rejectedCount,
        ]);
    }

    public function approve($id)
    {
        $booking = Booking::find($id);

        $booking->status = 'approved';

        $booking->save();

        return redirect('/');
    }
}