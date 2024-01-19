"use client";
import { theme } from "@/theme/theme";
import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster richColors position="bottom-center" />
      <MantineProvider theme={theme}>
        <ContextMenuProvider>{children}</ContextMenuProvider>
      </MantineProvider>
    </SessionProvider>
  );
}
