import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/sections/BlogArticle/BlogArticle";
import { BLOG_POSTS, getBlogPost } from "@/constants/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogArticle post={post} />;
}
