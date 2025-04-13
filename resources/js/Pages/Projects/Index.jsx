import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Projects({ auth, projects, departments }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'not_started',
        priority: 'medium',
        estimated_hours: '',
        department_id: '',
        user_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user.isAdmin && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                    />
                                    {errors.description && <div className="text-red-500">{errors.description}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.start_date && <div className="text-red-500">{errors.start_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.end_date && <div className="text-red-500">{errors.end_date}</div>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="not_started">Not Started</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        {errors.status && <div className="text-red-500">{errors.status}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            value={data.priority}
                                            onChange={e => setData('priority', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        {errors.priority && <div className="text-red-500">{errors.priority}</div>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Department</label>
                                        <select
                                            value={data.department_id}
                                            onChange={e => setData('department_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Select a department</option>
                                            {departments?.map(department => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && <div className="text-red-500">{errors.department_id}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={data.estimated_hours}
                                            onChange={e => setData('estimated_hours', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.estimated_hours && <div className="text-red-500">{errors.estimated_hours}</div>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Create Project
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Projects</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects?.map(project => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    {project.name}
                                                </Link>
                                                <div className="text-sm text-gray-500">{project.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{project.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.priority === 'low' ? 'bg-green-100 text-green-800' :
                                                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-indigo-600 h-2.5 rounded-full"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">{project.progress}%</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {project.total_hours} / {project.estimated_hours}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {project.users.map(user => (
                                                        <div
                                                            key={user.id}
                                                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200"
                                                            title={user.name}
                                                        >
                                                            <span className="text-xs text-gray-500 flex items-center justify-center h-full">
                                                                {user.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {projects?.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 