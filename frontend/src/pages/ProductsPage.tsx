"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/types"

export const ProductsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [cartMessage, setCartMessage] = useState<string>("")

  const handleProductView = (product: Product) => {
    // You could open a modal or navigate to product details page
    console.log("View product:", product)
    // For now, just show an alert
    alert(`Viewing product: ${product.name}\nPrice: $${product.price}\nStock: ${product.stockLevel}`)
  }

  const handleAddToCart = (product: Product) => {
    // Add to cart logic here
    console.log("Add to cart:", product)
    setCartMessage(`"${product.name}" has been added to your cart!`)

    // Clear message after 3 seconds
    setTimeout(() => {
      setCartMessage("")
    }, 3000)
  }

  const handleProductSelect = (product: Product) => {
    // Toggle product selection
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id)
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const clearSelection = () => {
    setSelectedProducts([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Product Catalog</h1>
          <p className="text-gray-600">Explore Our Product Range</p>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
            </span>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Cart Message */}
      {cartMessage && (
        <Alert variant="success">
          <ShoppingCart className="h-4 w-4" />
          {cartMessage}
        </Alert>
      )}

      {/* Product Grid */}
      <ProductGrid
        onProductView={handleProductView}
        onAddToCart={handleAddToCart}
        onProductSelect={handleProductSelect}
        selectedProducts={selectedProducts}
        selectionMode={false}
        showActions={true}
      />
    </div>
  )
}
