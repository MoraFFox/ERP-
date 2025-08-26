"use client"

import { useState, useEffect } from "react"
import { productService, type ProductFilters } from "@/services/productService"
import type { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { ProductFiltersComponent } from "./ProductFilters"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Package, Grid, List } from "lucide-react"

interface ProductGridProps {
  onProductSelect?: (product: Product) => void
  onProductView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  selectedProducts?: Product[]
  selectionMode?: boolean
  showActions?: boolean
}

export const ProductGrid = ({
  onProductSelect,
  onProductView,
  onAddToCart,
  selectedProducts = [],
  selectionMode = false,
  showActions = true,
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await productService.getProducts(filters)
      setProducts(response.data?.items || [])
      setPagination(response.data?.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const isProductSelected = (product: Product) => {
    return selectedProducts.some((p) => p.id === product.id)
  }

  const handleProductSelect = (product: Product) => {
    if (selectionMode) {
      onProductSelect?.(product)
    } else {
      onProductView?.(product)
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <ProductFiltersComponent filters={filters} onFiltersChange={setFilters} />
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* View Mode Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {(pagination?.total || 0) > 0 ? (
            <>
              Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 12) + 1} to{" "}
              {Math.min((pagination?.page || 1) * (pagination?.limit || 12), pagination?.total || 0)} of {pagination?.total || 0} products
            </>
          ) : (
            "No products found"
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onProductView}
              onAddToCart={onAddToCart}
              onSelect={handleProductSelect}
              isSelected={isProductSelected(product)}
              showActions={showActions}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.category || filters.isActive !== undefined
                  ? "Try adjusting your filters"
                  : "No products available at the moment"}
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Pagination */}
      {(pagination?.totalPages || 0) > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {pagination?.page || 1} of {pagination?.totalPages || 1}
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
