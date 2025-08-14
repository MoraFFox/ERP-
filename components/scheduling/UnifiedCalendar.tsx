"use client"

import { useState, useEffect } from "react"
import { Calendar, Truck, Wrench, Phone, ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  type: "delivery" | "maintenance" | "visit"
  date: string
  time?: string
  status: string
  client: {
    name: string
    address?: string
  }
  assignee?: {
    name: string
    role: string
  }
  details?: string
}

interface CalendarData {
  [date: string]: ScheduleEvent[]
}

export default function UnifiedCalendar() {
  const [calendarData, setCalendarData] = useState<CalendarData>({})
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    delivery: true,
    maintenance: true,
    visits: true,
  })

  useEffect(() => {
    fetchCalendarData()
  }, [currentMonth, filters])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const startDate = startOfMonth.toISOString()
      const endDate = endOfMonth.toISOString()

      // Fetch data from all modules
      const promises = []

      if (filters.delivery) {
        promises.push(
          fetch(`/api/deliveries/calendar?startDate=${startDate}&endDate=${endDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      if (filters.maintenance) {
        promises.push(
          fetch(`/api/maintenance/calendar?startDate=${startDate}&endDate=${endDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      if (filters.visits) {
        promises.push(
          fetch(`/api/visit-calls?startDate=${startDate}&endDate=${endDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      const responses = await Promise.all(promises)
      const data = await Promise.all(responses.map((r) => r.json()))

      // Combine and normalize data
      const combinedData: CalendarData = {}

      // Process delivery data
      if (filters.delivery && data[0]?.success) {
        Object.entries(data[0].data).forEach(([date, deliveries]: [string, any[]]) => {
          if (!combinedData[date]) combinedData[date] = []
          deliveries.forEach((delivery) => {
            combinedData[date].push({
              id: `delivery-${delivery.id}`,
              title: `Delivery - ${delivery.order.client.name}`,
              type: "delivery",
              date,
              status: delivery.status,
              client: delivery.order.client,
              assignee: delivery.assignedDriver ? { name: delivery.assignedDriver, role: "Driver" } : undefined,
              details: `Order #${delivery.order.orderNumber}`,
            })
          })
        })
      }

      // Process maintenance data
      if (filters.maintenance && data[1]?.success) {
        Object.entries(data[1].data).forEach(([date, visits]: [string, any[]]) => {
          if (!combinedData[date]) combinedData[date] = []
          visits.forEach((visit) => {
            combinedData[date].push({
              id: `maintenance-${visit.id}`,
              title: `Maintenance - ${visit.client.name}`,
              type: "maintenance",
              date,
              status: visit.status,
              client: visit.client,
              assignee: {
                name: `${visit.technician.firstName} ${visit.technician.lastName}`,
                role: "Technician",
              },
              details: visit.description,
            })
          })
        })
      }

      // Process visit/call data
      if (filters.visits && data[2]?.success) {
        data[2].data.visitCalls.forEach((visitCall: any) => {
          const date = visitCall.visitDate.split("T")[0]
          if (!combinedData[date]) combinedData[date] = []
          combinedData[date].push({
            id: `visit-${visitCall.id}`,
            title: `${visitCall.type.replace("_", " ")} - ${visitCall.client.name}`,
            type: "visit",
            date,
            status: "completed",
            client: visitCall.client,
            assignee: {
              name: `${visitCall.salesperson.firstName} ${visitCall.salesperson.lastName}`,
              role: "Sales",
            },
            details: visitCall.purpose,
          })
        })
      }

      setCalendarData(combinedData)
    } catch (error) {
      console.error("Failed to fetch calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="w-3 h-3" />
      case "maintenance":
        return <Wrench className="w-3 h-3" />
      case "visit":
        return <Phone className="w-3 h-3" />
      default:
        return <Calendar className="w-3 h-3" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "delivery":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-green-100 text-green-800"
      case "visit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Unified Schedule Calendar
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-gray-900 min-w-[140px] text-center">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.delivery}
                onChange={(e) => setFilters((prev) => ({ ...prev, delivery: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Truck className="w-3 h-3 text-blue-600" />
                Deliveries
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.maintenance}
                onChange={(e) => setFilters((prev) => ({ ...prev, maintenance: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-green-600" />
                Maintenance
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.visits}
                onChange={(e) => setFilters((prev) => ({ ...prev, visits: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-purple-600" />
                Visits & Calls
              </span>
            </label>
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
              return <div key={index} className="h-28"></div>
            }

            const dateKey = formatDate(day)
            const events = calendarData[dateKey] || []
            const isSelected = selectedDate === dateKey
            const isToday = dateKey === new Date().toISOString().split("T")[0]

            return (
              <div
                key={day}
                className={`h-28 border rounded-lg p-1 cursor-pointer transition-colors ${
                  isSelected
                    ? "border-amber-500 bg-amber-50"
                    : isToday
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedDate(isSelected ? "" : dateKey)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-700" : "text-gray-900"}`}>{day}</div>
                <div className="space-y-1">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${getEventColor(event.type)}`}
                    >
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.client.name}</span>
                    </div>
                  ))}
                  {events.length > 3 && <div className="text-xs text-gray-500">+{events.length - 3} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && calendarData[selectedDate] && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-3">Schedule for {new Date(selectedDate).toLocaleDateString()}</h3>
          <div className="space-y-3">
            {calendarData[selectedDate].map((event) => (
              <div key={event.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getEventColor(event.type)}`}
                    >
                      {getEventIcon(event.type)}
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{event.client.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.details}</p>
                  {event.client.address && <p className="text-sm text-gray-500">{event.client.address}</p>}
                </div>
                {event.assignee && (
                  <div className="text-sm text-gray-600 text-right">
                    <div className="font-medium">{event.assignee.name}</div>
                    <div className="text-xs text-gray-500">{event.assignee.role}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
