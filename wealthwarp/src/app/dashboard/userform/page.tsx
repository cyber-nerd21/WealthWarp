import UserProfileForm from "@/components/ui/UserProfileForm";
export default function Page() {
   return( <div>
    <h1 className="text-2xl font-bold text-slate-800 mb-4">Know Your Customer</h1>
    <p className="mb-6 text-slate-600">Basic Details</p>
    <UserProfileForm />;</div>
  );
}