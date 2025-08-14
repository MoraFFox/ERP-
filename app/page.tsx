"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Package, ShoppingCart, Users, Shield, Database, Cloud } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"
import Dashboard from "@/components/dashboard/Dashboard"

export default function ERPSystem() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "register" | "dashboard">("landing")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm onSuccess={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setCurrentView("landing")}>
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm onSuccess={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setCurrentView("landing")}>
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "dashboard" && isAuthenticated) {
    return (
      <Dashboard
        onLogout={() => {
          setIsAuthenticated(false)
          setCurrentView("landing")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Enterprise ERP</h1>
                <p className="text-sm text-amber-600">Business Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setCurrentView("login")}>
                Sign In
              </Button>
              <Button onClick={() => setCurrentView("register")} className="bg-amber-600 hover:bg-amber-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-300">
            Stage 2 Complete - Frontend & Backend Ready
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Complete ERP Solution</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive Enterprise Resource Planning system with client management, product catalog, order
            processing, and robust authentication. Built with modern technologies for scalability and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setCurrentView("login")} className="bg-amber-600 hover:bg-amber-700">
              Access System
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">System Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Complete client onboarding with business details, contract generation, and relationship tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Business registration & tax info</li>
                  <li>• Monthly consumption tracking</li>
                  <li>• Automated contract generation</li>
                  <li>• File upload capabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>
                  Comprehensive product management with images, pricing, inventory, and quality ratings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visual product gallery</li>
                  <li>• Advanced filtering & search</li>
                  <li>• Stock level monitoring</li>
                  <li>• Quality rating system</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingCart className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Order Processing</CardTitle>
                <CardDescription>
                  Daily order management with client selection, product quantities, and delivery tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-product order forms</li>
                  <li>• Delivery information</li>
                  <li>• PDF order confirmations</li>
                  <li>• Order status tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Security & Auth</CardTitle>
                <CardDescription>
                  Enterprise-grade authentication with JWT tokens, refresh mechanisms, and role-based access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• JWT token authentication</li>
                  <li>• Automatic token refresh</li>
                  <li>• Password encryption</li>
                  <li>• Role-based permissions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Database & API</CardTitle>
                <CardDescription>
                  Robust PostgreSQL database with Prisma ORM and comprehensive RESTful API endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PostgreSQL with Prisma</li>
                  <li>• RESTful API design</li>
                  <li>• Data validation & sanitization</li>
                  <li>• Comprehensive error handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cloud className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Deployment Ready</CardTitle>
                <CardDescription>
                  Docker containerization, environment configuration, and production-ready deployment setup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Docker Compose setup</li>
                  <li>• Environment management</li>
                  <li>• Health monitoring</li>
                  <li>• Scalable architecture</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Technology Stack</h3>
          <Tabs defaultValue="backend" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>
            <TabsContent value="backend" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Core Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Express.js</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">Prisma ORM</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Security & Validation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">JWT</Badge>
                      <Badge variant="secondary">bcrypt</Badge>
                      <Badge variant="secondary">Joi Validation</Badge>
                      <Badge variant="secondary">Rate Limiting</Badge>
                      <Badge variant="secondary">CORS</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="frontend" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>UI Framework</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">React 18</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Vite</Badge>
                      <Badge variant="secondary">React Router</Badge>
                      <Badge variant="secondary">Zustand</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Styling & Forms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">Shadcn UI</Badge>
                      <Badge variant="secondary">React Hook Form</Badge>
                      <Badge variant="secondary">Zod Validation</Badge>
                      <Badge variant="secondary">Lucide Icons</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="deployment" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Containerization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Docker</Badge>
                      <Badge variant="secondary">Docker Compose</Badge>
                      <Badge variant="secondary">Multi-stage Builds</Badge>
                      <Badge variant="secondary">Health Checks</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation & Testing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">OpenAPI Spec</Badge>
                      <Badge variant="secondary">Jest Testing</Badge>
                      <Badge variant="secondary">Postman Collection</Badge>
                      <Badge variant="secondary">API Documentation</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Status & Next Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Development Status</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Stage 1 - Backend ✓</CardTitle>
                <CardDescription>Complete API with authentication, database, and Docker setup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 text-sm text-green-700">
                  <div>✓ Database schema & migrations</div>
                  <div>✓ JWT authentication system</div>
                  <div>✓ Client & product CRUD APIs</div>
                  <div>✓ Docker containerization</div>
                  <div>✓ API documentation & testing</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Stage 2 - Frontend ✓</CardTitle>
                <CardDescription>React application with full ERP functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 text-sm text-green-700">
                  <div>✓ Authentication UI</div>
                  <div>✓ Client management interface</div>
                  <div>✓ Product catalog with filtering</div>
                  <div>✓ Order processing system</div>
                  <div>✓ Error handling & API integration</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-amber-800 mb-4">Ready for Stage 3</h4>
            <p className="text-amber-700 mb-6">
              The ERP system foundation is complete with both backend API and frontend interface. The system is ready
              for advanced features, reporting, and production deployment.
            </p>
            <Button size="lg" onClick={() => setCurrentView("login")} className="bg-amber-600 hover:bg-amber-700">
              Evaluate System →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Enterprise ERP</span>
          </div>
          <p className="text-gray-400">Built with modern technologies for scalable business management</p>
        </div>
      </footer>
    </div>
  )
}
