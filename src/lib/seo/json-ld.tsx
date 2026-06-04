import { SOCIAL_LINKS } from "@/constants/social";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./site";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteJsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_AUTHOR,
    alternateName: "Eunsik Woo",
    url: SITE_URL,
    jobTitle: "UI · Frontend Developer",
    description: SITE_DESCRIPTION,
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
    </>
  );
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}) {
  const published = parseBlogDate(post.date);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
    datePublished: published,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    inLanguage: "ko-KR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/blog/${post.slug}`, SITE_URL).toString(),
    },
  };
}

function parseBlogDate(date: string) {
  const match = date.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!match) return undefined;
  return `${match[1]}-${match[2]}-${match[3]}`;
}
