"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";
import { createApolloClient } from "./client";

type ApolloProviderProps = {
  children: React.ReactNode;
};

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = useMemo(() => createApolloClient(), []);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
