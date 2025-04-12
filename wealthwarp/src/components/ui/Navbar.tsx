"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Advanced Analysis", href: "/analysis" },
  { label: "What If Simulator", href: "/what-if" },
  { label: "AI Advisor", href: "/aiadvisor" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">💸 Finance AI</h1>

        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn("text-sm")}
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/settings">
          <Button variant="outline">Settings</Button>
        </Link>
      </div>
    </nav>
  );
}
