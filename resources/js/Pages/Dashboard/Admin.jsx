import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboard({ activeUsers, timeLogs, tasks, projects, stats, weeklyHours, calendarData, selectedDate, dateRange }) {
    const [selectedRange, setSelectedRange] = useState(dateRange);
    const [activeTab, setActiveTab] = useState('overview');

    const dateRanges = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
    ];

    // Calendar navigation
    const handleDateSelect = (date) => {
        router.get('/dashboard', { date }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Format calendar data for display
    const getCalendarCellClass = (data) => {
        if (!data) return 'bg-gray-50';

        // Determine intensity based on total hours
        const intensity = Math.min(Math.floor(data.totalHours / 10), 4);
        return `bg-indigo-${(intensity + 1) * 100} hover:bg-indigo-${(intensity + 2) * 100} cursor-pointer`;
    };

    // Chart data for employee performance
    const employeePerformanceData = {
        labels: tasks?.map(task => task.user) || [],
        datasets: [
            {
                label: 'Hours Worked',
                data: tasks?.map(task => task.total_hours) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Tasks Completed',
                data: tasks?.map(task => task.tasks_completed) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    // Weekly hours data
    const weeklyHoursData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Average Hours',
                data: weeklyHours || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }
        ]
    };

    return (
        <MainLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`${activeTab === 'overview'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('time-logs')}
                                    className={`${activeTab === 'time-logs'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Time Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('charts')}
                                    className={`${activeTab === 'charts'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Charts
                                </button>
                            </nav>
                        </div>
                    </div>

                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{stats.total_hours}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Employees</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{stats.active_employees}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{stats.total_tasks}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{stats.total_projects}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Currently Active Employees</h3>
                                        <div className="mt-5">
                                            <div className="flex flex-col">
                                                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Employee
                                                                        </th>
                                                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Department
                                                                        </th> */}
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Clock In
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Status
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {activeUsers.map((user) => (
                                                                        <tr key={user.id}>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center">
                                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                            {user.name[0].toUpperCase()}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="ml-4">
                                                                                        <div className="text-sm font-medium text-gray-900">
                                                                                            {user.name}
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-500">
                                                                                            {user.email}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm text-gray-900">
                                                                                    {user.department?.name}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {user.latest_time_log?.clock_in &&
                                                                                    format(new Date(user.latest_time_log.clock_in), 'MMM d, yyyy HH:mm')}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.latest_time_log && !user.latest_time_log.clock_out
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-gray-100 text-gray-800'
                                                                                    }`}>
                                                                                    {user.latest_time_log && !user.latest_time_log.clock_out ? 'Active' : 'Inactive'}
                                                                                </span>
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
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'time-logs' && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Employee Time Logs</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Employee
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Clock In
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Clock Out
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Duration
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {timeLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                                                        <div className="text-sm text-gray-500">{log.user.department?.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(new Date(log.clock_in), 'MMM d, yyyy HH:mm')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {log.clock_out ? format(new Date(log.clock_out), 'MMM d, yyyy HH:mm') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {log.duration ? `${log.duration} hours` : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'charts' && (
                        <div className="space-y-6">
                            {/* Calendar Section */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Calendar</h3>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">
                                        Selected Date: {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {/* Calendar header */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Calendar cells */}
                                    {calendarData.map((day, index) => (
                                        <div
                                            key={day.date}
                                            onClick={() => handleDateSelect(day.date)}
                                            className={`p-2 text-center transition-colors ${getCalendarCellClass(day)
                                                } ${day.date === selectedDate ? 'ring-2 ring-indigo-600' : ''}`}
                                        >
                                            <div className="text-sm font-medium">
                                                {format(parseISO(day.date), 'd')}
                                            </div>
                                            {day.date === selectedDate && (
                                                <div className="mt-1 text-xs">
                                                    <div>{day.totalHours}h</div>
                                                    <div>{day.completedTasks} tasks</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Employee Performance Chart */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Performance</h3>
                                <div className="h-96">
                                    <Bar
                                        data={employeePerformanceData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Weekly Hours Chart */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Hours</h3>
                                <div className="h-96">
                                    <Line
                                        data={weeklyHoursData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 