import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blog";
import { SITE_URL } from "@/lib/seo/site";

const STATIC_ROUTES = ["", "/about", "/projects", "/blog", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: parseBlogDate(post.date) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}

function parseBlogDate(date: string) {
  const match = date.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!match) return undefined;
  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`);
}
