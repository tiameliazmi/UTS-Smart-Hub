<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index()
    {
        $booking = Booking::with('user', 'equipment')->get();

        return response()->json($booking);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'equipment_id' => 'required',
            'borrow_date' => 'required',
            'return_date' => 'required'
        ]);

        $booking = Booking::create([
            'user_id' => $request->user_id,
            'equipment_id' => $request->equipment_id,
            'borrow_date' => $request->borrow_date,
            'return_date' => $request->return_date,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Booking Created',
            'data' => $booking
        ]);
    }

    public function show($id)
    {
        $booking = Booking::with('user', 'equipment')->find($id);

        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        $booking->update([
            'borrow_date' => $request->borrow_date,
            'return_date' => $request->return_date,
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Booking Updated',
            'data' => $booking
        ]);
    }

    public function destroy($id)
    {
        $booking = Booking::find($id);

        $booking->delete();

        return response()->json([
            'message' => 'Booking Deleted'
        ]);
    }
}