<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EquipmentController;
use App\Http\Controllers\API\BookingController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('equipments', EquipmentController::class);

Route::apiResource('bookings', BookingController::class);