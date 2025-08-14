"use client"

import type { Product } from "@/types"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Rating } from "@/components/ui/Rating"
import { formatCurrency } from "@/lib/utils"
import { Eye, ShoppingCart, Package, AlertTriangle } from "lucide-react"

interface ProductCardProps {
  product: Product
  onView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onSelect?: (product: Product) => void
  isSelected?: boolean
  showActions?: boolean
}

export const ProductCard = ({
  product,
  onView,
  onAddToCart,
  onSelect,
  isSelected = false,
  showActions = true,
}: ProductCardProps) => {
  // Calculate quality rating based on stock level and other factors
  const getQualityRating = (product: Product) => {
    let rating = 4.0 // Base rating

    // Adjust based on stock level
    if (product.stockLevel <= product.minStock) {
      rating -= 1.0
    } else if (product.stockLevel > product.minStock * 3) {
      rating += 0.5
    }

    // Adjust based on price (higher price = potentially higher quality)
    if (product.price > 100) {
      rating += 0.3
    }

    return Math.min(5.0, Math.max(1.0, rating))
  }

  const qualityRating = getQualityRating(product)
  const isLowStock = product.stockLevel <= product.minStock
  const isOutOfStock = product.stockLevel === 0

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect?.(product)}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {!product.isActive && <Badge variant="destructive">Inactive</Badge>}
          {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
          {isLowStock && !isOutOfStock && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Low Stock
            </Badge>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-gray-900 font-bold">{formatCurrency(product.price)}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Product name and category */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>

          {/* SKU */}
          <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>

          {/* Description */}
          {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}

          {/* Quality rating */}
          <Rating value={qualityRating} size="sm" />

          {/* Stock info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Stock: {product.stockLevel} {product.unit}
            </span>
            {product.weight && <span className="text-gray-500">{product.weight}kg</span>}
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
              {product.cost && <span className="text-sm text-gray-500 ml-2">Cost: {formatCurrency(product.cost)}</span>}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onView?.(product)
                }}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart?.(product)
                }}
                disabled={isOutOfStock || !product.isActive}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
