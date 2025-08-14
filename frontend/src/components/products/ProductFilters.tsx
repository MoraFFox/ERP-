"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { productService } from "@/services/productService"
import { Search, Filter, X } from "lucide-react"

interface ProductFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "category", label: "Category" },
  { value: "stockLevel", label: "Stock Level" },
  { value: "createdAt", label: "Date Added" },
]

const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
]

const statusOptions = [
  { value: "", label: "All Products" },
  { value: "true", label: "Active Only" },
  { value: "false", label: "Inactive Only" },
]

export const ProductFiltersComponent = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const [categories, setCategories] = useState<string[]>([])
  const [localFilters, setLocalFilters] = useState<any>(filters)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await productService.getCategories()
        setCategories(categoryList)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ]

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    const newFilters = {
      ...localFilters,
      [key]: value === "" ? undefined : value,
      page: 1, // Reset to first page when filtering
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: filters.limit || 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = !!(
    localFilters.search ||
    localFilters.category ||
    localFilters.isActive !== undefined ||
    localFilters.minPrice ||
    localFilters.maxPrice
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={localFilters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Select
              options={categoryOptions}
              value={localFilters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            />
          </div>

          {/* Status and Price Range Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={localFilters.isActive?.toString() || ""}
              onChange={(e) =>
                handleFilterChange("isActive", e.target.value === "" ? undefined : e.target.value === "true")
              }
            />

            <Input
              label="Min Price"
              type="number"
              placeholder="0"
              value={localFilters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange("minPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
              }
            />

            <Input
              label="Max Price"
              type="number"
              placeholder="1000"
              value={localFilters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange("maxPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
              }
            />
          </div>

          {/* Sorting Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Sort By"
              options={sortOptions}
              value={localFilters.sortBy || "createdAt"}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            />

            <Select
              label="Sort Order"
              options={sortOrderOptions}
              value={localFilters.sortOrder || "desc"}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value as "asc" | "desc")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
