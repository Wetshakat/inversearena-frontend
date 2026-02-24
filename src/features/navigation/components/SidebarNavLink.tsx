"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "../navItems";

export function SidebarNavLink({ href, label }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold tracking-wide transition-colors",
        isActive
          ? "bg-[#0f2410] text-[#39ff14]"
          : "text-zinc-300 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      <span className="inline-block size-5 rounded bg-white/10" />
      <span>{label}</span>
    </Link>
  );
}

