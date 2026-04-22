import { StoreProduct, StoreProductVariant } from "@medusajs/types"

export type ProductBuilderCustomField = {
  id: string
  name: string
  type: "text" | "number"
  description?: string
  is_required: boolean
}

export type ProductBuilderComplementaryProduct = {
  id: string
  product: StoreProduct
}

export type ProductBuilderAddon = {
  id: string
  product: StoreProduct
}

export type ProductBuilder = {
  id: string
  product_id: string
  custom_fields: ProductBuilderCustomField[]
  complementary_products: ProductBuilderComplementaryProduct[]
  addons: ProductBuilderAddon[]
}

// Extended Product Type with Product Builder
export type ProductWithBuilder = StoreProduct & {
  product_builder?: ProductBuilder
}

// Product Builder Configuration Types
export type CustomFieldValue = {
  field_id: string
  value: string | number
}

export type ComplementarySelection = {
  product_id: string
  variant_id: string
  title: string
  thumbnail?: string
  price: number
}

export type AddonSelection = {
  product_id: string
  variant_id: string
  title: string
  thumbnail?: string
  price: number
  quantity: number
}

export type BuilderConfiguration = {
  custom_fields: CustomFieldValue[]
  complementary_products: ComplementarySelection[]
  addons: AddonSelection[]
}
export type DigitalProduct = {
  id: string
  name: string
  medias?: DigitalProductMedia[]
}

export type DigitalProductMedia = {
  id: string
  fileId: string
  type: "preview" | "main"
  mimeType: string
  digitalProduct?: DigitalProduct[]
}

export type DigitalProductPreview = DigitalProductMedia & {
  url: string
}

export type VariantWithDigitalProduct = StoreProductVariant & {
  digital_product?: DigitalProduct
}