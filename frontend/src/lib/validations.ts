import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().optional(),
  businessId: z.string().optional(),
  taxNumber: z.string().optional(),
  address: z.string().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().max(50, "City must be less than 50 characters").optional(),
  state: z.string().max(50, "State must be less than 50 characters").optional(),
  zipCode: z.string().max(20, "ZIP code must be less than 20 characters").optional(),
  country: z.string().max(50, "Country must be less than 50 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  industry: z.string().max(50, "Industry must be less than 50 characters").optional(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+", ""]).optional(),
  monthlyConsumption: z.number().min(0, "Monthly consumption must be positive").optional(),
  productIds: z.array(z.string()).optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  branchInfo: z
    .object({
      branchName: z.string().max(100, "Branch name must be less than 100 characters").optional(),
      branchAddress: z.string().max(200, "Branch address must be less than 200 characters").optional(),
      branchContact: z.string().max(100, "Branch contact must be less than 100 characters").optional(),
    })
    .optional(),
})

export const orderSchema = z.object({
  orderDate: z.string().min(1, "Order date is required"),
  clientId: z.string().min(1, "Client is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Unit price must be positive").optional(),
      }),
    )
    .min(1, "At least one product is required"),
  deliveryInfo: z.string().max(500, "Delivery info must be less than 500 characters").optional(),
  receiverContact: z.string().max(100, "Receiver contact must be less than 100 characters").optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ClientFormData = z.infer<typeof clientSchema>
export type OrderFormData = z.infer<typeof orderSchema>
