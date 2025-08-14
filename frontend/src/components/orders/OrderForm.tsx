"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema, type OrderFormData } from "@/lib/validations"
import { orderService } from "@/services/orderService"
import { clientService } from "@/services/clientService"
import { productService } from "@/services/productService"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import type { Client, Product } from "@/types"

interface OrderFormProps {
  onSuccess?: (order: any, pdfUrl?: string) => void
  onCancel?: () => void
}

export const OrderForm = ({ onSuccess, onCancel }: OrderFormProps) => {
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split("T")[0],
      items: [{ productId: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const watchedItems = watch("items")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const [clientsResponse, productsResponse] = await Promise.all([
          clientService.getClients({ limit: 100, status: "ACTIVE" }),
          productService.getProducts({ limit: 100, isActive: true }),
        ])
        setClients(clientsResponse.data.items)
        setProducts(productsResponse.data.items)
      } catch (err) {
        setError("Failed to load clients and products")
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const clientOptions = [
    { value: "", label: "Select a client" },
    ...clients.map((client) => ({ value: client.id, label: client.name })),
  ]

  const getProductOptions = (excludeIds: string[] = []) => [
    { value: "", label: "Select a product" },
    ...products
      .filter((product) => !excludeIds.includes(product.id))
      .map((product) => ({
        value: product.id,
        label: `${product.name} - ${formatCurrency(product.price)} (Stock: ${product.stockLevel})`,
      })),
  ]

  const getProductById = (id: string) => products.find((p) => p.id === id)

  const calculateItemTotal = (productId: string, quantity: number) => {
    const product = getProductById(productId)
    return product ? product.price * quantity : 0
  }

  const calculateOrderTotal = () => {
    return watchedItems.reduce((total, item) => {
      return total + calculateItemTotal(item.productId, item.quantity)
    }, 0)
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Add unit prices to items
      const itemsWithPrices = data.items.map((item) => {
        const product = getProductById(item.productId)
        return {
          ...item,
          unitPrice: product?.price || 0,
        }
      })

      const orderData = {
        ...data,
        items: itemsWithPrices,
      }

      const response = await orderService.createOrder(orderData)

      reset()
      onSuccess?.(response.order, response.pdfUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order form...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <Alert variant="destructive">{error}</Alert>}

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Order Date *" type="date" error={errors.orderDate?.message} {...register("orderDate")} />

              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select label="Client *" options={clientOptions} error={errors.clientId?.message} {...field} />
                )}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1 })}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const selectedProductIds = watchedItems
                  .map((item, i) => (i !== index ? item.productId : ""))
                  .filter(Boolean)
                const product = getProductById(watchedItems[index]?.productId)
                const itemTotal = calculateItemTotal(watchedItems[index]?.productId, watchedItems[index]?.quantity)

                return (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-6">
                        <Controller
                          name={`items.${index}.productId`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              label="Product *"
                              options={getProductOptions(selectedProductIds)}
                              error={errors.items?.[index]?.productId?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          label="Quantity *"
                          type="number"
                          min="1"
                          max={product?.stockLevel || 999}
                          error={errors.items?.[index]?.quantity?.message}
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Unit Price</label>
                          <div className="text-sm text-gray-600">{product ? formatCurrency(product.price) : "-"}</div>
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Total</label>
                          <div className="text-sm font-semibold text-primary">{formatCurrency(itemTotal)}</div>
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {product && (
                      <div className="mt-2 text-xs text-gray-500">
                        Stock available: {product.stockLevel} {product.unit}
                        {watchedItems[index]?.quantity > product.stockLevel && (
                          <span className="text-red-500 ml-2">⚠ Insufficient stock</span>
                        )}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {/* Order Total */}
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-lg font-semibold">Order Total: {formatCurrency(calculateOrderTotal())}</div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Info</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Delivery address, special instructions, etc."
                  {...register("deliveryInfo")}
                />
                {errors.deliveryInfo && <p className="text-sm text-destructive">{errors.deliveryInfo.message}</p>}
              </div>

              <Input
                label="Receiver Contact"
                placeholder="Contact person for delivery"
                error={errors.receiverContact?.message}
                {...register("receiverContact")}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <div className="space-y-2">
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional notes for this order..."
                {...register("notes")}
              />
              {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? "Creating Order..." : "Create New Order"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
