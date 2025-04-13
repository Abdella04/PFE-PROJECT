import { Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ users }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        manager_id: '',
        color: '#4A5568',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('departments.store'));
    }

    return (
        <MainLayout title="Create Department">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Create Department
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="3"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="manager" value="Manager" />
                                    <select
                                        id="manager"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.manager_id}
                                        onChange={e => setData('manager_id', e.target.value)}
                                    >
                                        <option value="">Select a manager</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.manager_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="color" value="Department Color" />
                                    <input
                                        id="color"
                                        type="color"
                                        className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.color}
                                        onChange={e => setData('color', e.target.value)}
                                    />
                                    <InputError message={errors.color} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('departments.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Create Department
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 