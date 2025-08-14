"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, Package, Star, Grid, List, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  sku: string
  category: string
  price: number
  cost: number
  stockLevel: number
  minStock: number
  rating: number
  isActive: boolean
  images: string[]
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Widget Pro",
    description: "High-quality widget for professional use with advanced features",
    sku: "WIDGET-PRO-001",
    category: "Electronics",
    price: 299.99,
    cost: 150.0,
    stockLevel: 45,
    minStock: 10,
    rating: 4.8,
    isActive: true,
    images: ["/premium-widget.png"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Smart Connector Kit",
    description: "Universal connector kit with smart technology integration",
    sku: "CONNECT-SMART-002",
    category: "Accessories",
    price: 89.99,
    cost: 45.0,
    stockLevel: 120,
    minStock: 25,
    rating: 4.6,
    isActive: true,
    images: ["/smart-connector.png"],
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Industrial Sensor Array",
    description: "Professional-grade sensor array for industrial applications",
    sku: "SENSOR-IND-003",
    category: "Industrial",
    price: 599.99,
    cost: 300.0,
    stockLevel: 8,
    minStock: 5,
    rating: 4.9,
    isActive: true,
    images: ["/industrial-sensor.png"],
    createdAt: "2024-01-20",
  },
]

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    price: 0,
    cost: 0,
    stockLevel: 0,
    minStock: 0,
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory && product.isActive
  })

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      rating: 0,
      isActive: true,
      images: ["/new-product-launch.png"],
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProducts([...products, product])
    setNewProduct({
      name: "",
      description: "",
      sku: "",
      category: "",
      price: 0,
      cost: 0,
      stockLevel: 0,
      minStock: 0,
    })
    setIsAddDialogOpen(false)
  }

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const getStockStatus = (product: Product) => {
    if (product.stockLevel === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (product.stockLevel <= product.minStock) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product)

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <Badge className={stockStatus.color} variant="secondary">
                {stockStatus.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500">({product.rating})</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-gray-900">${product.price}</div>
                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Stock: {product.stockLevel}</div>
                <div className="text-xs text-gray-500">{product.category}</div>
              </div>
            </div>
            <Button
              onClick={() => addToCart(product.id)}
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={product.stockLevel === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart {cart[product.id] && `(${cart[product.id]})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the product information to add it to your catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Premium Widget Pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="WIDGET-PRO-001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="High-quality widget for professional use"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="Electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      placeholder="299.99"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                      placeholder="150.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Level</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stockLevel}
                      onChange={(e) => setNewProduct({ ...newProduct, stockLevel: Number(e.target.value) })}
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="bg-amber-600 hover:bg-amber-700">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList>
          <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4">
            {products.map((product) => {
              const stockStatus = getStockStatus(product)
              return (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{product.stockLevel}</div>
                          <div className="text-xs text-gray-500">Current</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{product.minStock}</div>
                          <div className="text-xs text-gray-500">Min Stock</div>
                        </div>
                        <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{products.length}</div>
                <p className="text-sm text-gray-600 mt-1">Active products</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${products.reduce((sum, p) => sum + p.price * p.stockLevel, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">Inventory value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {products.filter((p) => p.stockLevel <= p.minStock).length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Items need restock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
                <p className="text-sm text-gray-600 mt-1">Product categories</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
