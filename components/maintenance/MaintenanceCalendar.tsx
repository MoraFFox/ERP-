"use client"

import { useState, useEffect } from "react"
import { Calendar, Wrench, User, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface MaintenanceVisit {
  id: string
  scheduledDate: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED"
  visitType: "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY" | "INSPECTION" | "INSTALLATION"
  description: string
  client: {
    name: string
    address?: string
  }
  technician: {
    firstName: string
    lastName: string
  }
  product?: {
    name: string
  }
}

interface CalendarData {
  [date: string]: MaintenanceVisit[]
}

export default function MaintenanceCalendar() {
  const [calendarData, setCalendarData] = useState<CalendarData>({})
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarData()
  }, [currentMonth])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const response = await fetch(
        `/api/maintenance/calendar?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setCalendarData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "RESCHEDULED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case "PREVENTIVE":
        return "bg-green-100 text-green-800"
      case "CORRECTIVE":
        return "bg-yellow-100 text-yellow-800"
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "INSPECTION":
        return "bg-blue-100 text-blue-800"
      case "INSTALLATION":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-3 h-3" />
      case "IN_PROGRESS":
        return <Wrench className="w-3 h-3" />
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3" />
      case "CANCELLED":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    return new Date(year, month, day).toISOString().split("T")[0]
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Maintenance Calendar
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="font-medium text-gray-900">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth().map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24"></div>
            }

            const dateKey = formatDate(day)
            const visits = calendarData[dateKey] || []
            const isSelected = selectedDate === dateKey

            return (
              <div
                key={day}
                className={`h-24 border rounded-lg p-1 cursor-pointer transition-colors ${
                  isSelected ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedDate(isSelected ? "" : dateKey)}
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                <div className="space-y-1">
                  {visits.slice(0, 2).map((visit) => (
                    <div
                      key={visit.id}
                      className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${getStatusColor(visit.status)}`}
                    >
                      {getStatusIcon(visit.status)}
                      <span className="truncate">{visit.client.name}</span>
                    </div>
                  ))}
                  {visits.length > 2 && <div className="text-xs text-gray-500">+{visits.length - 2} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && calendarData[selectedDate] && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-3">
            Maintenance visits for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {calendarData[selectedDate].map((visit) => (
              <div key={visit.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(visit.status)}`}
                    >
                      {getStatusIcon(visit.status)}
                      {visit.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitTypeColor(visit.visitType)}`}
                    >
                      {visit.visitType}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{visit.client.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{visit.description}</div>
                  {visit.client.address && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {visit.client.address}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {visit.technician.firstName} {visit.technician.lastName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
