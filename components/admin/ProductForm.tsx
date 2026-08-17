'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { UploadButton } from '@/lib/uploadthing'

interface ShadeEntry { name: string; hex: string; images: string[] }
interface SizeEntry { label: string; available: boolean }
interface FAQEntry { question: string; answer: string }
interface IngredientEntry { name: string; purpose: string; percentage: string }

interface FormData {
  name: string; slug: string; sku: string; price: number; originalPrice: number | ''; collection: string
  category: string; subcategory: string; finish: string; inStock: boolean; stockCount: number | ''
  highlights: string; tags: string; whatsappNumber: string; metaTitle: string; metaDescription: string
  colors: ShadeEntry[]; sizes: SizeEntry[]
  description: { overview: string; ingredients: string; howToUse: string; benefits: string }
  ingredientsList: IngredientEntry[]
  productInfo: { crueltyFree: boolean; vegan: boolean; paraben: boolean; waterproof: boolean; longLasting: string; skinType: string }
  deliveryInfo: { estimatedDays: string; regions: string; returnPolicy: string; exchangePolicy: string; freeShippingThreshold: number | '' }
  faqs: FAQEntry[]
}

const DEFAULT_SIZES: SizeEntry[] = [
  { label: '30ml', available: true },
  { label: '50ml', available: true },
  { label: '100ml', available: true },
]

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildInitialForm(initial?: any): FormData {
  if (!initial) {
    return {
      name: '', slug: '', sku: '', price: 0, originalPrice: '', collection: '', category: '', subcategory: '',
      finish: '', inStock: true, stockCount: '', highlights: '', tags: '', whatsappNumber: '923172760406',
      metaTitle: '', metaDescription: '',
      colors: [{ name: 'Rose Quartz', hex: '#E8B4B8', images: [''] }],
      sizes: DEFAULT_SIZES,
      description: { overview: '', ingredients: '', howToUse: '', benefits: '' },
      ingredientsList: [],
      productInfo: { crueltyFree: true, vegan: false, paraben: false, waterproof: false, longLasting: '', skinType: 'All' },
      deliveryInfo: { estimatedDays: '3–5 Business Days', regions: 'All Major Cities in Pakistan\nInternational Shipping Available', returnPolicy: '7-day easy returns', exchangePolicy: 'Free exchange within 14 days', freeShippingThreshold: 2500 },
      faqs: [],
    }
  }
  return {
    ...initial,
    finish: initial.finish ?? '',
    originalPrice: initial.originalPrice ?? '',
    stockCount: initial.stockCount ?? '',
    highlights: (initial.highlights ?? []).join('\n'),
    tags: (initial.tags ?? []).join(', '),
    colors: initial.colors?.length ? initial.colors.map((c: any) => ({ ...c, images: c.images?.length ? c.images : [''] })) : [{ name: '', hex: '#000000', images: [''] }],
    sizes: initial.sizes?.length ? initial.sizes : DEFAULT_SIZES,
    description: {
      overview: initial.description?.overview ?? '',
      ingredients: initial.description?.ingredients ?? '',
      howToUse: initial.description?.howToUse ?? '',
      benefits: initial.description?.benefits ?? '',
    },
    ingredientsList: initial.ingredientsList ?? [],
    productInfo: {
      crueltyFree: initial.productInfo?.crueltyFree ?? true,
      vegan: initial.productInfo?.vegan ?? false,
      paraben: initial.productInfo?.paraben ?? false,
      waterproof: initial.productInfo?.waterproof ?? false,
      longLasting: initial.productInfo?.longLasting ?? '',
      skinType: (initial.productInfo?.skinType ?? ['All']).join(', '),
    },
    deliveryInfo: { ...initial.deliveryInfo, regions: (initial.deliveryInfo?.regions ?? []).join('\n'), freeShippingThreshold: initial.deliveryInfo?.freeShippingThreshold ?? '' },
    faqs: initial.faqs ?? [],
  }
}

interface Props {
  initial?: any
  mode: 'create' | 'edit'
  categories?: { name: string; slug: string }[]
}

const TABS = ['Basic', 'Shades', 'Sizes', 'Description', 'Ingredients & Info', 'Delivery & FAQs']

