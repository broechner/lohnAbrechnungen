"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLocale } from "./useLocale";
import { useTheme } from "./useTheme";
import { getString } from "./i18n";

export const TopNav = () => {
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-[rgba(1,112,193,0.2)] bg-[linear-gradient(90deg,rgba(12,22,34,0.96),rgba(1,57,95,0.9))] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 text-lg text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-gradient shadow-[0_12px_30px_rgba(1,112,193,0.3)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M5 18h14" />
                <path d="M5 12h10" />
                <path d="M5 6h14" />
                <circle cx="17" cy="12" r="2.2" fill="#FF5800" stroke="none" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block font-light tracking-[0.08em] text-[0.72rem] uppercase text-[rgba(126,185,229,0.95)]">abbi</span>
              <span className="block font-light">{getString(locale, "appName")}</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm text-neutral-200">
            <Link href="/employees" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "employees")}</Link>
            <Link href="/contracts" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "contracts")}</Link>
            <Link href="/time-entries" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "timeEntries")}</Link>
            <Link href="/payslips" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "payslips")}</Link>
            <Link href="/reports" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "reports")}</Link>
            <Link href="/settings" className="rounded-full px-3 py-1.5 hover:bg-[rgba(1,112,193,0.2)] hover:text-white">{getString(locale, "settings")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            aria-label={getString(locale, "darkMode")}
            title={getString(locale, "darkMode")}
            className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(1,112,193,0.24)] bg-[rgba(255,255,255,0.03)] text-[rgba(126,185,229,0.95)]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2.5v3" />
              <path d="M12 18.5v3" />
              <path d="M2.5 12h3" />
              <path d="M18.5 12h3" />
              <path d="m5.4 5.4 2.1 2.1" />
              <path d="m16.5 16.5 2.1 2.1" />
              <path d="m18.6 5.4-2.1 2.1" />
              <path d="m7.5 16.5-2.1 2.1" />
            </svg>
          </button>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value === "en" ? "en" : "de")}
            className="rounded-full border border-[rgba(1,112,193,0.2)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-neutral-100"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          {status === "authenticated" ? (
            <>
              <span className="hidden text-neutral-300 md:inline">{session.user?.email}</span>
              <button
                type="button"
                className="rounded-full border border-[rgba(1,112,193,0.2)] px-3 py-1.5 text-neutral-100 hover:bg-[rgba(1,112,193,0.16)]"
                onClick={() => signOut({ callbackUrl: "/signin" })}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="rounded-full border border-[rgba(1,112,193,0.2)] px-3 py-1.5 text-neutral-100 hover:bg-[rgba(1,112,193,0.16)]">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
