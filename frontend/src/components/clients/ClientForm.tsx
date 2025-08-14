"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema, type ClientFormData } from "@/lib/validations"
import { clientService } from "@/services/clientService"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { FileUpload } from "@/components/ui/FileUpload"
import { Alert } from "@/components/ui/Alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface ClientFormProps {
  onSuccess?: (client: any, contractUrl?: string) => void
  onCancel?: () => void
}

const companySizeOptions = [
  { value: "", label: "Select company size" },
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
]

const monthlyConsumptionOptions = [
  { value: "0", label: "Select monthly consumption" },
  { value: "1000", label: "Up to $1,000" },
  { value: "5000", label: "$1,000 - $5,000" },
  { value: "10000", label: "$5,000 - $10,000" },
  { value: "25000", label: "$10,000 - $25,000" },
  { value: "50000", label: "$25,000 - $50,000" },
  { value: "100000", label: "$50,000+" },
]

export const ClientForm = ({ onSuccess, onCancel }: ClientFormProps) => {
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companySize: "",
      monthlyConsumption: 0,
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Convert monthlyConsumption to number if it's a string
      const formData = {
        ...data,
        monthlyConsumption:
          typeof data.monthlyConsumption === "string"
            ? Number.parseInt(data.monthlyConsumption)
            : data.monthlyConsumption,
      }

      const response = await clientService.createClient(formData)

      // Upload files if any
      if (files.length > 0 && response.client.id) {
        try {
          await clientService.uploadClientFiles(response.client.id, files)
        } catch (uploadError) {
          console.error("File upload failed:", uploadError)
          // Don't fail the entire process if file upload fails
        }
      }

      reset()
      setFiles([])
      onSuccess?.(response.client, response.contract?.contractUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <Alert variant="destructive">{error}</Alert>}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                placeholder="Acme Corporation"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="contact@acme.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Website"
                type="url"
                placeholder="https://acme.com"
                error={errors.website?.message}
                {...register("website")}
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Business ID"
                placeholder="123456789"
                error={errors.businessId?.message}
                {...register("businessId")}
              />

              <Input
                label="Tax Number"
                placeholder="TAX123456"
                error={errors.taxNumber?.message}
                {...register("taxNumber")}
              />

              <Input
                label="Industry"
                placeholder="Technology"
                error={errors.industry?.message}
                {...register("industry")}
              />

              <Controller
                name="companySize"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Company Size"
                    options={companySizeOptions}
                    error={errors.companySize?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>

            <Input
              label="Address"
              placeholder="123 Business Street"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City" placeholder="New York" error={errors.city?.message} {...register("city")} />

              <Input label="State" placeholder="NY" error={errors.state?.message} {...register("state")} />

              <Input label="ZIP Code" placeholder="10001" error={errors.zipCode?.message} {...register("zipCode")} />
            </div>

            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>

          {/* Branch Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Branch Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Branch Name"
                placeholder="Main Branch"
                error={errors.branchInfo?.branchName?.message}
                {...register("branchInfo.branchName")}
              />

              <Input
                label="Branch Contact"
                placeholder="John Doe"
                error={errors.branchInfo?.branchContact?.message}
                {...register("branchInfo.branchContact")}
              />
            </div>

            <Input
              label="Branch Address"
              placeholder="456 Branch Street"
              error={errors.branchInfo?.branchAddress?.message}
              {...register("branchInfo.branchAddress")}
            />
          </div>

          {/* Business Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Preferences</h3>

            <Controller
              name="monthlyConsumption"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Select
                  label="Monthly Consumption"
                  options={monthlyConsumptionOptions}
                  error={errors.monthlyConsumption?.message}
                  onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
                  value={value?.toString() || "0"}
                  {...field}
                />
              )}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Visuals</h3>
            <FileUpload
              label="Upload Images/Videos"
              accept="image/*,video/*"
              multiple={true}
              maxFiles={5}
              maxSize={10}
              onFilesChange={setFiles}
            />
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional information about the client..."
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
              {isLoading ? "Creating Client..." : "Add New Client"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
