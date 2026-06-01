"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import type { EmotionCache } from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

type SerializedStyle = { name: string };

type EmotionRegistryProps = {
  children: React.ReactNode;
};

export function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [registry] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: Parameters<EmotionCache["insert"]>) => {
      const serialized = args[1] as SerializedStyle;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      const style = registry.cache.inserted[name];
      if (typeof style === "string") {
        styles += style;
      }
    }

    return (
      <style
        data-emotion={`${registry.cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
