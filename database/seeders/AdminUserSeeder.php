<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Admin SmartStock',
            'email' => 'admin.smartstock@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);
    }
}
