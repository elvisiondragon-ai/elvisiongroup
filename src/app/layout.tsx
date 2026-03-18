import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/Providers";
import "../index.css"; // Global styles

export const metadata = {
  title: "El Vision",
  description: "El Vision Web App",
  // Add other standard metadata here as needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent hydration warnings from theme scripts or similar extensions */}
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
