<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Checkin;
use App\Models\Equipment;

class CheckinController extends Controller
{
    public function checkin($id)
    {
        $booking = Booking::find($id);

        $existing = Checkin::where('booking_id', $booking->id)->first();

        if ($existing) {
            return redirect('/');
        }

        Checkin::create([
            'booking_id' => $booking->id,
            'checkin_time' => now(),
            'note' => 'Equipment Checked In'
        ]);

        $booking->status = 'approved';

        $booking->save();

        $equipment = Equipment::find($booking->equipment_id);

        $equipment->status = 'borrowed';

        $equipment->save();

        return redirect('/');
    }
}