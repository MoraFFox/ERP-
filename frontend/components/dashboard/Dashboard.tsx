"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, ShoppingCart, LogOut, Plus, Calendar, MapPin, Truck, Wrench } from "lucide-react"
import ClientManagement from "@/components/clients/ClientManagement"
import ProductCatalog from "@/components/products/ProductCatalog"
import OrderManagement from "@/components/orders/OrderManagement"

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Enterprise ERP</h1>
                <p className="text-xs text-gray-500">Advanced Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+23%</span> from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-amber-600">12</span> scheduled today
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Visits</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">8</span> scheduled this week
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery completed</p>
                        <p className="text-xs text-gray-500">Order #1234 - 5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Maintenance visit scheduled</p>
                        <p className="text-xs text-gray-500">TechStart Inc - 15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Client visit logged</p>
                        <p className="text-xs text-gray-500">Acme Corp - 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Upcoming deliveries and visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery Route A</p>
                        <p className="text-xs text-gray-500">5 stops - 9:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Wrench className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Maintenance Visit</p>
                        <p className="text-xs text-gray-500">TechStart Inc - 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Client Visit</p>
                        <p className="text-xs text-gray-500">Acme Corp - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => setActiveTab("orders")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Order
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => setActiveTab("deliveries")}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Schedule Delivery
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => setActiveTab("maintenance")}
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Plan Maintenance
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => setActiveTab("schedule")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-8">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="products" className="mt-8">
            <ProductCatalog />
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="deliveries" className="mt-8">
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Management</h3>
              <p className="text-gray-600 mb-6">Manage delivery schedules, routes, and tracking</p>
              <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <p className="text-sm text-gray-600">Pending Deliveries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <p className="text-sm text-gray-600">Today's Routes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600">8</div>
                    <p className="text-sm text-gray-600">Active Drivers</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-8">
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Management</h3>
              <p className="text-gray-600 mb-6">Schedule and track maintenance visits with route optimization</p>
              <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <p className="text-sm text-gray-600">Scheduled Visits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <p className="text-sm text-gray-600">Active Technicians</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600">156</div>
                    <p className="text-sm text-gray-600">Total KM This Week</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-8">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unified Schedule</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive calendar view of all deliveries, maintenance, and visits
              </p>
              <div className="grid gap-4 md:grid-cols-4 max-w-5xl mx-auto">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-sm text-gray-600">Today's Events</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <p className="text-sm text-gray-600">This Week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600">156</div>
                    <p className="text-sm text-gray-600">This Month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
