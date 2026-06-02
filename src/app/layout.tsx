import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hamsik's Journey",
    template: "%s | Hamsik's Journey",
  },
  description: "UI 및 프론트엔드 개발자 우은식의 포트폴리오",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
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
