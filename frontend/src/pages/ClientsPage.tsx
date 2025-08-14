"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { ClientForm } from "@/components/clients/ClientForm"
import { ClientList } from "@/components/clients/ClientList"
import { Plus, Download } from "lucide-react"
import type { Client } from "@/types"

export const ClientsPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [contractUrl, setContractUrl] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleClientSuccess = (client: any, contract?: string) => {
    setShowForm(false)
    setSuccessMessage(`Client "${client.name}" has been created successfully!`)
    if (contract) {
      setContractUrl(contract)
    }
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("")
      setContractUrl("")
    }, 5000)
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    // You could open a modal or navigate to client details page
    console.log("Selected client:", client)
  }

  const handleClientEdit = (client: Client) => {
    // You could open edit form or navigate to edit page
    console.log("Edit client:", client)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Client Management</h1>
          <p className="text-gray-600">Your Client Relationships, Simplified</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "View Clients" : "Add New Client"}
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            {contractUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(contractUrl, "_blank")} className="ml-4">
                <Download className="mr-2 h-4 w-4" />
                Download Contract
              </Button>
            )}
          </div>
        </Alert>
      )}

      {/* Content */}
      {showForm ? (
        <ClientForm onSuccess={handleClientSuccess} onCancel={() => setShowForm(false)} />
      ) : (
        <ClientList onClientSelect={handleClientSelect} onClientEdit={handleClientEdit} />
      )}
    </div>
  )
}
