import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "mantine-contextmenu/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capy Drive",
  description: "Document control app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="bg-secondary-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
