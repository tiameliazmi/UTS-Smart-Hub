<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $table = 'equipments';

    protected $fillable = [
        'code',
        'name',
        'stock',
        'condition',
        'status'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}