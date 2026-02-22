"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Preloader() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname === "/login") {
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "auto";
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-deep-twilight-100 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mb-6">
        <Image
          src="/logo 02.png"
          alt="Nij Scientific logo"
          width={360}
          height={360}
          priority
        />
      </div>

      <div className="overflow-hidden px-4 text-center">
        <p className="text-lg md:text-xl text-french-blue dark:text-sky-aqua font-medium">
          First Scientific Mall in Saurashtra/Kutch
        </p>
      </div>
    </div>
  );
}
