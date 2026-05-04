import type { NextAuthOptions } from "next-auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env;

type SignInCallback = NonNullable<NonNullable<NextAuthOptions["callbacks"]>["signIn"]>;

const loadSignInCallback = async (env: Record<string, string | undefined>): Promise<SignInCallback> => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV, ...env };

  const { authOptions } = await import("../api/auth");
  const signIn = authOptions.callbacks?.signIn;

  if (!signIn) {
    throw new Error("signIn callback is not configured");
  }

  return signIn;
};

describe("auth signIn callback", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("allows any @abbi.ch user even when other allow rules would reject", async () => {
    const signIn = await loadSignInCallback({
      GOOGLE_ALLOWED_EMAILS: "someone@example.com",
      GOOGLE_ALLOWED_DOMAIN: "example.com",
      AUTH_ALLOW_ANY_GOOGLE_USER: "false"
    });

    const allowed = await signIn({ profile: { email: "person@abbi.ch" } as never } as never);

    expect(allowed).toBe(true);
  });

  it("still rejects non-@abbi.ch users when no rule allows them", async () => {
    const signIn = await loadSignInCallback({
      GOOGLE_ALLOWED_EMAILS: "",
      GOOGLE_ALLOWED_DOMAIN: "",
      AUTH_ALLOW_ANY_GOOGLE_USER: "false"
    });

    const allowed = await signIn({ profile: { email: "person@example.com" } as never } as never);

    expect(allowed).toBe(false);
  });
});
