"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const asPath = usePathname();

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
      case "/sign-up": {
        return {
          routes: [
            {
              content: "Sign In",
              href: "/sign-in",
            },
          ],
        };
      }
      case "/sign-in": {
        return {
          routes: [
            {
              content: "Sign Up",
              href: "/sign-up",
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
    <nav className="h-24 w-full px-20 flex items-center justify-between bg-white border-b border-french-grey">
      <Link href="/" className="flex items-center gap-x-8" title="LenDen">
        <Image src="/site/logo.svg" alt="LenDen logo" width={88} height={88} />
        <h1 className="text-4xl font-semibold">LenDen</h1>
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
