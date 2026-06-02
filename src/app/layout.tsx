import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunsik Portfolio",
  description: "포트폴리오",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>
          <Header />
          <div className="pageScaleWrapper">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
