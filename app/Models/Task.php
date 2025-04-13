<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Task extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'project_id',
        'assigned_by',
        'hours_worked',
        'estimated_hours',
        'task_date',
        'status',
        'type',
        'is_billable',
        'notes',
    ];

    protected $casts = [
        'task_date' => 'date',
        'hours_worked' => 'decimal:2',
        'estimated_hours' => 'decimal:2',
        'is_billable' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class);
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }

    public function getProgressAttribute(): float
    {
        $totalSubtasks = $this->subtasks()->count();
        if ($totalSubtasks === 0) return 0;
        
        $completedSubtasks = $this->subtasks()->where('is_completed', true)->count();
        return ($completedSubtasks / $totalSubtasks) * 100;
    }

    public function getEstimatedHoursRemainingAttribute(): float
    {
        return max(0, $this->estimated_hours - $this->hours_worked);
    }
}
