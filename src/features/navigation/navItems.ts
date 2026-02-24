export type NavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Lobby", href: "/dashboard/lobby" },
  { label: "Games", href: "/dashboard/games" },
  { label: "My Profile", href: "/dashboard/profile" },
];

