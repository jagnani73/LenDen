"use client";

import { useMemo } from "react";
import Marquee from "react-easy-marquee";
import Image from "next/image";

const Footer: React.FC = () => {
  const SPONSOR_IMAGES = useMemo<string[]>(
    () => [
      "/sponsors/avalanche.svg",
      "/sponsors/polygon.svg",
      "/sponsors/push.svg",
      "/sponsors/router.svg",
      "/sponsors/spheron.svg",
    ],
    []
  );

  return (
    <footer className="px-20 py-4 bg-green-yellow">
      <Marquee height="60px" duration={7500}>
        <div className="flex w-full">
          {SPONSOR_IMAGES.map((src) => (
            <Image
              key={src}
              src={src}
              alt={src}
              height={520}
              width={120}
              className="m-auto"
            />
          ))}
        </div>
      </Marquee>
    </footer>
  );
};

export default Footer;
