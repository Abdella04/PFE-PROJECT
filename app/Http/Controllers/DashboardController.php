<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    private function generateDummyEmployeeData($date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::now();
        $employees = [
            'John Smith',
            'Sarah Johnson',
            'Michael Brown',
            'Emily Davis',
            'David Wilson',
            'Lisa Anderson',
            'James Taylor',
            'Jennifer Martinez'
        ];

        $data = [];
        foreach ($employees as $employee) {
            // Seed the random number generator with the date and employee name
            // This ensures the same data is shown for the same date
            srand(crc32($date->format('Y-m-d') . $employee));

            // Random hours between 20 and 40
            $hoursWorked = rand(20, 40);
            // Random tasks between 5 and 15
            $totalTasks = rand(5, 15);
            // Random completed tasks (less than total tasks)
            $completedTasks = rand(2, $totalTasks);

            $dailyHours = [];
            $weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            foreach ($weekDays as $day) {
                // Random daily hours between 4 and 9
                $dailyHours[$day] = rand(4, 9);
            }

            $data[] = [
                'user' => $employee,
                'total_hours' => $hoursWorked,
                'tasks_completed' => $completedTasks,
                'total_tasks' => $totalTasks,
                'daily_hours' => $dailyHours,
                'date' => $date->format('Y-m-d')
            ];
        }

        // Reset random seed
        srand();
        return $data;
    }

    private function generateWeeklyAverageHours($date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::now();
        $weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $weeklyHours = [];

        // Seed the random number generator with the week number
        srand(crc32($date->format('Y-W')));

        foreach ($weekDays as $day) {
            if ($day === 'Sat') {
                $weeklyHours[] = rand(2, 5); // Less hours on Saturday
            } elseif ($day === 'Sun') {
                $weeklyHours[] = 0; // No work on Sunday
            } else {
                $weeklyHours[] = rand(6, 9); // Regular workdays
            }
        }

        // Reset random seed
        srand();
        return $weeklyHours;
    }

    private function generatePersonalPerformanceData($userId)
    {
        $now = Carbon::now();
        
        // Generate last 30 days of performance data
        $dailyData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            srand(crc32($date->format('Y-m-d') . $userId));
            
            $dailyData[] = [
                'date' => $date->format('Y-m-d'),
                'hours_worked' => rand(6, 9),
                'tasks_completed' => rand(2, 8),
                'productivity_score' => rand(75, 98)
            ];
        }

        // Generate skill progress data
        $skills = [
            'Time Management',
            'Task Completion',
            'Team Collaboration',
            'Project Contribution',
            'Meeting Deadlines'
        ];

        $skillsData = [];
        foreach ($skills as $skill) {
            srand(crc32($skill . $userId));
            $skillsData[] = [
                'skill' => $skill,
                'score' => rand(65, 95)
            ];
        }

        // Generate weekly performance trends
        $weeklyTrends = [];
        for ($i = 11; $i >= 0; $i--) {
            $weekStart = $now->copy()->subWeeks($i)->startOfWeek();
            srand(crc32($weekStart->format('Y-W') . $userId));
            
            $weeklyTrends[] = [
                'week' => $weekStart->format('M d'),
                'efficiency' => rand(70, 95),
                'tasks_completed' => rand(10, 25),
                'hours_worked' => rand(35, 45)
            ];
        }

        return [
            'daily_performance' => $dailyData,
            'skills_assessment' => $skillsData,
            'weekly_trends' => $weeklyTrends,
            'summary' => [
                'average_daily_hours' => number_format(collect($dailyData)->avg('hours_worked'), 1),
                'total_tasks_completed' => collect($dailyData)->sum('tasks_completed'),
                'average_productivity' => number_format(collect($dailyData)->avg('productivity_score'), 1),
                'top_skill' => collect($skillsData)->sortByDesc('score')->first()
            ]
        ];
    }

    public function index(Request $request)
    {
        if (Auth::user()->isAdmin()) {
            return $this->adminDashboard($request);
        }
        return $this->employeeDashboard();
    }

    protected function adminDashboard(Request $request)
    {
        $selectedDate = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();
        $startOfWeek = $selectedDate->copy()->startOfWeek();
        $endOfWeek = $selectedDate->copy()->endOfWeek();

        // Active Users with their latest time logs
        $activeUsers = User::with(['department', 'latestTimeLog'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'department' => $user->department,
                    'latest_time_log' => $user->latestTimeLog
                ];
            });

        // Time Logs for the selected week
        $timeLogs = TimeLog::with(['user.department'])
            ->whereBetween('clock_in', [$startOfWeek, $endOfWeek])
            ->latest('clock_in')
            ->get();

        // Generate dummy data for charts based on selected date
        $employeeTasks = $this->generateDummyEmployeeData($selectedDate);
        $weeklyHours = $this->generateWeeklyAverageHours($selectedDate);

        // Generate calendar data for 3 months
        $calendarData = [];
        $startDate = Carbon::now()->subMonth();
        $endDate = Carbon::now()->addMonth();

        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            // Seed random for consistent daily stats
            srand(crc32($date->format('Y-m-d')));
            
            $calendarData[] = [
                'date' => $date->format('Y-m-d'),
                'totalHours' => rand(30, 80),
                'completedTasks' => rand(10, 30),
                'activeEmployees' => rand(5, 8)
            ];
        }
        // Reset random seed
        srand();

        return Inertia::render('Dashboard/Admin', [
            'activeUsers' => $activeUsers,
            'timeLogs' => $timeLogs,
            'stats' => [
                'total_projects' => Project::count() ?: rand(5, 15),
                'active_projects' => Project::where('status', 'in_progress')->count() ?: rand(3, 8),
                'total_tasks' => Task::count() ?: rand(50, 100),
                'completed_tasks' => Task::where('status', 'done')->count() ?: rand(20, 40),
                'total_hours_this_week' => Task::whereBetween('task_date', [$startOfWeek, $endOfWeek])->sum('hours_worked') ?: rand(150, 250),
                'active_employees' => User::whereHas('tasks', function ($query) use ($startOfWeek, $endOfWeek) {
                    $query->whereBetween('task_date', [$startOfWeek, $endOfWeek]);
                })->count() ?: count($employeeTasks),
            ],
            'tasks' => $employeeTasks,
            'weeklyHours' => $weeklyHours,
            'calendarData' => $calendarData,
            'selectedDate' => $selectedDate->format('Y-m-d'),
            'dateRange' => 'week'
        ]);
    }

    protected function employeeDashboard()
    {
        $user = Auth::user();
        $now = Carbon::now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfWeek = $now->copy()->startOfWeek();
        $startOfMonth = $now->copy()->startOfMonth();

        // User's Tasks
        $tasks = $user->tasks()
            ->with(['project', 'subtasks'])
            ->whereIn('status', ['done', 'in_progress'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'project' => $task->project->name,
                    'status' => $task->status,
                    'hours_worked' => $task->hours_worked,
                    'progress' => $task->progress,
                ];
            });

        // Time Statistics
        $timeStats = [
            'today' => $user->tasks()
                ->whereDate('task_date', $startOfDay)
                ->sum('hours_worked'),
            'this_week' => $user->tasks()
                ->whereBetween('task_date', [$startOfWeek, $now])
                ->sum('hours_worked'),
            'this_month' => $user->tasks()
                ->whereBetween('task_date', [$startOfMonth, $now])
                ->sum('hours_worked'),
        ];

        // Generate performance data
        $performanceData = $this->generatePersonalPerformanceData($user->id);

        return Inertia::render('Dashboard/Employee', [
            'tasks' => $tasks,
            'timeStats' => $timeStats,
            'performanceData' => $performanceData
        ]);
    }

    protected function getStartDate($range)
    {
        return match($range) {
            'today' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->startOfDay(),
        };
    }
}
