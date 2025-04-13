<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'manager_id',
        'team_size',
        'projects_count',
        'color',
    ];

    protected $appends = ['active_projects_count'];

    /**
     * Get the manager of the department.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get the users in this department.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the projects in this department.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the active projects count.
     */
    public function getActiveProjectsCountAttribute(): int
    {
        return $this->projects()->where('status', 'in_progress')->count();
    }

    /**
     * Update the team size based on actual user count.
     */
    public function updateTeamSize(): void
    {
        $this->team_size = $this->users()->count();
        $this->save();
    }

    /**
     * Update the projects count based on actual project count.
     */
    public function updateProjectsCount(): void
    {
        $this->projects_count = $this->projects()->count();
        $this->save();
    }

    /**
     * Get total hours logged by department members this month.
     */
    public function getMonthlyHours(): float
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        return $this->users()
            ->with('timeLogs')
            ->get()
            ->flatMap->timeLogs
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('duration');
    }
}
