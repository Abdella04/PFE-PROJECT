<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TimeLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'clock_in',
        'clock_out',
        'hours_worked'
    ];

    protected $casts = [
        'clock_in' => 'datetime',
        'clock_out' => 'datetime',
        'hours_worked' => 'float'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($timeLog) {
            if ($timeLog->clock_in && $timeLog->clock_out) {
                $clockIn = Carbon::parse($timeLog->clock_in);
                $clockOut = Carbon::parse($timeLog->clock_out);
                $timeLog->hours_worked = $clockIn->diffInHours($clockOut, true);
            }
        });
    }
} 