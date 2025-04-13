<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Inertia\Inertia;
use App\Http\Controllers\TimeLogController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;

// Redirect guest users to login page
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create']);
    Route::post('register', [RegisteredUserController::class, 'store']);
    
    Route::get('login', [AuthenticatedSessionController::class, 'create']);
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Time logs
    Route::get('/time-logs', [TimeLogController::class, 'index'])->name('time-logs.index');
    Route::get('/time-logs/status', [TimeLogController::class, 'status'])->name('time-logs.status');
    Route::post('/time-logs/clock-in', [TimeLogController::class, 'clockIn'])->name('time-logs.clock-in');
    Route::post('/time-logs/clock-out', [TimeLogController::class, 'clockOut'])->name('time-logs.clock-out');
    Route::get('/time-logs/{timeLog}', [TimeLogController::class, 'show'])->name('time-logs.show');
    
    // Tasks
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    
    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    
    // Departments
    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::get('/departments/{department}', [DepartmentController::class, 'show'])->name('departments.show');

    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Time logs admin operations
        Route::post('/time-logs', [TimeLogController::class, 'store']);
        Route::put('/time-logs/{timeLog}', [TimeLogController::class, 'update']);
        
        // Tasks admin operations
        Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
        Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
        Route::post('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');
        Route::post('tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments');
        Route::post('tasks/{task}/attachments', [TaskController::class, 'addAttachment'])->name('tasks.attachments');
        
        // Projects admin operations
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::post('/projects/{project}/tasks', [ProjectController::class, 'createTask'])->name('projects.tasks.store');
        
        // Departments admin operations
        Route::get('/departments/create', [DepartmentController::class, 'create'])->name('departments.create');
        Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
        Route::get('/departments/{department}/edit', [DepartmentController::class, 'edit'])->name('departments.edit');
        Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
        Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');
    });
});

require __DIR__.'/auth.php';
