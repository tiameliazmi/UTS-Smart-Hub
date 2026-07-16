<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDataController extends Controller
{
    /**
     * Display a listing of the master data.
     */
    public function index()
    {
        $masterData = Equipment::all();

        return Inertia::render('MasterData/Index', [
            'masterData' => $masterData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:equipments,code',
            'name' => 'required|string|max:255',
            'condition' => 'required|string',
            'stock' => 'required|integer|min:0',
            'status' => 'required|string'
        ]);

        Equipment::create($request->only(['code', 'name', 'condition', 'stock', 'status']));

        return redirect()->back()->with('success', 'Data Master berhasil ditambahkan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);
        $equipment->delete();

        return redirect()->back()->with('success', 'Data Master berhasil dihapus.');
    }
}
