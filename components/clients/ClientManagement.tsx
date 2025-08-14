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
import { Plus, Search, Filter, Building2, Phone, Mail, MapPin, FileText, Edit, Trash2 } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  industry: string
  status: "ACTIVE" | "INACTIVE" | "PROSPECT"
  monthlyConsumption: number
  createdAt: string
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0123",
    address: "123 Business St",
    city: "New York",
    industry: "Technology",
    status: "ACTIVE",
    monthlyConsumption: 15000,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "hello@techstart.com",
    phone: "+1-555-0456",
    address: "456 Innovation Ave",
    city: "San Francisco",
    industry: "Software",
    status: "ACTIVE",
    monthlyConsumption: 8500,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Global Manufacturing",
    email: "info@globalmanuf.com",
    phone: "+1-555-0789",
    address: "789 Industrial Blvd",
    city: "Chicago",
    industry: "Manufacturing",
    status: "PROSPECT",
    monthlyConsumption: 25000,
    createdAt: "2024-03-10",
  },
]

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    industry: "",
    monthlyConsumption: 0,
  })

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: "PROSPECT",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setClients([...clients, client])
    setNewClient({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      industry: "",
      monthlyConsumption: 0,
    })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800"
      case "PROSPECT":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Manage your business relationships and client information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter the client information to create a new business relationship.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={newClient.industry}
                    onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                    placeholder="Technology"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    placeholder="123 Business Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newClient.city}
                    onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumption">Monthly Consumption ($)</Label>
                <Input
                  id="consumption"
                  type="number"
                  value={newClient.monthlyConsumption}
                  onChange={(e) => setNewClient({ ...newClient, monthlyConsumption: Number(e.target.value) })}
                  placeholder="15000"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient} className="bg-amber-600 hover:bg-amber-700">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Client List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {client.address}, {client.city}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>{client.industry}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <span className="text-gray-500">Monthly: ${client.monthlyConsumption.toLocaleString()}</span>
                          <span className="text-gray-500">Since: {client.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        Contract
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{clients.length}</div>
                <p className="text-sm text-gray-600 mt-1">Active business relationships</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${clients.reduce((sum, client) => sum + client.monthlyConsumption, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">Total monthly consumption</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((clients.filter((c) => c.status === "ACTIVE").length / clients.length) * 100)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">Client activation rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
