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
        Schema::table('departments', function (Blueprint $table) {
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->integer('team_size')->default(0);
            $table->integer('projects_count')->default(0);
            $table->string('color', 7)->default('#4A5568'); // Default color in hex
            $table->text('description')->nullable()->change();
            $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn(['manager_id', 'team_size', 'projects_count', 'color']);
            $table->text('description')->change();
        });
    }
};
