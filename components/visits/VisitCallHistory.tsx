"use client"

import { useState, useEffect } from "react"
import { Phone, Mail, Users, Video, Calendar, MapPin, Clock, User } from "lucide-react"

interface VisitCall {
  id: string
  type: "PHONE_CALL" | "EMAIL" | "IN_PERSON_VISIT" | "VIDEO_CALL" | "FOLLOW_UP"
  purpose: string
  outcome?: string
  followUpDate?: string
  distanceKm?: number
  notes?: string
  visitDate: string
  salesperson: {
    firstName: string
    lastName: string
  }
}

interface VisitCallHistoryProps {
  clientId: string
  limit?: number
}

export default function VisitCallHistory({ clientId, limit = 10 }: VisitCallHistoryProps) {
  const [visitCalls, setVisitCalls] = useState<VisitCall[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisitHistory()
  }, [clientId])

  const fetchVisitHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/visit-calls/client/${clientId}/history?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVisitCalls(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch visit history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PHONE_CALL":
        return <Phone className="w-4 h-4 text-blue-600" />
      case "EMAIL":
        return <Mail className="w-4 h-4 text-green-600" />
      case "IN_PERSON_VISIT":
        return <Users className="w-4 h-4 text-purple-600" />
      case "VIDEO_CALL":
        return <Video className="w-4 h-4 text-orange-600" />
      case "FOLLOW_UP":
        return <Calendar className="w-4 h-4 text-amber-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PHONE_CALL":
        return "bg-blue-100 text-blue-800"
      case "EMAIL":
        return "bg-green-100 text-green-800"
      case "IN_PERSON_VISIT":
        return "bg-purple-100 text-purple-800"
      case "VIDEO_CALL":
        return "bg-orange-100 text-orange-800"
      case "FOLLOW_UP":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Visit & Call History</h3>
        <p className="text-sm text-gray-600 mt-1">Recent interactions and communications</p>
      </div>

      <div className="divide-y divide-gray-200">
        {visitCalls.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No visit or call history found</p>
          </div>
        ) : (
          visitCalls.map((visitCall) => (
            <div key={visitCall.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(visitCall.type)}`}
                    >
                      {getTypeIcon(visitCall.type)}
                      {formatType(visitCall.type)}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(visitCall.visitDate).toLocaleDateString()}</span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-1">{visitCall.purpose}</h4>

                  {visitCall.outcome && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Outcome:</strong> {visitCall.outcome}
                    </p>
                  )}

                  {visitCall.distanceKm && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Distance: {visitCall.distanceKm} km
                    </p>
                  )}

                  {visitCall.followUpDate && (
                    <p className="text-sm text-amber-600 mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Follow-up scheduled: {new Date(visitCall.followUpDate).toLocaleDateString()}
                    </p>
                  )}

                  {visitCall.notes && (
                    <p className="text-sm text-gray-600 italic">
                      <strong>Notes:</strong> {visitCall.notes}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-600 flex items-center gap-1 ml-4">
                  <User className="w-3 h-3" />
                  {visitCall.salesperson.firstName} {visitCall.salesperson.lastName}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {visitCalls.length >= limit && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All History</button>
        </div>
      )}
    </div>
  )
}
