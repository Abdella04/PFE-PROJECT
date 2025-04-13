import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ departments, users }) {
    const { auth } = usePage().props;

    return (
        <MainLayout title="Departments">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Departments</h2>
                        {auth.user?.isAdmin && (
                            <Link
                                href={route('departments.create')}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Create Department
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((department) => (
                            <div
                                key={department.id}
                                className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-200"
                                style={{ borderLeft: `4px solid ${department.color}` }}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                <Link
                                                    href={route('departments.show', department.id)}
                                                    className="hover:text-indigo-600"
                                                >
                                                    {department.name}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{department.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Manager:</span>
                                            <span className="font-medium ml-1">
                                                {department.manager?.name || 'Not assigned'}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Team Size:</span>
                                            <span className="font-medium ml-1">{department.team_size}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Active Projects:</span>
                                            <span className="font-medium ml-1">{department.active_projects_count}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Monthly Hours:</span>
                                            <span className="font-medium ml-1">
                                                {Math.round(department.monthly_hours)}
                                            </span>
                                        </div>
                                    </div>

                                    {auth.user?.isAdmin && (
                                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                                            <Link
                                                href={route('departments.edit', department.id)}
                                                className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete ${department.name}?`)) {
                                                        router.delete(route('departments.destroy', department.id));
                                                    }
                                                }}
                                                className="inline-flex items-center px-3 py-1 bg-red-100 border border-red-300 rounded-md font-semibold text-xs text-red-700 uppercase tracking-widest hover:bg-red-200 focus:bg-red-200 active:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 