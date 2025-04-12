// /app/what-if/page.tsx
import WhatIfSimulator from "@/components/ui/WhatIfSimulator";
export default function Page() {
  return( <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">📈What IF</h1>
      <p className="mb-6 text-slate-600">Get to know your chances</p>
      <WhatIfSimulator />;</div>
    );
}
