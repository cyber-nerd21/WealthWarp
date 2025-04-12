'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        router.replace('/dashboard');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        router.replace('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#203a43] text-white flex flex-col justify-center items-center px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
            Meet Your <span className="text-green-400">Financial Future Machine</span> 💸
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            WealthWarp uses AI + smart simulations to guide your money decisions. Visualize your journey, simulate what-ifs, and plan like a pro.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${location.origin}/dashboard`,
                },
              });
            }}
            className="bg-green-400 hover:bg-green-300 text-black px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return null;
}
