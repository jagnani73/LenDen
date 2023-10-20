"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const asPath = usePathname();
  console.log(asPath);
  const NAVIGATION = useMemo<{
    prompt?: string;
    routes: { href: string; content: string }[];
  }>(() => {
    switch (asPath) {
      case "/": {
        return {
          prompt: "Get into Cross-Chain DeFi:",
          routes: [
            {
              content: "Sign Up",
              href: "/sign-up",
            },
            {
              content: "Sign In",
              href: "/sign-in",
            },
          ],
        };
      }
      case "/employee/jobs": {
        return {
          routes: [
            {
              content: "Applications",
              href: "/employee/applications",
            },
            {
              content: "Profile",
              href: "/employee/profile",
            },
            {
              content: "Logout",
              href: "/",
            },
          ],
        };
      }

      default:
        return {
          routes: [],
        };
    }
  }, [asPath]);

  return (
    <nav className="h-32 w-full px-20 flex items-center justify-between bg-white border-b border-french-grey">
      <Link href="/" className="flex items-center gap-x-8" title="LenDen">
        <Image src="/site/logo.svg" alt="LenDen logo" width={96} height={96} />
        <h1 className="text-5xl font-semibold">LenDen</h1>
      </Link>

      <div className="flex items-center justify-center gap-x-8">
        {NAVIGATION.prompt && (
          <p className="font-medium text-lg text-french-grey">
            {NAVIGATION.prompt}
          </p>
        )}

        {NAVIGATION.routes.map(({ content, href }) => (
          <Link
            key={href + content}
            href={href}
            className="bg-green-yellow border border-green-yellow px-6 py-3 font-medium"
          >
            {content}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
