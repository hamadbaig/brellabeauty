import { Product } from '@/types/product'

interface WhatsAppOrderOptions {
  shade?: string
  size?: string
  price?: number
  url?: string
}

// Normalizes any input format (local "0317...", spaces, dashes, +92...) into the digits-only
// international format wa.me requires (country code + number, no leading zero or symbols).
export function normalizeWhatsAppNumber(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`
  else if (!digits.startsWith('92') && digits.length === 10) digits = `92${digits}`
  return digits
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
  return `https://wa.me/${normalizeWhatsAppNumber(product.whatsappNumber)}?text=${text}`
}
