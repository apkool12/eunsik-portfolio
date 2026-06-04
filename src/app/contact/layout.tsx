import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "포트폴리오에 관심을 가져주셔서 감사합니다. 협업·채용·문의는 Contact 페이지에서 연락할 수 있습니다.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
