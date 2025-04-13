<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin')->except(['index', 'show']);
    }

    public function index()
    {
        $projects = Project::with(['department', 'users'])
            ->latest()
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'start_date' => $project->start_date,
                    'end_date' => $project->end_date,
                    'status' => $project->status,
                    'priority' => $project->priority,
                    'estimated_hours' => $project->estimated_hours,
                    'department' => $project->department ? $project->department->name : null,
                    'progress' => $project->calculateProgress(),
                    'total_hours' => $project->calculateTotalHours(),
                    'users' => $project->users->map(fn($user) => [
                        'id' => $user->id,
                        'name' => $user->name
                    ])
                ];
            });

        $users = User::select('id', 'name')->get();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'users' => $users,
            'statuses' => ['not_started', 'in_progress', 'completed', 'archived'],
            'priorities' => ['low', 'medium', 'high']
        ]);
    }

    public function show(Project $project)
    {
        $project->load(['department', 'users', 'tasks.user']);
        
        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status,
                'priority' => $project->priority,
                'estimated_hours' => $project->estimated_hours,
                'department' => $project->department ? $project->department->name : null,
                'progress' => $project->calculateProgress(),
                'total_hours' => $project->calculateTotalHours(),
                'users' => $project->users->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name
                ]),
                'tasks' => $project->tasks->map(fn($task) => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'user' => $task->user ? [
                        'id' => $task->user->id,
                        'name' => $task->user->name
                    ] : null,
                    'hours_worked' => $task->calculateHoursWorked(),
                    'progress' => $task->calculateProgress()
                ])
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'required|in:not_started,in_progress,completed,archived',
            'priority' => 'required|in:low,medium,high',
            'estimated_hours' => 'nullable|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project = Project::create($validated);
        $project->users()->attach($validated['user_ids']);

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'required|in:not_started,in_progress,completed,archived',
            'priority' => 'required|in:low,medium,high',
            'estimated_hours' => 'nullable|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project->update($validated);
        $project->users()->sync($validated['user_ids']);

        return redirect()->route('projects.show', $project)->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }

    public function createTask(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'estimated_hours' => 'nullable|numeric|min:0',
            'task_date' => 'required|date',
            'type' => 'required|in:bug,feature,maintenance,other',
            'is_billable' => 'boolean',
            'notes' => 'nullable|string',
            'subtasks' => 'nullable|array',
            'subtasks.*.title' => 'required|string|max:255',
        ]);

        $task = $project->tasks()->create([
            ...$validated,
            'assigned_by' => auth()->id(),
            'status' => 'todo',
        ]);

        if (!empty($validated['subtasks'])) {
            foreach ($validated['subtasks'] as $subtask) {
                $task->subtasks()->create($subtask);
            }
        }

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task created successfully.');
    }
}
