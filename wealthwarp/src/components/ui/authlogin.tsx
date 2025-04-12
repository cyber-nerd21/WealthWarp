'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AuthLogin() {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      console.error("Google Login Error:", error.message)
    } else {
      console.log("Redirecting to Google login...")
    }
  }

  useEffect(() => {
    // 1️⃣ Check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        router.push("/dashboard")
      } else {
        setCheckingSession(false)
      }
    })

    // 2️⃣ Listen for auth state change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = session.user

        // ✅ Insert or update user in profiles table
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email,
          },
          { onConflict: "id" }
        )

        if (error) {
          console.error("Error inserting/updating profile:", error.message)
        }

        // 🚀 Redirect after login
        router.push("/dashboard")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (checkingSession) {
    return <p className="text-white">Checking session...</p>
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Button onClick={handleGoogleLogin} variant="default" className="text-white">
        Continue with Google
      </Button>
    </div>
  )
}
