import { Suspense } from "react";
import { SignInClient } from "./signin-client";

const SignInPage = () => {
  return (
    <Suspense fallback={<section className="mx-auto mt-16 max-w-md rounded-xl border border-neutral-800 bg-neutral-900/70 p-8" />}>
      <SignInClient />
    </Suspense>
  );
};

export default SignInPage;