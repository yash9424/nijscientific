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
      }, 600);
    }, 2400);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background transition-all duration-600 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 grid-bg mask-fade" />
      <div className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-turquoise-surf/20 blur-3xl animate-float-slow" />

      <div className="relative animate-fade-up">
        <Image src="/logo 02.png" alt="Nij Scientific logo" width={300} height={300} priority />
      </div>

      <p className="relative mt-4 px-4 text-center font-display text-lg font-medium text-french-blue animate-fade-up [animation-delay:200ms] md:text-xl dark:text-sky-aqua">
        First Scientific Mall in Saurashtra/Kutch
      </p>

      <div className="relative mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-french-blue to-turquoise-surf animate-progress" />
      </div>
    </div>
  );
}
