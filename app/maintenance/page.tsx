"use client"

import { useState } from "react"
import MaintenanceCalendar from "../../components/maintenance/MaintenanceCalendar"
import MaintenanceList from "../../components/maintenance/MaintenanceList"
import MaintenanceMap from "../../components/maintenance/MaintenanceMap"

export default function MaintenancePage() {
  const [activeView, setActiveView] = useState<"calendar" | "list" | "map">("calendar")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
          <p className="text-gray-600">Schedule and track maintenance visits</p>
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
              onClick={() => setActiveView("list")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === "list" ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List View
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

        {/* Content */}
        {activeView === "calendar" && <MaintenanceCalendar />}
        {activeView === "list" && <MaintenanceList />}
        {activeView === "map" && <MaintenanceMap />}
      </div>
    </div>
  )
}
