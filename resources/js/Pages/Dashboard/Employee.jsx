import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { format, parseISO } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function EmployeeDashboard({ auth, tasks, timeStats, performanceData }) {
    const [timeElapsed, setTimeElapsed] = useState('00:00:00');
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clockInTime, setClockInTime] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const formatTimeElapsed = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = Math.floor((now - start) / 1000); // difference in seconds

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const checkClockStatus = async () => {
        try {
            const response = await axios.get('/time-logs/status');
            setIsClockedIn(response.data.isClockedIn);
            if (response.data.isClockedIn && response.data.clockInTime) {
                setClockInTime(response.data.clockInTime);
            } else {
                setClockInTime(null);
            }
            setError(null);
        } catch (err) {
            setError('Failed to check clock status');
        }
    };

    useEffect(() => {
        checkClockStatus();
    }, []);

    useEffect(() => {
        let interval;
        if (clockInTime) {
            interval = setInterval(() => {
                setTimeElapsed(formatTimeElapsed(clockInTime));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [clockInTime]);

    const handleClockInOut = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isClockedIn) {
                await axios.post('/time-logs/clock-out');
                setClockInTime(null);
            } else {
                const response = await axios.post('/time-logs/clock-in');
                if (response.data.clockInTime) {
                    setClockInTime(response.data.clockInTime);
                }
            }
            await checkClockStatus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to clock in/out');
        } finally {
            setLoading(false);
        }
    };

    // Get today's tasks
    const todaysTasks = tasks?.filter(task => {
        const taskDate = new Date(task.task_date);
        const today = new Date();
        return taskDate.toDateString() === today.toDateString();
    }) || [];

    // Get next upcoming task
    const nextTask = tasks?.find(task => {
        const taskDate = new Date(task.task_date);
        const today = new Date();
        return taskDate >= today && task.status !== 'completed';
    });

    // Chart configurations
    const dailyPerformanceConfig = {
        labels: performanceData.daily_performance.map(day => format(parseISO(day.date), 'MMM d')),
        datasets: [
            {
                label: 'Productivity Score',
                data: performanceData.daily_performance.map(day => day.productivity_score),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const skillsConfig = {
        labels: performanceData.skills_assessment.map(skill => skill.skill),
        datasets: [
            {
                label: 'Skill Level',
                data: performanceData.skills_assessment.map(skill => skill.score),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }
        ]
    };

    const weeklyTrendsConfig = {
        labels: performanceData.weekly_trends.map(week => week.week),
        datasets: [
            {
                label: 'Tasks Completed',
                data: performanceData.weekly_trends.map(week => week.tasks_completed),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Hours Worked',
                data: performanceData.weekly_trends.map(week => week.hours_worked),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    return (
        <MainLayout>
            <Head title="Employee Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Welcome, {auth.user.name}!</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Time Clock */}
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Time Clock</h3>
                                {isClockedIn && (
                                    <div className="mb-4 text-2xl font-bold text-indigo-600">
                                        {timeElapsed}
                                    </div>
                                )}
                                <button
                                    onClick={handleClockInOut}
                                    disabled={loading}
                                    className={`w-full px-4 py-2 rounded-md text-sm font-medium text-white ${isClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 ${isClockedIn ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                    } disabled:opacity-50`}
                                >
                                    {loading ? 'Processing...' : isClockedIn ? 'Clock Out' : 'Clock In'}
                                </button>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600">{error}</p>
                                )}
                            </div>
                        </div>

                        {/* Hours Today */}
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Hours Today</h3>
                            <p className="text-3xl font-bold text-indigo-600">
                                {timeStats?.today || '0'}
                            </p>
                        </div>

                        {/* Today's Tasks Card */}
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Today's Tasks</h3>
                            <p className="text-3xl font-bold text-indigo-600">
                                {todaysTasks.length}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {todaysTasks.filter(t => t.status === 'completed').length} completed
                            </p>
                        </div>

                        {/* Next Task Preview */}
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Next Task</h3>
                            {nextTask ? (
                                <div>
                                    <p className="text-md font-semibold text-gray-800">{nextTask.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">{nextTask.task_date}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No upcoming tasks</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white p-6 rounded-lg shadow border mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[...tasks, /* Add other activity types here */]
                                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                .slice(0, 5)
                                .map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            {activity.status === 'completed' ? (
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                                                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {activity.status === 'completed' ? 'Completed task' : 'Updated task'} • {new Date(activity.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Existing Recent Tasks Table */}
                    {tasks && tasks.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
                                    <Link
                                        href="/tasks"
                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        View All Tasks
                                    </Link>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Task Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Due Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tasks.slice(0, 5).map((task) => (
                                                <tr key={task.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {task.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {task.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {task.task_date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {task.status?.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={`/tasks/${task.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    onClick={() => setActiveTab('performance')}
                                    className={`${activeTab === 'performance'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    My Performance
                                </button>
                            </nav>
                        </div>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Time Statistics */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Hours Today</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{timeStats.today}</dd>
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Hours This Week</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{timeStats.this_week}</dd>
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Hours This Month</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{timeStats.this_month}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Tasks */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tasks</h3>
                                    <div className="mt-5">
                                        <div className="flex flex-col">
                                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {tasks.map((task) => (
                                                                    <tr key={task.id}>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.project}</td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'done'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-yellow-100 text-yellow-800'
                                                                                }`}>
                                                                                {task.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.hours_worked}</td>
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
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            {/* Performance Summary */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Average Daily Hours</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{performanceData.summary.average_daily_hours}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Tasks Completed (30d)</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{performanceData.summary.total_tasks_completed}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Average Productivity</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{performanceData.summary.average_productivity}%</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Top Skill</dt>
                                                    <dd className="text-lg font-medium text-gray-900">{performanceData.summary.top_skill.skill}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Performance Chart */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">30-Day Productivity Trend</h3>
                                <div className="h-80">
                                    <Line
                                        data={dailyPerformanceConfig}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    max: 100
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Skills Assessment */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h3>
                                <div className="h-80">
                                    <Radar
                                        data={skillsConfig}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                r: {
                                                    beginAtZero: true,
                                                    max: 100
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Weekly Performance Trends */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Performance Trends</h3>
                                <div className="h-80">
                                    <Bar
                                        data={weeklyTrendsConfig}
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