"use client";

import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import { EmotionRegistry } from "@/lib/emotion/EmotionRegistry";
import { CursorFollower } from "@/components/ui/CursorFollower";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <EmotionRegistry>
      <ApolloProvider>
        <CursorFollower />
        {children}
      </ApolloProvider>
    </EmotionRegistry>
  );
}
