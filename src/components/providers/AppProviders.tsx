"use client";

import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import { EmotionRegistry } from "@/lib/emotion/EmotionRegistry";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <EmotionRegistry>
      <ApolloProvider>{children}</ApolloProvider>
    </EmotionRegistry>
  );
}
