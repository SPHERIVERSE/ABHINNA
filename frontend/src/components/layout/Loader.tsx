"use client";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 150,
});

export default function Loader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
}

