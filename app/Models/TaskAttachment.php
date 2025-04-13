<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskAttachment extends Model
{
    protected $fillable = [
        'task_id',
        'filename',
        'path',
        'mime_type',
        'size',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
} 