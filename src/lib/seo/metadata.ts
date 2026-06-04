import type { Metadata } from "next";
import {
  BRAND_LOGO,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "./site";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function buildOgImage(image: string, alt: string) {
  const imageUrl = image.startsWith("http") ? image : new URL(image, SITE_URL).toString();

  return {
    url: imageUrl,
    alt,
    ...(image === DEFAULT_OG_IMAGE
      ? { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }
      : {}),
  };
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = buildOgImage(image, `${title} | ${SITE_NAME}`);

  return {
    title,
    description,
    authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
    creator: SITE_AUTHOR,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: SITE_LOCALE,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  keywords: [
    "우은식",
    "프론트엔드",
    "UI 개발",
    "포트폴리오",
    "React",
    "Next.js",
    "Hamsik",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [buildOgImage(DEFAULT_OG_IMAGE, SITE_TITLE)],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [{ url: BRAND_LOGO, type: "image/svg+xml" }],
    shortcut: BRAND_LOGO,
    apple: BRAND_LOGO,
  },
};
