<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::all();

        return response()->json($equipment);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:equipments',
            'name' => 'required',
            'stock' => 'required',
            'condition' => 'required',
            'status' => 'required'
        ]);

        $equipment = Equipment::create([
            'code' => $request->code,
            'name' => $request->name,
            'stock' => $request->stock,
            'condition' => $request->condition,
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Equipment Created',
            'data' => $equipment
        ]);
    }

    public function show($id)
    {
        $equipment = Equipment::find($id);

        return response()->json($equipment);
    }

    public function update(Request $request, $id)
    {
        $equipment = Equipment::find($id);

        $equipment->update([
            'code' => $request->code,
            'name' => $request->name,
            'stock' => $request->stock,
            'condition' => $request->condition,
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Equipment Updated',
            'data' => $equipment
        ]);
    }

    public function destroy($id)
    {
        $equipment = Equipment::find($id);

        $equipment->delete();

        return response()->json([
            'message' => 'Equipment Deleted'
        ]);
    }
}