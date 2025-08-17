"use client"

import { useState, useEffect } from "react"
import { clientService, type ClientFilters } from "@/services/clientService"
import type { Client } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Search, Filter, Eye, Edit, Building, Mail, Phone, Globe } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ClientListProps {
  onClientSelect?: (client: Client) => void
  onClientEdit?: (client: Client) => void
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "CHURNED", label: "Churned" },
]

const companySizeOptions = [
  { value: "", label: "All Sizes" },
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
]

export const ClientList = ({ onClientSelect, onClientEdit }: ClientListProps) => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [filters, setFilters] = useState<ClientFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await clientService.getClients(filters)
      setClients(response.data?.items || [])
      setPagination(response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [filters])

  const handleFilterChange = (key: keyof ClientFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      PROSPECT: "bg-blue-100 text-blue-800",
      CHURNED: "bg-red-100 text-red-800",
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.INACTIVE}`}
      >
        {status}
      </span>
    )
  }

  if (loading && clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading clients...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Select
              options={statusOptions}
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            />

            <Select
              options={companySizeOptions}
              value={filters.companySize || ""}
              onChange={(e) => handleFilterChange("companySize", e.target.value)}
            />

            <Input
              placeholder="Industry"
              value={filters.industry || ""}
              onChange={(e) => handleFilterChange("industry", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients?.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex items-center mt-1">
                    {client.status && getStatusBadge(client.status)}
                    {client.industry && <span className="ml-2 text-sm text-gray-500">• {client.industry}</span>}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onClientSelect?.(client)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onClientEdit?.(client)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {client.email}
                </div>

                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {client.phone}
                  </div>
                )}

                {client.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="mr-2 h-4 w-4" />
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {client.website}
                    </a>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="mr-2 h-4 w-4" />
                    {client.address}
                    {client.city && `, ${client.city}`}
                    {client.state && `, ${client.state}`}
                  </div>
                )}

                <div className="pt-2 text-xs text-gray-500">
                  Created {formatDate(client.createdAt)}
                  {client.createdBy && ` by ${client.createdBy.firstName} ${client.createdBy.lastName}`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status || filters.industry || filters.companySize
                ? "Try adjusting your filters"
                : "Get started by adding your first client"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {(pagination?.totalPages || 0) > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 10) + 1} to{" "}
                {Math.min((pagination?.page || 1) * (pagination?.limit || 10), pagination?.total || 0)} of {pagination?.total || 0} clients
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                  disabled={(pagination?.page || 1) <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                  disabled={(pagination?.page || 1) >= (pagination?.totalPages || 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
