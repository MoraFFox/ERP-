"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { OrderForm } from "@/components/orders/OrderForm"
import { OrderList } from "@/components/orders/OrderList"
import { Plus, Download, CheckCircle } from "lucide-react"
import type { Order } from "@/types"

export const OrdersPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleOrderSuccess = (order: any, pdf?: string) => {
    setShowForm(false)
    setSuccessMessage(`Order #${order.id.slice(-8)} has been created successfully!`)
    if (pdf) {
      setPdfUrl(pdf)
    }
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("")
      setPdfUrl("")
    }, 5000)
  }

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
    // You could open a modal or navigate to order details page
    console.log("Selected order:", order)
  }

  const handleOrderEdit = (order: Order) => {
    // You could open edit form or navigate to edit page
    console.log("Edit order:", order)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Order Management</h1>
          <p className="text-gray-600">Streamlined Order Processing</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "View Orders" : "Create New Order"}
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <div className="flex items-center justify-between w-full">
            <span>{successMessage}</span>
            {pdfUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(pdfUrl, "_blank")} className="ml-4">
                <Download className="mr-2 h-4 w-4" />
                Download Order PDF
              </Button>
            )}
          </div>
        </Alert>
      )}

      {/* Content */}
      {showForm ? (
        <OrderForm onSuccess={handleOrderSuccess} onCancel={() => setShowForm(false)} />
      ) : (
        <OrderList onOrderSelect={handleOrderSelect} onOrderEdit={handleOrderEdit} />
      )}
    </div>
  )
}
