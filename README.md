# SmartStock Project

A task management and time tracking system built with Laravel and React.

## Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16
- MySQL or PostgreSQL
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Abdella04/PFE-PROJECT.git
cd PFE-PROJECT
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Environment setup:
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

6. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

7. Build assets:
```bash
npm run dev
```

8. Start the development server:
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Default Admin Credentials

- Email: admin@example.com
- Password: password

## Features

- Task Management
- Time Tracking
- Department Management
- User Management
- Project Management
- Real-time Updates
- Activity Logging

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
