<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'priority',
        'estimated_hours',
        'department_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'estimated_hours' => 'decimal:2',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')
            ->withTimestamps();
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function calculateProgress(): int
    {
        $tasks = $this->tasks;
        if ($tasks->isEmpty()) {
            return 0;
        }
        
        return round($tasks->avg('progress') ?? 0);
    }

    public function calculateTotalHours(): float
    {
        return $this->tasks->sum('hours_worked') ?? 0;
    }

    public function getRemainingHours(): float
    {
        $totalHours = $this->calculateTotalHours();
        return max(0, $this->estimated_hours - $totalHours);
    }
}
