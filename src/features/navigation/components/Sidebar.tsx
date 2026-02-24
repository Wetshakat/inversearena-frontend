import { dashboardNavItems } from "../navItems";
import { SidebarNavLink } from "./SidebarNavLink";

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-black">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="text-lg font-bold leading-none tracking-tight text-white">
          INVERSE <span className="text-[#39ff14]">ARENA</span>
        </div>
        <div className="mt-2 text-xs font-semibold tracking-widest text-zinc-400">
          PROTOCOL 
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
        {dashboardNavItems.map((item) => (
          <SidebarNavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#39ff14]">
          <span className="inline-block size-2 rounded-full bg-[#39ff14]" />
          WALLET CONNECTED
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <div className="truncate text-sm font-semibold text-zinc-200">
            0x71...8A92
          </div>
          <button
            type="button"
            className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
            aria-label="Open wallet"
          >
            ↗
          </button>
        </div>
      </div>
    </aside>
  );
}

