"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Calendar,
  User,
  Package,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  clientId: string
  clientName: string
  orderDate: string
  deliveryDate: string
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  items: OrderItem[]
  totalAmount: number
  deliveryAddress: string
  receiverContact: string
  notes: string
  createdAt: string
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    clientId: "1",
    clientName: "Acme Corporation",
    orderDate: "2024-03-15",
    deliveryDate: "2024-03-20",
    status: "CONFIRMED",
    items: [
      { productId: "1", productName: "Premium Widget Pro", quantity: 5, price: 299.99 },
      { productId: "2", productName: "Smart Connector Kit", quantity: 10, price: 89.99 },
    ],
    totalAmount: 2399.85,
    deliveryAddress: "123 Business St, New York, NY 10001",
    receiverContact: "John Smith - +1-555-0123",
    notes: "Urgent delivery required",
    createdAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    clientId: "2",
    clientName: "TechStart Inc",
    orderDate: "2024-03-16",
    deliveryDate: "2024-03-22",
    status: "PROCESSING",
    items: [{ productId: "3", productName: "Industrial Sensor Array", quantity: 2, price: 599.99 }],
    totalAmount: 1199.98,
    deliveryAddress: "456 Innovation Ave, San Francisco, CA 94105",
    receiverContact: "Jane Doe - +1-555-0456",
    notes: "Handle with care - fragile equipment",
    createdAt: "2024-03-16T14:15:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    clientId: "3",
    clientName: "Global Manufacturing",
    orderDate: "2024-03-17",
    deliveryDate: "2024-03-25",
    status: "PENDING",
    items: [
      { productId: "1", productName: "Premium Widget Pro", quantity: 20, price: 299.99 },
      { productId: "2", productName: "Smart Connector Kit", quantity: 50, price: 89.99 },
    ],
    totalAmount: 10499.3,
    deliveryAddress: "789 Industrial Blvd, Chicago, IL 60601",
    receiverContact: "Mike Johnson - +1-555-0789",
    notes: "Bulk order - coordinate with warehouse",
    createdAt: "2024-03-17T09:45:00Z",
  },
]

const mockClients = [
  { id: "1", name: "Acme Corporation" },
  { id: "2", name: "TechStart Inc" },
  { id: "3", name: "Global Manufacturing" },
]

const mockProducts = [
  { id: "1", name: "Premium Widget Pro", price: 299.99 },
  { id: "2", name: "Smart Connector Kit", price: 89.99 },
  { id: "3", name: "Industrial Sensor Array", price: 599.99 },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    clientId: "",
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    deliveryAddress: "",
    receiverContact: "",
    notes: "",
    items: [] as { productId: string; quantity: number }[],
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddOrder = () => {
    const orderItems: OrderItem[] = newOrder.items.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)!
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      }
    })

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, "0")}`,
      clientName: mockClients.find((c) => c.id === newOrder.clientId)?.name || "",
      ...newOrder,
      status: "PENDING",
      items: orderItems,
      totalAmount,
      createdAt: new Date().toISOString(),
    }

    setOrders([...orders, order])
    setNewOrder({
      clientId: "",
      orderDate: new Date().toISOString().split("T")[0],
      deliveryDate: "",
      deliveryAddress: "",
      receiverContact: "",
      notes: "",
      items: [],
    })
    setIsAddDialogOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4" />
      case "PROCESSING":
        return <Package className="w-4 h-4" />
      case "SHIPPED":
        return <Truck className="w-4 h-4" />
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "PROCESSING":
        return "bg-purple-100 text-purple-800"
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addOrderItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1 }],
    }))
  }

  const updateOrderItem = (index: number, field: string, value: any) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeOrderItem = (index: number) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Process and track customer orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Enter the order details and select products for the customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={newOrder.clientId}
                    onValueChange={(value) => setNewOrder({ ...newOrder, clientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={newOrder.orderDate}
                    onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverContact">Receiver Contact</Label>
                  <Input
                    id="receiverContact"
                    value={newOrder.receiverContact}
                    onChange={(e) => setNewOrder({ ...newOrder, receiverContact: e.target.value })}
                    placeholder="John Smith - +1-555-0123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  value={newOrder.deliveryAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                  placeholder="123 Business Street, City, State, ZIP"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Order Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateOrderItem(index, "productId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, "quantity", Number(e.target.value))}
                        placeholder="Qty"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-medium">
                        $
                        {item.productId
                          ? (mockProducts.find((p) => p.id === item.productId)?.price || 0) * item.quantity
                          : 0}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeOrderItem(index)}>
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Special instructions or notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOrder} className="bg-amber-600 hover:bg-amber-700">
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Order List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{order.clientName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Order: {order.orderDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4" />
                            <span>Delivery: {order.deliveryDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${order.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <div>
                          <strong>Delivery:</strong> {order.deliveryAddress}
                        </div>
                        <div>
                          <strong>Contact:</strong> {order.receiverContact}
                        </div>
                        {order.notes && (
                          <div>
                            <strong>Notes:</strong> {order.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{orders.length}</div>
                <p className="text-sm text-gray-600 mt-1">All time orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">Total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "PENDING").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Awaiting confirmation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "DELIVERED").length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Successfully completed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
