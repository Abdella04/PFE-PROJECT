namespace App\Providers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Department;
use App\Policies\TaskPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\DepartmentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Task::class => TaskPolicy::class,
        Project::class => ProjectPolicy::class,
        Department::class => DepartmentPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('manage-departments', function ($user) {
            return $user->isAdmin();
        });

        Gate::define('manage-projects', function ($user) {
            return $user->isAdmin();
        });
    }
} 