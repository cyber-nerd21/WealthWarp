'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-green-500 to-blue-600 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-8">WealthWarp 🧠</h2>
        <nav className="flex flex-col space-y-4">
          
          <Link href="/dashboard" className="hover:text-yellow-400">🏠 Dashboard</Link>
          <Link href="/dashboard/userform" className="hover:text-yellow-400">📝Fill Details</Link>
          <Link href="/dashboard/analyse-spend" className="hover:text-yellow-400">🧾Expenses Tracker</Link>
          <Link href="/dashboard/simulation" className="hover:text-yellow-400">📈 Your Financial Future</Link>
          <Link href="/dashboard/aiadvisor" className="hover:text-yellow-400">🧘 Finance Guru</Link>
          <Link href="/dashboard/what-if" className="hover:text-yellow-400">🤔 What If Scenario</Link>
          <Link href="/dashboard/analysis" className="hover:text-yellow-400">📊 Visualise Journey</Link>
          <Link href="/dashboard/behaviourinsights" className="hover:text-yellow-400">⏳ Time Travel</Link>
          
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
