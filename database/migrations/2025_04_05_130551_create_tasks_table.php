<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'archived'])->default('not_started');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->decimal('estimated_hours', 8, 2)->nullable();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('project_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->decimal('hours_worked', 8, 2)->default(0);
            $table->decimal('estimated_hours', 8, 2)->nullable();
            $table->date('task_date');
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->enum('type', ['bug', 'feature', 'maintenance'])->default('feature');
            $table->boolean('is_billable')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('path');
            $table->string('mime_type');
            $table->integer('size');
            $table->timestamps();
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('subtasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->boolean('is_completed')->default(false);
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->morphs('subject');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->text('description')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('subtasks');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('task_attachments');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('project_user');
        Schema::dropIfExists('projects');
    }
};