export default function ProductForm({ initial, mode, categories = [] }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(buildInitialForm(initial))
  const [tab, setTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [subcategories, setSubcategories] = useState<{ name: string; slug: string }[]>([])
  const [loadingSubs, setLoadingSubs] = useState(false)

  useEffect(() => {
    if (!form.category) { setSubcategories([]); return }
    const cat = categories.find(c => c.name === form.category)
    if (!cat) return
    setLoadingSubs(true)
    fetch(`/api/subcategories?category=${cat.slug}`)
      .then(r => r.json())
      .then(data => { setSubcategories(Array.isArray(data) ? data.map((s: any) => ({ name: s.name, slug: s.slug })) : []) })
      .finally(() => setLoadingSubs(false))
  }, [form.category])

  const setF = (k: keyof FormData, v: any) => setForm(p => ({ ...p, [k]: v }))
  const setNested = (root: keyof FormData, k: string, v: any) =>
    setForm(p => ({ ...p, [root]: { ...(p[root] as any), [k]: v } }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice !== '' ? Number(form.originalPrice) : undefined,
        stockCount: form.stockCount !== '' ? Number(form.stockCount) : undefined,
        highlights: form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.map(c => ({ ...c, images: c.images.filter(Boolean) })),
        productInfo: {
          ...form.productInfo,
          skinType: form.productInfo.skinType.split(',').map(s => s.trim()).filter(Boolean),
        },
        deliveryInfo: {
          ...form.deliveryInfo,
          regions: form.deliveryInfo.regions.split('\n').map(s => s.trim()).filter(Boolean),
          freeShippingThreshold: form.deliveryInfo.freeShippingThreshold !== '' ? Number(form.deliveryInfo.freeShippingThreshold) : undefined,
        },
      }

      const url = mode === 'create' ? '/api/products' : `/api/products/${initial?.id ?? initial?._id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Save failed'); return }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent'
  const lbl = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t} type="button" onClick={() => setTab(i)}
            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === i ? 'border-blush-500 text-blush-600 bg-blush-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>}

        {/* Tab 0: Basic */}
        {tab === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Product Name *</label>
                <input className={inp} value={form.name} onChange={e => { setF('name', e.target.value); if (!initial) setF('slug', toSlug(e.target.value)) }} placeholder="Rose Quartz Lip Gloss" required />
              </div>
              <div>
                <label className={lbl}>Slug *</label>
                <input className={inp} value={form.slug} onChange={e => setF('slug', toSlug(e.target.value))} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>SKU *</label>
                <input className={inp} value={form.sku} onChange={e => setF('sku', e.target.value)} placeholder="BB-LG-001" required />
              </div>
              <div>
                <label className={lbl}>Price (PKR) *</label>
                <input className={inp} type="number" value={form.price} onChange={e => setF('price', e.target.value)} required />
              </div>
              <div>
                <label className={lbl}>Original Price (optional)</label>
                <input className={inp} type="number" value={form.originalPrice} onChange={e => setF('originalPrice', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Collection</label>
                <input className={inp} value={form.collection} onChange={e => setF('collection', e.target.value)} placeholder="Premium Gloss Collection" />
              </div>
              <div>
                <label className={lbl}>Finish</label>
                <input className={inp} value={form.finish} onChange={e => setF('finish', e.target.value)} placeholder="Matte, Glossy, Satin, Shimmer…" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Category</label>
                <select
                  className={inp}
                  value={form.category}
                  onChange={e => { setF('category', e.target.value); setF('subcategory', '') }}
                >
                  <option value="">Select category…</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Subcategory</label>
                <select
                  className={inp}
                  value={form.subcategory}
                  onChange={e => setF('subcategory', e.target.value)}
                  disabled={!form.category || loadingSubs}
                >
                  <option value="">
                    {loadingSubs ? 'Loading…' : form.category ? 'Select subcategory…' : 'Select category first'}
                  </option>
                  {subcategories.map(s => (
                    <option key={s.slug} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setF('inStock', e.target.checked)} className="w-4 h-4 text-blush-500 rounded border-gray-300" />
                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
              </div>
              <div>
                <label className={lbl}>Stock Count</label>
                <input className={inp} type="number" value={form.stockCount} onChange={e => setF('stockCount', e.target.value)} placeholder="Unlimited" />
              </div>
            </div>
            <div>
              <label className={lbl}>Highlights (one per line)</label>
              <textarea className={`${inp} resize-none`} rows={4} value={form.highlights} onChange={e => setF('highlights', e.target.value)} placeholder="Long-lasting 8+ hour formula&#10;Moisturizing with Vitamin E" />
            </div>
            <div>
              <label className={lbl}>Tags (comma separated)</label>
              <input className={inp} value={form.tags} onChange={e => setF('tags', e.target.value)} placeholder="lip gloss, vegan, cruelty-free" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>WhatsApp Number</label>
                <input className={inp} value={form.whatsappNumber} onChange={e => setF('whatsappNumber', e.target.value)} />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div>
                <label className={lbl}>Meta Title</label>
                <input className={inp} value={form.metaTitle} onChange={e => setF('metaTitle', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Meta Description</label>
                <textarea className={`${inp} resize-none`} rows={2} value={form.metaDescription} onChange={e => setF('metaDescription', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Shades (Colors) */}
        {tab === 1 && (
          <div className="space-y-4">
            {form.colors.map((color, ci) => (
              <div key={ci} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Shade {ci + 1}</h4>
                  {form.colors.length > 1 && (
                    <button type="button" onClick={() => setF('colors', form.colors.filter((_, i) => i !== ci))} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lbl}>Shade Name</label>
                    <input className={inp} value={color.name} onChange={e => { const c = [...form.colors]; c[ci] = { ...c[ci], name: e.target.value }; setF('colors', c) }} placeholder="Rose Quartz" />
                  </div>
                  <div>
                    <label className={lbl}>Hex Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={color.hex} onChange={e => { const c = [...form.colors]; c[ci] = { ...c[ci], hex: e.target.value }; setF('colors', c) }} className="w-10 h-9 rounded border border-gray-200 cursor-pointer" />
                      <input className={`${inp} flex-1`} value={color.hex} onChange={e => { const c = [...form.colors]; c[ci] = { ...c[ci], hex: e.target.value }; setF('colors', c) }} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Images</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {color.images.filter(Boolean).map((img, ii) => (
                      <div key={ii} className="relative group">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button
                          type="button"
                          title="Remove image"
                          onClick={() => { const c = [...form.colors]; c[ci].images = c[ci].images.filter((_, j) => j !== ii); setF('colors', c) }}
                          className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={res => {
                      const c = [...form.colors]
                      const newUrls = res.map(r => r.ufsUrl)
                      c[ci].images = [...c[ci].images.filter(Boolean), ...newUrls]
                      setF('colors', c)
                    }}
                    onUploadError={err => alert(`Upload failed: ${err.message}`)}
                    appearance={{
                      button: 'bg-blush-500 hover:bg-blush-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ut-uploading:opacity-60',
                      allowedContent: 'text-gray-400 text-xs mt-1',
                    }}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setF('colors', [...form.colors, { name: '', hex: '#000000', images: [''] }])} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blush-600 border border-dashed border-gray-300 hover:border-blush-400 px-4 py-3 rounded-xl w-full justify-center transition-colors">
              <Plus size={14} /> Add Shade
            </button>
          </div>
        )}

        {/* Tab 2: Sizes (bottle/pack size) */}
        {tab === 2 && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-500 px-3 mb-1">
              <div>Size (e.g. 30ml, 50ml, 100g)</div><div>Available</div>
            </div>
            {form.sizes.map((size, si) => (
              <div key={si} className="grid grid-cols-2 gap-2 items-center bg-gray-50 rounded-lg px-3 py-2">
                <input className={`${inp} font-medium`} value={size.label} placeholder="30ml" onChange={e => { const s = [...form.sizes]; s[si] = { ...s[si], label: e.target.value }; setF('sizes', s) }} />
                <div className="flex items-center justify-between">
                  <input type="checkbox" checked={size.available} onChange={e => { const s = [...form.sizes]; s[si] = { ...s[si], available: e.target.checked }; setF('sizes', s) }} className="w-4 h-4 text-blush-500 rounded border-gray-300" />
                  <button type="button" onClick={() => setF('sizes', form.sizes.filter((_, i) => i !== si))} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setF('sizes', [...form.sizes, { label: '', available: true }])} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blush-600 mt-2">
              <Plus size={13} /> Add size
            </button>
          </div>
        )}

        {/* Tab 3: Description */}
        {tab === 3 && (
          <div className="space-y-4">
            <div>
              <label className={lbl}>Overview</label>
              <textarea className={`${inp} resize-none`} rows={5} value={form.description.overview} onChange={e => setNested('description', 'overview', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Ingredients</label>
              <textarea className={`${inp} resize-none`} rows={5} value={form.description.ingredients} onChange={e => setNested('description', 'ingredients', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>How To Use</label>
              <textarea className={`${inp} resize-none`} rows={5} value={form.description.howToUse} onChange={e => setNested('description', 'howToUse', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Benefits</label>
              <textarea className={`${inp} resize-none`} rows={5} value={form.description.benefits} onChange={e => setNested('description', 'benefits', e.target.value)} />
            </div>
          </div>
        )}

        {/* Tab 4: Ingredients list & Product Info */}
        {tab === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Ingredients</h3>
              <div className="space-y-2">
                {form.ingredientsList.map((ing, ii) => (
                  <div key={ii} className="grid grid-cols-7 gap-2 items-center bg-gray-50 rounded-lg px-3 py-2">
                    <input className={`${inp} col-span-3`} placeholder="Vitamin E" value={ing.name} onChange={e => { const l = [...form.ingredientsList]; l[ii] = { ...l[ii], name: e.target.value }; setF('ingredientsList', l) }} />
                    <input className={`${inp} col-span-3`} placeholder="Antioxidant & moisturizer" value={ing.purpose} onChange={e => { const l = [...form.ingredientsList]; l[ii] = { ...l[ii], purpose: e.target.value }; setF('ingredientsList', l) }} />
                    <div className="flex items-center gap-1">
                      <input className={inp} placeholder="5%" value={ing.percentage} onChange={e => { const l = [...form.ingredientsList]; l[ii] = { ...l[ii], percentage: e.target.value }; setF('ingredientsList', l) }} />
                      <button type="button" onClick={() => setF('ingredientsList', form.ingredientsList.filter((_, i) => i !== ii))} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setF('ingredientsList', [...form.ingredientsList, { name: '', purpose: '', percentage: '' }])} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blush-600 mt-1">
                  <Plus size={13} /> Add ingredient
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Info</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {(['crueltyFree', 'vegan', 'paraben', 'waterproof'] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.productInfo[k]} onChange={e => setNested('productInfo', k, e.target.checked)} className="w-4 h-4 text-blush-500 rounded border-gray-300" />
                    {k === 'crueltyFree' ? 'Cruelty-Free' : k === 'paraben' ? 'Contains Paraben' : k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Long Lasting</label>
                  <input className={inp} value={form.productInfo.longLasting} onChange={e => setNested('productInfo', 'longLasting', e.target.value)} placeholder="8+ hours" />
                </div>
                <div>
                  <label className={lbl}>Skin Type (comma separated)</label>
                  <input className={inp} value={form.productInfo.skinType} onChange={e => setNested('productInfo', 'skinType', e.target.value)} placeholder="All, Oily, Dry, Combination, Sensitive" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Delivery & FAQs */}
        {tab === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Information</h3>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Estimated Days</label>
                  <input className={inp} value={form.deliveryInfo.estimatedDays} onChange={e => setNested('deliveryInfo', 'estimatedDays', e.target.value)} placeholder="3–5 Business Days" />
                </div>
                <div>
                  <label className={lbl}>Delivery Regions (one per line)</label>
                  <textarea className={`${inp} resize-none`} rows={3} value={form.deliveryInfo.regions} onChange={e => setNested('deliveryInfo', 'regions', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Return Policy</label>
                    <input className={inp} value={form.deliveryInfo.returnPolicy} onChange={e => setNested('deliveryInfo', 'returnPolicy', e.target.value)} />
                  </div>
                  <div>
                    <label className={lbl}>Exchange Policy</label>
                    <input className={inp} value={form.deliveryInfo.exchangePolicy} onChange={e => setNested('deliveryInfo', 'exchangePolicy', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Free Shipping Threshold (PKR)</label>
                  <input className={inp} type="number" value={form.deliveryInfo.freeShippingThreshold} onChange={e => setNested('deliveryInfo', 'freeShippingThreshold', e.target.value)} placeholder="2500" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">FAQs</h3>
              <div className="space-y-3">
                {form.faqs.map((faq, fi) => (
                  <div key={fi} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">FAQ {fi + 1}</span>
                      <button type="button" onClick={() => setF('faqs', form.faqs.filter((_, i) => i !== fi))} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    </div>
                    <div>
                      <label className={lbl}>Question</label>
                      <input className={inp} value={faq.question} onChange={e => { const f = [...form.faqs]; f[fi] = { ...f[fi], question: e.target.value }; setF('faqs', f) }} />
                    </div>
                    <div>
                      <label className={lbl}>Answer</label>
                      <textarea className={`${inp} resize-none`} rows={3} value={faq.answer} onChange={e => { const f = [...form.faqs]; f[fi] = { ...f[fi], answer: e.target.value }; setF('faqs', f) }} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setF('faqs', [...form.faqs, { question: '', answer: '' }])} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blush-600 border border-dashed border-gray-300 hover:border-blush-400 px-4 py-3 rounded-xl w-full justify-center transition-colors">
                  <Plus size={14} /> Add FAQ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-blush-500 hover:text-white transition-all disabled:opacity-60">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <div className="ml-auto flex gap-2">
          {TABS.map((t, i) => (
            <button key={i} type="button" onClick={() => setTab(i)} className={`w-2 h-2 rounded-full transition-colors ${i === tab ? 'bg-blush-500' : 'bg-gray-300 hover:bg-gray-400'}`} />
          ))}
        </div>
      </div>
    </form>
  )
}
