import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import request from "supertest"
import { app } from "../src/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

describe("Stage 3 ERP System Tests", () => {
  let authToken: string
  let testClientId: string
  let testOrderId: string

  beforeEach(async () => {
    // Setup test data and authentication
    const loginResponse = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    })

    authToken = loginResponse.body.data.accessToken

    // Create test client
    const clientResponse = await request(app).post("/api/clients").set("Authorization", `Bearer ${authToken}`).send({
      name: "Test Client",
      email: "client@test.com",
      phone: "+1234567890",
    })

    testClientId = clientResponse.body.data.id
  })

  afterEach(async () => {
    // Cleanup test data
    await prisma.deliverySchedule.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.visitCall.deleteMany()
    await prisma.maintenanceVisit.deleteMany()
    await prisma.client.deleteMany()
  })

  describe("Orders Module", () => {
    it("should create order with automatic delivery scheduling", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientId: testClientId,
          orderDate: new Date().toISOString(),
          deliveryAddress: "123 Test Street",
          items: [{ productId: "test-product-id", quantity: 5, unitPrice: 99.99 }],
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("PENDING")

      testOrderId = response.body.data.id

      // Check if delivery schedule was created
      const deliveryResponse = await request(app)
        .get(`/api/deliveries/order/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(deliveryResponse.status).toBe(200)
      expect(deliveryResponse.body.data).toBeDefined()
    })

    it("should update order status", async () => {
      // First create an order
      const orderResponse = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientId: testClientId,
          orderDate: new Date().toISOString(),
          deliveryAddress: "123 Test Street",
          items: [{ productId: "test-product-id", quantity: 1, unitPrice: 50.0 }],
        })

      const orderId = orderResponse.body.data.id

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "CONFIRMED" })

      expect(response.status).toBe(200)
      expect(response.body.data.status).toBe("CONFIRMED")
    })
  })

  describe("Delivery Scheduling", () => {
    it("should get delivery schedules with filtering", async () => {
      const response = await request(app)
        .get("/api/deliveries")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ status: "SCHEDULED", date: new Date().toISOString().split("T")[0] })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.deliveries)).toBe(true)
    })

    it("should reschedule delivery", async () => {
      // Create order first to get delivery schedule
      const orderResponse = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientId: testClientId,
          orderDate: new Date().toISOString(),
          deliveryAddress: "123 Test Street",
          items: [{ productId: "test-product-id", quantity: 1, unitPrice: 25.0 }],
        })

      const deliveryResponse = await request(app)
        .get(`/api/deliveries/order/${orderResponse.body.data.id}`)
        .set("Authorization", `Bearer ${authToken}`)

      const deliveryId = deliveryResponse.body.data.id
      const newDate = new Date()
      newDate.setDate(newDate.getDate() + 2)

      const rescheduleResponse = await request(app)
        .put(`/api/deliveries/${deliveryId}/reschedule`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ deliveryDate: newDate.toISOString() })

      expect(rescheduleResponse.status).toBe(200)
      expect(rescheduleResponse.body.success).toBe(true)
    })
  })

  describe("Maintenance Scheduling", () => {
    it("should create maintenance visit with location", async () => {
      const response = await request(app)
        .post("/api/maintenance")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientId: testClientId,
          visitType: "PREVENTIVE",
          scheduledDate: new Date().toISOString(),
          location: { lat: 40.7128, lng: -74.006 },
          estimatedDuration: 120,
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.location).toEqual({ lat: 40.7128, lng: -74.006 })
    })

    it("should optimize technician routes", async () => {
      const response = await request(app)
        .get("/api/maintenance/routes/optimize")
        .set("Authorization", `Bearer ${authToken}`)
        .query({
          technicianId: "test-technician-id",
          date: new Date().toISOString().split("T")[0],
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.optimizedRoute).toBeDefined()
    })
  })

  describe("Visits & Calls Logging", () => {
    it("should log client visit with distance", async () => {
      const response = await request(app).post("/api/visit-calls").set("Authorization", `Bearer ${authToken}`).send({
        clientId: testClientId,
        type: "IN_PERSON_VISIT",
        purpose: "Sales meeting",
        outcome: "Positive discussion about new products",
        distanceKm: 15.5,
        visitDate: new Date().toISOString(),
      })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.distanceKm).toBe(15.5)
    })

    it("should get visit history for client", async () => {
      const response = await request(app)
        .get(`/api/visit-calls/client/${testClientId}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.visits)).toBe(true)
    })
  })

  describe("Integration Tests", () => {
    it("should handle complete order-to-delivery workflow", async () => {
      // Create order
      const orderResponse = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientId: testClientId,
          orderDate: new Date().toISOString(),
          deliveryAddress: "123 Test Street",
          items: [{ productId: "test-product-id", quantity: 3, unitPrice: 75.0 }],
        })

      expect(orderResponse.status).toBe(201)
      const orderId = orderResponse.body.data.id

      // Confirm order
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "CONFIRMED" })

      // Check delivery was scheduled
      const deliveryResponse = await request(app)
        .get(`/api/deliveries/order/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(deliveryResponse.status).toBe(200)
      expect(deliveryResponse.body.data.status).toBe("SCHEDULED")

      // Complete delivery
      const deliveryId = deliveryResponse.body.data.id
      const completeResponse = await request(app)
        .put(`/api/deliveries/${deliveryId}/complete`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ notes: "Delivered successfully" })

      expect(completeResponse.status).toBe(200)
      expect(completeResponse.body.data.status).toBe("DELIVERED")
    })
  })
})
