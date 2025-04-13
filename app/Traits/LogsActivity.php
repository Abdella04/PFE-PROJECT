<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            $model->logActivity('created');
        });

        static::updated(function ($model) {
            $model->logActivity('updated');
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }

    protected function logActivity(string $action)
    {
        $this->activityLogs()->create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $this->getActivityDescription($action),
            'old_values' => $action === 'updated' ? $this->getOriginal() : null,
            'new_values' => $action === 'deleted' ? null : $this->getAttributes(),
        ]);
    }

    protected function getActivityDescription(string $action): string
    {
        $modelName = class_basename($this);
        
        return match($action) {
            'created' => "{$modelName} was created",
            'updated' => "{$modelName} was updated",
            'deleted' => "{$modelName} was deleted",
            default => "{$modelName} was {$action}",
        };
    }
} 