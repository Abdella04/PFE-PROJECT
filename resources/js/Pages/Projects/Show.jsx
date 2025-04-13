import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Project({ auth, project }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        user_id: '',
        estimated_hours: '',
        task_date: new Date().toISOString().split('T')[0],
        type: 'feature',
        is_billable: true,
        notes: '',
        subtasks: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/projects/${project.id}/tasks`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleAddSubtask = () => {
        setData('subtasks', [...data.subtasks, { title: '', is_completed: false }]);
    };

    const handleSubtaskChange = (index, value) => {
        const updatedSubtasks = [...data.subtasks];
        updatedSubtasks[index].title = value;
        setData('subtasks', updatedSubtasks);
    };

    const handleRemoveSubtask = (index) => {
        const updatedSubtasks = data.subtasks.filter((_, i) => i !== index);
        setData('subtasks', updatedSubtasks);
    };

    return (
        <MainLayout>
            <Head title={`Project: ${project.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{project.name}</h2>
                                <p className="text-gray-600 mt-2">{project.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    <p>Department: {project.department}</p>
                                    <p>Status: {project.status}</p>
                                    <p>Priority: {project.priority}</p>
                                    <p>Progress: {project.progress}%</p>
                                    <p>Total Hours: {project.total_hours}</p>
                                    <p>Estimated Hours: {project.estimated_hours}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.users.map(user => (
                                    <span
                                        key={user.id}
                                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {user.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {auth.user.isAdmin && (
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.title && <div className="text-red-500">{errors.title}</div>}
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="bug">Bug</option>
                                            <option value="feature">Feature</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.type && <div className="text-red-500">{errors.type}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={data.estimated_hours}
                                            onChange={e => setData('estimated_hours', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.estimated_hours && <div className="text-red-500">{errors.estimated_hours}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            value={data.task_date}
                                            onChange={e => setData('task_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.task_date && <div className="text-red-500">{errors.task_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                        />
                                        {errors.notes && <div className="text-red-500">{errors.notes}</div>}
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Subtasks</label>
                                            <button
                                                type="button"
                                                onClick={handleAddSubtask}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                + Add Subtask
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.subtasks.map((subtask, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={subtask.title}
                                                        onChange={e => handleSubtaskChange(index, e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        placeholder="Subtask title"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSubtask(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.subtasks && <div className="text-red-500">{errors.subtasks}</div>}
                                    </div>

                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.is_billable}
                                                onChange={e => setData('is_billable', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Billable Task</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Create Task
                                    </button>
                                </form>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {project.tasks.map(task => (
                                            <tr key={task.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{task.user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.type === 'bug' ? 'bg-red-100 text-red-800' :
                                                        task.type === 'feature' ? 'bg-green-100 text-green-800' :
                                                            task.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {task.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {task.hours_worked} / {task.estimated_hours}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'todo' ? 'bg-yellow-100 text-yellow-800' :
                                                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className="bg-indigo-600 h-2.5 rounded-full"
                                                            style={{ width: `${task.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 