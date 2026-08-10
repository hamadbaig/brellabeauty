import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin Panel — Brella Beauty' }

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const store = await cookies()
    const token = store.get('admin_token')?.value
    if (!token) redirect('/admin/login')

    try {
        await verifyToken(token)
    } catch {
        redirect('/admin/login')
    }

    return (
        <div className="flex min-h-screen bg-pearl">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    )
}
