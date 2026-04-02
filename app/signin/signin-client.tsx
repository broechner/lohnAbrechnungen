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
    <section className="mx-auto mt-16 max-w-md rounded-xl border border-neutral-800 bg-neutral-900/70 p-8">
      <h1 className="text-2xl font-semibold text-white">Sign in required</h1>
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
