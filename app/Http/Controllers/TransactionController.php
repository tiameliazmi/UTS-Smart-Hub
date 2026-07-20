<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     */
    public function index()
    {
        if (Auth::user()->role === 'admin') {
            $transactions = Booking::with('user', 'equipment')->get();
        } else {
            $transactions = Booking::with('user', 'equipment')->where('user_id', Auth::id())->get();
        }

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $masterData = Equipment::all();

        return Inertia::render('Transactions/Form', [
            'masterData' => $masterData,
        ]);
    }

    /**
     * Store a newly created transaction (booking) in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|integer|exists:equipments,id',
            'borrow_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:borrow_date',
        ]);

        $equipment = Equipment::findOrFail($request->equipment_id);

        if ($equipment->stock < 1) {
            return back()->withErrors(['equipment_id' => 'Stok peralatan tidak mencukupi']);
        }

        Booking::create([
            'user_id' => Auth::id(),
            'equipment_id' => $request->equipment_id,
            'borrow_date' => $request->borrow_date,
            'return_date' => $request->return_date,
            'status' => 'pending'
        ]);

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dicatat.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('transactions.index')->with('error', 'Akses ditolak.');
        }

        $transaction = Booking::findOrFail($id);
        $masterData = Equipment::all();

        return Inertia::render('Transactions/Form', [
            'transaction' => $transaction,
            'masterData' => $masterData,
        ]);
    }

    /**
     * Update the specified transaction in storage.
     */
    public function update(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('transactions.index')->with('error', 'Akses ditolak.');
        }

        $request->validate([
            'borrow_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:borrow_date',
            'status' => 'required|in:pending,approved,rejected,returned',
        ]);

        $transaction = Booking::findOrFail($id);
        $oldStatus = $transaction->status;
        $newStatus = $request->status;

        $transaction->update([
            'borrow_date' => $request->borrow_date,
            'return_date' => $request->return_date,
            'status' => $newStatus
        ]);

        // Update equipment status based on booking status change
        if ($oldStatus !== $newStatus) {
            $equipment = Equipment::find($transaction->equipment_id);

            if ($equipment) {
                if ($newStatus === 'approved' && $oldStatus !== 'approved') {
                    $equipment->update([
                        'status' => 'borrowed',
                        'stock' => max(0, $equipment->stock - 1),
                    ]);
                } elseif ($newStatus === 'returned' && $oldStatus === 'approved') {
                    $equipment->update([
                        'status' => 'available',
                        'stock' => $equipment->stock + 1,
                    ]);
                }
            }
        }

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('transactions.index')->with('error', 'Akses ditolak.');
        }
        
        Booking::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
