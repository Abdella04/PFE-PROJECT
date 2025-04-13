<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('New Task Assigned: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A new task has been assigned to you.')
            ->line('Task: ' . $this->task->title);

        if ($this->task->estimated_hours) {
            $message->line('Estimated Hours: ' . $this->task->estimated_hours);
        }

        $message->action('View Task', route('tasks.show', $this->task))
            ->line('Please review the task details and update the status accordingly.');

        return $message;
    }

    public function toArray($notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'title' => $this->task->title,
            'assigned_by' => $this->task->assignedBy->name,
        ];
    }
} 