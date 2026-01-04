import { redirect } from "next/navigation";

export default async function AdminEntryPage({
  params,
}: {
  params: Promise<{ adminRoute: string }>;
}) {
  // Await params here too
  const { adminRoute } = await params;
  
  // Redirect to login
  redirect(`/${adminRoute}/login`);
}
