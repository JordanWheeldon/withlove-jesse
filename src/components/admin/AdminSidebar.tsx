"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Calendar,
  Tag,
  FileText,
  Menu,
  ClipboardList,
  Users,
  Image,
  Settings,
  Search,
  HelpCircle,
  FileCheck,
  Mail,
  Palette,
  Shield,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const OVERVIEW: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

const CATALOG: NavItem[] = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Collections & Occasions", icon: FolderOpen },
  { href: "/admin/campaigns", label: "Campaigns", icon: Calendar },
];

const CONTENT: NavItem[] = [
  { href: "/admin/promotions", label: "Banners & Promotions", icon: Tag },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/navigation", label: "Menus & Footer", icon: Menu },
  { href: "/admin/policies", label: "Policies", icon: FileCheck },
  { href: "/admin/contact", label: "Contact", icon: Mail },
];

const COMMERCE: NavItem[] = [
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

const MEDIA_SETTINGS: NavItem[] = [
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/seo", label: "SEO & Site Settings", icon: Search },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/users", label: "Admin Users", icon: Shield },
];

function NavSection({
  items,
  label,
  collapsed,
}: {
  items: NavItem[];
  label: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="px-4 mb-2 text-xs font-medium text-premium-taupe/70 uppercase tracking-wider">
          {label}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-premium-accent/40 text-premium-brown font-medium"
                    : "text-premium-taupe hover:bg-premium-soft hover:text-premium-brown"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          flex flex-col bg-premium-soft border-r border-sand-200
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center gap-2 h-16 px-3 border-b border-sand-200 flex-shrink-0">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 -ml-1 rounded-lg text-premium-taupe hover:bg-premium-soft hover:text-premium-brown transition-colors shrink-0"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
          {!collapsed && (
            <Link href="/admin" className="font-serif text-lg font-medium text-premium-brown truncate">
              Withlove, Jesse
            </Link>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <NavSection items={OVERVIEW} label="Overview" collapsed={collapsed} />
          <NavSection items={CATALOG} label="Catalog" collapsed={collapsed} />
          <NavSection items={CONTENT} label="Content" collapsed={collapsed} />
          <NavSection items={COMMERCE} label="Commerce" collapsed={collapsed} />
          <NavSection items={MEDIA_SETTINGS} label="Media & Settings" collapsed={collapsed} />
        </nav>
        <div className="p-2 border-t border-sand-200">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-premium-taupe hover:bg-premium-soft hover:text-premium-brown transition-colors"
            title={collapsed ? "View Site" : undefined}
          >
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

export function AdminSidebarToggle({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-premium-taupe hover:bg-premium-soft hover:text-premium-brown transition-colors"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronRight className="h-5 w-5" />
      ) : (
        <ChevronLeft className="h-5 w-5" />
      )}
    </button>
  );
}
