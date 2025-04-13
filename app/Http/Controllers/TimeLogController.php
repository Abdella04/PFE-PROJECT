<?php

namespace App\Http\Controllers;

use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TimeLogController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $timeLogs = $user->timeLogs()
            ->latest()
            ->paginate(10);

        return Inertia::render('TimeLogs/Index', [
            'timeLogs' => $timeLogs,
            'isClockedIn' => $user->isClockedIn(),
        ]);
    }

    public function status(Request $request)
    {
        $user = Auth::user();
        $isClockedIn = $user->isClockedIn();
        $clockInTime = null;
        
        if ($isClockedIn) {
            $latestLog = $user->timeLogs()
                ->whereNull('clock_out')
                ->latest('clock_in')
                ->first();
            $clockInTime = $latestLog ? $latestLog->clock_in : null;
        }
        
        return response()->json([
            'isClockedIn' => $isClockedIn,
            'clockInTime' => $clockInTime
        ]);
    }

    public function clockIn(Request $request)
    {
        $user = Auth::user();
        
        if ($user->isClockedIn()) {
            return response()->json(['error' => 'Already clocked in'], 400);
        }

        $timeLog = TimeLog::create([
            'user_id' => $user->id,
            'clock_in' => now()
        ]);

        return response()->json([
            'message' => 'Clocked in successfully',
            'time_elapsed' => '00:00:00'
        ]);
    }

    public function clockOut(Request $request)
    {
        $user = Auth::user();
        $timeLog = $user->timeLogs()
            ->whereNull('clock_out')
            ->latest('clock_in')
            ->first();

        if (!$timeLog) {
            return response()->json(['error' => 'Not clocked in'], 400);
        }

        $clockOut = now();
        
        try {
            $timeLog->update([
                'clock_out' => $clockOut,
                'hours_worked' => $timeLog->clock_in->diffInHours($clockOut, true)
            ]);

            return response()->json([
                'message' => 'Clocked out successfully',
                'hours_worked' => number_format($timeLog->hours_worked, 2)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating clock out time'], 500);
        }
    }

    public function show(TimeLog $timeLog)
    {
        $this->authorize('view', $timeLog);

        return Inertia::render('TimeLogs/Show', [
            'timeLog' => $timeLog->load('user'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'clock_in' => 'required|date',
        ]);

        $timeLog = new TimeLog();
        $timeLog->user_id = Auth::id();
        $timeLog->clock_in = Carbon::parse($validated['clock_in']);
        $timeLog->save();

        return redirect()->back();
    }

    public function update(Request $request, TimeLog $timeLog)
    {
        $validated = $request->validate([
            'clock_out' => 'required|date|after:clock_in'
        ]);

        try {
            $clockOut = Carbon::parse($validated['clock_out']);
            
            $timeLog->update([
                'clock_out' => $clockOut,
                'hours_worked' => $timeLog->clock_in->diffInHours($clockOut, true)
            ]);

            return redirect()->back();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error updating clock out time']);
        }
    }
}
