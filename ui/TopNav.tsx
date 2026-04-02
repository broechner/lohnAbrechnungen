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
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            {getString(locale, "appName")}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-neutral-300">
            <Link href="/employees">{getString(locale, "employees")}</Link>
            <Link href="/contracts">{getString(locale, "contracts")}</Link>
            <Link href="/time-entries">{getString(locale, "timeEntries")}</Link>
            <Link href="/reports">{getString(locale, "reports")}</Link>
            <Link href="/settings">{getString(locale, "settings")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-3 py-1"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {getString(locale, "darkMode")}: {theme === "dark" ? "On" : "Off"}
          </button>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value === "en" ? "en" : "de")}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          {status === "authenticated" ? (
            <>
              <span className="hidden text-neutral-300 md:inline">{session.user?.email}</span>
              <button
                type="button"
                className="rounded-full border border-neutral-700 px-3 py-1"
                onClick={() => signOut({ callbackUrl: "/signin" })}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="rounded-full border border-neutral-700 px-3 py-1">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
