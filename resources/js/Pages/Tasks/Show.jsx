import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Task({ auth, task, canEdit }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/tasks/${task.id}/comments`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleStatusChange = (status) => {
        post(`/tasks/${task.id}/status`, {
            data: { status },
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title={`Task: ${task.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{task.title}</h2>
                                <p className="text-gray-600 mt-2">{task.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    <p>Project: {task.project.name}</p>
                                    <p>Assigned To: {task.assigned_to.name}</p>
                                    <p>Assigned By: {task.assigned_by.name}</p>
                                    <p>Hours: {task.hours_worked} / {task.estimated_hours}</p>
                                    <p>Date: {task.task_date}</p>
                                    <p>Type: {task.type}</p>
                                    <p>Billable: {task.is_billable ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Status:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusChange('todo')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === 'todo'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                            }`}
                                    >
                                        To Do
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('in_progress')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === 'in_progress'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                                            }`}
                                    >
                                        In Progress
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('done')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === 'done'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                            }`}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Progress</h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{task.progress}%</div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Subtasks</h3>
                            <div className="space-y-2">
                                {task.subtasks.map(subtask => (
                                    <div key={subtask.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={subtask.is_completed}
                                            onChange={() => {
                                                post(`/tasks/${task.id}/subtasks/${subtask.id}`, {
                                                    data: { is_completed: !subtask.is_completed },
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className={`text-sm ${subtask.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Notes</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">{task.notes || 'No notes yet.'}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Comments</h3>
                            <div className="space-y-4">
                                {task.comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-gray-900">{comment.user.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Add a comment</label>
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                    />
                                    {errors.content && <div className="text-red-500">{errors.content}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Post Comment
                                </button>
                            </form>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Activity Log</h3>
                            <div className="space-y-4">
                                {task.activity_logs.map(log => (
                                    <div key={log.id} className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-sm text-gray-500">{log.user.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{log.user.name}</span>
                                                <span className="text-gray-500"> {log.action}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </div>
                                            {log.description && (
                                                <div className="mt-1 text-sm text-gray-700">{log.description}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 