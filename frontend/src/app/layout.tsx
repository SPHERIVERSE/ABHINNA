import "@/styles/globals.css";
import Loader from "@/components/layout/Loader";

export const metadata = {
  title: "Institute Portal",
  description: "Professional Coaching Institute",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Loader />
        {children}
      </body>
    </html>
  );
}

