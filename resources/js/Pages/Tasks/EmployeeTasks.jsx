import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function EmployeeTasks({ auth, tasks }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <MainLayout>
            <Head title="My Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">My Tasks</h2>

                            {tasks.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No tasks assigned yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Task Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Due Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hours
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tasks.map((task) => (
                                                <tr key={task.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {task.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {task.description}
                                                        </div>
                                                        {task.notes && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                Notes: {task.notes}
                                                            </div>
                                                        )}
                                                        {task.subtasks && task.subtasks.length > 0 && (
                                                            <div className="mt-2">
                                                                <div className="text-xs font-medium text-gray-700">Subtasks:</div>
                                                                <ul className="mt-1 space-y-1">
                                                                    {task.subtasks.map((subtask, index) => (
                                                                        <li key={index} className="text-xs text-gray-600 flex items-center">
                                                                            <span className={`w-2 h-2 rounded-full mr-2 ${subtask.is_completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                                            {subtask.title}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            task.type === 'bug' ? 'bg-red-100 text-red-800' :
                                                            task.type === 'feature' ? 'bg-green-100 text-green-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {task.type}
                                                        </span>
                                                        {task.is_billable && (
                                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                Billable
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {task.task_date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {task.hours_worked || 0} / {task.estimated_hours || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
