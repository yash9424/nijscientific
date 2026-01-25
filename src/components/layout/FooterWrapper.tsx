"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const isHidden = pathname.startsWith("/admin") || pathname === "/login";

  if (isHidden) return null;

  return <Footer />;
}
