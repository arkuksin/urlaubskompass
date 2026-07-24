import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const baseMetadata: Metadata = {
  title: "Urlaubskompass – Familienausflüge rund um Troyes",
  description: "In drei kurzen Fragen zum passenden Urlaubstag: Lac d’Orient, Champagne oder Namur.",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const imageUrl = new URL("/og.png", baseUrl).toString();

  return {
    ...baseMetadata,
    metadataBase: baseUrl,
    openGraph: {
      title: "Urlaubskompass",
      description: "Was passt heute zu euch? In drei Fragen zum richtigen Familientag.",
      type: "website",
      locale: "de_DE",
      images: [{ url: imageUrl, width: 1734, height: 907, alt: "Urlaubskompass – Was passt heute zu euch?" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Urlaubskompass",
      description: "Was passt heute zu euch? In drei Fragen zum richtigen Familientag.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${sans.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
