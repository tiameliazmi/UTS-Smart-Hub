<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::middleware('admin')->group(function () {
        Route::resource('master-data', \App\Http\Controllers\MasterDataController::class)->only(['index', 'store', 'destroy']);
    });
    
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class)->only(['index', 'create', 'store']);
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class)->only(['edit', 'update', 'destroy'])->middleware('admin');
    Route::post('/bookings/{id}/checkin', [\App\Http\Controllers\CheckinController::class, 'checkin'])->name('bookings.checkin');

    // Notifications
    Route::get('/notifications', function () {
        return Inertia::render('Notifications/Index');
    })->name('notifications.index');

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings.index');

    // Help
    Route::get('/help', function () {
        return Inertia::render('Help/Index');
    })->name('help.index');
});

require __DIR__.'/auth.php';
