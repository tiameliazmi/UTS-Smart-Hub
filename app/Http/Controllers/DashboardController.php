<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Booking;
use App\Models\Checkin;

class DashboardController extends Controller
{
    public function index()
    {
        $equipment = Equipment::count();

        $booking = Booking::count();

        $equipmentData = Equipment::all();

        $bookingData = Booking::with('user', 'equipment')->get();

        $checkinData = Checkin::with('booking.user', 'booking.equipment')->latest()->get();

        return view('dashboard', compact(
            'equipment',
            'booking',
            'equipmentData',
            'bookingData',
            'checkinData'
        ));
    }

    public function approve($id)
    {
        $booking = Booking::find($id);

        $booking->status = 'approved';

        $booking->save();

        return redirect('/');
    }
}