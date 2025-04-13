import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartStock</h1>
                        <p className="text-gray-600">Inventory Management System</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-600">Don't have an account? </span>
                            <Link
                                href="/register"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
} 