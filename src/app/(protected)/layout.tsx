import { ReactNode } from "react";
import AppLayout from "./components/app-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
