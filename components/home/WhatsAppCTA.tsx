import { normalizeWhatsAppNumber } from '@/lib/whatsapp'

// Placeholder
export default function WhatsAppCTA({ settings }: any) {
    return (
        <section className="py-20 bg-gradient-to-r from-blush to-rosegold text-white">
            <div className="container mx-auto text-center">
                <h2 className="font-serif text-4xl mb-4">Order via WhatsApp</h2>
                <a href={`https://wa.me/${normalizeWhatsAppNumber(settings?.whatsappNumber || '923172760406')}`} className="btn-whatsapp inline-flex">Message Us</a>
            </div>
        </section>
    )
}
