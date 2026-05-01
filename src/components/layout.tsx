import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  FilePlus2,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  Menu,
  Settings,
  ShieldAlert,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { disclaimer } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Patient" },
  { href: "/clinic", label: "Clinic" },
  { href: "/pricing", label: "Pricing" },
];

const dashboardItems = [
  { href: "/app/dashboard", label: "Patient", icon: LayoutDashboard },
  { href: "/app/invite-doctor", label: "Invite doctor", icon: UserPlus },
  { href: "/clinic/dashboard", label: "Clinic", icon: UsersRound },
  { href: "/clinic/invite-patient", label: "Invite patient", icon: FilePlus2 },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="LeanDoze home">
          <Logo variant="full" theme="light" size="sm" priority />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/onboarding"
            className="hidden h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex"
          >
            Start tracking
          </Link>
          <UserButton afterSignOutUrl="/" />
          <button className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-700 md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

const patientItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/check-in", label: "Check-in", icon: ClipboardList },
  { href: "/app/progress", label: "Progress", icon: LineChart },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/invite-doctor", label: "Invite doctor", icon: UserPlus },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

const clinicItems = [
  { href: "/clinic/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clinic/patients", label: "Patients", icon: UsersRound },
  { href: "/clinic/dashboard#risk-flags", label: "Risk flags", icon: ShieldAlert },
  { href: "/clinic/reports", label: "Reports", icon: FileText },
  { href: "/clinic/invite-patient", label: "Invite patient", icon: FilePlus2 },
  { href: "/clinic/settings", label: "Settings", icon: Settings },
];

function AppTopbar({
  homeHref,
  label,
  cta,
}: {
  homeHref: string;
  label: string;
  cta?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link href={homeHref} className="flex items-center gap-3" aria-label="LeanDoze app home">
          <Logo variant="full" theme="light" size="sm" priority />
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
            {label}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {cta}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}

function AppSidebar({
  items,
  activePath,
  homeHref,
  footerIcon: FooterIcon,
}: {
  items: Array<{ href: string; label: string; icon: LucideIcon }>;
  activePath?: string;
  homeHref: string;
  footerIcon: LucideIcon;
}) {
  const isActiveItem = (href: string) => {
    if (!activePath) {
      return false;
    }

    const cleanHref = href.split("#")[0];
    return activePath === cleanHref || activePath.startsWith(`${cleanHref}/`);
  };

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] rounded-[28px] border border-[#E2E8F0] bg-white/85 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col items-center justify-between">
        <Link
          href={homeHref}
          aria-label="LeanDoze app home"
          className="grid size-12 place-items-center rounded-2xl bg-white p-1 ring-1 ring-slate-100 transition hover:shadow-sm"
        >
          <Logo variant="mark" theme="light" size="md" />
        </Link>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={
                isActiveItem(item.href)
                  ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] shadow-[0_0_0_1px_rgba(23,194,178,0.18),0_12px_24px_rgba(23,194,178,0.16)] transition-all duration-300"
                  : "flex h-11 w-11 items-center justify-center rounded-2xl text-[#64748B] transition-all duration-300 hover:bg-[#F8FAFC] hover:text-[#0B1220]"
              }
            >
              <item.icon className="size-5" />
            </Link>
          ))}
        </nav>
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-400">
          <FooterIcon className="size-5" />
        </div>
      </div>
    </aside>
  );
}

function MobileAppNav({
  items,
  activePath,
}: {
  items: Array<{ href: string; label: string; icon: LucideIcon }>;
  activePath?: string;
}) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
      {items.map((item) => {
        const cleanHref = item.href.split("#")[0];
        const active = activePath === cleanHref || activePath?.startsWith(`${cleanHref}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ECFEFF] px-3 py-2 text-sm font-semibold text-[#0F766E]"
                : "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500"
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AppLayoutShell({
  eyebrow,
  title,
  description,
  children,
  action,
  activePath,
  items,
  homeHref,
  appLabel,
  footerIcon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  activePath?: string;
  items: Array<{ href: string; label: string; icon: LucideIcon }>;
  homeHref: string;
  appLabel: string;
  footerIcon: LucideIcon;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220]">
      <AppTopbar homeHref={homeHref} label={appLabel} cta={action} />
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[88px_1fr]">
        <AppSidebar items={items} activePath={activePath} homeHref={homeHref} footerIcon={footerIcon} />
        <main>
          <MobileAppNav items={items} activePath={activePath} />
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-[#050816]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#475569]">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function PatientLayout(props: Omit<Parameters<typeof AppLayoutShell>[0], "items" | "homeHref" | "appLabel" | "footerIcon">) {
  return (
    <AppLayoutShell
      {...props}
      items={patientItems}
      homeHref="/app/dashboard"
      appLabel="Patient app"
      footerIcon={HeartPulse}
    />
  );
}

export function ClinicLayout(props: Omit<Parameters<typeof AppLayoutShell>[0], "items" | "homeHref" | "appLabel" | "footerIcon">) {
  return (
    <AppLayoutShell
      {...props}
      items={clinicItems}
      homeHref="/clinic/dashboard"
      appLabel="Clinic app"
      footerIcon={BarChart3}
    />
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <div className="flex flex-col items-start">
            <Logo variant="full" theme="light" size="md" />
          </div>
          <p className="mt-6 max-w-md text-sm leading-6 text-slate-500">{disclaimer}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-4">
          {["Product", "Clinics", "Security", "Company"].map((group) => (
            <div key={group}>
              <p className="font-semibold text-slate-950">{group}</p>
              <div className="mt-3 space-y-2 text-slate-500">
                <p>Overview</p>
                <p>Privacy</p>
                <p>Support</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function DashboardShell({
  eyebrow,
  title,
  description,
  children,
  action,
  activePath,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  activePath?: string;
}) {
  const isActiveItem = (href: string) => {
    if (!activePath) {
      return false;
    }

    if (href === "/clinic/dashboard") {
      return activePath.startsWith("/clinic");
    }

    return activePath === href || activePath.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto grid max-w-[1180px] gap-8 px-8 py-8 lg:grid-cols-[88px_1fr]">
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] rounded-[28px] border border-[#E2E8F0] bg-white/85 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
          <div className="flex h-full flex-col items-center justify-between">
            <Link
              href="/"
              aria-label="LeanDoze home"
              className="grid size-12 place-items-center rounded-2xl bg-white p-1 ring-1 ring-slate-100 transition hover:shadow-sm"
            >
              <Logo variant="mark" theme="light" size="md" />
            </Link>
            <nav className="flex flex-col gap-2">
              {dashboardItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={
                    isActiveItem(item.href)
                      ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] shadow-[0_0_0_1px_rgba(23,194,178,0.18),0_12px_24px_rgba(23,194,178,0.16)] transition-all duration-300"
                      : "flex h-11 w-11 items-center justify-center rounded-2xl text-[#64748B] transition-all duration-300 hover:bg-[#F8FAFC] hover:text-[#0B1220]"
                  }
                >
                  <item.icon className="size-5" />
                </Link>
              ))}
            </nav>
            <div className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-400">
              <BarChart3 className="size-5" />
            </div>
          </div>
        </aside>
        <main>
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <Logo variant="mark" theme="light" size="sm" />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  GLP-1 Care. Simplified.
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">{eyebrow}</p>
              <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-[#050816]">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#475569]">{description}</p>
            </div>
            {action}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
