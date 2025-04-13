<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin')->except(['index', 'show']);
    }

    public function index()
    {
        $departments = Department::with(['manager', 'users', 'projects'])
            ->withCount(['users as team_size', 'projects'])
            ->get()
            ->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'description' => $department->description,
                    'manager' => $department->manager ? [
                        'id' => $department->manager->id,
                        'name' => $department->manager->name,
                    ] : null,
                    'team_size' => $department->team_size,
                    'projects_count' => $department->projects_count,
                    'color' => $department->color,
                    'monthly_hours' => $department->getMonthlyHours(),
                    'active_projects_count' => $department->active_projects_count,
                ];
            });

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'users' => User::select('id', 'name')->get(),
            'canCreate' => auth()->user()->isAdmin(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Departments/Create', [
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
            'color' => 'required|string|size:7|regex:/^#[A-Fa-f0-9]{6}$/',
        ]);

        $department = Department::create($validated);
        $department->updateTeamSize();
        $department->updateProjectsCount();

        return redirect()->route('departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function show(Department $department)
    {
        $department->load(['manager', 'users', 'projects']);
        
        return Inertia::render('Departments/Show', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'description' => $department->description,
                'manager' => $department->manager ? [
                    'id' => $department->manager->id,
                    'name' => $department->manager->name,
                ] : null,
                'team_size' => $department->team_size,
                'projects_count' => $department->projects_count,
                'color' => $department->color,
                'monthly_hours' => $department->getMonthlyHours(),
                'active_projects_count' => $department->active_projects_count,
                'users' => $department->users->map->only(['id', 'name', 'email']),
                'projects' => $department->projects->map->only(['id', 'name', 'status']),
            ],
            'available_users' => User::whereDoesntHave('department')->orWhere('department_id', $department->id)
                ->select('id', 'name')
                ->get(),
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
            'color' => 'required|string|size:7|regex:/^#[A-Fa-f0-9]{6}$/',
        ]);

        $department->update($validated);
        $department->updateTeamSize();
        $department->updateProjectsCount();

        return back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        if ($department->users()->exists()) {
            return back()->with('error', 'Cannot delete department with assigned users.');
        }

        if ($department->projects()->exists()) {
            return back()->with('error', 'Cannot delete department with assigned projects.');
        }

        $department->delete();

        return back()->with('success', 'Department deleted successfully.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('Departments/Edit', [
            'department' => $department,
            'users' => User::select('id', 'name')->get(),
        ]);
    }
}
