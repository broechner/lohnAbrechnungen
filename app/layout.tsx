import "../styles/globals.css";
import type { ReactNode } from "react";
import { TopNav } from "../ui/TopNav";

export const metadata = {
  title: "LohnAbrechnungsApp",
  description: "Swiss payroll for private households"
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="de" className="dark">
      <body>
        <TopNav />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
