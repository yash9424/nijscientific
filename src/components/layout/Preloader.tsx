"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FlaskConical, FlaskRound } from "lucide-react";

export function Preloader() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Skip preloader on admin/login
    if (pathname.startsWith("/admin") || pathname === "/login") {
      setShow(false);
      return;
    }

    // Prevent scrolling when preloader is active
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
      <div className="relative flex items-end justify-center gap-6 mb-8">
        {/* Flask 1 - Conical */}
        <div className="relative animate-float">
          <FlaskConical className="w-24 h-24 text-french-blue dark:text-sky-aqua fill-french-blue/10 dark:fill-sky-aqua/10" strokeWidth={1.5} />
          {/* Bubbles */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full h-1/2 flex justify-center overflow-hidden">
             {[...Array(6)].map((_, i) => (
               <div
                 key={`b1-${i}`}
                 className="absolute w-2 h-2 rounded-full bg-bright-teal-blue/60 dark:bg-frosted-blue/60 animate-bubble-rise"
                 style={{
                   left: `${40 + ((i * 3 + 7) % 20 - 10)}%`,
                   animationDelay: `${(i * 0.3) % 2}s`,
                   animationDuration: `${1.5 + ((i * 0.2) % 1)}s`
                 }}
               />
             ))}
          </div>
        </div>

        {/* Flask 2 - Round */}
        <div className="relative animate-float" style={{ animationDelay: "1.5s" }}>
           <FlaskRound className="w-20 h-20 text-deep-twilight dark:text-frosted-blue fill-deep-twilight/10 dark:fill-frosted-blue/10" strokeWidth={1.5} />
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full h-1/2 flex justify-center overflow-hidden">
             {[...Array(6)].map((_, i) => (
               <div
                 key={`b2-${i}`}
                 className="absolute w-2 h-2 rounded-full bg-french-blue/60 dark:bg-sky-aqua/60 animate-bubble-rise"
                 style={{
                   left: `${40 + ((i * 4 + 2) % 20 - 10)}%`,
                   animationDelay: `${(i * 0.4) % 2}s`,
                   animationDuration: `${1.5 + ((i * 0.3) % 1)}s`
                 }}
               />
             ))}
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-deep-twilight dark:text-white mb-4 tracking-tight text-center px-4">
        Nij Scientific
      </h1>
      
      <div className="overflow-hidden px-4 text-center">
        <p className="text-lg md:text-xl text-french-blue dark:text-sky-aqua font-medium">
          First Chemical Mall in Saurashtra/Kutch
        </p>
      </div>
    </div>
  );
}
