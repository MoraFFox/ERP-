"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart3, Clock, TrendingUp, Users } from "lucide-react"
import UnifiedCalendar from "./UnifiedCalendar"
import ScheduleMap from "./ScheduleMap"

interface ScheduleStats {
  totalScheduled: number
  completedToday: number
  upcomingThisWeek: number
  overdueItems: number
  byType: {
    delivery: number
    maintenance: number
    visits: number
  }
  efficiency: number
}

export default function ScheduleDashboard() {
  const [activeView, setActiveView] = useState<"calendar" | "map" | "stats">("calendar")
  const [stats, setStats] = useState<ScheduleStats>({
    totalScheduled: 0,
    completedToday: 0,
    upcomingThisWeek: 0,
    overdueItems: 0,
    byType: { delivery: 0, maintenance: 0, visits: 0 },
    efficiency: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      // Fetch stats from all modules
      const [deliveryStats, maintenanceStats, visitStats] = await Promise.all([
        fetch(`/api/deliveries/stats?startDate=${today}&endDate=${weekFromNow}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }).then((r) => r.json()),
        fetch(`/api/maintenance/stats?startDate=${today}&endDate=${weekFromNow}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }).then((r) => r.json()),
        fetch(`/api/visit-calls/stats?startDate=${today}&endDate=${weekFromNow}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }).then((r) => r.json()),
      ])

      // Combine stats
      const combinedStats: ScheduleStats = {
        totalScheduled:
          (deliveryStats.data?.scheduled || 0) +
          (maintenanceStats.data?.scheduled || 0) +
          (visitStats.data?.total || 0),
        completedToday:
          (deliveryStats.data?.completed || 0) +
          (maintenanceStats.data?.completed || 0) +
          (visitStats.data?.total || 0),
        upcomingThisWeek:
          (deliveryStats.data?.scheduled || 0) +
          (maintenanceStats.data?.scheduled || 0) +
          (visitStats.data?.total || 0),
        overdueItems: (deliveryStats.data?.missed || 0) + (maintenanceStats.data?.cancelled || 0),
        byType: {
          delivery: deliveryStats.data?.total || 0,
          maintenance: maintenanceStats.data?.total || 0,
          visits: visitStats.data?.total || 0,
        },
        efficiency: Math.round(
          ((deliveryStats.data?.completionRate || 0) + (maintenanceStats.data?.completionRate || 0) + 85) / 3,
        ), // Mock calculation
      }

      setStats(combinedStats)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center gap-1 ${change > 0 ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className="w-3 h-3" />
              {change > 0 ? "+" : ""}
              {change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Dashboard</h1>
          <p className="text-gray-600">Unified view of all deliveries, maintenance, and visits</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Scheduled"
            value={stats.totalScheduled}
            icon={Calendar}
            color="bg-blue-500"
            change={12}
          />
          <StatCard title="Completed Today" value={stats.completedToday} icon={Clock} color="bg-green-500" change={8} />
          <StatCard
            title="Upcoming This Week"
            value={stats.upcomingThisWeek}
            icon={Users}
            color="bg-amber-500"
            change={-3}
          />
          <StatCard
            title="Efficiency Rate"
            value={`${stats.efficiency}%`}
            icon={BarChart3}
            color="bg-purple-500"
            change={5}
          />
        </div>

        {/* Activity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Activity Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  Deliveries
                </span>
                <span className="font-medium">{stats.byType.delivery}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  Maintenance
                </span>
                <span className="font-medium">{stats.byType.maintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  Visits & Calls
                </span>
                <span className="font-medium">{stats.byType.visits}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Schedule New Delivery
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Book Maintenance Visit
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Log Client Visit
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Optimize Routes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              {stats.overdueItems > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{stats.overdueItems} overdue items require attention</p>
                </div>
              )}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">3 deliveries scheduled for tomorrow</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">Maintenance efficiency up 5% this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === "calendar" ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveView("map")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === "map" ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeView === "calendar" && <UnifiedCalendar />}
        {activeView === "map" && <ScheduleMap />}
      </div>
    </div>
  )
}
