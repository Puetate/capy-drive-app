"use client";
import { theme } from "@/theme/theme";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </SessionProvider>
  );
}
