import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Tasks({ auth, tasks, canCreate, users, isAdmin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        project_id: '',
        user_id: '',
        estimated_hours: '',
        task_date: new Date().toISOString().split('T')[0],
        type: 'feature',
        is_billable: true,
        notes: '',
        subtasks: [],
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                reset();
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 5000);
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
            <Head title="Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showSuccessMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Task has been sent successfully!</span>
                        </div>
                    )}

                    {canCreate && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Send New Task</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
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
                                    <label className="block text-sm font-medium text-gray-700">Assign To</label>
                                    <select
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    {errors.user_id && <div className="text-red-500">{errors.user_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
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
                                        required
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
                                    {processing ? 'Sending...' : 'Send Task'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}