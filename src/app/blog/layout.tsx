import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "개발 회고와 UI/프론트엔드 구현 과정에서 배운 내용을 기록한 블로그입니다.",
  path: "/blog",
});

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
