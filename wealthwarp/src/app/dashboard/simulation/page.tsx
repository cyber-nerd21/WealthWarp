// src/app/dashboard/simulation/page.tsx

'use client';

import SIPComponent from '@/components/ui/SIPComponent'; // update path if needed

export default function SimulationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">📈 Your Financial Future</h1>
      <p className="mb-6 text-slate-600">Simulate how your money grows over time with monthly investments.</p>
      
      <SIPComponent />
    </div>
  );
}
