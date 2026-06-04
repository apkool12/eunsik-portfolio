import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { PageScaleWrapper } from "@/components/layout/PageScaleWrapper";
import { SiteJsonLd } from "@/lib/seo/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata = rootMetadata;

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
        <SiteJsonLd />
        <AppProviders>
          <Header />
          <PageScaleWrapper>{children}</PageScaleWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
