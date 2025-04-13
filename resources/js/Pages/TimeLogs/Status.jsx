import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Status({ isClockedIn }) {
    return (
        <MainLayout>
            <Head title="Time Log Status" />
            <div className="hidden">
                {/* This is just a placeholder component since we're using JSON responses */}
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </div>
        </MainLayout>
    );
} 