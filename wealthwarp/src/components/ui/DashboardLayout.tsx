'use client'

import { ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import SIPComponent from "@/components/ui/SIPComponent"
import { Home, BarChart2, LogOut } from "lucide-react"

interface DashboardLayoutProps {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeComponent, setActiveComponent] = useState<"dashboard" | "sip" | "">("dashboard")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      const email = data?.user?.email ?? null

      if (error || !email) {
        router.push("/") // Redirect if not logged in
      } else {
        setUserEmail(email)
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <p className="text-center mt-20 text-xl text-blue-600">Loading...</p>
  }

  return (
    <div className="flex min-h-screen bg-[#f4f8fb] text-[#1e293b]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-[#0052cc]">WealthWarp</h1>
            <p className="text-xs text-gray-500 mt-1">Logged in as<br /><span className="font-medium">{userEmail}</span></p>
          </div>
          <nav className="flex flex-col p-4 gap-2">
            <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("dashboard")}>
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("sip")}>
              <BarChart2 className="w-4 h-4 mr-2" /> SIP Calculator
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center justify-center">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        {/* Render based on activeComponent OR children, not both */}
        {!children && activeComponent === "dashboard" && (
          <div>
            <h2 className="text-3xl font-semibold text-[#00b386] mb-6">Welcome to WealthWarp</h2>
            <p className="text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        )}

        {!children && activeComponent === "sip" && (
          <div>
            <h2 className="text-3xl font-semibold text-[#00b386] mb-6">📈 SIP Calculator</h2>
            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <SIPComponent />
            </div>
          </div>
        )}

        {/* Render children only if it's a routed page (e.g. /dashboard/something) */}
        {children}
      </main>
    </div>
  )
}
