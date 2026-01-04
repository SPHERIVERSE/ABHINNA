import { notFound } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminRoute: string }>; // 1. Update type to Promise
}) {
  // 2. Await the params
  const { adminRoute } = await params;

  // 3. Verify secret
  if (adminRoute !== process.env.NEXT_PUBLIC_ADMIN_ROUTE) {
    notFound();
  }

  return <>{children}</>;
}
