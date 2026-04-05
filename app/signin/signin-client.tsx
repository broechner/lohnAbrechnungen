"use client";

import { useEffect, useMemo, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "../../ui/Button";

export const SignInClient = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const authError = searchParams.get("error");
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setGoogleAvailable(Boolean(providers?.google));
    };

    loadProviders().catch(() => setGoogleAvailable(false));
  }, []);

  const errorMessage = useMemo(() => {
    if (!authError) {
      return null;
    }

    if (authError === "AccessDenied") {
      return "Access denied: your Google account is not allowed for this application.";
    }

    if (authError === "Configuration") {
      return "Authentication is not configured correctly on the server.";
    }

    return `Authentication error: ${authError}`;
  }, [authError]);

  return (
    <section className="brand-panel mx-auto mt-16 max-w-md rounded-[28px] p-8">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-accent-gradient shadow-[0_16px_36px_rgba(1,112,193,0.28)]">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M7 10V8a5 5 0 0 1 10 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M12 14v2" />
          </svg>
        </div>
        <div>
          <p className="brand-accent-text text-xs uppercase tracking-[0.24em]">abbi Access</p>
          <h1 className="text-2xl font-semibold text-white">Sign in required</h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-neutral-300">
        Please sign in with your Google account to access payroll data.
      </p>

      {errorMessage ? <p className="mt-4 rounded-md bg-red-950/70 p-3 text-sm text-red-200">{errorMessage}</p> : null}

      {googleAvailable === false ? (
        <div className="mt-4 rounded-md bg-amber-950/70 p-3 text-sm text-amber-200">
          Google login is not enabled yet. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, and
          NEXTAUTH_SECRET in Vercel.
        </div>
      ) : null}

      <Button
        className="mt-6 w-full"
        onClick={() => signIn("google", { callbackUrl })}
        disabled={googleAvailable === false}
      >
        Continue with Google
      </Button>
    </section>
  );
};
