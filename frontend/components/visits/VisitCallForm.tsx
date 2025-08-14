"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, Users, Video, Calendar, MapPin, Save } from "lucide-react"

interface VisitCallFormProps {
  clientId: string
  clientName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function VisitCallForm({ clientId, clientName, onSuccess, onCancel }: VisitCallFormProps) {
  const [formData, setFormData] = useState({
    type: "PHONE_CALL",
    purpose: "",
    outcome: "",
    followUpDate: "",
    distanceKm: "",
    notes: "",
    visitDate: new Date().toISOString().split("T")[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const visitTypes = [
    { value: "PHONE_CALL", label: "Phone Call", icon: Phone },
    { value: "EMAIL", label: "Email", icon: Mail },
    { value: "IN_PERSON_VISIT", label: "In-Person Visit", icon: Users },
    { value: "VIDEO_CALL", label: "Video Call", icon: Video },
    { value: "FOLLOW_UP", label: "Follow-up", icon: Calendar },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/visit-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          clientId,
          salespersonId: localStorage.getItem("userId"), // Assuming current user is the salesperson
          type: formData.type,
          purpose: formData.purpose,
          outcome: formData.outcome || undefined,
          followUpDate: formData.followUpDate || undefined,
          distanceKm: formData.distanceKm ? Number.parseFloat(formData.distanceKm) : undefined,
          notes: formData.notes || undefined,
          visitDate: formData.visitDate,
        }),
      })

      if (response.ok) {
        onSuccess?.()
        // Reset form
        setFormData({
          type: "PHONE_CALL",
          purpose: "",
          outcome: "",
          followUpDate: "",
          distanceKm: "",
          notes: "",
          visitDate: new Date().toISOString().split("T")[0],
        })
      } else {
        const data = await response.json()
        setError(data.message || "Failed to log visit/call")
      }
    } catch (error) {
      setError("Failed to log visit/call")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Log Visit/Call</h3>
        <div className="text-sm text-gray-600">Client: {clientName}</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Visit Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visit/Call Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {visitTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                  className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-1 transition-colors ${
                    formData.type === type.value
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Purpose *
          </label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            placeholder="e.g., Product demonstration, Follow-up on proposal"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Visit Date */}
        <div>
          <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
            Visit/Call Date
          </label>
          <input
            type="date"
            id="visitDate"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Distance (for in-person visits) */}
        {formData.type === "IN_PERSON_VISIT" && (
          <div>
            <label htmlFor="distanceKm" className="block text-sm font-medium text-gray-700 mb-1">
              Distance Traveled (km)
            </label>
            <div className="relative">
              <input
                type="number"
                id="distanceKm"
                name="distanceKm"
                value={formData.distanceKm}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="0.0"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <MapPin className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Outcome */}
        <div>
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-1">
            Outcome
          </label>
          <textarea
            id="outcome"
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            rows={3}
            placeholder="What was accomplished or discussed?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
            Follow-up Date (Optional)
          </label>
          <input
            type="date"
            id="followUpDate"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Any additional information or observations"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !formData.purpose}
            className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Logging..." : "Log Visit/Call"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
