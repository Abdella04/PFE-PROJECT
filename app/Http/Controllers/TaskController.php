<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\TaskAssigned;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        if ($isAdmin) {
            return Inertia::render('Tasks/Index', [
                'tasks' => [],  // Empty array since we removed the table
                'canCreate' => true,
                'users' => User::where('id', '!=', $user->id)->get(),
                'isAdmin' => true
            ]);
        } else {
            $tasks = Task::with(['project', 'subtasks'])
                ->where('user_id', $user->id)
                ->latest()
                ->get()
                ->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'project' => $task->project,
                        'hours_worked' => $task->hours_worked,
                        'estimated_hours' => $task->estimated_hours,
                        'status' => $task->status,
                        'type' => $task->type,
                        'is_billable' => $task->is_billable,
                        'task_date' => $task->task_date->format('Y-m-d'),
                        'notes' => $task->notes,
                        'subtasks' => $task->subtasks->map(function ($subtask) {
                            return [
                                'title' => $subtask->title,
                                'is_completed' => $subtask->is_completed
                            ];
                        })
                    ];
                });

            return Inertia::render('Tasks/EmployeeTasks', [
                'tasks' => $tasks
            ]);
        }
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load([
            'project',
            'user',
            'assignedBy',
            'attachments',
            'subtasks',
            'comments.user',
            'activityLogs.user',
        ]);

        return Inertia::render('Tasks/Show', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'project' => [
                    'id' => $task->project->id,
                    'name' => $task->project->name,
                ],
                'assigned_to' => [
                    'id' => $task->user->id,
                    'name' => $task->user->name,
                ],
                'assigned_by' => [
                    'id' => $task->assignedBy->id,
                    'name' => $task->assignedBy->name,
                ],
                'hours_worked' => $task->hours_worked,
                'estimated_hours' => $task->estimated_hours,
                'status' => $task->status,
                'type' => $task->type,
                'is_billable' => $task->is_billable,
                'task_date' => $task->task_date,
                'notes' => $task->notes,
                'progress' => $task->progress,
                'attachments' => $task->attachments->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'filename' => $attachment->filename,
                        'mime_type' => $attachment->mime_type,
                        'size' => $attachment->size,
                        'url' => Storage::url($attachment->path),
                    ];
                }),
                'subtasks' => $task->subtasks->map(function ($subtask) {
                    return [
                        'id' => $subtask->id,
                        'title' => $subtask->title,
                        'is_completed' => $subtask->is_completed,
                    ];
                }),
                'comments' => $task->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                        ],
                        'created_at' => $comment->created_at,
                    ];
                }),
                'activity_logs' => $task->activityLogs->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'description' => $log->description,
                        'user' => [
                            'id' => $log->user->id,
                            'name' => $log->user->name,
                        ],
                        'created_at' => $log->created_at,
                    ];
                }),
            ],
            'canEdit' => Auth::user()->isAdmin() || Auth::id() === $task->user_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'estimated_hours' => 'nullable|numeric|min:0',
            'task_date' => 'required|date',
            'type' => 'required|in:feature,bug,maintenance',
            'is_billable' => 'boolean',
            'notes' => 'nullable|string',
            'subtasks' => 'nullable|array',
            'subtasks.*.title' => 'required|string|max:255',
            'subtasks.*.is_completed' => 'boolean',
        ]);

        $task = Task::create([
            ...$validated,
            'assigned_by' => auth()->id(),
            'status' => 'pending'
        ]);

        // Create subtasks if any
        if (!empty($validated['subtasks'])) {
            foreach ($validated['subtasks'] as $subtaskData) {
                $task->subtasks()->create($subtaskData);
            }
        }

        // Notify the assigned user
        $task->user->notify(new TaskAssigned($task));

        return redirect()->back()->with('success', 'Task sent successfully!');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'hours_worked' => 'nullable|numeric|min:0',
            'estimated_hours' => 'nullable|numeric|min:0',
            'task_date' => 'required|date',
            'type' => 'required|in:bug,feature,maintenance,other',
            'is_billable' => 'boolean',
            'notes' => 'nullable|string',
            'subtasks' => 'nullable|array',
            'subtasks.*.id' => 'nullable|exists:subtasks,id',
            'subtasks.*.title' => 'required|string|max:255',
            'subtasks.*.is_completed' => 'boolean',
        ]);

        $task->update($validated);

        if (!empty($validated['subtasks'])) {
            $existingSubtaskIds = $task->subtasks->pluck('id')->toArray();
            $updatedSubtaskIds = [];

            foreach ($validated['subtasks'] as $subtask) {
                if (isset($subtask['id'])) {
                    $task->subtasks()->where('id', $subtask['id'])->update($subtask);
                    $updatedSubtaskIds[] = $subtask['id'];
                } else {
                    $task->subtasks()->create($subtask);
                }
            }

            // Delete subtasks that were removed
            $task->subtasks()
                ->whereNotIn('id', $updatedSubtaskIds)
                ->delete();
        }

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task updated successfully.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task status updated successfully.');
    }

    public function addComment(Request $request, Task $task)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $task->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    public function addAttachment(Request $request, Task $task)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('task-attachments');

        $task->attachments()->create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return back()->with('success', 'File attached successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}
