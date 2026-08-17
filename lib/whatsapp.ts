import { Product } from '@/types/product'

interface WhatsAppOrderOptions {
  shade?: string
  size?: string
  price?: number
  url?: string
}

// Builds a wa.me deep link carrying the full product reference (name, SKU, price, shade, size, link).
export function buildProductWhatsAppLink(product: Product, options: WhatsAppOrderOptions = {}): string {
  const price = options.price ?? product.price
  const lines = [
    `Hi! I'm interested in ordering this product from Brella Beauty:`,
    ``,
    `*${product.name}*`,
    `SKU: ${product.sku}`,
    `Price: ${product.currencySymbol} ${price.toLocaleString('en-PK')}`,
  ]

  if (options.shade) lines.push(`Shade: ${options.shade}`)
  if (options.size) lines.push(`Size: ${options.size}`)
  if (options.url) lines.push(``, options.url)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${product.whatsappNumber}?text=${text}`
}
