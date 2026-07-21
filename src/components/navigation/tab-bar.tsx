"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Play, List, Dumbbell, Zap } from "lucide-react"; // or use your preferred icon set

const tabs = [
  { name: "Home", href: "/app", icon: Home },
  { name: "Matches", href: "/app/matches", icon: List },
  { name: "Train", href: "/app/training", icon: Zap },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 rounded-t-2xl shadow-lg z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center flex-1 py-2">
            <Icon
              size={28}
              className={active ? "text-blue-600" : "text-slate-400"}
              fill={active ? "#2563eb" : "none"}
            />
            <span
              className={`text-xs mt-1 ${
                active ? "text-blue-600 font-semibold" : "text-slate-500"
              }`}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
