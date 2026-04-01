"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../ui/Button";

const SignInPage = () => {
  return (
    <section className="mx-auto mt-16 max-w-md rounded-xl border border-neutral-800 bg-neutral-900/70 p-8">
      <h1 className="text-2xl font-semibold text-white">Sign in required</h1>
      <p className="mt-3 text-sm text-neutral-300">
        Please sign in with your Google account to access payroll data.
      </p>

      <Button className="mt-6 w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
        Continue with Google
      </Button>
    </section>
  );
};

export default SignInPage;