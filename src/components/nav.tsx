"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "space_dashboard" },
  { href: "/scan/new", label: "New Scan", icon: "radar" },
  { href: "/how-to", label: "How To", icon: "help" },
  { href: "/benchmarks", label: "Benchmarks", icon: "verified" },
  { href: "/about", label: "About", icon: "info" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-[0.5px] border-hairline shadow-[0_20px_40px_rgba(26,26,46,0.04)]">
      <div className="flex justify-between items-center h-16 px-8 w-full">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-semibold tracking-tighter text-charcoal font-headline">
            AgentProbe
          </Link>
          <div className="hidden md:flex space-x-6 font-headline tracking-[-0.01em] text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 ${
                  isActive(item.href)
                    ? "text-charcoal font-semibold border-b-2 border-charcoal pb-1"
                    : "text-slate-500 hover:text-charcoal transition-colors"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
