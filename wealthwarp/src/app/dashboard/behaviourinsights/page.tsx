import BehaviorInsights from "@/components/ui/Behaviour-Insights";

export default function Page() {
   return( <div>
    <h1 className="text-2xl font-bold text-slate-800 mb-4">📊Your History</h1>
    <p className="mb-6 text-slate-600">Get to know your finances</p>
    <BehaviorInsights />;</div>
  );
}
