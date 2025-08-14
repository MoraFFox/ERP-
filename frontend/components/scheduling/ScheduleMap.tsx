"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Layers, Filter, Route } from "lucide-react"

interface MapLocation {
  id: string
  type: "delivery" | "maintenance" | "visit"
  title: string
  client: {
    name: string
    address?: string
  }
  coordinates?: {
    lat: number
    lng: number
  }
  status: string
  assignee?: string
  scheduledDate: string
}

export default function ScheduleMap() {
  const [locations, setLocations] = useState<MapLocation[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [filters, setFilters] = useState({
    delivery: true,
    maintenance: true,
    visits: true,
  })
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMapData()
  }, [selectedDate, filters])

  const fetchMapData = async () => {
    try {
      setLoading(true)
      const promises = []

      // Fetch delivery locations
      if (filters.delivery) {
        promises.push(
          fetch(`/api/deliveries?startDate=${selectedDate}&endDate=${selectedDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      // Fetch maintenance locations
      if (filters.maintenance) {
        promises.push(
          fetch(`/api/maintenance?startDate=${selectedDate}&endDate=${selectedDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      // Fetch visit locations
      if (filters.visits) {
        promises.push(
          fetch(`/api/visit-calls?startDate=${selectedDate}&endDate=${selectedDate}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }),
        )
      }

      const responses = await Promise.all(promises)
      const data = await Promise.all(responses.map((r) => r.json()))

      const combinedLocations: MapLocation[] = []

      // Process delivery data
      if (filters.delivery && data[0]?.success) {
        data[0].data.deliveries.forEach((delivery: any) => {
          combinedLocations.push({
            id: `delivery-${delivery.id}`,
            type: "delivery",
            title: `Delivery - ${delivery.order.client.name}`,
            client: delivery.order.client,
            coordinates: generateMockCoordinates(), // In real app, get from client address
            status: delivery.status,
            assignee: delivery.assignedDriver,
            scheduledDate: delivery.deliveryDate,
          })
        })
      }

      // Process maintenance data
      if (filters.maintenance && data[1]?.success) {
        data[1].data.visits.forEach((visit: any) => {
          combinedLocations.push({
            id: `maintenance-${visit.id}`,
            type: "maintenance",
            title: `Maintenance - ${visit.client.name}`,
            client: visit.client,
            coordinates: visit.location || generateMockCoordinates(),
            status: visit.status,
            assignee: `${visit.technician.firstName} ${visit.technician.lastName}`,
            scheduledDate: visit.scheduledDate,
          })
        })
      }

      // Process visit data
      if (filters.visits && data[2]?.success) {
        data[2].data.visitCalls
          .filter((visit: any) => visit.type === "IN_PERSON_VISIT")
          .forEach((visit: any) => {
            combinedLocations.push({
              id: `visit-${visit.id}`,
              type: "visit",
              title: `Visit - ${visit.client.name}`,
              client: visit.client,
              coordinates: generateMockCoordinates(),
              status: "completed",
              assignee: `${visit.salesperson.firstName} ${visit.salesperson.lastName}`,
              scheduledDate: visit.visitDate,
            })
          })
      }

      setLocations(combinedLocations)
    } catch (error) {
      console.error("Failed to fetch map data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock coordinate generation for demo purposes
  const generateMockCoordinates = () => ({
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.006 + (Math.random() - 0.5) * 0.1,
  })

  const getLocationColor = (type: string, status: string) => {
    if (status === "COMPLETED" || status === "DELIVERED") return "bg-green-500"
    if (status === "IN_PROGRESS") return "bg-yellow-500"
    if (status === "CANCELLED" || status === "MISSED") return "bg-red-500"

    switch (type) {
      case "delivery":
        return "bg-blue-500"
      case "maintenance":
        return "bg-green-500"
      case "visit":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const optimizeRoutes = async () => {
    // Mock route optimization
    console.log("Optimizing routes for", locations.length, "locations")
    // In real implementation, this would call route optimization API
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
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
            <MapPin className="w-5 h-5 text-amber-600" />
            Schedule Map View
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={optimizeRoutes}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
            >
              <Route className="w-4 h-4" />
              Optimize Routes
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />

          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-500" />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.delivery}
                onChange={(e) => setFilters((prev) => ({ ...prev, delivery: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Deliveries</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.maintenance}
                onChange={(e) => setFilters((prev) => ({ ...prev, maintenance: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Maintenance</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.visits}
                onChange={(e) => setFilters((prev) => ({ ...prev, visits: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Visits</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        <div className="relative h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Interactive Map Integration</p>
            <p className="text-sm text-gray-500">Real map with Leaflet/Mapbox would be integrated here</p>
            <p className="text-sm text-gray-500 mt-2">
              Showing {locations.length} scheduled locations for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </div>

          {/* Mock map markers */}
          {locations.slice(0, 8).map((location, index) => (
            <div
              key={location.id}
              className={`absolute w-6 h-6 rounded-full ${getLocationColor(location.type, location.status)} border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform`}
              style={{
                left: `${15 + (index % 4) * 20}%`,
                top: `${25 + Math.floor(index / 4) * 25}%`,
              }}
              onClick={() => setSelectedLocation(location)}
              title={location.title}
            />
          ))}

          {/* Mock route lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 60 120 Q 150 80 240 140 T 320 160"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">{selectedLocation.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedLocation.client.address}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Status: {selectedLocation.status}</span>
                {selectedLocation.assignee && <span>Assigned: {selectedLocation.assignee}</span>}
                <span>Date: {new Date(selectedLocation.scheduledDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Scheduled Locations ({locations.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${getLocationColor(location.type, location.status)}`} />
                <span className="font-medium text-sm text-gray-900">{location.client.name}</span>
              </div>
              <p className="text-xs text-gray-600 capitalize">{location.type}</p>
              {location.assignee && <p className="text-xs text-gray-500">{location.assignee}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
