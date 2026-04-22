import Medusa from "@medusajs/js-sdk"

// Storefront client
export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "session",
  }
})

// Admin client
export const medusaAdmin = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  apiKey: process.env.NEXT_PUBLIC_MEDUSA_ADMIN_API_KEY,
})