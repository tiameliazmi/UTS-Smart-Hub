<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CheckinController;

Route::get('/', [DashboardController::class, 'index']);

Route::get('/approve-booking/{id}', [
    DashboardController::class,
    'approve'
]);

Route::get('/checkin/{id}', [
    CheckinController::class,
    'checkin'
]);