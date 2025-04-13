import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">SmartStock</h1>
                    <p className="text-gray-600 mt-2">Inventory Management System</p>
                </div>
                {children}
            </div>
        </div>
    );
} 