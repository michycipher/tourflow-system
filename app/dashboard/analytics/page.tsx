"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Weekly trend data
const weeklyData = [
    { day: "Mon", views: 900 },
    { day: "Tue", views: 1350 },
    { day: "Wed", views: 1300 },
    { day: "Thu", views: 900 },
    { day: "Fri", views: 1250 },
    { day: "Sat", views: 1400 },
    { day: "Sun", views: 1700 },
];

// Step performance data
const stepPerformanceData = [
    { step: "Step 1", views: 12000 },
    { step: "Step 2", views: 11500 },
    { step: "Step 3", views: 11000 },
    { step: "Step 4", views: 10800 },
    { step: "Step 5", views: 11200 },
];

// Tour status data (for pie chart)
const tourStatusData = [
    { name: "active", value: 2, color: "#9d00a8" },
    { name: "inactive", value: 1, color: "#334155" },
];

// Step skip rates data
const skipRatesData = [
    { step: "Step 1", rate: 2 },
    { step: "Step 2", rate: 5 },
    { step: "Step 3", rate: 8 },
    { step: "Step 4", rate: 10 },
    { step: "Step 5", rate: 3 },
];

export default function AnalyticsPage() {
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Analytics
                </h1>
                <p className="text-slate-400">
                    Track the performance of your onboarding tours.
                </p>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Views */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <p className="text-slate-400 text-sm mb-2">Total Views</p>
                    <p className="text-4xl font-bold text-purple-400">12,453</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <p className="text-slate-400 text-sm mb-2">
                        Completion Rate
                    </p>
                    <p className="text-4xl font-bold text-purple-400">78%</p>
                </div>

                {/* Avg Time Spent */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <p className="text-slate-400 text-sm mb-2">
                        Avg. Time Spent
                    </p>
                    <p className="text-4xl font-bold text-purple-400">2m 34s</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Active Users*/}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Active Users
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#334155"
                            />
                            <XAxis
                                dataKey="day"
                                stroke="#94a3b8"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: "12px" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #800080",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#9d00a8"
                                strokeWidth={3}
                                dot={{ fill: "#9d00a8", r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Step Performance */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Step Performance
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stepPerformanceData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#334155"
                            />
                            <XAxis
                                dataKey="step"
                                stroke="#94a3b8"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: "12px" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #800080",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Bar
                                dataKey="views"
                                fill="#9d00a8"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tour Status */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Tour Status
                    </h2>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={tourStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {tourStatusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-slate-300 text-sm">
                                Active: 2
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <span className="text-slate-300 text-sm">
                                Inactive: 1
                            </span>
                        </div>
                    </div>
                </div>

                {/* Step Skip Rates */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Step Skip Rates
                    </h2>
                    <div className="space-y-6">
                        {skipRatesData.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-300 text-sm">
                                        {item.step}
                                    </span>
                                    <span className="text-slate-400 text-sm">
                                        {item.rate}% skipped
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-purple-500/60 h-2 rounded-full transition-all"
                                        style={{ width: `${item.rate * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
